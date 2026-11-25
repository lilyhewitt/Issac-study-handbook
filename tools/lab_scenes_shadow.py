# Detailed side-view scenes for the shadow experiment. 1 cm = PX px, measured from the wall.
PX = 9.0
WALL = 540          # x of the wall face
TOP = 300           # y of the table top
TOY_H = 64          # toy height in px
LENS_Y = TOP - 34   # torch lens height

def X(cm):  # cm from the wall -> x
    return WALL - cm*PX

DEFS = '''<defs>
<linearGradient id="wallG" x1="0" x2="1"><stop offset="0" stop-color="#efe7d6"/><stop offset="1" stop-color="#e2d8c3"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99a63"/><stop offset="1" stop-color="#a8773f"/></linearGradient>
<linearGradient id="woodF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a35"/><stop offset="1" stop-color="#7c5228"/></linearGradient>
<linearGradient id="torchB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6a8a"/><stop offset=".45" stop-color="#9aa8c8"/><stop offset="1" stop-color="#3d4660"/></linearGradient>
<linearGradient id="torchH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c7896"/><stop offset=".5" stop-color="#c3cde3"/><stop offset="1" stop-color="#465071"/></linearGradient>
<radialGradient id="lens"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#ffe98a"/><stop offset="1" stop-color="#f2c94c"/></radialGradient>
<linearGradient id="beam" x1="0" x2="1"><stop offset="0" stop-color="#fff4b0" stop-opacity=".75"/><stop offset="1" stop-color="#fff4b0" stop-opacity=".18"/></linearGradient>
<linearGradient id="tape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd84d"/><stop offset="1" stop-color="#f0b929"/></linearGradient>
<linearGradient id="rulerG" x1="0" x2="1"><stop offset="0" stop-color="#f7f2e4"/><stop offset="1" stop-color="#e5dcc4"/></linearGradient>
<linearGradient id="dino" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fd18f"/><stop offset="1" stop-color="#3ea866"/></linearGradient>
<filter id="soft"><feGaussianBlur stdDeviation="1.4"/></filter>
</defs>'''

def room(dark=False):
    s = f'<rect width="600" height="380" fill="{"#1c1f3a" if dark else "#f6f1e7"}"/>'
    # back wall of the room (behind everything), and the white wall/board on the right
    s += f'<rect x="0" y="0" width="{WALL}" height="{TOP}" fill="{"#262a4d" if dark else "#efe9dd"}"/>'
    s += f'<rect x="{WALL}" y="20" width="44" height="{TOP-20}" fill="url(#wallG)"/>'
    s += f'<rect x="{WALL}" y="20" width="5" height="{TOP-20}" fill="#d6cab0"/>'
    s += f'<text x="{WALL+22}" y="40" text-anchor="middle" font-size="11" fill="#9a8f78" transform="rotate(90 {WALL+22} 40)">white wall 白墙</text>'
    # table: top face + front face + grain + legs
    s += f'<path d="M20 {TOP} L{WALL+44} {TOP} L{WALL+44} {TOP+12} L20 {TOP+12} Z" fill="url(#wood)"/>'
    s += f'<rect x="20" y="{TOP+12}" width="{WALL+24}" height="20" fill="url(#woodF)"/>'
    for i, y in enumerate((TOP+4, TOP+8)):
        s += f'<path d="M30 {y} C 160 {y-2}, 300 {y+2}, {WALL+30} {y}" stroke="#b88550" stroke-width=".8" fill="none" opacity=".7"/>'
    s += f'<rect x="40" y="{TOP+32}" width="16" height="48" fill="#6e4a24"/><rect x="{WALL+8}" y="{TOP+32}" width="16" height="48" fill="#6e4a24"/>'
    if dark:
        s += '<rect width="600" height="380" fill="#0b0d22" opacity=".25"/>'
    return s

