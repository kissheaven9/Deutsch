#!/usr/bin/env python3
"""
Локальный виджет расхода токенов Claude Code.

Читает логи Claude Code из ~/.claude/projects/**/*.jsonl и показывает,
сколько токенов потрачено сегодня / за неделю / за месяц / всего.
Запуск: python3 server.py  (потом открыть http://localhost:8787)

Никаких внешних библиотек — только стандартный Python 3.
"""

import os
import re
import glob
import json
import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = 8787
PROJECTS_DIR = os.path.expanduser("~/.claude/projects")

# Кэш: путь_файла -> (mtime, size, [(date_iso, in, out, cache_create, cache_read), ...])
# Перечитываем только изменённые файлы — поэтому обновление быстрое.
_CACHE = {}


def _parse_file(path):
    """Возвращает список (date_iso_local, in, out, cc, cr) по одному файлу."""
    rows = []
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if '"usage"' not in line:
                    continue
                try:
                    d = json.loads(line)
                except Exception:
                    continue
                msg = d.get("message") or {}
                u = msg.get("usage") or d.get("usage")
                if not u:
                    continue
                ts = d.get("timestamp")
                if not ts:
                    continue
                try:
                    dt = datetime.datetime.fromisoformat(
                        ts.replace("Z", "+00:00")
                    ).astimezone()
                except Exception:
                    continue
                rows.append((
                    dt.date().isoformat(),
                    int(u.get("input_tokens", 0) or 0),
                    int(u.get("output_tokens", 0) or 0),
                    int(u.get("cache_creation_input_tokens", 0) or 0),
                    int(u.get("cache_read_input_tokens", 0) or 0),
                ))
    except Exception:
        pass
    return rows


def collect():
    """Сканирует все файлы, перечитывая только изменённые. Возвращает словарь по дням."""
    files = glob.glob(os.path.join(PROJECTS_DIR, "**", "*.jsonl"), recursive=True)
    seen = set()
    for path in files:
        seen.add(path)
        try:
            st = os.stat(path)
        except OSError:
            continue
        key = (st.st_mtime, st.st_size)
        cached = _CACHE.get(path)
        if cached is None or cached[0] != key:
            _CACHE[path] = (key, _parse_file(path))
    # убрать из кэша исчезнувшие файлы
    for gone in [p for p in _CACHE if p not in seen]:
        _CACHE.pop(gone, None)

    # агрегируем по дням
    by_day = {}  # date_iso -> [in, out, cc, cr]
    for _key, rows in _CACHE.values():
        for date_iso, i, o, cc, cr in rows:
            a = by_day.setdefault(date_iso, [0, 0, 0, 0])
            a[0] += i
            a[1] += o
            a[2] += cc
            a[3] += cr
    return by_day


