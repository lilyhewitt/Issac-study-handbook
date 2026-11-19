# Printable worksheets for Space Mission (one per planet + adult answer page): python3 tools/space/worksheets.py → p3.html / p4.html, then print to PDF.
# Needs the sample page scratch ws.html for the 4-steps card; the CSS and card are read from it.
import sys, re, html
sys.path.insert(0, '/home/claude/issac-study-handbook/tools/space')
from data_p3 import P3
from data_p4 import P4
for p in P3: p.setdefault('seg', 'P3')
E = html.escape
TPL = ['读数', '写特征', '解释原因', '比较', '读规律', '目的变量', '选最合适', '对错判断', '预测', '建议']
CUE = ['写数字和单位', 'X has / does not have ___.', '___, so ___. / ___ because ___.', 'A ___, but B ___.', 'As ___ increases, ___ increases / decreases.',
       'To find out how ___ affects ___.', 'X. 证据（数字）. X is ___, so ___.', '图上有这个信息吗？', '___ will ___ because ___.', '___ so that ___.']
CHK = lambda t: ['方向对吗？', '有科学词吗？', '两边都写了吗？' if t == 3 else '两样东西都写了吗？' if t == 4 else '写的是变量吗？' if t == 5 else '有证据或 because / so 吗？', '没留空']
CSS = open('/tmp/claude-0/-home-claude/60c0acd7-8046-599f-865a-8a82898312e8/scratchpad/mi/ws.html').read().split('<style>')[1].split('</style>')[0]
CSS += '''.q{page-break-inside:avoid}.blk{margin-bottom:4mm}.part{page-break-inside:avoid;break-inside:avoid}.qhead{break-after:avoid;page-break-after:avoid}.pl{font-size:20pt}.sub{font-size:10.5pt;color:#4F6A60;margin:-2mm 0 3mm}
.ln2{border-bottom:1.3px solid #15302A;height:9mm}.cover h1{font-size:26pt}.toc td{border-bottom:1px solid #ccd;padding:1.5mm 2mm;font-size:11pt}
.mcl{display:flex;gap:3mm;align-items:flex-end;margin:1.5mm 0}.mcl .fill{min-width:35mm}.small{font-size:10pt;color:#4F6A60}'''

def fill(t): return '<span class="fill" style="min-width:%dmm"></span>' % max(16, min(80, int(len(t) * 2.6)))
def starter(fr): return E(fr).replace('{', '\x00').replace('}', '\x01') and re.sub(r'\{([^}]+)\}', lambda m: '\x02' + str(len(m.group(1))) + '\x03', fr)
def frame_html(fr): return re.sub(r'\{([^}]+)\}', lambda m: fill(m.group(1)), E(fr))
def ans_html(a): return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', E(a))
def tbl(T):
    if not T: return ''
    return '<table class="data" style="margin:2mm 0;width:auto">' + ''.join('<tr>' + ''.join(('<th>%s</th>' if (i == 0 or j == 0) else '<td>%s</td>') % E(c) for j, c in enumerate(r)) + '</tr>' for i, r in enumerate(T)) + '</table>'
def marks(p): return len(p['score']) or (2 if p['tpl'] == 6 or len(p['frame']) > 90 else 1)