def tape():
    # measuring tape along the front edge, 0 at the wall
    y = TOP + 13
    s = f'<rect x="{X(48)}" y="{y}" width="{48*PX}" height="15" fill="url(#tape)" stroke="#c99413" stroke-width=".8"/>'
    for cm in range(0, 49):
        x = X(cm)
        h = 8 if cm % 10 == 0 else (5 if cm % 5 == 0 else 3)
        s += f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+h}" stroke="#3b2a05" stroke-width="{1.1 if cm%10==0 else .7}"/>'
        if cm % 10 == 0:
            s += f'<text x="{x}" y="{y+14}" text-anchor="middle" font-size="7.5" font-weight="700" fill="#3b2a05">{cm}</text>'
    s += f'<rect x="{X(48)-14}" y="{y-3}" width="16" height="21" rx="3" fill="#d63b3b"/>'
    return s

def toy(cm):
    x = X(cm)
    b = TOP
    return f'''<g transform="translate({x} {b})">
<ellipse cx="0" cy="0" rx="18" ry="3" fill="#000" opacity=".18"/>
<path d="M-14 -4 Q-16 -30 -6 -40 Q-2 -58 8 -62 Q18 -64 20 -54 Q20 -46 12 -44 Q14 -30 14 -4 Z" fill="url(#dino)" stroke="#2c7d4a" stroke-width="1.2"/>
<path d="M-14 -14 Q-28 -10 -32 -2 Q-22 -6 -14 -6 Z" fill="url(#dino)" stroke="#2c7d4a" stroke-width="1.2"/>
<circle cx="12" cy="-56" r="2.6" fill="#fff"/><circle cx="12.8" cy="-56" r="1.4" fill="#222"/>
<path d="M14 -49 q3 2 5 0" stroke="#2c7d4a" stroke-width="1.2" fill="none"/>
<path d="M-2 -44 l4 -6 l3 6 M-8 -36 l4 -6 l3 6 M-12 -26 l4 -6 l3 6" fill="#f7c948" stroke="#c99413" stroke-width=".8"/>
<rect x="-10" y="-6" width="7" height="6" rx="2" fill="#2c7d4a"/><rect x="4" y="-6" width="7" height="6" rx="2" fill="#2c7d4a"/>
</g>'''

def torch(cm, on=True, ghost=False):
    # lens faces right; cm = distance from the toy's front? we place lens at X(cm)
    x = X(cm)
    y = LENS_Y
    op = ' opacity=".28"' if ghost else ''
    g = f'''<g{op}>
<rect x="{x-78}" y="{y-9}" width="58" height="18" rx="6" fill="url(#torchB)"/>
<rect x="{x-60}" y="{y-13}" width="10" height="5" rx="2" fill="#e85a4f"/>
<path d="M{x-22} {y-9} L{x-6} {y-15} L{x-6} {y+15} L{x-22} {y+9} Z" fill="url(#torchH)"/>
<ellipse cx="{x-5}" cy="{y}" rx="4" ry="15" fill="{'url(#lens)' if on and not ghost else '#c9cfdd'}"/>
<rect x="{x-82}" y="{y-6}" width="6" height="12" rx="2" fill="#2d3348"/>
<rect x="{x-70}" y="{y+9}" width="40" height="{TOP-y-9}" fill="#8a7458"/>
<rect x="{x-76}" y="{TOP-5}" width="52" height="5" rx="2" fill="#6e5a40"/>
</g>'''
    return g

