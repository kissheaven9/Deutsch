#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Пересобрать audio/greta-part-N.mp3 МНОГОГОЛОСО: прямая речь Лины — детским голосом (childgirl),
всё остальное (нарратив + реплики Греты) — голосом Греты (Katja).
Причина: в тексте героя чужие реплики должны звучать голосом их персонажа, а не робота/героя
(правило озвучки по роду; дневник — голос героя). ffmpeg/pydub нет → бинарная склейка mp3 edge-tts
(один кодек/частота 24кГц моно → корректно проигрывается в браузере).

  python3 tools/gen_part_multivoice.py 4     # пересобрать часть 4

Сегменты части задаются ниже в SEGMENTS[part] списком (voice, text):
  voice: 'greta' (Katja, -4%) | 'lina' (Amala, детский)
Текст сегментов = ТОЧНО как в textDE части (с уже подставленными формами глаголов),
иначе аудио разойдётся с тем, что показывает playText (плейн из DOM).
"""
import os, sys, asyncio, edge_tts

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
AUD = os.path.join(ROOT, 'site', 'audio')

VOICE = {
    'greta': dict(voice='de-DE-KatjaNeural', rate='-4%', pitch='+0Hz'),   # как в gen_untrennbar
    'lina':  dict(voice='de-DE-AmalaNeural', rate='+5%', pitch='+45Hz'),  # childgirl
}

# Сегменты по частям. Склеенный текст сегментов ДОЛЖЕН совпадать с плейном textDE части.
SEGMENTS = {
    4: [
        ('greta', 'Es klopft: Lina, meine kleine Nachbarin. Sie besucht mich oft, und ich betreue sie, wenn ihre Mutter arbeitet.'),
        ('lina',  '„Was machst du?“'),
        ('greta', '„Suppe.“'),
        ('lina',  '„Darf ich helfen?“'),
        ('greta', 'Ich erlaube es und erteile ihr sofort eine Aufgabe. Beim Kochen beobachtet sie mich: wie ich schneide, wie ich probiere. Sie fragt ohne Ende, und ich berate sie: warum Tomaten, warum keine Wurst. Ich erzähle ihr von Neapel: die Sonne, die laute Straße, meine Oma in der blauen Bluse. So vertieft Lina sich in meine Küche — und verliebt sich in sie. Und ich vermittle ihr das Wichtigste: nicht die Suppe, sondern die Freude am Kochen.'),
    ],
    6: [
        ('greta', 'In der Tasche ist noch eine Orange. „Woher?“ —'),
        ('lina',  '„Ich habe sie gewonnen! Die Verkäuferin hat eine Frage gestellt, ich habe richtig geantwortet.“'),
        ('greta', 'Ich bedanke mich bei ihr: behalte diese Orange, du hast sie verdient! Ich beginne. Ich verbinde Tomaten, Zitronen und Oliven — rot, gelb, grün in einer Pfanne. Ich probiere. Es gefällt mir: sauer, kräftig, genau richtig. Meine Suppe enthält nur das. Ich beschreibe Lina alles und berichte das Wichtigste: Wurst in der Suppe verbiete ich! Mamma mia, nie! Lina lacht und ergänzt:'),
        ('lina',  'und keine Milch!'),
        ('greta', 'Brava! Ihre Mutter kommt spät — und Lina übernachtet bei mir.'),
    ],
}


async def tts(text, role, out):
    cfg = VOICE[role]
    for _ in range(3):
        try:
            await edge_tts.Communicate(text, cfg['voice'], rate=cfg['rate'], pitch=cfg['pitch']).save(out)
            return
        except Exception as e:
            last = e
    raise last


async def build(part):
    # Отдельные файлы-сегменты greta-part-N-i.mp3 — плеер (playSeq) играет их по очереди.
    # Это надёжнее бинарной склейки mp3 (некоторые браузеры её не доигрывают) и даёт чистую смену голоса.
    segs = SEGMENTS[part]
    names = []
    for i, (role, text) in enumerate(segs):
        name = f'greta-part-{part}-{i}.mp3'
        await tts(text, role, os.path.join(AUD, name))
        names.append(name)
    print('OK part', part, '→', len(names), 'сегментов:')
    for n in names:
        print('   ', n)
    print('JS для playText:', ['audio/' + n for n in names])


if __name__ == '__main__':
    part = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    asyncio.run(build(part))
