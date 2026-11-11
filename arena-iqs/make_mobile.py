#!/usr/bin/env python3
"""Build ARENA_IQS_mobile.html (phone layout) from ARENA_IQS.html.

Same features and data; only a phone layout is added (applies on screens up to 820 px wide):
off-canvas sidebar with a menu button, compact top bar, single-column pages, scrollable tables,
16 px inputs (no iOS zoom), full-screen dialogs. Run again after every change to ARENA_IQS.html:
    python3 arena-iqs/make_mobile.py
"""
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC, DST = HERE / 'ARENA_IQS.html', HERE / 'ARENA_IQS_mobile.html'

MOBILE_CSS = r"""
<style id="iqs-mobile">
.mb-menu{display:none}
.mb-backdrop{display:none}
@media (max-width:820px){
  html,body{overflow:hidden;height:100%;-webkit-text-size-adjust:100%}
  .app{position:relative;height:100dvh}
  .sider{position:fixed;top:0;left:0;bottom:0;width:78vw;max-width:300px;min-width:0;transform:translateX(-105%);transition:transform .22s ease;z-index:1000;padding-top:env(safe-area-inset-top)}
  .app.mb-open .sider{transform:none}
  .mb-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:999}
  .app.mb-open .mb-backdrop{display:block}
  .sider .ni{min-height:44px;font-size:15px}
  .main-wrap{width:100%;min-width:0}
  .topbar{height:52px;min-height:52px;padding:0 8px;gap:6px;padding-top:env(safe-area-inset-top);box-sizing:content-box}
  .mb-menu{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid var(--bd);border-radius:8px;background:#fff;color:#1F2733;font-size:20px;flex-shrink:0;cursor:pointer}
  #topbar-title{font-size:15px !important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:90px;flex:1 1 auto}
  #btn-back,#btn-fwd,#mf-status-label,#mf-modified-label,#clock{display:none !important}
  .topbar button[onclick*="openMfModal"],.topbar .btn[onclick*="openMfModal"]{font-size:0 !important;padding:0 10px !important;min-width:40px;height:36px}
  .topbar button[onclick*="openMfModal"] svg{width:16px;height:16px}
  .srcv-layout{flex-direction:column !important;gap:10px !important}
  .srcv-layout > *{width:100% !important;max-width:none !important;min-width:0 !important;flex:none !important}
  .topbar .tb-div{display:none}
  .topbar [id*="clock"],.topbar [id*="date"],.topbar .tb-date{display:none !important}
  .topbar .btn,.topbar button{white-space:nowrap}
  .content{-webkit-overflow-scrolling:touch}
  .page{padding:10px 10px 80px !important}
  .ph{flex-direction:column;align-items:stretch !important;gap:10px}
  .ph-r{display:flex;flex-wrap:wrap;gap:6px}
  .ph h2{font-size:18px}
  .g2,.g3,.g4,.kpi-grid-4,.kpi-grid-6,.dash-grid{grid-template-columns:1fr 1fr !important;gap:8px !important}
  .g2{grid-template-columns:1fr !important}
  #page-fri-val .fri-grid{grid-template-columns:1fr !important}
  #page-fri-val .fri-grid > div[style*="span"]{grid-column:auto !important}
  .card{padding:12px;border-radius:10px}
  .ch2{flex-wrap:wrap;gap:8px}
  .tw{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}
  .tbl{font-size:12px}
  .tbl th,.tbl td{padding:7px 8px}
  .fb{gap:6px}
  .fb .fc,.fb .fsel,.fb input{width:100% !important;max-width:none !important}
  input.fc,select.fc,textarea.fc,.fsel,input,select,textarea{font-size:16px !important}
  .btn{min-height:36px}
  .bk-nc{padding:10px 12px}
  .bk-nc-val{font-size:20px}
  .fri-tabs,.folder-tabs{overflow-x:auto;white-space:nowrap;flex-wrap:nowrap}
  .modal,.modal-box,dialog{width:96vw !important;max-width:96vw !important;max-height:90dvh;overflow:auto}
  #ob-frame{height:calc(100dvh - 60px) !important}
  #fri-export-menu{position:fixed !important;left:8px !important;right:8px !important;top:auto !important;bottom:8px;min-width:0 !important;z-index:1100}
  #fri-lightbox img{max-width:100vw !important}
}
</style>
"""

MOBILE_JS = r"""
<script id="iqs-mobile-js">
(function(){
  function toggle(open){ var a = document.querySelector('.app'); if (!a) return; a.classList.toggle('mb-open', open === undefined ? !a.classList.contains('mb-open') : open); }
  window.iqsMenu = toggle;
  function boot(){
    var app = document.querySelector('.app'), tb = document.querySelector('.topbar');
    if (!app || !tb || document.querySelector('.mb-menu')) return;
    var bd = document.createElement('div'); bd.className = 'mb-backdrop'; bd.onclick = function(){ toggle(false); }; app.appendChild(bd);
    var b = document.createElement('button'); b.className = 'mb-menu'; b.type = 'button'; b.setAttribute('aria-label', 'Menu'); b.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'; b.onclick = function(){ toggle(); };
    tb.insertBefore(b, tb.firstChild);
    document.querySelector('.sider').addEventListener('click', function(e){ if (e.target.closest('.ni') && window.matchMedia('(max-width:820px)').matches) toggle(false); });
    if (typeof window.go === 'function') { var g0 = window.go; window.go = function(){ var r = g0.apply(this, arguments); if (window.matchMedia('(max-width:820px)').matches) toggle(false); var c = document.querySelector('.content'); if (c) c.scrollTop = 0; return r; }; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
</script>
"""

def main():
    s = SRC.read_text(encoding='utf-8')
    s = s.replace('<meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
                  '<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover"/>\n'
                  '<meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/>'
                  '<meta name="apple-mobile-web-app-title" content="ARENA IQS"/><meta name="theme-color" content="#001529"/>', 1)
    s = s.replace('<title>ARENA IQS — Quality Platform</title>', '<title>ARENA IQS — Mobile</title>', 1)
    # the real </head> and </body> stand on their own line ('</head>' also appears inside embedded scripts)
    i = s.index('\n</head>\n') + 1
    s = s[:i] + MOBILE_CSS + s[i:]
    j = s.rindex('\n</body>') + 1
    s = s[:j] + MOBILE_JS + s[j:]
    DST.write_text(s, encoding='utf-8')
    print(f'{DST.name}: {DST.stat().st_size / 1e6:.1f} MB')

if __name__ == '__main__':
    main()
