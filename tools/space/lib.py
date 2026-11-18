# helpers for the Space Mission question data (science app). Written from claude/太空探险_闯关题目设计.md
import re
def mc(ask, opts, ans, say=''):
    assert ans in opts, (ask, ans)
    return dict(k='mc', ask=ask, opts=opts, ans=ans, say=say)
def op(ask, tpl, dir, frame, extra=(), ans=None, ev=None, evtip='', score=None):
    slots = re.findall(r'\{([^}]+)\}', frame)
    assert slots, frame
    if ans is None:
        ans = re.sub(r'\{([^}]+)\}', r'**\1**', frame)
    for d in dir:
        assert d.lower() in ask.lower(), ('dir not in ask', d, ask)
    for e in extra:
        assert isinstance(e, tuple) and len(e) == 2, e
        assert e[0] not in slots, ('extra equals slot', e)
    return dict(k='op', ask=ask, tpl=tpl, dir=list(dir), frame=frame, extra=[list(e) for e in extra], ans=ans, ev=ev, evtip=evtip, score=score or [])
def tf(ask, ans, why=''):
    return mc(ask, ['True', 'False', 'Not possible to tell'], ans, why)
def pr(q='', parts=(), tbl=None, pre=None, note=''):
    d = dict(k='pr', q=q, tbl=tbl, parts=list(parts), note=note)
    if pre: d['pre'] = pre
    for p in parts:
        ev = p.get('ev')
        if ev:
            if ev[0] == 'txt': assert ev[1] in q, ('ev text not in q', ev, q)
            elif ev[0] == 'cell': assert tbl and tbl[ev[1]][ev[2]] is not None
            elif ev[0] == 'row': assert tbl and len(tbl) > ev[1]
    return d
def pre(ask, tpl, dir):
    for x in dir: assert x.lower() in ask.lower(), (x, ask)
    return dict(ask=ask, tpl=tpl, dir=list(dir))
def mcq(q, opts, ans, why='', note='', tbl=None):
    assert 1 <= ans <= len(opts)
    return dict(k='mcq', q=q, opts=opts, ans=ans - 1, why=why, note=note, tbl=tbl)
