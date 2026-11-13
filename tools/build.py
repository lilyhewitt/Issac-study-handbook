#!/usr/bin/env python3
"""Build the three practice apps from src/ into english/, science/ and math/.

    python3 tools/build.py                 build all three (what gets deployed)
    python3 tools/build.py --db URL        use another sync database (tests use a local mock)
    python3 tools/build.py --out DIR       write DIR/<app>/index.html instead of the repo folders
    python3 tools/build.py --artifact F    also write the English app without the page wrapper

src/app.html is the shared app (written as the English edition). Science and maths are the same
app with their own question bank, colours, home tiles and names; maths also adds the bar-model screen.
Every replacement is asserted, so a change to app.html that breaks an edition fails the build.
"""
import argparse, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
DB = 'https://xiaoxiao-sync-default-rtdb.asia-southeast1.firebasedatabase.app'

def read(*p):
    with open(os.path.join(SRC, *p), encoding='utf-8') as f:
        return f.read()

def rep(s, a, b, n=1):
    c = s.count(a)
    assert c == n, 'expected %d of %r, found %d' % (n, a[:70], c)
    return s.replace(a, b)

APPS = {
    'english': dict(theme='#2F66F0', name='小小英文', desc='小小的英文练习：语法、词汇、阅读选择题，每轮 5 题。'),
    'science': dict(theme='#12965F', name='小小科学', desc='小小的科学练习：三年级复习和四年级预习选择题，每轮 5 题，带中文翻译。',
        title='小小科学题库', edition='Science', key='xiaoxiao-science-v1',
        tokens=[('--gram', '--life'), ('--word', '--mat'), ('--read', '--p4')], modes=('mat', 'p4'), flame='--mat',
        cats="{life:'Living things 生物',mat:'Materials & magnets 材料磁铁',p4:'P4 preview 四年级预习'}",
        help='Tap 🔊 Listen to hear the question. Tap 中文 to read the question in Chinese.'),
    'math': dict(theme='#6B47E6', name='小小数学', desc='小小的数学练习：应用题一步一步想、计算和四年级预习，每轮 5 题。',
        title='小小数学题库', edition='Maths', key='xiaoxiao-math-v1',
        tokens=[('--gram', '--wp'), ('--word', '--calc'), ('--read', '--p4')], modes=('calc', 'p4'), flame='--calc',
        cats="{wp:'Word problems 应用题',calc:'Calculation 计算',p4:'Preview 4A 预习 4A'}",
        help='Tap 🔊 Listen to hear the question. Tap 中文 to read it in Chinese. Word problems come in small steps.'),
}

