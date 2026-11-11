#!/usr/bin/env python3
"""Build the private-link edition of the phone IQS (claude.ai Artifact page) from ARENA_IQS_mobile.html.

Changes against the phone file, nothing else:
  * the embedded PDF reader and order book are gzip-compressed (unpacked in the browser on first use)
    so the page stays under the 16 MB link limit;
  * downloads go through the link's "save file" prompt (the link blocks direct downloads);
  * alert / confirm become in-page messages (the link blocks pop-up dialogs);
    a confirm asks you to tap the same button again within 6 seconds;
  * browser storage falls back to memory if the browser refuses it (private window).
Run after make_mobile.py:
    python3 arena-iqs/make_link.py [output.html]
"""
import base64, gzip, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / 'ARENA_IQS_mobile.html'
DST = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'ARENA_IQS_link.html'
GZ_IDS = ['fri-pdfjs-src', 'fri-pdfjs-worker', 'ob-src']

HEAD = r"""<title>ARENA IQS Mobile</title>
<meta name="theme-color" content="#001529">
<script id="iqs-link-shim">
(function(){
  // storage: fall back to memory when the browser refuses it
  try { var k = '__iqs_t'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); }
  catch (e) { var m = {}; var mem = { getItem: function(x){ return x in m ? m[x] : null; }, setItem: function(x, v){ m[x] = String(v); }, removeItem: function(x){ delete m[x]; }, clear: function(){ m = {}; }, key: function(i){ return Object.keys(m)[i] || null; }, get length(){ return Object.keys(m).length; } };
    try { Object.defineProperty(window, 'localStorage', { value: mem, configurable: true }); } catch (e2) {} }
  // in-page messages instead of pop-up dialogs
  function toast(text, kind){
    var b = document.getElementById('iqs-toast');
    if (!b) { b = document.createElement('div'); b.id = 'iqs-toast'; b.setAttribute('role', 'status');
      b.style.cssText = 'position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:99999;padding:12px 40px 12px 14px;border-radius:10px;font:14px/1.4 system-ui,sans-serif;white-space:pre-wrap;max-height:40vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.25)';
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Close');
      x.style.cssText = 'position:absolute;top:6px;right:8px;border:0;background:none;color:inherit;font-size:22px;cursor:pointer';
      x.onclick = function(){ b.hidden = true; }; b.appendChild(x); b.appendChild(document.createElement('span'));
      (document.body || document.documentElement).appendChild(b); }
    b.style.background = kind === 'warn' ? '#7A2E0E' : '#001529'; b.style.color = '#fff';
    b.lastChild.textContent = String(text); b.hidden = false;
    clearTimeout(b._t); b._t = setTimeout(function(){ b.hidden = true; }, kind === 'warn' ? 9000 : 6000);
  }
  window.iqsToast = toast;
  window.alert = function(m){ toast(m == null ? '' : m); };
  var pend = null;
  window.confirm = function(m){
    m = m == null ? '' : String(m);
    if (pend && pend.m === m && Date.now() - pend.t < 6000) { pend = null; document.getElementById('iqs-toast') && (document.getElementById('iqs-toast').hidden = true); return true; }
    pend = { m: m, t: Date.now() }; toast(m + '\n\nTap the same button again within 6 seconds to confirm.', 'warn'); return false;
  };
  window.prompt = function(){ toast('This step needs a text box that the link cannot show. Use the file version of the IQS for it.', 'warn'); return null; };
  window.print = function(){ toast('Printing is not available from the link. Use the exported file instead.', 'warn'); };
  // downloads: hand generated files to the link's save prompt
  var OK = /\.(gif|png|jpe?g|webp|mp4|webm|txt|json|md|docx|pptx|epub|csv|ttf|html|svg|pdf|xlsx|zip)$/i;
  function save(href, name){
    name = name || 'download';
    if (!OK.test(name)) { toast('"' + name + '" cannot be saved from the link (file type not allowed). Use the file version of the IQS for this export.', 'warn'); return; }
    fetch(href).then(function(r){ return r.blob(); }).then(function(blob){
      return window.claude && window.claude.use ? window.claude.use('downloads').then(function(d){
        if (!d) { toast('Saving files is not available in this view.', 'warn'); return; }
        return d.save({ filename: name, data: blob }).then(function(){ toast('Saved ' + name); }, function(e){
          var c = e && e.code; if (c === 'declined') return;
          toast(c === 'rate_limited' ? 'A save prompt is already open. Finish it, then try again.' : 'Could not save ' + name + (c ? ' (' + c + ')' : '') + '.', 'warn'); });
      }) : toast('Saving files is not available in this view.', 'warn');
    }).catch(function(){ toast('Could not read the file to save.', 'warn'); });
  }
  var click0 = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function(){
    if (this.hasAttribute('download') && /^(blob:|data:)/.test(this.href)) { save(this.href, this.getAttribute('download')); return; }
    return click0.apply(this, arguments);
  };
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if (a && /^(blob:|data:)/.test(a.href)) { e.preventDefault(); save(a.href, a.getAttribute('download')); }
  }, true);
  // compressed embedded blobs: unpack to plain base64 on first use
  window.iqsInflate = async function(ids){
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]); if (!el || !el.dataset.gz) continue;
      var s = atob(el.textContent.trim()), u = new Uint8Array(s.length); for (var j = 0; j < s.length; j++) u[j] = s.charCodeAt(j);
      var out = new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
      var parts = []; for (var k = 0; k < out.length; k += 0x8000) parts.push(String.fromCharCode.apply(null, out.subarray(k, k + 0x8000)));
      el.textContent = btoa(parts.join('')); delete el.dataset.gz;
    }
  };
})();
</script>
"""