def build_payload():
    by_day = collect()
    today = datetime.date.today()

    def day_sum(date_iso):
        return by_day.get(date_iso, [0, 0, 0, 0])

    def sum_range(days):
        acc = [0, 0, 0, 0]
        for n in range(days):
            d = (today - datetime.timedelta(days=n)).isoformat()
            v = by_day.get(d)
            if v:
                for k in range(4):
                    acc[k] += v[k]
        return acc

    # начало недели — понедельник
    week_start = today - datetime.timedelta(days=today.weekday())

    def sum_since(start):
        acc = [0, 0, 0, 0]
        for date_iso, v in by_day.items():
            try:
                d = datetime.date.fromisoformat(date_iso)
            except ValueError:
                continue
            if d >= start:
                for k in range(4):
                    acc[k] += v[k]
        return acc

    all_time = [0, 0, 0, 0]
    for v in by_day.values():
        for k in range(4):
            all_time[k] += v[k]

    # ряд за 14 дней для графика
    series = []
    for n in range(13, -1, -1):
        d = today - datetime.timedelta(days=n)
        v = day_sum(d.isoformat())
        series.append({"date": d.isoformat(), "in": v[0], "out": v[1], "cc": v[2], "cr": v[3]})

    def pack(v):
        return {
            "in": v[0], "out": v[1], "cc": v[2], "cr": v[3],
            "total": v[0] + v[1] + v[2] + v[3],
            "no_cache": v[0] + v[1] + v[2],
        }

    # --- серии (streak) для геймификации ---
    HARD_DAY = 10_000_000  # «ударный» день: ввод+вывод+создание кэша >= этого
    active_dates = set(by_day.keys())

    def is_active(d):
        return d.isoformat() in active_dates

    def is_hard(d):
        v = by_day.get(d.isoformat())
        return bool(v) and (v[0] + v[1] + v[2]) >= HARD_DAY

    # текущая серия активных дней (отсчёт от сегодня или вчера назад)
    streak = 0
    anchor = today if is_active(today) else (today - datetime.timedelta(days=1))
    if is_active(anchor):
        d = anchor
        while is_active(d):
            streak += 1
            d -= datetime.timedelta(days=1)

    # текущая серия «ударных» дней подряд (от последнего активного дня назад)
    hard_streak = 0
    if is_active(anchor):
        d = anchor
        while is_hard(d):
            hard_streak += 1
            d -= datetime.timedelta(days=1)

    # лучшая серия активных дней за всё время
    best_streak = 0
    if active_dates:
        sorted_dates = sorted(datetime.date.fromisoformat(x) for x in active_dates)
        run = 1
        best_streak = 1
        for i in range(1, len(sorted_dates)):
            if (sorted_dates[i] - sorted_dates[i - 1]).days == 1:
                run += 1
            else:
                run = 1
            best_streak = max(best_streak, run)

    return {
        "today": pack(day_sum(today.isoformat())),
        "week": pack(sum_since(week_start)),
        "month": pack(sum_range(30)),
        "all_time": pack(all_time),
        "series": series,
        "active_days": len(by_day),
        "streak": streak,
        "hard_streak": hard_streak,
        "best_streak": best_streak,
        "today_active": is_active(today),
        "generated": datetime.datetime.now().strftime("%H:%M:%S"),
    }