def edition(app):
    """The app page before the document wrapper: template + this subject's pieces."""
    c, s = APPS[app], read('app.html')
    if app != 'english':
        s = rep(s, '<title>小小英文题库</title>', '<title>%s</title>' % c['title'])
        for a, b in c['tokens']:                       # colour tokens are named after the English categories
            assert a in s
            s = s.replace(a, b)
        for kind in ('.tile[data-mode="%s"]', '.chip[data-c="%s"]'):
            for old, new in zip(('word', 'read'), c['modes']):
                s = rep(s, kind % old, kind % new)
        s = rep(s, '/* Layout: one phone-width column.', '/* %s edition of the English practice app. Layout: one phone-width column.' % c['edition'])
        i = s.index('</style>') + len('</style>\n')
        s = s[:i] + read(app, 'palette.html') + s[i:]
        s = rep(s, 'Tap 🔊 Listen to hear the question. Tap 提示 for a Chinese hint.', c['help'])
        s, n = re.subn(r'<button class="tool" id="bHint" aria-pressed="false">.*?</button>', lambda m: read('shared', 'hint-zh.html'), s, count=1, flags=re.S)
        assert n == 1
    s = rep(s, '/*__BANK__*/', read(app, 'bank.js'))
    if app != 'english':
        s = rep(s, "const KEY='xiaoxiao-english-v1'", "const KEY='%s'" % c['key'])
        s = rep(s, "const NEWV={cards:1,pp:1};", "const NEWV=%s;" % ('{bar:1,wp:1}' if app == 'math' else '{}'))
        s = rep(s, "const CATS={gram:'Grammar 语法',word:'Words 词汇',read:'Reading 阅读'};", 'const CATS=%s;' % c['cats'])
        s = rep(s, '.ico-flame{fill:var(%s)}' % c['flame'], '.ico-flame{fill:var(--p4)}')
    # home in every app: square tiles (word cards first, try again last), no Mix, word-cards bar gone
    a = s.index('    <button class="wtile" id="tWords">'); b = s.index('</button>\n', a) + len('</button>\n')
    s = s[:a] + s[b:]
    t0, t1 = s.index('<div class="tiles">'), s.index('<button class="redo"')
    s = s[:t0] + read(app, 'tiles.html') + s[t1:]
    i = s.index('</style>')
    css = read('shared', 'home6.css')
    for a, b in (c['tokens'] if app != 'english' else []):   # same colour-token renames as the template
        css = css.replace(a, b)
    s = s[:i] + css + s[i:]
    s = rep(s, 'function home(){', read('shared', 'home6.js') + '\nfunction home(){')
    if app == 'english':                               # the phrases deck (介词词组)
        s = rep(s, '  <section id="vSpell" class="view"', read('english', 'pp.html') + '  <section id="vSpell" class="view"')
        def cut(s, start):                            # take a home-page block out, return the page without it
            a = s.index(start); b = s.index('</button>\n', a) + len('</button>\n')
            return s[:a] + s[b:]
        s = cut(s, '    <button class="wtile" id="tSpell" hidden>')   # spell it is mixed into the Words round
        i = s.index('</style>')
        s = s[:i] + read('english', 'pp.css') + s[i:]
        s = rep(s, 'function home(){', read('english', 'pp.js') + '\nfunction home(){')
        # the word map (单词地图): sets along a road, reviews, chests and badges; new sentences for the chests
        s = rep(s, '  <section id="vSpell" class="view"', read('shared', 'map.html') + '  <section id="vSpell" class="view"')
        i = s.index('</style>')
        s = s[:i] + read('shared', 'map.css') + s[i:]
        s = rep(s, 'function home(){', read('english', 'sent.js') + '\n' + read('shared', 'map.js') + '\nfunction home(){')
    if app == 'science':                               # 答题本领 answer-skill questions
        sk = read('science', 'skill.js').replace('/*__CARDS__*/[]', read('science', 'cards.json').strip())
        s = rep(s, 'function home(){', sk + '\nfunction home(){')
        i = s.index('</style>')
        s = s[:i] + read('science', 'skill.css') + s[i:]
    if app == 'math':                                  # the bar-model screen
        s = rep(s, '  <section id="vSpell" class="view"', read('math', 'bar.html') + '  <section id="vSpell" class="view"')
        i = s.index('</style>')
        s = s[:i] + read('math', 'bar.css') + s[i:]
        s = rep(s, 'function home(){', read('math', 'bar.js') + '\nfunction home(){')
    return s

def page(app, db):
    """A complete HTML document: head tags for a home-screen app, auto-update and sync glue."""
    c, s = APPS[app], edition(app)
    s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
    i = s.index('<div class="app">')
    head, body = s[:i].rstrip(), s[i:].rstrip()
    doc = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="{c['theme']}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{c['name']}">
<meta name="description" content="{c['desc']}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}</style>
{head}
</head>
<body>
{body}
</body>
</html>
'''
    doc = doc.replace('</body>', read('shared', 'quizveto.html') + read('shared', 'autoupdate.html') + '</body>', 1)
    return doc.replace('</head>', read('shared', 'sync-app.html').replace('__DB__', db) + '</head>', 1)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--db', default=DB)
    ap.add_argument('--out', default=ROOT)
    ap.add_argument('--artifact')
    a = ap.parse_args()
    for app in APPS:
        d = os.path.join(a.out, app)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page(app, a.db))
        print('built', app)
    if a.artifact:
        with open(a.artifact, 'w', encoding='utf-8') as f:
            f.write(edition('english'))
