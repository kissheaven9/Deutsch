# -*- coding: utf-8 -*-
"""
ОБЩИЙ ДВИЖОК ГЛАГОЛОВ — единственный источник истины по формам и семьям.
Используют: tools/gen_trennbar.py (генерация), tools/check_verben.py (проверка).

⚠️ Формы руками НЕ писать. Правила:
  - основа на -d/-t  → +e в du/er/ihr (findest/findet, bietest, arbeitet, schaltet)
  - основа на -s/-ß/-z/-x → du = основа+t (kreuzt, weist)
  - сильные глаголы — таблицей STRONG (fährt, lädt, nimmt, sieht, gibt, hat…)

СЕМЬЯ = ПЕРСОНАЖ (docs/12):
  отделяемые   → Otto  (der)   : приставка отлетает, Perfekt с -ge- внутри (aufgestanden)
  неотделяемые → Грета (die)   : приставка приросла, Perfekt БЕЗ ge- (bekommen, erfunden)
  -ieren       → Тео   (das)   : Perfekt тоже БЕЗ ge- (organisiert)
  ausprobieren — «мостик»: и отделяемый, и -ieren.
"""
import re

# приставки ВСЕГДА отделяемых (длинные — раньше коротких!)
SEP_PREFIXES = ['spazieren','zurück','weiter','kennen','statt','fern','nach','frei',
                'aus','auf','ein','mit','vor','weg','hin','ab','an','zu']
# приставки ВСЕГДА неотделяемых (приросли намертво), Perfekt без ge-
INSEP_PREFIXES = ['be','er','ver','ge','ent','emp','miss','zer']
# ⚠️ ДВОЙНЫЕ приставки: бывают и так и так — решает ПРИЧАСТИЕ:
#    umziehen → umgezogen (есть -ge- → ОТДЕЛЯЕМЫЙ)  ↔  umarmen → umarmt (нет -ge- → НЕотделяемый)
#    durchsagen → durchgesagt (отд.)  ↔  durchschauen → durchschaut (неотд.)
#    überprüfen → überprüft, wiederholen → wiederholt, unterschreiben → unterschrieben (неотд.)
AMBIG_PREFIXES = ['wieder','wider','über','unter','durch','um']

STRONG = {
 'haben':['habe','hast','hat','haben','habt','haben'],
 'sein':['bin','bist','ist','sind','seid','sind'],
 'nehmen':['nehme','nimmst','nimmt','nehmen','nehmt','nehmen'],
 'geben':['gebe','gibst','gibt','geben','gebt','geben'],
 'sehen':['sehe','siehst','sieht','sehen','seht','sehen'],
 'lesen':['lese','liest','liest','lesen','lest','lesen'],
 'essen':['esse','isst','isst','essen','esst','essen'],
 'sprechen':['spreche','sprichst','spricht','sprechen','sprecht','sprechen'],
 'treffen':['treffe','triffst','trifft','treffen','trefft','treffen'],
 'vergessen':['vergesse','vergisst','vergisst','vergessen','vergesst','vergessen'],
 'fahren':['fahre','fährst','fährt','fahren','fahrt','fahren'],
 'waschen':['wasche','wäschst','wäscht','waschen','wascht','waschen'],
 'schlagen':['schlage','schlägst','schlägt','schlagen','schlagt','schlagen'],
 'fangen':['fange','fängst','fängt','fangen','fangt','fangen'],
 'laden':['lade','lädst','lädt','laden','ladet','laden'],
 'gefallen':['gefalle','gefällst','gefällt','gefallen','gefallt','gefallen'],
 'beraten':['berate','berätst','berät','beraten','beratet','beraten'],
 'raten':['rate','rätst','rät','raten','ratet','raten'],
}

HAB = ['habe','hast','hat','haben','habt','haben']
SEIN = ['bin','bist','ist','sind','seid','sind']
PRO_AUDIO = ['ich','du','er','wir','ihr','sie']
PRO_SHOW = ['ich','du','er/sie/es','wir','ihr','sie/Sie']


def _match_prefix(inf, prefixes):
    for p in prefixes:
        if inf.startswith(p) and len(inf) > len(p) + 2:
            return p
    return None