def planet(p, qnum0):
    meteor = p.get('meteor')
    lvl = '第 3 层 · 只有横线，和考卷一样' if meteor else '照开头写 · 有词库和提示'
    out = ['<div class="page"><div class="hd"><h1 class="pl">%s %s · %s <span class="lv">%s</span></h1><div class="nm">Date: ______　用时: ____ 分钟</div></div>' % (p['icon'], E(p['name']), E(p['en']), lvl)]
    if not meteor: out.append('<p class="sub">每道题照 4 步做：① 看问句，写第几种句式、圈方向词 → ② 找证据 → ③ 照开头写完整的句子 → ④ 三查打勾。选择题在 app 里做。</p>')
    keys = []; n = 0
    for qi, q in enumerate(p['qs']):
        if q['k'] != 'pr': continue
        n += 1; num = '%d' % n
        parts = q['parts']; multi = len(parts) > 1
        h = ['<div class="blk"><div class="q qhead"><b>%s.</b> %s%s' % (num, E(q['q']).replace('\n', '<br>'), tbl(q['tbl']))]
        if q.get('pre'): h.append('<br>' + E(q['pre']['ask']))
        h.append('</div>')
        for j, x in enumerate(parts):
            lab = '(%s) ' % 'abcdef'[j] if multi else ''
            if x['k'] == 'mc':
                tf = x['opts'] == ['True', 'False', 'Not possible to tell']
                h.append('<div class="mcl"><span>%s%s</span>%s</div>' % (lab, E(x['ask']), '<span class="opt">True</span><span class="opt">False</span><span class="opt">Not possible to tell</span>' if tf else '<span>答：</span><span class="fill"></span>'))
                keys.append((num + (lab and ' ' + lab.strip()), E(x['ans']), E(x['say'])))
                continue
            t = x['tpl']; full = (qi == 1) and not meteor
            h.append('<div class="part">');h.append('<div style="margin:2mm 0 1mm"><b>%s%s</b> <span class="mk" style="float:right">[%d]</span></div>' % (lab, E(x['ask']), marks(x)))
            if meteor:
                h.append('<div class="ln2"></div><div class="ln2"></div><div class="ln2"></div><div class="small">写完：这是第 ____ 种句式。□ 方向对 □ 有科学词 □ 有证据或 because</div>')
            else:
                dirs = '、'.join(x['dir'])
                h.append('<div class="box"><div class="t"><span class="n">1</span>看问句</div>第 <span class="fill" style="min-width:12mm"></span> 种句式。　圈出方向词%s</div>' % ('（提示：%s）' % E(dirs) if full else ''))
                if full and x.get('ev'):
                    ev = x['ev']; where = '题目里哪几个词' if ev[0] == 'txt' else '表里哪一行' if ev[0] == 'row' else '表里哪个数字'
                    h.append('<div class="box"><div class="t"><span class="n">2</span>找证据</div>证据是%s？写下来：<span class="fill" style="min-width:70mm"></span></div>' % where)
                bank = list(dict.fromkeys(re.findall(r'\{([^}]+)\}', x['frame']) + [e[0] for e in x['extra']]))
                bank.sort(key=lambda s: (len(s) % 3, s))
                hint = ''
                if x['extra'] and (full or qi in (0, 2)): hint = '<div class="hint">提示：“%s”不对——%s</div>' % (E(x['extra'][0][0]), E(x['extra'][0][1]))
                h.append('<div class="box"><div class="t"><span class="n">3</span>写任务报告 <span class="small">%d %s：%s</span></div><div class="tpl">%s</div><div class="bank"><b>词库</b>%s</div>%s</div>' % (
                    t, TPL[t], E(CUE[t]), frame_html(x['frame']), ''.join('<span>%s</span>' % E(b) for b in bank), hint))
                h.append('<div class="box"><div class="t"><span class="n">4</span>三查</div><div class="chk">%s</div></div>' % ''.join('<span>□ %s</span>' % c for c in CHK(t)))
            h.append('</div>')
            why = '<br>'.join(E(s) for s in x['score'])
            trap = ('容易错：“%s”——%s' % (E(x['extra'][0][0]), E(x['extra'][0][1]))) if x['extra'] else ''
            keys.append((num + (lab and ' ' + lab.strip()), ans_html(x['ans']), '<br>'.join(s for s in ['第 %d 种 · %s' % (t, TPL[t]), why, trap] if s)))
        if q.get('note'): keys[-1] = (keys[-1][0], keys[-1][1], keys[-1][2] + '<br><b>%s</b>' % E(q['note']))
        h.append('</div>'); out.append(''.join(h))
    out.append('</div>')
    out.append('<div class="page"><div class="hd"><h1>%s %s · 大人对照页 <small>看关键词打勾就行</small></h1><div class="nm">和题目分开放</div></div>' % (p['icon'], E(p['name'])))
    out.append('<table class="ans"><tr><th style="width:12%">题</th><th style="width:48%">参考答案（黄色 = 必须出现的词）</th><th>句式 · 怎么给分 · 容易错</th></tr>')
    out += ['<tr class="key"><td>%s</td><td>%s</td><td>%s</td></tr>' % k for k in keys]
    out.append('</table>')
    if p.get('must'): out.append('<h2>这颗星的必会句（说熟、会写）</h2><ul>%s</ul>' % ''.join('<li>%s</li>' % E(m) for m in p['must']))
    out.append('<p class="note">写对了就夸具体的：“你写了 waterproof，很好。”没写对，只问一句：“题目要最多还是最少？”或“证据在哪？”</p></div>')
    return '\n'.join(out)

def book(P, title, fn):
    steps = open('/tmp/claude-0/-home-claude/60c0acd7-8046-599f-865a-8a82898312e8/scratchpad/mi/ws.html').read().split('<!-- page 1: the card he keeps on the desk -->')[1].split('<!-- page 2: level 1 -->')[0]
    steps = steps.replace('练习单分三层：第 1 层给完整句式、词库和提示 → 第 2 层给句子开头和词库 → 第 3 层和考卷一样，只有横线。同一种句式连续两张自己写对才换下一层。',
                          '每颗星一份：先在 app 里闯关，再做这颗星的练习纸；陨石带那份只有横线，和考卷一样。做完大人用后面的对照页看关键词。')
    body = steps + '\n'.join(planet(p, 0) for p in P)
    open(fn, 'w').write('<!doctype html><html><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s</body></html>' % (title, CSS, body))
book(P3, '太空探险 P3 星系 · 练习纸', 'p3.html')
book(P4, '太空探险 P4 星系 · 练习纸', 'p4.html')
print('ok')
