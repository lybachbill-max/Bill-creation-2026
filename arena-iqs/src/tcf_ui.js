// ═════════════ TCF page: live preview of the evaluation + workbook download ═════════════
function tcsPill(st){ const c = st === 'ACCEPTED' || st === 'MET' ? 'p-acc' : st === 'CONDITIONAL' ? 'p-cond' : st === 'N/A' ? 'p-na' : 'p-open'; return `<span class="tcs-pill ${c}">${tcsE(st)}</span>`; }
function tcsRender(){
  if (!g('page-tcf')) return;
  tcsPoOptions();
  const chips = g('tcs-po-chips');
  if (chips) chips.innerHTML = TCS.pis.map((p, i) => `<span class="tcs-chip" title="${tcsE(p.name)}">📄 P.O. ${tcsE(p.po)} · ${p.lines.length} line(s)<button aria-label="Remove" onclick="tcsDelPo('pi',${i})">×</button></span>`).join('') +
    TCS.masterPos.map((p, i) => `<span class="tcs-chip" title="from the master file">🗂 ${tcsE(p.po)} · ${tcsE(p.lot)}${TCS.pis.some(x => x.po === p.po) ? ' (P.I. file used)' : ''}<button aria-label="Remove" onclick="tcsDelPo('m',${i})">×</button></span>`).join('') +
    (TCS.offer ? `<span class="tcs-chip">📋 ${tcsE(TCS.offer.name)} · ${TCS.offer.items.length} item(s)<button aria-label="Remove" onclick="TCS.offer=null;tcsRender()">×</button></span>` : '') +
    (TCS.reports.length ? `<span class="tcs-chip">📎 ${TCS.reports.length} document(s)<button aria-label="Remove all" onclick="TCS.reports=[];tcsRender()">×</button></span>` : '');
  const out = g('tcs-out'), itl = g('tcs-items'), rpl = g('tcs-reps');
  const B = tcsEvaluate(), items = B.items;
  if (!items.length) {
    out.innerHTML = `<div class="card"><div class="tcs-note">Add the P.O. / P.I. files (or pick P.O.s from the master file) and / or the Ally offer sheet to list the items. Then add the supplier's reports and declarations. · Thêm file P.O. / P.I. (hoặc chọn P.O. từ master file) và / hoặc offer sheet, sau đó thêm báo cáo và tuyên bố của NCC.</div></div>`;
    itl.innerHTML = ''; rpl.innerHTML = ''; return;
  }
  const all = items.flatMap(i => i.reqs), n = f => all.filter(f).length, noPo = !B.pis.length;
  const urgent = items.filter(i => i.fri && i.fri <= tcsAddDays(tcsToday(), 14) && i.reqs.some(q => q.st !== 'ACCEPTED'));
  const pastDue = all.filter(q => q.due && q.due < tcsToday() && !q.done).length;
  out.innerHTML = `<div class="card"><div class="tcs-out">
    <button type="button" class="bk-nc nc-soon fri-out" onclick="tcsDownload()" style="flex:1 1 320px">
      <div style="font-size:26px;flex-shrink:0">📊</div>
      <div style="min-width:0;text-align:left"><div class="fri-out-t">TCF Status &amp; Action Plan (.xlsx)</div><div class="fri-out-vn">Trạng thái TCF và Kế hoạch hành động</div>
      <div class="bk-nc-sub">${items.length} item(s) · ${all.length} requirement line(s) · ${TCS.lang === 'bi' ? 'EN / VI' : 'EN'} · 2 worksheets: TCF status, Test plan</div></div>
      <div class="fri-out-go">⬇</div></button>
    <div class="tcs-row" style="flex:1 1 300px">${tcsPill('OPEN')} ${n(q => q.st === 'OPEN' && q.sev === 'CRI')} CRI · ${n(q => q.st === 'OPEN' && q.sev === 'MAJ')} MAJ &nbsp; ${tcsPill('CONDITIONAL')} ${n(q => q.st === 'CONDITIONAL')} &nbsp; ${tcsPill('ACCEPTED')} ${n(q => q.st === 'ACCEPTED')}</div></div>
    <div class="tcs-note" style="margin-top:8px">${noPo ? '⚠ No P.O. / P.I. yet – P.O. fields stay blank and validity (K-1) is checked at today; add the P.O. / P.I. files when available.' : 'ETD per P.O.: ' + tcsE(B.pis.map(p => `${p.po}: ${tcsFmt(p.lines.map(l => l.etd).filter(Boolean).sort()[0]) || 'n/a'}`).join(' · '))}
    <br>Standards editions live-checked ${tcsFmt(TCS_STD_CHECKED)}${tcsStdAge() > 30 ? ` – <b>${tcsStdAge()} days ago: re-check before use (rulebook §4.2)</b>` : ''}.
    ${B.notOnPo.length ? `<br>⚠ Offer item(s) not on any P.O. – left out of the TCF: ${tcsE(B.notOnPo.map(o => o.sref || o.name).join(', '))}` : ''}
    ${urgent.length ? `<br>⚠ FRI within 14 days with open evidence: ${tcsE(urgent.map(i => `item ${i.n} (${tcsFmt(i.fri)})`).join(', '))}` : ''}
    ${pastDue ? `<br>⚠ ${pastDue} action(s) already past the ETD − 45 days due date – next hard deadline is the first FRI; options: Ally accepts a short ETD delay, or a documented first-shipment exception (Ally + SRC owner QS).` : ''}</div></div>`;
  itl.innerHTML = `<div class="card"><div class="ch2"><div class="ct">Items · Mặt hàng</div><div class="tcs-note">Legal stream is suggested from the description – change it where needed (stricter stream recommended).</div></div><div class="tw"><table class="tbl"><thead><tr><th>#</th><th>Picture</th><th>Item</th><th>Supplier ref · GTIN</th><th>P.O. lines</th><th>FRI · ETD</th><th>Legal stream</th><th>Lines</th><th>Verdict (tests)</th></tr></thead><tbody>${items.map(it => {
    const o = it.reqs.filter(q => q.st === 'OPEN').length, c = it.reqs.filter(q => q.st === 'CONDITIONAL').length, a = it.reqs.filter(q => q.st === 'ACCEPTED').length;
    return `<tr><td>${it.n}</td><td>${it.pic ? `<img class="tcs-thumb" src="${it.pic.url}" alt="item ${it.n}">` : '<span class="tcs-note">—</span>'}</td><td><b>${tcsE(it.name)}</b>${it.issues.length ? `<div class="fri-warn">⚠ ${tcsE(it.issues.map(x => x.en).join('; '))}</div>` : ''}</td>
      <td>${tcsE(it.sref || '—')}<div class="tcs-note">${tcsE(it.ean || '')}${it.ally ? ' · ' + tcsE(it.ally) : ''}</div></td><td class="tcs-note">${it.lines.map(l => `${tcsE(l.po)} L${l.line} · ${l.qty} pcs`).join('<br>') || '—'}</td>
      <td class="tcs-note" style="white-space:nowrap">${it.fri ? 'FRI ' + tcsFmt(it.fri) : ''}${it.etd ? '<br>ETD ' + tcsFmt(it.etd) : (it.fri ? '' : '—')}</td>
      <td><select class="fsel tcs-sel" onchange="TCS.streams['${tcsE(it.key)}']=this.value;tcsRender()">${Object.entries(TCS_STREAM).map(([k, v]) => `<option value="${k}"${k === it.stream ? ' selected' : ''}>${tcsE(v)}</option>`).join('')}</select></td>
      <td style="white-space:nowrap">${o ? tcsPill('OPEN') + ' ' + o : ''} ${c ? tcsPill('CONDITIONAL') + ' ' + c : ''} ${a ? tcsPill('ACCEPTED') + ' ' + a : ''}</td><td>${tcsPill(it.verdict)}</td></tr>`; }).join('')}</tbody></table></div></div>`;
  rpl.innerHTML = TCS.reports.length ? `<div class="card"><div class="ch2"><div class="ct">Reports &amp; declarations · Báo cáo &amp; tuyên bố</div><div class="tcs-note">Automatic first pass — QS confirms each verdict in the workbook (sheet Report validation).</div></div><div class="tw"><table class="tbl"><thead><tr><th>Ref</th><th>File</th><th>Report no. · lab</th><th>Issued</th><th>Valid until</th><th>Items (supplier ref)</th><th>Verdict</th></tr></thead><tbody>${TCS.reports.map(r => `<tr><td>${r.R}</td><td class="tcs-note">${tcsE(r.name)}</td><td>${tcsE(r.no || '—')}<div class="tcs-note">${tcsE(r.lab)}</div></td><td>${tcsFmt(r.issue) || '—'}</td><td>${tcsFmt(r.valid) || '—'}</td>
    <td class="tcs-note">${r.cover.map(c => `item ${c.it.n} ${c.refOk ? '✓' : '✗ ref'}`).join(', ') || '—'}</td><td>${tcsPill(r.verdict.split(' – ')[0]) } <span class="tcs-note">${tcsE(r.verdict.split(' – ').slice(1).join(' – '))}</span></td></tr>`).join('')}</tbody></table></div></div>` : '';
}
async function tcsDownload(){
  try { const B = tcsEvaluate(); if (!B.items.length) { alert('Add the P.O. / P.I. files or the offer sheet first.'); return; }
    const { blob, name } = tcsBuildBook(B); friDownload(blob, name); tcsMsg(`Workbook ready: ${tcsE(name)}`);
  } catch(e) { console.error(e); alert('The workbook could not be built: ' + e.message); }
}
