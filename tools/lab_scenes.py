"""Pictures for the science app's Home Lab (家里实验室).

Writes src/science/lab-scenes.js: LABPIC = {experiment id: [setup picture, step 1, step 2, step 3, step 4]}.
Every picture is a 600 x 380 side view of the same desk, drawn as SVG.  Run:  python3 tools/lab_scenes.py
The shadow pictures (approved by Lily on 25 Nov) live in lab_scenes_shadow.py.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import lab_scenes_shadow as sh
from lab_scenes_shadow import DEFS, room, label, svg, TOP

EXTRA = '''<defs>
<linearGradient id="mug" x1="0" x2="1"><stop offset="0" stop-color="#e9eef7"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd7e6"/></linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd3ff" stop-opacity=".85"/><stop offset="1" stop-color="#4f9be8" stop-opacity=".85"/></linearGradient>
<linearGradient id="metal" x1="0" x2="1"><stop offset="0" stop-color="#8d96a8"/><stop offset=".5" stop-color="#e7ebf2"/><stop offset="1" stop-color="#7c8597"/></linearGradient>
<linearGradient id="jug" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".12"/><stop offset="1" stop-color="#ffffff" stop-opacity=".35"/></linearGradient>
<linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a39b90"/><stop offset="1" stop-color="#6c645b"/></linearGradient>
<linearGradient id="mag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b5e"/><stop offset="1" stop-color="#c9372c"/></linearGradient>
<marker id="ahY" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d6492f"/></marker>
</defs>'''

def pic(body):
    return svg(EXTRA + body)

def plain_room():
    # same desk, no wall board: just the kitchen wall behind
    s = '<rect width="600" height="380" fill="#f6f1e7"/><rect x="0" y="0" width="600" height="300" fill="#efe9dd"/>'
    s += '<rect x="0" y="230" width="600" height="70" fill="#e6dfd0"/>'
    s += f'<path d="M10 {TOP} L590 {TOP} L590 {TOP+12} L10 {TOP+12} Z" fill="url(#wood)"/><rect x="10" y="{TOP+12}" width="580" height="20" fill="url(#woodF)"/>'
    for y in (TOP+4, TOP+8):
        s += f'<path d="M20 {y} C 200 {y-2}, 400 {y+2}, 580 {y}" stroke="#b88550" stroke-width=".8" fill="none" opacity=".7"/>'
    s += f'<rect x="30" y="{TOP+32}" width="16" height="48" fill="#6e4a24"/><rect x="554" y="{TOP+32}" width="16" height="48" fill="#6e4a24"/>'
    return s

def note(x, y, t, size=12):
    return label(x, y, t, c='#5a4a20', bg='#fff4c2', size=size)

def title(t, x=300, y=40):
    return label(x, y, t, size=15)

def warn(x, y, t):
    return label(x, y, '⚠ ' + t, c='#fff', bg='#d6492f', size=12)

def hand(x, y, flip=False, s=1.0):
    f = f' scale({-s} {s})' if flip else f' scale({s})'
    return (f'<g transform="translate({x} {y}){f}"><path d="M0 0 q14 -4 22 2 q6 5 2 12 l-10 3 q-8 2 -14 -2 z" fill="#f2c7a5" stroke="#c99a7a" stroke-width="1"/>'
            '<path d="M-2 2 q-6 2 -6 8 q0 5 6 5" fill="#f2c7a5" stroke="#c99a7a" stroke-width="1"/><rect x="20" y="-2" width="34" height="20" rx="6" fill="#4a5fbf"/></g>')

def finger(x, y):
    # a fingertip pressing down onto a point (x, y)
    return (f'<g transform="translate({x} {y})"><path d="M-9 -2 q0 -26 9 -40 q9 14 9 40 q0 8 -9 8 q-9 0 -9 -8z" fill="#f2c7a5" stroke="#c99a7a" stroke-width="1.2"/>'
            '<path d="M-5 -4 q5 4 10 0" stroke="#e0a98a" stroke-width="1.2" fill="none"/></g>')

def timer(x, y, t='1:00'):
    return (f'<g transform="translate({x} {y})"><rect x="-34" y="-22" width="68" height="44" rx="10" fill="#2d3348"/><rect x="-28" y="-16" width="56" height="32" rx="6" fill="#bfe8c8"/>'
            f'<text x="0" y="7" text-anchor="middle" font-size="18" font-weight="800" fill="#1d4a2a" font-family="DejaVu Sans Mono,monospace">{t}</text><rect x="-8" y="-28" width="16" height="6" rx="2" fill="#2d3348"/></g>')

# ---------------------------------------------------------------- hot spoons
MUG_X, MUG_W, MUG_H = 300, 120, 110
def mug(water=True, steam=True):
    x0, y0 = MUG_X - MUG_W/2, TOP - MUG_H
    s = ''
    if steam:
        for dx in (-30, 0, 30):
            s += f'<path d="M{MUG_X+dx} {y0-8} q-10 -14 0 -26 q10 -12 0 -26" stroke="#c9d3e3" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>'
    s += f'<path d="M{x0+MUG_W} {y0+25} q40 0 40 32 q0 32 -40 32" stroke="#cfd7e6" stroke-width="12" fill="none"/>'
    s += f'<rect x="{x0}" y="{y0}" width="{MUG_W}" height="{MUG_H}" rx="10" fill="url(#mug)" stroke="#aab4c6" stroke-width="2"/>'
    if water:
        s += f'<rect x="{x0+6}" y="{y0+34}" width="{MUG_W-12}" height="{MUG_H-40}" rx="6" fill="url(#water)"/>'
        s += f'<ellipse cx="{MUG_X}" cy="{y0+34}" rx="{MUG_W/2-6}" ry="5" fill="#bfe3ff"/>'
    s += f'<text x="{MUG_X}" y="{y0+MUG_H-14}" text-anchor="middle" font-size="12" font-weight="700" fill="#2b5e91">hot water</text>'
    return s

def spoon(kind, x, y_top, lean=0, hot=0, front=True):
    """A spoon standing in the mug: handle from y_top down into the water. hot 0..2 shows a red glow at the top."""
    col = {'metal': 'url(#metal)', 'plastic': '#58b4f0', 'wood': '#d2a46a'}[kind]
    edge = {'metal': '#6c7586', 'plastic': '#2f7fc0', 'wood': '#9a6c36'}[kind]
    L = 150
    s = f'<g transform="translate({x} {y_top}) rotate({lean})">'
    s += f'<rect x="-5" y="0" width="10" height="{L}" rx="5" fill="{col}" stroke="{edge}" stroke-width="1.4"/>'
    s += f'<ellipse cx="0" cy="{L+10}" rx="11" ry="17" fill="{col}" stroke="{edge}" stroke-width="1.4"/>'
    if hot:
        s += f'<rect x="-7" y="-2" width="14" height="{30 if hot==2 else 16}" rx="6" fill="#ff5a3c" opacity="{.55 if hot==2 else .3}"/>'
    s += '</g>'
    return s

def spoons_in(hot=(0, 0, 0)):
    y0 = TOP - MUG_H
    return (spoon('metal', MUG_X-30, y0-80, -12, hot[0]) + spoon('plastic', MUG_X, y0-86, 0, hot[1]) + spoon('wood', MUG_X+30, y0-80, 12, hot[2]))

def mug_front():
    # the front of the mug drawn again over the spoons so they look inside
    x0, y0 = MUG_X - MUG_W/2, TOP - MUG_H
    return (f'<rect x="{x0}" y="{y0+30}" width="{MUG_W}" height="{MUG_H-30}" rx="10" fill="url(#mug)" stroke="#aab4c6" stroke-width="2" opacity=".93"/>'
            f'<text x="{MUG_X}" y="{y0+MUG_H-14}" text-anchor="middle" font-size="12" font-weight="700" fill="#2b5e91">hot water</text>')

def spoon_tags():
    y0 = TOP - MUG_H
    return (label(MUG_X-110, y0-50, 'metal 金属', size=11) + label(MUG_X-2, y0-104, 'plastic 塑料', size=11) + label(MUG_X+104, y0-50, 'wood 木', size=11)
            + f'<path d="M{MUG_X-80} {y0-54} L{MUG_X-46} {y0-66}" stroke="#888" stroke-width="1"/><path d="M{MUG_X+82} {y0-54} L{MUG_X+46} {y0-66}" stroke="#888" stroke-width="1"/>')

def kettle(x, y, pour=False):
    rot = -35 if pour else 0
    s = f'<g transform="translate({x} {y}) rotate({rot})">'
    s += '<path d="M-40 0 q0 -50 40 -50 q40 0 40 50 z" fill="#d9dee8" stroke="#8a93a6" stroke-width="2"/><rect x="-44" y="0" width="88" height="10" rx="4" fill="#8a93a6"/>'
    s += '<path d="M38 -20 q30 -6 42 -26" stroke="#d9dee8" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-20 -48 q20 -22 40 0" stroke="#4a5068" stroke-width="7" fill="none"/>'
    s += '</g>'
    return s

def spoons_lying():
    s = ''
    for i, k in enumerate(('metal', 'plastic', 'wood')):
        x = 410 + i*0
        y = TOP - 8 - i*18
        col = {'metal': 'url(#metal)', 'plastic': '#58b4f0', 'wood': '#d2a46a'}[k]
        s += f'<g transform="translate(430 {y}) rotate(-90)"><rect x="-5" y="0" width="10" height="120" rx="5" fill="{col}" stroke="#6c7586" stroke-width="1"/><ellipse cx="0" cy="128" rx="9" ry="14" fill="{col}" stroke="#6c7586" stroke-width="1"/></g>'
    return s

def spoons_pics():
    p0 = plain_room() + mug(water=False, steam=False) + kettle(130, TOP, False) + timer(548, TOP-30, '1:00')
    p0 += spoons_lying().replace('translate(430', 'translate(370')
    p0 += title('要准备：杯子、热水壶、三把勺子、计时器')
    p0 += label(130, TOP-80, '热水（大人倒）', size=11) + label(300, TOP-125, '杯子', size=11) + label(548, TOP-66, '计时器', size=11)
    p0 += label(430, TOP-72, '金属 · 塑料 · 木勺', size=11)
    p1 = plain_room() + mug(water=True, steam=True) + kettle(150, TOP-70, True) + hand(110, TOP-120)
    p1 += '<path d="M222 166 q10 20 18 60" stroke="#9fd3ff" stroke-width="6" fill="none" stroke-linecap="round"/>'
    p1 += title('① 大人把热水倒进杯子，大约半杯') + warn(300, 76, '热水只让大人倒')
    p2 = plain_room() + mug(water=True, steam=True) + spoons_in() + mug_front() + spoon_tags()
    p2 += title('② 三把勺子一起放进去，勺柄露在外面') + note(300, 66, '三把一样长，同时放')
    p3 = plain_room() + mug(water=True, steam=True) + spoons_in() + mug_front() + spoon_tags() + timer(500, 150, '0:42')
    p3 += title('③ 按计时器，等 1 分钟') + note(500, 196, '勺子不要动')
    p4 = plain_room() + mug(water=True, steam=True) + spoons_in((2, 0, 0)) + mug_front() + spoon_tags()
    p4 += finger(MUG_X-48, TOP-MUG_H-80) + label(130, 120, '金属勺柄：烫！', c='#fff', bg='#d6492f', size=12)
    p4 += title('④ 轻轻碰一下每把勺柄的最上面，记下来') + warn(300, 76, '只碰最上面，不要碰水')
    return [pic(p0), pic(p1), pic(p2), pic(p3), pic(p4)]

# ---------------------------------------------------------------- stone volume
JX, JW, JH = 300, 130, 190      # measuring jug
ML_PX = 0.55                    # px per ml
def jug(ml, stone_in=False, eye=False, read=None):
    x0, yb = JX - JW/2, TOP
    s = ''
    wy = yb - 10 - ml*ML_PX
    s += f'<path d="M{x0} {yb-JH} L{x0+JW} {yb-JH} L{x0+JW-6} {yb} L{x0+6} {yb} Z" fill="#dfeaf5" opacity=".5"/>'
    s += f'<path d="M{x0+4} {wy} L{x0+JW-4} {wy} L{x0+JW-8} {yb-4} L{x0+8} {yb-4} Z" fill="url(#water)"/>'
    s += f'<path d="M{x0+4} {wy} q{JW/2-4} 8 {JW-8} 0" fill="#bfe3ff" stroke="#4f9be8" stroke-width="1.2"/>'
    if stone_in:
        s += f'<line x1="{JX+10}" y1="{yb-JH-40}" x2="{JX+10}" y2="{yb-44}" stroke="#8a6d3b" stroke-width="2"/>'
        s += f'<path d="M{JX-14} {yb-46} q8 -16 26 -12 q20 4 18 20 q-2 16 -24 16 q-24 0 -20 -24z" fill="url(#stone)" stroke="#4f4840" stroke-width="1.4"/>'
    for m in range(0, 301, 10):
        y = yb - 10 - m*ML_PX
        if y < yb - JH + 6: break
        L = 18 if m % 50 == 0 else 9
        s += f'<line x1="{x0+JW-6}" y1="{y}" x2="{x0+JW-6-L}" y2="{y}" stroke="#2b4a6b" stroke-width="{1.4 if m%50==0 else .8}"/>'
        if m % 50 == 0:
            s += f'<text x="{x0+JW-28}" y="{y+4}" text-anchor="end" font-size="11" font-weight="700" fill="#2b4a6b">{m}</text>'
    s += f'<text x="{x0+JW-28}" y="{yb-JH+18}" text-anchor="end" font-size="10" fill="#2b4a6b">ml</text>'
    s += f'<path d="M{x0} {yb-JH} L{x0+JW} {yb-JH} L{x0+JW-6} {yb} L{x0+6} {yb} Z" fill="url(#jug)" stroke="#8aa4c0" stroke-width="2.5"/>'
    s += f'<path d="M{x0+JW} {yb-JH+20} q36 6 32 50 q-4 36 -36 40" stroke="#8aa4c0" stroke-width="7" fill="none"/>'
    if eye:
        s += f'<line x1="40" y1="{wy+4}" x2="{x0+JW+60}" y2="{wy+4}" stroke="#d6492f" stroke-width="1.6" stroke-dasharray="5 4"/>'
        s += f'<g transform="translate(60 {wy+4})"><ellipse cx="0" cy="0" rx="18" ry="11" fill="#fff" stroke="#333" stroke-width="1.6"/><circle cx="6" cy="0" r="6" fill="#3a2a1a"/><circle cx="8" cy="-2" r="1.8" fill="#fff"/></g>'
    if read:
        s += label(x0+JW+92, wy+8, read, c='#fff', bg='#2b4a6b', size=13)
    return s, wy

def stone_pics():
    j0, _ = jug(0)
    p0 = plain_room() + j0
    p0 += f'<path d="M470 {TOP-4} q8 -16 26 -12 q20 4 18 20 q-2 16 -24 16 q-24 0 -20 -24z" fill="url(#stone)" stroke="#4f4840" stroke-width="1.4"/>'
    p0 += f'<path d="M110 {TOP-6} q-30 -30 0 -60 q30 -30 60 0" stroke="#8a6d3b" stroke-width="2.5" fill="none"/>'
    p0 += title('要准备：量杯、水、一块小石头、一段线')
    p0 += label(300, TOP-206, '量杯（有 ml 刻度）', size=11) + label(490, TOP-40, '小石头', size=11) + label(130, TOP-80, '线', size=11)
    j1, wy = jug(200)
    p1 = plain_room() + j1 + title('① 量杯放平，倒水到 200 ml') + note(300, 66, '量杯放在桌上，不要拿在手里')
    j2, wy = jug(200, eye=True, read='200 ml')
    p2 = plain_room() + j2 + title('② 蹲下来，眼睛和水面一样高再读') + note(300, 66, '看水面弯下去的最低点')
    j3, wy = jug(260, stone_in=True)
    p3 = plain_room() + j3 + title('③ 石头用线绑好，慢慢放进水里') + note(300, 66, '石头要整个泡在水里，不要碰到杯底太用力')
    j4, wy = jug(260, stone_in=True, eye=True, read='260 ml')
    p4 = plain_room() + j4 + title('④ 再读一次水位，两个数相减') + note(300, 66, '260 − 200 = 60，石头的体积是 60 cm³')
    return [pic(p0), pic(p1), pic(p2), pic(p3), pic(p4)]

# ---------------------------------------------------------------- magnet
OBJ = [('clip', '回形针'), ('pin', '别针'), ('foil', '铝箔'), ('chop', '木筷'), ('ruler', '塑料尺'), ('band', '橡皮筋')]
def obj(k, x, y):
    if k == 'clip':
        return f'<path transform="translate({x} {y})" d="M-14 -4 h24 a5 5 0 0 1 0 10 h-22 a4 4 0 0 1 0 -8 h18" fill="none" stroke="#8d96a8" stroke-width="2.4"/>'
    if k == 'pin':
        return f'<g transform="translate({x} {y})"><path d="M-18 0 h30 a5 5 0 0 0 0 -8 h-30" fill="none" stroke="#a3abbd" stroke-width="2"/><circle cx="-20" cy="-4" r="4" fill="none" stroke="#a3abbd" stroke-width="2"/></g>'
    if k == 'foil':
        return f'<path transform="translate({x} {y})" d="M-16 6 l6 -14 l10 4 l8 -8 l8 12 l-6 8 z" fill="url(#metal)" stroke="#8d96a8" stroke-width="1"/>'
    if k == 'chop':
        return f'<rect x="{x-30}" y="{y-3}" width="60" height="6" rx="3" fill="#d2a46a" stroke="#9a6c36" stroke-width="1"/>'
    if k == 'ruler':
        return f'<g transform="translate({x} {y})"><rect x="-30" y="-6" width="60" height="12" rx="2" fill="#7fd0ff" opacity=".8" stroke="#2f7fc0"/>' + ''.join(f'<line x1="{-26+i*6}" y1="-6" x2="{-26+i*6}" y2="{-2 if i%5 else 1}" stroke="#2f7fc0"/>' for i in range(10)) + '</g>'
    if k == 'band':
        return f'<ellipse cx="{x}" cy="{y}" rx="16" ry="7" fill="none" stroke="#e0a32e" stroke-width="3"/>'

def magnet(x, y, rot=0):
    return (f'<g transform="translate({x} {y}) rotate({rot})"><rect x="-30" y="-14" width="60" height="28" rx="6" fill="url(#mag)" stroke="#8a1f17" stroke-width="1.5"/>'
            '<text x="0" y="5" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">MAGNET</text></g>')

def mag_pics():
    xs = [70 + i*92 for i in range(6)]
    row = ''.join(f'<g transform="translate({x} {TOP-16}) scale(1.9) translate({-x} {-(TOP-16)})">'+obj(k, x, TOP-16)+'</g>' for (k, _), x in zip(OBJ, xs))
    tags = ''.join(label(x, TOP-52, n, size=12) for (_, n), x in zip(OBJ, xs))
    p0 = plain_room() + row + tags + magnet(300, 120) + title('要准备：冰箱贴磁铁，还有这 6 样东西')
    p1 = plain_room() + row + tags + title('① 6 样东西在桌上排成一排') + note(300, 66, '一样一样分开放')
    p2 = plain_room() + row + tags + magnet(xs[0]+4, TOP-100) + hand(xs[0]+34, TOP-114)
    p2 += f'<path d="M{xs[0]+4} {TOP-84} v14" stroke="#d6492f" stroke-width="2" marker-end="url(#ahY)"/>'
    p2 += title('② 拿磁铁慢慢靠近每一样东西') + note(300, 66, '靠近就好，不用用力压')
    p3 = plain_room() + magnet(150, 130) + f'<g transform="translate(150 156) scale(1.9) translate(-150 -156)">'+obj('clip', 150, 156)+'</g>' + hand(180, 116)
    p3 += label(150, 200, '吸起来了！', c='#fff', bg='#2f9e6a', size=13)
    p3 += f'<g transform="translate(420 {TOP-14}) scale(1.9) translate(-420 {-(TOP-14)})">'+obj('chop', 420, TOP-14)+'</g>' + magnet(420, TOP-60) + label(420, TOP-90, '没反应', c='#fff', bg='#8a8f9c', size=13)
    p3 += title('③ 看它有没有被吸住')
    big = lambda k, x: f'<g transform="translate({x} {TOP-16}) scale(1.7) translate({-x} {-(TOP-16)})">' + obj(k, x, TOP-16) + '</g>'
    left = big('clip', 80) + big('pin', 175)
    right = ''.join(big(k, x) for k, x in (('foil', 305), ('chop', 385), ('ruler', 480), ('band', 560)))
    p4 = plain_room() + f'<line x1="260" y1="{TOP-120}" x2="260" y2="{TOP}" stroke="#b9ae96" stroke-width="2" stroke-dasharray="6 5"/>'
    p4 += left + right + label(130, TOP-60, '吸住的', c='#fff', bg='#2f9e6a', size=13) + label(430, TOP-60, '没吸住的', c='#fff', bg='#8a8f9c', size=13)
    p4 += title('④ 吸住的放左边，没吸住的放右边，记下来')
    return [pic(p0), pic(p1), pic(p2), pic(p3), pic(p4)]

# ---------------------------------------------------------------- syringe
def syringe(x, y, fill_ml, push_ml=None, content='air', blocked=False, hold=False):
    """Horizontal syringe, tip on the left at x. Barrel 0..10 ml over 220 px. push_ml = plunger position."""
    pm = fill_ml if push_ml is None else push_ml
    L = 220
    s = f'<g transform="translate({x} {y})">'
    s += f'<rect x="20" y="-18" width="{L}" height="36" rx="5" fill="#eef4fb" opacity=".6" stroke="#8aa4c0" stroke-width="2"/>'
    # contents
    w = pm/10*L
    if content == 'water':
        s += f'<rect x="22" y="-15" width="{w}" height="30" fill="url(#water)"/>'
    else:
        for i in range(int(w//16)):
            s += f'<circle cx="{30+i*16}" cy="{(-6 if i%2 else 6)}" r="3.4" fill="#cfe3f7" stroke="#8aa4c0" stroke-width=".8"/>'
    s += f'<rect x="0" y="-5" width="22" height="10" rx="3" fill="#eef4fb" stroke="#8aa4c0" stroke-width="2"/>'
    for m in range(0, 11):
        xx = 20 + m/10*L
        s += f'<line x1="{xx}" y1="-18" x2="{xx}" y2="{-10 if m%5 else -6}" stroke="#2b4a6b" stroke-width="1"/>'
        if m % 5 == 0:
            s += f'<text x="{xx}" y="-24" text-anchor="middle" font-size="11" font-weight="700" fill="#2b4a6b">{m}</text>'
    s += f'<text x="{20+L+6}" y="-24" font-size="10" fill="#2b4a6b">ml</text>'
    px = 20 + w
    s += f'<rect x="{px}" y="-16" width="8" height="32" rx="2" fill="#4a5068"/><rect x="{px+8}" y="-4" width="60" height="8" fill="#9aa3b8"/><rect x="{px+68}" y="-20" width="10" height="40" rx="3" fill="#4a5068"/>'
    if hold:
        s += hand(px+80, -12)
    s += f'<rect x="{20+L}" y="-26" width="8" height="52" rx="2" fill="#c8d3e3" stroke="#8aa4c0"/>'
    if blocked:
        s += '<g transform="translate(-2 0) rotate(90)">' + finger(0, 0).replace('<g transform="translate(0 0)">', '<g>') + '</g>'
    s += '</g>'
    return s

def syr_pics():
    y = 190
    p0 = plain_room() + syringe(160, y, 0) + '<path d="M80 290 q30 -40 60 0 z" fill="#9fd3ff" stroke="#4f9be8"/>'
    p0 += title('要准备：喂药用的针筒（没有针头）、一小碗水') + label(270, y+50, '针筒', size=11) + label(110, 250, '水', size=11)
    p0 += warn(300, 76, '不要对着人，不要用有针头的')
    p1 = plain_room() + syringe(160, y, 10, hold=True) + title('① 把活塞拉到 10 ml，里面是空气') + note(300, 66, '空气看不见，但它在里面')
    p2 = plain_room() + syringe(160, y, 10, blocked=True) + title('② 手指紧紧按住针筒口') + note(300, 66, '按紧，不要让空气跑出来')
    p3 = plain_room() + syringe(160, y, 10, push_ml=6, blocked=True, hold=True)
    p3 += f'<path d="M470 {y+44} h-80" stroke="#d6492f" stroke-width="2.5" marker-end="url(#ahY)"/>' + label(400, y+80, '推到 6 ml', c='#fff', bg='#2b4a6b', size=13)
    p3 += title('③ 用力推活塞，看推到几 ml') + note(300, 66, '松手后活塞会弹回来')
    p4 = plain_room() + syringe(160, y, 10, push_ml=10, content='water', blocked=True, hold=True)
    p4 += label(400, y+80, '水：几乎推不动', c='#fff', bg='#2b4a6b', size=13)
    p4 += title('④ 换成 10 ml 水，按住口再推一次') + note(300, 66, '在水槽上做，水会洒一点')
    return [pic(p0), pic(p1), pic(p2), pic(p3), pic(p4)]

# ---------------------------------------------------------------- shadow (approved scenes + a setup picture)
def shadow_pics():
    p0 = room() + sh.tape() + sh.toy(20)
    p0 += sh.torch(48, on=False).replace('<g>', '<g transform="translate(-40 0)">', 1)
    p0 += f'<rect x="430" y="{TOP-10}" width="70" height="10" rx="2" fill="url(#rulerG)" stroke="#a89a78"/>'
    p0 += title('要准备：手电筒、小玩具、卷尺、尺子、一面白墙', x=280)
    p0 += label(80, TOP-70, '手电筒', size=11) + label(360, TOP-90, '小玩具', size=11) + label(465, TOP-26, '尺子', size=11) + label(200, TOP+48, '卷尺贴在桌边，0 对着墙', size=11)
    return [svg(p0)] + [sh.scene(i) for i in (1, 2, 3, 4)]

if __name__ == '__main__':
    out = {'shadow': shadow_pics(), 'spoons': spoons_pics(), 'stone': stone_pics(), 'magnet': mag_pics(), 'air': syr_pics()}
    here = os.path.dirname(os.path.abspath(__file__))
    js = '/* generated by tools/lab_scenes.py — do not edit by hand */\nconst LABPIC=' + json.dumps(out, ensure_ascii=False) + ';\n'
    open(os.path.join(here, '..', 'src', 'science', 'lab-scenes.js'), 'w', encoding='utf-8').write(js)
    print('pictures:', sum(len(v) for v in out.values()), 'bytes:', len(js))