def beam_and_shadow(lens_cm, toy_cm):
    """Light from the lens past the toy's top onto the wall. Returns beam, shadow, shadow height in cm."""
    lx, ly = X(lens_cm) - 1, LENS_Y
    tx, ty = X(toy_cm), TOP - TOY_H
    # line from lens through the toy top to the wall
    k = (ty - ly) / (tx - lx)
    wy = ly + k * (WALL - lx)
    top_beam = 30
    beam = f'<path d="M{lx} {ly-12} L{WALL} {top_beam} L{WALL} {TOP} L{lx} {ly+12} Z" fill="url(#beam)"/>'
    # light patch on the wall
    beam += f'<rect x="{WALL}" y="{top_beam+10}" width="44" height="{TOP-top_beam-10}" fill="#fff3a8" opacity=".55"/>'
    sc = (TOP - wy) / 62.0
    sh = (f'<g transform="translate({WALL+22} {TOP}) scale({0.55*sc:.3f} {sc:.3f})" opacity=".88">'
          '<path d="M-14 -4 Q-16 -30 -6 -40 Q-2 -58 8 -62 Q18 -64 20 -54 Q20 -46 12 -44 Q14 -30 14 -4 Z M-14 -14 Q-28 -10 -32 -2 Q-22 -6 -14 -6 Z" fill="#23263a"/></g>')
    # dashed ray past the toy top
    ray = f'<line x1="{lx}" y1="{ly}" x2="{WALL}" y2="{wy}" stroke="#c99413" stroke-width="1" stroke-dasharray="4 3"/>'
    h_cm = (TOP - wy) / PX * 0.9  # read as cm on the ruler (scale for the story)
    return beam, sh + ray, wy

def label(x, y, t, c="#1d2140", bg="#ffffffd9", size=13, anchor="middle"):
    w = sum(size*1.02 if ord(ch)>0x2e80 else size*0.6 for ch in t) + 16
    x0 = x - w/2 if anchor == "middle" else x
    return f'<rect x="{x0}" y="{y-size-3}" width="{w}" height="{size+9}" rx="6" fill="{bg}"/><text x="{x0+w/2}" y="{y+1}" text-anchor="middle" font-size="{size}" font-weight="700" fill="{c}">{t}</text>'

def dist(cm1, cm2, y, t, c="#d6492f", tc=None, bg="#ffffffd9"):
    x1, x2 = X(cm1), X(cm2)
    s = f'<g stroke="{c}" stroke-width="2"><line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}"/><line x1="{x1}" y1="{y-7}" x2="{x1}" y2="{y+7}"/><line x1="{x2}" y1="{y-7}" x2="{x2}" y2="{y+7}"/></g>'
    return s + label((x1+x2)/2, y-10, t, c=tc or c, bg=bg)

def ruler_hand(wy, reading):
    x = WALL + 8
    s = f'<rect x="{x}" y="{wy-26}" width="16" height="{TOP-wy+26}" fill="url(#rulerG)" stroke="#a89a78" stroke-width=".8"/>'
    for i in range(0, int((TOP-wy+26)/4)):
        yy = TOP - i*4
        l = 7 if i % 5 == 0 else 4
        s += f'<line x1="{x}" y1="{yy}" x2="{x+l}" y2="{yy}" stroke="#555" stroke-width=".6"/>'
    # hand holding the ruler
    s += f'''<g transform="translate({x+18} {wy-8})"><path d="M0 0 q14 -4 22 2 q6 5 2 12 l-10 3 q-8 2 -14 -2 z" fill="#f2c7a5" stroke="#c99a7a" stroke-width="1"/>
<path d="M-2 2 q-6 2 -6 8 q0 5 6 5" fill="#f2c7a5" stroke="#c99a7a" stroke-width="1"/><rect x="20" y="-2" width="30" height="20" rx="6" fill="#4a5fbf"/></g>'''
    # pointer to the shadow top, and zoom bubble
    s += f'<line x1="{WALL+3}" y1="{wy}" x2="{WALL-70}" y2="{wy-70}" stroke="#d6492f" stroke-width="1.5"/>'
    s += f'<circle cx="{WALL-100}" cy="{wy-96}" r="34" fill="#fff" stroke="#d6492f" stroke-width="2"/>'
    s += f'<rect x="{WALL-108}" y="{wy-126}" width="16" height="60" fill="url(#rulerG)"/>'
    s += ''.join(f'<line x1="{WALL-108}" y1="{wy-126+i*6}" x2="{WALL-100 if i%5 else WALL-96}" y2="{wy-126+i*6}" stroke="#555" stroke-width=".8"/>' for i in range(11))
    s += f'<rect x="{WALL-92}" y="{wy-96}" width="14" height="30" fill="#2a2d3a"/>'
    s += f'<text x="{WALL-100}" y="{wy-46}" stroke="#fff" stroke-width="3" paint-order="stroke" text-anchor="middle" font-size="13" font-weight="800" fill="#d6492f">{reading}</text>'
    return s