TAIL = r"""
<script id="iqs-link-wrap">
(function(){
  if (typeof friLoadPdfJs === 'function') { var p0 = friLoadPdfJs; friLoadPdfJs = function(){ return iqsInflate(['fri-pdfjs-src', 'fri-pdfjs-worker']).then(function(){ return p0(); }); }; }
  if (typeof obOpen === 'function') { var o0 = obOpen; obOpen = function(){ iqsInflate(['ob-src']).then(function(){ o0(); }); }; }
})();
</script>
"""

def main():
    s = SRC.read_text(encoding='utf-8')
    for i in GZ_IDS:
        m = re.search(r'<script type="text/plain" id="%s">([^<]*)</script>' % re.escape(i), s)
        assert m, i
        raw = base64.b64decode(m.group(1).strip())
        gz = base64.b64encode(gzip.compress(raw, 9)).decode()
        s = s[:m.start()] + f'<script type="text/plain" id="{i}" data-gz="1">{gz}</script>' + s[m.end():]
    # the viewer adds its own document skeleton: drop ours, keep everything inside
    assert s.startswith('<!DOCTYPE html>')
    s = s[len('<!DOCTYPE html>'):]
    s = re.sub(r'<html[^>]*>', '', s, count=1)
    s = s.replace('<head>', '', 1)
    i = s.index('\n</head>\n<body>\n'); s = s[:i] + '\n' + s[i + len('\n</head>\n<body>\n'):]
    j = s.rindex('\n</body>\n</html>'); s = s[:j] + TAIL
    s = re.sub(r'<title>[^<]*</title>', '', s, count=1)
    s = re.sub(r'<meta charset="[^"]*"\s*/?>', '', s, count=1)
    s = re.sub(r'<meta name="viewport"[^>]*>', '', s, count=1)
    # SheetJS codepage tables hold literal U+FFFD inside JS strings: write them as the equivalent escape
    bad = [l for l in s.split('\n') if '�' in l]
    assert len(bad) <= 6 and all(len(l) > 30000 and 'cptable' in s[:s.index(l)][-200000:] + l for l in bad), 'U+FFFD outside the SheetJS tables'
    s = s.replace('�', '\\ufffd')
    s = HEAD + s
    DST.write_text(s, encoding='utf-8')
    print(f'{DST}: {DST.stat().st_size / 1e6:.2f} MB')

if __name__ == '__main__':
    main()
