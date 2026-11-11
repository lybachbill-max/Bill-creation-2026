#!/usr/bin/env python3
"""Insert (or refresh) the TCF Status & Action Plan page — built on the tcf-status-action-plan skill — into ARENA_IQS.html.
Sources: src/tcf_page.html (markup + styles), src/tcf.js, src/tcf_xlsx.js, src/tcf_ui.js. Re-runnable: replaces the marked blocks.
    python3 arena-iqs/add_tcf.py
"""
import pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
F = HERE / 'ARENA_IQS.html'
SRC = HERE / 'src'
s = F.read_text(encoding='utf-8')

def block(tag, body):
    return f'<!-- {tag}:BEGIN -->\n{body}\n<!-- {tag}:END -->'

def put(tag, body, anchor, before=True):
    global s
    new = block(tag, body)
    m = re.search(rf'<!-- {tag}:BEGIN -->.*?<!-- {tag}:END -->', s, flags=re.S)
    if m:
        s = s[:m.start()] + new + s[m.end():]
        return
    i = s.index(anchor)
    s = s[:i] + new + '\n' + s[i:] if before else s[:i + len(anchor)] + '\n' + new + s[i + len(anchor):]

NAV = '''    <div class="nav-grp">TECHNICAL COMPLIANCE</div>
    <div class="ni" id="nav-tcf-item" onclick="go('tcf',this)" title="TCF Status &amp; Action Plan — per item TCF test / document requirements, existing valid reports (K-1/K-2/K-3), actions and due dates; downloads the workbook">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/></svg>
      TCF Status &amp; Action Plan
    </div>'''
put('TCF-NAV', NAV, '    <div class="nav-grp">DOCUMENTS</div>')
put('TCF-PAGE', (SRC / 'tcf_page.html').read_text(encoding='utf-8'), '<div id="page-new-repeat" class="page">')
js = '\n'.join((SRC / n).read_text(encoding='utf-8') for n in ['tcf.js', 'tcf_xlsx.js', 'tcf_ui.js'])
put('TCF-JS', '<script>\n' + js + '\n</script>', '\n</body>')

# router: title + render on open; master-file load refreshes the P.O. list
if "'tcf':'TCF Status & Action Plan'" not in s:
    s = s.replace("const TITLES = {", "const TITLES = {'tcf':'TCF Status & Action Plan',", 1)
hook = "  if (id === 'tcf' && typeof tcsRender === 'function') tcsRender();\n"
if hook not in s:
    a = "  if (id === 'fri-val') friRenderAll();\n"
    assert a in s
    s = s.replace(a, a + hook, 1)
mf = "  if (typeof friRenderAll === 'function') friRenderAll();"
mfh = "  if (typeof tcsPoOptions === 'function') tcsPoOptions();"
if mfh not in s:
    s = s.replace(mf, mf + '\n' + mfh)
F.write_text(s, encoding='utf-8')
print('TCF page inserted:', F.stat().st_size // 1024, 'KB')