def is_separable(inf, pp=None):
    """
    Отделяемый ли глагол. Для ДВОЙНЫХ приставок (um/durch/über/unter/wieder) решает ПРИЧАСТИЕ:
    есть 'приставка+ge' → отделяемый (umgezogen), нет → неотделяемый (umarmt).
    """
    if ' ' in inf:                       # spazieren gehen
        return True
    if _match_prefix(inf, SEP_PREFIXES):
        return True
    amb = _match_prefix(inf, AMBIG_PREFIXES)
    if amb:
        if pp:
            partizip = pp.split()[-1]
            return partizip.startswith(amb + 'ge')
        raise ValueError(
            'Двойная приставка %r у %r — нужен Perfekt, чтобы решить '
            '(umgezogen=отделяемый ↔ umarmt=неотделяемый)' % (amb, inf))
    return False


def split_prefix(inf, pp=None):
    """'aufstehen' → ('stehen','auf'); 'umarmen' → ('umarmen',''); 'machen' → ('machen','')"""
    if ' ' in inf:
        part, base = inf.split(' ', 1)
        return base, part
    if not is_separable(inf, pp):
        return inf, ''
    p = _match_prefix(inf, SEP_PREFIXES) or _match_prefix(inf, AMBIG_PREFIXES)
    return inf[len(p):], p


def conj_base(base):
    """6 личных форм базового глагола (без приставки): ich,du,er,wir,ihr,sie"""
    if base in STRONG:
        return list(STRONG[base])
    if not base.endswith('en'):
        raise ValueError('не инфинитив на -en: %r' % base)
    stem = base[:-2]
    last = stem[-1]
    if last in 'dt':
        du, er, ihr = stem+'est', stem+'et', stem+'et'
    elif last in ('s', 'ß', 'z', 'x'):
        du, er, ihr = stem+'t', stem+'t', stem+'t'
    else:
        du, er, ihr = stem+'st', stem+'t', stem+'t'
    return [stem+'e', du, er, base, ihr, base]


def conj_full(inf, pp=None):
    """
    → (6 полных форм, приставка, 6 форм базы)
    Отделяемый: 'steht auf' (приставка в конец). Неотделяемый: 'überprüft' (НЕ разделяется!).
    """
    base, part = split_prefix(inf, pp)
    forms = conj_base(base)
    return [f + (' ' + part if part else '') for f in forms], part, forms


def perfekt_forms(pp, person_idx):
    """'ist aufgestanden', лицо → ('bin', 'aufgestanden')"""
    aux_list = SEIN if pp.startswith('ist') else HAB
    return aux_list[person_idx], ' '.join(pp.split()[1:])


# ---- КЛАССИФИКАЦИЯ СЕМЬИ ----
_IEREN_FALSE = {'verlieren', 'frieren', 'gefrieren', 'schmieren', 'rasieren'}  # НЕ -ieren-семья


def family(inf, pp=None):
    """
    → множество семей: {'trennbar'} | {'untrennbar'} | {'ieren'} | {'einfach'}
    ausprobieren → {'trennbar','ieren'} (мостик). pp повышает точность (обязателен для двойных приставок).
    """
    fams = set()
    if is_separable(inf, pp):
        fams.add('trennbar')
    # -ieren: надёжный признак — причастие на -iert (verlieren→verloren НЕ попадёт)
    if pp:
        if pp.split()[-1].endswith('iert'):
            fams.add('ieren')
    elif inf.endswith('ieren') and inf not in _IEREN_FALSE:
        fams.add('ieren')
    if 'trennbar' not in fams:
        if _match_prefix(inf, INSEP_PREFIXES) or _match_prefix(inf, AMBIG_PREFIXES):
            fams.add('untrennbar')          # приставка есть, но не отделяется
    if not fams:
        fams.add('einfach')
    return fams


HERO_OF_FAMILY = {'trennbar': 'Otto', 'untrennbar': 'Грета', 'ieren': 'Тео'}
FAMILY_OF_HERO = {'otto': 'trennbar', 'greta': 'untrennbar', 'teo': 'ieren'}


def hero_for(inf, pp=None):
    """Кому принадлежит глагол по методике. Мостик → список героев."""
    fams = family(inf, pp)
    heroes = [HERO_OF_FAMILY[f] for f in ('trennbar', 'untrennbar', 'ieren') if f in fams]
    return heroes or ['—(простой)']


def all_surface_forms(inf, pp=None):
    """Все поверхностные формы для поиска в тексте: 6 личных (база+приставка отдельно) + инфинитив + причастие."""
    forms, part, base = conj_full(inf)
    out = set(base) | {inf}
    if part:
        out.add(part)
    if pp:
        out.add(pp.split()[-1])
    return out