def switch_off():
    return '''<g transform="translate(40 40)"><rect x="0" y="0" width="34" height="50" rx="6" fill="#f4f1ea" stroke="#b8b09c"/><rect x="9" y="10" width="16" height="30" rx="3" fill="#d9d3c4"/><rect x="11" y="25" width="12" height="13" rx="2" fill="#8b8577"/>
<text x="44" y="22" font-size="13" font-weight="800" fill="#ff8f8f">OFF</text><text x="44" y="40" font-size="12" fill="#cfd5ff">关灯</text></g>'''

def svg(body):
    return f'<svg viewBox="0 0 600 380" width="100%" style="border-radius:14px;display:block">{DEFS}{body}</svg>'

TOY = 20   # toy is 20 cm from the wall
def scene(step):
    if step == 1:
        b = room() + tape() + toy(TOY) + dist(0, TOY, TOP-92, '20 cm')
        b += label(200, 70, '① 恐龙放在离墙 20 cm 的地方', size=15)
        b += label(200, 96, '看卷尺：0 在墙边', size=12, c='#5a4a20', bg='#fff4c2')
        return svg(b)
    if step == 2:
        L = TOY + 30
        beam, sh, wy = beam_and_shadow(L, TOY)
        b = room(dark=True) + beam + tape() + toy(TOY) + sh + torch(L) + switch_off()
        b += dist(TOY, L, TOP-110, '手电筒到恐龙 30 cm', c='#ffd166', tc='#1d2140', bg='#ffd166')
        b += label(300, 40, '② 关灯，手电筒对准恐龙', size=15)
        b += label(WALL-30, wy-14, '墙上的影子', c='#fff', bg='#2a2d3ae0', size=12)
        return svg(b)
    if step == 3:
        L = TOY + 30
        beam, sh, wy = beam_and_shadow(L, TOY)
        b = room(dark=True) + beam + tape() + toy(TOY) + sh + torch(L) + ruler_hand(wy, '9 cm')
        b += label(200, 40, '③ 大人用尺量影子多高', size=15)
        b += label(200, 66, '从桌面量到影子最上面', size=12, c='#5a4a20', bg='#fff4c2')
        return svg(b)
    if step == 4:
        L = TOY + 10
        beam, sh, wy = beam_and_shadow(L, TOY)
        b = room(dark=True) + beam + tape() + toy(TOY) + sh
        b += torch(TOY+30, ghost=True) + torch(TOY+20, ghost=True) + torch(L)
        b += f'<path d="M{X(TOY+30)-40} {LENS_Y-48} C {X(TOY+25)} {LENS_Y-68}, {X(TOY+15)} {LENS_Y-68}, {X(L)-36} {LENS_Y-48}" stroke="#ffd166" stroke-width="2.5" fill="none" marker-end="url(#ah)"/>'
        b = b.replace('</defs>', '<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ffd166"/></marker></defs>') if '</defs>' in b else b
        b += label(X(TOY+30)-38, LENS_Y-24, '30 cm', c='#ffd166', bg='#00000066', size=12) + label(X(TOY+20)-38, LENS_Y-24, '20 cm', c='#ffd166', bg='#00000066', size=12) + label(X(L)-38, LENS_Y-24, '10 cm', c='#1d2140', bg='#ffd166', size=12)
        b += label(250, 40, '④ 手电筒移近到 20 cm、10 cm，每次都量', size=14)
        b += label(250, 66, '恐龙和墙都不动', size=12, c='#5a4a20', bg='#fff4c2')
        b += label(WALL-30, wy-14, '影子变大了', c='#fff', bg='#2a2d3ae0', size=12)
        return svg(b)
