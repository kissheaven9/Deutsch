# Неотделяемые глаголы (семья Греты) — из учебника Momente

> **A1** — извлечено СПЛОШНЫМ автопоиском по Kursbuch+Arbeitsbuch (текстовый слой): все встречающиеся глаголы в любых формах, не только Lernwortschatz. Отфильтрованы причастия/прилагательные.
> **A2.1 (уроки 1–4)** — сканы без текстового слоя, OCR в системе нет → Lernwortschatz (стр. 106–113) **вычитан глазами**. ⚠️ Это словник уроков; сплошной автопрогон по A2.1, как для A1, невозможен без OCR.
> Каждый глагол проверен `tools/verben_engine.py`: все **untrennbar**, формы генерируются движком (не руками).

## Всего 73 → 8 частей по ~10 (у Отто было 56 → 5 частей)

## A1 (65)

| глагол | перевод | Perfekt |
|---|---|---|
| beachten | обращать внимание | hat beachtet |
| beantworten | отвечать на | hat beantwortet |
| bedanken | благодарить (sich) | hat bedankt |
| bedeuten | значить | hat bedeutet |
| beginnen | начинать(ся) | hat begonnen |
| begrüßen | приветствовать | hat begrüßt |
| bekommen | получать | hat bekommen |
| benennen | называть | hat benannt |
| benutzen | пользоваться | hat benutzt |
| beraten | консультировать | hat beraten |
| berichten | сообщать | hat berichtet |
| berühren | трогать, касаться | hat berührt |
| beschreiben | описывать | hat beschrieben |
| bestehen | сдать (экзамен) | hat bestanden |
| bestellen | заказывать | hat bestellt |
| besuchen | посещать | hat besucht |
| betreuen | опекать, курировать | hat betreut |
| bewerten | оценивать | hat bewertet |
| bezahlen | платить | hat bezahlt |
| bezeichnen | обозначать | hat bezeichnet |
| empfehlen | рекомендовать | hat empfohlen |
| entdecken | обнаруживать | hat entdeckt |
| enthalten | содержать | hat enthalten |
| erfinden | изобретать | hat erfunden |
| ergänzen | дополнять | hat ergänzt |
| erklären | объяснять | hat erklärt |
| erlauben | разрешать | hat erlaubt |
| erleben | переживать | hat erlebt |
| ermöglichen | делать возможным | hat ermöglicht |
| erzählen | рассказывать | hat erzählt |
| gefallen | нравиться | hat gefallen |
| gehören | принадлежать | hat gehört |
| gewinnen | выигрывать | hat gewonnen |
| umarmen | обнимать | hat umarmt |
| umkreisen | обводить кружком | hat umkreist |
| unterstreichen | подчёркивать | hat unterstrichen |
| unterstützen | поддерживать | hat unterstützt |
| verabreden | договориться о встрече (sich) | hat verabredet |
| verabschieden | прощаться (sich) | hat verabschiedet |
| verbessern | улучшать | hat verbessert |
| verbieten | запрещать | hat verboten |
| verbinden | соединять | hat verbunden |
| verdienen | зарабатывать | hat verdient |
| vereinbaren | договариваться | hat vereinbart |
| verfassen | составлять (текст) | hat verfasst |
| vergessen | забывать | hat vergessen |
| vergleichen | сравнивать | hat verglichen |
| verkaufen | продавать | hat verkauft |
| verlieben | влюбляться (sich) | hat verliebt |
| verlieren | терять | hat verloren |
| vermeiden | избегать | hat vermieden |
| vermitteln | посредничать | hat vermittelt |
| vermuten | предполагать | hat vermutet |
| verpassen | пропускать | hat verpasst |
| verschieben | переносить | hat verschoben |
| verstehen | понимать | hat verstanden |
| verstärken | усиливать | hat verstärkt |
| versuchen | пытаться | hat versucht |
| vertiefen | углублять | hat vertieft |
| verwenden | использовать | hat verwendet |
| wiederholen | повторять | hat wiederholt |
| überlegen | обдумывать | hat überlegt |
| übernehmen | брать на себя | hat übernommen |
| überprüfen | проверять | hat überprüft |
| übersiedeln | переселяться | ist übersiedelt |

## A2.1, уроки 1–4 — НОВЫЕ (8)

| глагол | перевод | Perfekt | урок |
|---|---|---|---|
| behalten | оставлять себе | hat behalten | L1 · **сильный**: du behältst, er behält |
| übernachten | ночевать | hat übernachtet | L1 |
| vermissen | скучать по | hat vermisst | L3 · du vermisst |
| beobachten | наблюдать | hat beobachtet | L3 · du beobachtest |
| verschicken | отправлять | hat verschickt | L4 |
| erteilen | давать (поручение) | hat erteilt | L4 |
| unterschreiben | подписывать | hat unterschrieben | L4 · учебник печатает `unter\|schreiben`, но причастие БЕЗ -ge- → неотделяемый |
| erledigen | улаживать, делать | hat erledigt | L4 |

## Подтверждены на A2.1 (уже были в A1)
erleben (L2), verdienen (L3), vereinbaren (L4), überlegen (L4), übernehmen (L4), verpassen (L3), verkaufen (L1).

## ⚠️ Ловушки, которые ловит движок
- **Двойные приставки** — решает причастие: `umziehen→umgezogen` (Отто) ↔ `umarmen→umarmt` (Грета); `überprüfen→überprüft` (Грета).
- **Сильная основа под приставкой:** `behalten→behält`, `übernehmen→übernimmt`, `empfehlen→empfiehlt`, `enthalten→enthält`, `beraten→berät`, `gefallen→gefällt`, `vergessen→vergisst`.
- **-ern/-eln:** `verbessern→verbessere/verbesserst`, `vermitteln→vermittle/vermittelst`.
- **Не -ieren:** `verlieren` — это ver+lieren (неотделяемый), НЕ семья Тео.
