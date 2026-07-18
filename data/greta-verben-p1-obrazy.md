# -*- coding: utf-8 -*-
# Данные упражнений «Персонажи» по брифу (brief-uprazhneniya.md), часть 1 Греты.
# Значение через ОБРАЗ-МОСТ (приставка+корень → физическая сценка) + русская идиома + разведение синонимов.
# inf, ru, pre, root, rootru, emoji, bridge(образ-мост), idiom(рус. идиома или ''), pp, sent(фраза из текста)
V=[
 ('bekommen','получать','be','kommen','приходить','📩→🤲',
  'be+kommen: «приходит К тебе в руки». ⚠️ НЕ «становиться» (ложный друг!)','', 'hat bekommen',
  'Ich bekomme Post und verstehe zuerst nicht: von wem?'),
 ('verstehen','понимать','ver','stehen','стоять','💡🧠',
  'ver+stehen: «встал в теме» → разобрался','до меня дошло','hat verstanden',
  'Ich beachte die Unterschrift — und da verstehe ich alles.'),
 ('vermuten','предполагать','ver','Mut','дух, смелость','🤔❓',
  'ver+Mut: духом чую → догадка БЕЗ фактов','сдаётся мне','hat vermutet',
  'Ich vermute das Schlimmste — eine Strafe?'),
 ('überlegen','обдумывать','über','legen','класть','⚖️🧩',
  'über+legen: раскладывает варианты ПОВЕРХ, взвешивает','взвесить','hat überlegt',
  'Ich überlege: nein, für Werbung ist das zu schön.'),
 ('beachten','обращать внимание','be','achten','внимание','👀❗',
  'be+achten: заметить И учесть','принять во внимание','hat beachtet',
  'Ich beachte die Unterschrift.'),
 ('entdecken','обнаруживать','ent','decken','покрывать','🔍🎁',
  'ent+decken: СНЯТЬ покрывало (ent-=прочь) → раскрыть','открыть, раскрыть','hat entdeckt',
  'Ich entdecke weiter: die Premiere, hundert Personen.'),
 ('benutzen','пользоваться','be','Nutzen','польза','🔧🖐',
  'be+Nutzen: пустить в дело, извлечь пользу','пустить в ход','hat benutzt',
  'Ich benutze sie endlich und lese: eine Einladung.'),
 ('verlieren','терять','ver','','','🔑💨',
  'ver- = «прочь, впустую»: выронил, ушло безвозвратно. ⚠️ НЕ -ieren (не как studieren)!','потерять','hat verloren',
  'Eine halbe Stunde habe ich sie verloren.'),
 ('beginnen','начинать','be','ginnen','(старин.) браться','🎬▶️',
  'be+ginnen: взяться за дело → старт','положить начало','hat begonnen',
  'Alles beginnt am Mittwoch.'),
 ('benennen','называть','be','nennen','звать','🏷️✍️',
  'be+nennen: дать имя, обозначить','дать имя','hat benannt',
  'Sie benennen die beste Köchin aus Neapel.'),
 ('erleben','переживать','er','leben','жить','🎢❤️',
  'er+leben: прожить НА СЕБЕ, испытать','пережить','hat erlebt',
  'So etwas habe ich noch nie erlebt.'),
]
# «Не перепутай»: русское слово, на которое ложатся два глагола набора, с жестом-различием
CONFUSE=[
 ('«понял/догадался?»',
  ('verstehen','точно понял 💡 (встал в теме)'),
  ('vermuten','лишь догадка ❓ (без фактов)')),
 ('«заметил?»',
  ('beachten','обратил внимание, учёл 👀'),
  ('entdecken','обнаружил новое 🔍 (снял покрывало)')),
]