HTML = r"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Токены Claude — сегодня</title>
<style>
  :root{
    --bg:#0f1020; --panel:#1a1b33; --panel2:#212247; --ink:#eef0ff;
    --muted:#9aa0c8; --accent:#8b5cf6; --accent2:#a78bfa;
    --in:#60a5fa; --out:#f472b6; --cc:#34d399; --cr:#fbbf24; --line:#2c2e54;
  }
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Inter,sans-serif;
       background:radial-gradient(1200px 600px at 70% -10%,#241d4a 0%,var(--bg) 55%);
       color:var(--ink);min-height:100vh;padding:24px}
  .wrap{max-width:920px;margin:0 auto}
  h1{font-size:20px;font-weight:700;margin:0 0 2px;letter-spacing:.2px}
  .sub{color:var(--muted);font-size:13px;margin-bottom:20px}
  .grid{display:grid;grid-template-columns:1.4fr 1fr;gap:16px}
  @media(max-width:720px){.grid{grid-template-columns:1fr}}
  .card{background:linear-gradient(180deg,var(--panel) 0%,var(--panel2) 100%);
        border:1px solid var(--line);border-radius:18px;padding:20px 22px;
        box-shadow:0 10px 30px rgba(0,0,0,.25)}
  .card.hero{border:1px solid #3a2d78;background:
        linear-gradient(180deg,#241a52 0%,#1b1c3c 100%)}
  .label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
  .big{font-size:46px;font-weight:800;line-height:1;letter-spacing:-1px}
  .big small{font-size:16px;color:var(--muted);font-weight:600;margin-left:6px}
  .mid{font-size:30px;font-weight:800;line-height:1}
  .row{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px}
  .chip{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
  .dot{width:9px;height:9px;border-radius:50%}
  .stat{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed var(--line);font-size:14px}
  .stat:last-child{border-bottom:0}
  .stat b{font-variant-numeric:tabular-nums}
  .bar{height:10px;border-radius:8px;background:#2a2b50;overflow:hidden;margin-top:10px}
  .bar > i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0}
  .bar.warn > i{background:linear-gradient(90deg,#f59e0b,#ef4444)}
  .muted{color:var(--muted);font-size:12px;line-height:1.5}
  /* триплет лимита */
  .trow{display:flex;justify-content:space-between;align-items:baseline;padding:6px 0}
  .trow .k{color:var(--muted);font-size:13px}
  .trow .v{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}
  .trow.left .v{font-size:32px;color:#fff}
  .bar{height:12px;border-radius:8px;background:#2a2b50;overflow:hidden;margin:12px 0 4px}
  .bar > i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));width:0;transition:width .5s}
  .bar.warn > i{background:linear-gradient(90deg,#f59e0b,#ef4444)}
  /* геймификация */
  .streak{display:flex;align-items:center;gap:14px}
  .flame{font-size:46px;line-height:1}
  .streak .num{font-size:38px;font-weight:800;line-height:1}
  .streak .num small{font-size:17px;font-weight:700;color:var(--muted)}
  .streak .cap{color:var(--muted);font-size:13px;margin-top:4px}
  .badge{display:inline-block;margin-top:14px;padding:8px 13px;border-radius:999px;
         background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;font-weight:700;font-size:13px}
  .days{display:flex;gap:5px;margin-top:16px}
  .days .d{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
  .days .cell{width:100%;aspect-ratio:1;border-radius:7px;background:#23244a;
        display:flex;align-items:center;justify-content:center;font-size:13px}
  .days .cell.l1{background:#3b2d6b}.days .cell.l2{background:#6d4ad6}.days .cell.l3{background:#a78bfa}
  .days .cell.hard{box-shadow:inset 0 0 0 2px #fbbf24}
  .days .cell.today{outline:2px solid #fff}
  .days .lbl{font-size:9px;color:var(--muted)}
  .foot{margin-top:18px;color:var(--muted);font-size:12px;text-align:center}
  a{color:var(--accent2)}
  .note{margin-top:12px;padding:10px 12px;background:#1c1530;border:1px solid #3a2d78;border-radius:12px}
</style>
</head>
<body>
<div class="wrap">
  <h1>Расход токенов Claude Code</h1>
  <div class="sub">Локальный виджет · данные из ваших логов · обновляется автоматически</div>

  <div class="grid">
    <div class="card hero">
      <div class="label">Сегодня потрачено</div>
      <div class="big" id="today_total">—<small>токенов</small></div>
      <div class="row">
        <span class="chip"><span class="dot" style="background:var(--in)"></span>ввод <b id="t_in">—</b></span>
        <span class="chip"><span class="dot" style="background:var(--out)"></span>вывод <b id="t_out">—</b></span>
        <span class="chip"><span class="dot" style="background:var(--cc)"></span>кэш+ <b id="t_cc">—</b></span>
        <span class="chip"><span class="dot" style="background:var(--cr)"></span>кэш-чтение <b id="t_cr">—</b></span>
      </div>
      <div style="margin-top:14px;font-size:13px;color:var(--muted)">
        Без учёта кэш-чтения: <b id="t_nocache" style="color:var(--ink)">—</b>
      </div>
    </div>

    <div class="card">
      <div class="label">Осталось до лимита</div>
      <div class="mid" id="remaining">—</div>
      <div class="bar" id="bar"><i></i></div>
      <div style="margin-top:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="muted">Дневной ориентир:</span>
        <input class="budget" id="budget" type="number" min="0" step="500000" placeholder="напр. 20000000">
      </div>
      <div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="muted">Считать от:</span>
        <select id="metric">
          <option value="no_cache">без кэш-чтения</option>
          <option value="total">всего (с кэшем)</option>
        </select>
      </div>
      <div class="note muted">
        «Осталось» = ориентир − потрачено сегодня. Официального лимита подписки
        в токенах Claude не публикует и локально не отдаёт. По умолчанию здесь
        ваш практический максимум по замерам (≈20 млн/день) — поправьте под себя.
      </div>
    </div>
  </div>

  <div class="grid" style="margin-top:16px">
    <div class="card">
      <div class="label">Итоги (всего токенов)</div>
      <div class="stat"><span>За эту неделю</span><b id="week">—</b></div>
      <div class="stat"><span>За 30 дней</span><b id="month">—</b></div>
      <div class="stat"><span>За всё время</span><b id="all">—</b></div>
      <div class="stat"><span>Дней с активностью</span><b id="days">—</b></div>
    </div>
    <div class="card">
      <div class="label">Последние 14 дней</div>
      <div class="chart" id="chart"></div>
    </div>
  </div>

  <div class="foot">
    Обновлено: <span id="gen">—</span> · автообновление каждые 20 c ·
    точный отчёт со стоимостью: <code>npx ccusage</code>
  </div>
</div>

<script>
const fmt = n => (n||0).toLocaleString('ru-RU');
function load(){
  fetch('/api/usage').then(r=>r.json()).then(d=>{
    const t=d.today;
    document.getElementById('today_total').innerHTML = fmt(t.total)+'<small>токенов</small>';
    document.getElementById('t_in').textContent=fmt(t.in);
    document.getElementById('t_out').textContent=fmt(t.out);
    document.getElementById('t_cc').textContent=fmt(t.cc);
    document.getElementById('t_cr').textContent=fmt(t.cr);
    document.getElementById('t_nocache').textContent=fmt(t.no_cache);
    document.getElementById('week').textContent=fmt(d.week.total);
    document.getElementById('month').textContent=fmt(d.month.total);
    document.getElementById('all').textContent=fmt(d.all_time.total);
    document.getElementById('days').textContent=fmt(d.active_days);
    document.getElementById('gen').textContent=d.generated;

    // осталось
    const metric=document.getElementById('metric').value;
    const used = metric==='no_cache' ? t.no_cache : t.total;
    const budget=parseFloat(localStorage.getItem('budget')||'')||0;
    const rem=document.getElementById('remaining');
    const bar=document.getElementById('bar');
    if(budget>0){
      const left=budget-used;
      rem.textContent=fmt(Math.max(0,left))+(left<0?' (превышен!)':'');
      const pct=Math.min(100,Math.round(used/budget*100));
      bar.querySelector('i').style.width=pct+'%';
      bar.classList.toggle('warn',pct>=85);
    } else {
      rem.textContent='— задайте лимит';
      bar.querySelector('i').style.width='0%';
    }

    // график
    const c=document.getElementById('chart'); c.innerHTML='';
    const max=Math.max(1,...d.series.map(s=>s.in+s.out+s.cc+s.cr));
    d.series.forEach((s,i)=>{
      const tot=s.in+s.out+s.cc+s.cr;
      const col=document.createElement('div');
      col.className='col'+(i===d.series.length-1?' today':'');
      col.style.height=Math.max(2,Math.round(tot/max*88))+'px';
      col.title=s.date+': '+fmt(tot)+' токенов';
      c.appendChild(col);
    });
  }).catch(()=>{});
}
// значения по умолчанию (первый запуск): практический максимум и метрика без кэш-чтения
const DEFAULT_BUDGET='20000000', DEFAULT_METRIC='no_cache';
if(localStorage.getItem('budget')===null) localStorage.setItem('budget',DEFAULT_BUDGET);
if(localStorage.getItem('metric')===null) localStorage.setItem('metric',DEFAULT_METRIC);
// сохранение лимита и метрики
const bi=document.getElementById('budget');
bi.value=localStorage.getItem('budget')||'';
bi.addEventListener('input',()=>{localStorage.setItem('budget',bi.value);load();});
const mi=document.getElementById('metric');
mi.value=localStorage.getItem('metric')||DEFAULT_METRIC;
mi.addEventListener('change',()=>{localStorage.setItem('metric',mi.value);load();});
load();
setInterval(load,20000);
</script>
</body>
</html>"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # тихо

    def do_GET(self):
        if self.path.startswith("/api/usage"):
            try:
                body = json.dumps(build_payload()).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
            except Exception as e:
                body = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        body = HTML.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"\n  Виджет токенов запущен:  {url}")
    print("  Остановить — закрыть это окно или Ctrl+C\n")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n  Остановлено.")


if __name__ == "__main__":
    main()
