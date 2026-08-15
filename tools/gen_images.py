#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генерация иллюстраций к текстам через OpenAI Images (gpt-image-1).
Ключ берётся из ~/.deutsch_openai_key (НЕ в гите/чате). Для консистентности персонажей
используем РЕФЕРЕНС-картинки (site/img/*-main.png) через endpoint /images/edits.

  python3 tools/gen_images.py otto-text-1      # один кадр
  python3 tools/gen_images.py all              # все

Результат: site/img/<name>.png (landscape 1536x1024).
"""
import os, sys, base64, json, mimetypes, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
IMG = os.path.join(ROOT, 'site', 'img')
KEYFILE = os.path.expanduser('~/.deutsch_openai_key')
API = 'https://api.openai.com/v1/images/edits'

def key():
    return open(KEYFILE).read().strip()

STYLE = ("Тёплая книжная иллюстрация (children's-book style, не фотореализм), мягкий свет, "
         "горизонтальная композиция. Персонажи ДОЛЖНЫ выглядеть КАК НА РЕФЕРЕНСЕ. "
         "Без текста, без букв и без цифр на картинке.")

# name -> (references[], prompt)
JOBS = {
 'otto-text-1': (['otto-main.png'],
   "Тот же рыжебородый шотландец Отто с референса (клетчатый килт, шляпа). "
   "Сцена: зал прилёта аэропорта. Отто стоит у выхода, растроган и счастлив, смотрит на "
   "маленького внука ~7 лет, который бежит к нему с детским рисунком в руке. Вдали табло и поезд. "+STYLE),
 'otto-text-2': (['otto-main.png','greta-main.png','teo-main.png'],
   "Вечерний сад. Тот же Отто (рыжая борода, килт, шляпа) с референса угощает соседей кофе и "
   "рыбным пирогом за простым пластиковым столом. Среди гостей — Грета (как на референсе) и "
   "дети Тео (как на референсе) и маленькая Лина с кроликом. Все смеются, тёплый свет фонариков. "+STYLE),
 'otto-text-3': (['otto-main.png'],
   "Поздний вечер, тёмная комната. Тот же Отто с референса тайком сидит за старым дешёвым "
   "компьютером — его секрет: мастерит маленького помощника для сада. На столе листок с планом и "
   "картонная коробка с деталями, экран светится, выключенный телевизор в стороне. Лицо мечтательное, тёплое. "+STYLE),
 'greta-text-1': (['greta-main.png'],
   "Та же итальянка Грета с референса (тёмные кудри, яркий фартук) на уютной кухне. Она держит "
   "письмо из Неаполя и растрогана, у глаз слёзы радости. Тёплые цвета: солнце в окне, красные "
   "помидоры, жёлтые лимоны; на фоне — воспоминание о Неаполе (море, солнечная улица). "+STYLE),
 'greta-text-2': (['greta-main.png','teo-main.png'],
   "Кухня Греты, маленький кулинарный урок. Та же Грета с референса учит девочку Лину готовить: "
   "показывает, как нюхать и трогать продукты. Яркие овощи, большая миска, сковорода, немного муки "
   "в воздухе, смех. По-домашнему тепло. "+STYLE),
 'greta-text-3': (['greta-main.png'],
   "Яркая сцена кулинарного шоу. Та же Грета с референса, азартная и гордая, представляет свой "
   "красный суп жюри; рядом подруга с тортом. Софиты, зрители, эмоции, много цвета, золотая медаль. "+STYLE),
}

def gen(name):
    refs, prompt = JOBS[name]
    boundary = '----deutschimg'
    parts = []
    def field(n, v):
        parts.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{n}"\r\n\r\n{v}\r\n'.encode())
    field('model', 'gpt-image-1'); field('prompt', prompt); field('size', '1536x1024')
    for r in refs:
        p = os.path.join(IMG, r)
        data = open(p, 'rb').read()
        ct = mimetypes.guess_type(p)[0] or 'image/png'
        parts.append((f'--{boundary}\r\nContent-Disposition: form-data; name="image[]"; filename="{r}"\r\n'
                      f'Content-Type: {ct}\r\n\r\n').encode() + data + b'\r\n')
    parts.append(f'--{boundary}--\r\n'.encode())
    body = b''.join(parts)
    req = urllib.request.Request(API, data=body, method='POST', headers={
        'Authorization': 'Bearer ' + key(),
        'Content-Type': f'multipart/form-data; boundary={boundary}'})
    with urllib.request.urlopen(req, timeout=300) as r:
        out = json.load(r)
    b64 = out['data'][0]['b64_json']
    dst = os.path.join(IMG, name + '.png')
    open(dst, 'wb').write(base64.b64decode(b64))
    print('OK', dst, os.path.getsize(dst), 'bytes')

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'otto-text-1'
    names = list(JOBS) if which == 'all' else [which]
    for n in names:
        try:
            gen(n)
        except urllib.error.HTTPError as e:
            print('HTTP ERROR', n, e.code, e.read().decode()[:400])
        except Exception as e:
            print('ERR', n, repr(e))
