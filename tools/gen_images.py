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

# Первый референс — ЭТАЛОН СТИЛЯ серии (сцены персонажей): для Отто/Греты свой.
def style_ref(name):
    return 'otto-szene-1.png' if name.startswith('otto') else 'greta-szene-2.png'
STYLE = ("Сделай ЯРКУЮ, СОЧНУЮ иллюстрацию в стиле приложенного эталона: насыщенные живые цвета "
         "(синее небо, зелень, красный, жёлтый, оранжевый — богатая РАЗНООБРАЗНАЯ палитра, не только "
         "тёплый тон), солнечный свет, ЧЁТКАЯ детальная иллюстрация как красочный мультфильм/"
         "детская книга. Лица ЖИВЫЕ и выразительные: большие блестящие глаза, румяные щёки, "
         "искренние эмоции — НЕ пластиковые, НЕ тусклые. Персонажи выглядят КАК НА РЕФЕРЕНСАХ, "
         "красивые и весёлые. КАТЕГОРИЧЕСКИ НЕ серо, НЕ монохромно, НЕ сепия, НЕ блёкло, НЕ "
         "фотореализм. Горизонтальная композиция. Без какого-либо текста, букв, цифр, вывесок и "
         "надписей — все таблички/экраны ПУСТЫЕ.")

# name -> (references[], prompt)
JOBS = {
 'otto-text-1': (['otto-main.png'],
   "Тот же рыжебородый шотландец Отто с референса (клетчатый килт, шляпа, связка ключей). "
   "Сцена: зал прилёта аэропорта. Отто стоит у выхода, растроган и счастлив, смотрит на "
   "внука Финлея, который бежит к нему. Финлей — рыжеватый мальчик ~7 лет в СИНЕЙ куртке и с "
   "СИНИМ рюкзаком (как внук на референсе otto-szene). Это ДРУГОЙ ребёнок, НЕ соседский мальчик "
   "Тео (у Тео зелёно-полосатая кофта и кудри) — не делай его похожим на Тео. В руке у Финлея "
   "детский рисунок: сад и две фигурки, держатся за руки. Вдали пустое табло и поезд. "+STYLE),
 'otto-text-2': (['otto-main.png','greta-main.png','teo-main.png'],
   "Вечерний сад, гриль-праздник. Тот же Отто (рыжая борода, шляпа, клетчатый килт) с референса "
   "угощает соседей кофе и рыбным пирогом за простым пластиковым столом. Гости: Грета (как на "
   "референсе — тёмные кудри, круглые очки, красный берет, цветастая блузка, белый фартук); "
   "Тео — рыжий кудрявый мальчик в зелёно-полосатой кофте; Лина — девочка с каштановыми кудрями, "
   "повязкой на голове и в платье в цветочек; рядом кролик. Все смеются, тёплый свет фонариков. "+STYLE),
 'otto-text-3': (['otto-main.png'],
   "Поздний вечер, тёмная комната. Тот же Отто с референса тайком сидит за старым дешёвым "
   "компьютером — его секрет: мастерит маленького помощника для сада. На столе листок с планом и "
   "картонная коробка с деталями, экран светится, выключенный телевизор в стороне. Лицо мечтательное, тёплое. "+STYLE),
 'greta-text-1': (['greta-main.png'],
   "Та же итальянка Грета с референса (тёмные кудри, яркий фартук) на уютной кухне. Она держит "
   "письмо из Неаполя и растрогана, у глаз слёзы радости. Тёплые цвета: солнце в окне, красные "
   "помидоры, жёлтые лимоны; на фоне — воспоминание о Неаполе (море, солнечная улица). "+STYLE),
 'greta-text-2': (['greta-main.png'],
   "Кухня Греты, маленький кулинарный урок. Та же Грета с референса (тёмные кудри, круглые очки, "
   "красный берет, цветастая блузка, белый фартук) учит девочку Лину готовить: показывает, как "
   "нюхать и трогать продукты. Лина — девочка с каштановыми кудрями, повязкой на голове и в платье "
   "в цветочек. Яркие овощи, большая миска, сковорода, немного муки в воздухе, смех. По-домашнему тепло. "+STYLE),
 'greta-text-3': (['greta-main.png'],
   "Яркая сцена кулинарного шоу. Та же Грета с референса (тёмные кудри, круглые очки, красный "
   "берет, цветастая блузка, белый фартук), азартная и гордая, с золотой медалью на шее, "
   "представляет свой красный суп в миске; рядом подруга держит торт. Софиты, тёплый свет. "
   "Зрители — ТОЛЬКО далеко на фоне и размытые; на переднем плане и по краям кадра НЕТ никаких "
   "крупных лиц или обрезанных голов, передний план чистый. "+STYLE),
}

def gen(name):
    refs, prompt = JOBS[name]
    sref = style_ref(name)
    refs = [sref] + [r for r in refs if r != sref]   # эталон стиля первым
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
