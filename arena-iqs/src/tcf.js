// ═════════════ TCF STATUS & ACTION PLAN — built on the tcf-status-action-plan skill ═════════════
// Inputs: P.O./P.I. files (priority; ARENA VPO template sheet "ProformaInvoice") or P.O.s of the loaded master file (fallback),
// the Ally offer sheet (ARENA template: headers row 8, pictures in the "Item Picture" column, mapped by picture centre),
// supplier reports / declarations. Rules: K-1 report valid 2 years from issue and up to ETD · K-2 existing valid reports first,
// retest ASAP when expired before ETD or scope gap · K-3 supplier ref on every report / document.
// Output: the TCF Status & Action Plan workbook (full layout). A.R.E.N.A. validates only — never manufacturer, importer or DoC signatory.
const TCS = { lang: 'bi', pis: [], masterPos: [], offer: null, reports: [], streams: {} };
const tcsE = s => friE(s);
const TCS_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── dates ──
function tcsDate(v){
  if (v === null || v === undefined || v === '') return '';
  if (v instanceof Date && !isNaN(v)) return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate())).toISOString().slice(0, 10);
  if (typeof v === 'number' && v > 20000 && v < 80000) return new Date(Date.UTC(1899, 11, 30) + v * 864e5).toISOString().slice(0, 10);
  const s = String(v).trim(); let m;
  const iso = (y, mo, d) => { y = +y; if (y < 100) y += 2000; const t = new Date(Date.UTC(y, mo - 1, +d)); return (t.getUTCMonth() === mo - 1 && y > 1990 && y < 2100) ? t.toISOString().slice(0, 10) : ''; };
  if ((m = s.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/))) return iso(m[1], +m[2], m[3]);
  if ((m = s.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/))) return iso(m[3], +m[2], m[1]);   // dd/mm/yyyy (ARENA / EU convention)
  const mon = x => TCS_MON.findIndex(n => x.toLowerCase().startsWith(n.toLowerCase())) + 1;
  if ((m = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?[\s\-.]+([A-Za-z]{3,9})\.?[\s\-.,]+(\d{2,4})\b/)) && mon(m[2])) return iso(m[3], mon(m[2]), m[1]);
  if ((m = s.match(/\b([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/)) && mon(m[1])) return iso(m[3], mon(m[1]), m[2]);
  return '';
}
const tcsFmt = d => { if (!d) return ''; const [y, mo, da] = d.split('-'); return `${da} ${TCS_MON[+mo - 1]} ${y}`; };
const tcsAddYears = (d, n) => { if (!d) return ''; const [y, mo, da] = d.split('-').map(Number); const t = new Date(Date.UTC(y + n, mo - 1, da)); if (t.getUTCDate() !== da) t.setUTCDate(0); return t.toISOString().slice(0, 10); };
const tcsAddDays = (d, n) => d ? new Date(Date.parse(d + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10) : '';
const tcsToday = () => new Date().toISOString().slice(0, 10);
const tcsNorm = s => String(s ?? '').toLowerCase().replace(/[\s\-_.]+/g, '');


// ═════ Standards live check (rulebook §0 / §3 / §4.2) — the single source for editions in texts, report checks and the workbook.
// Checked live on TCS_STD_CHECKED (Regulatory Register mirror not synced). Re-check when older than 30 days (the page warns).
// st: CURRENT (OJ-cited) · PASS-COEX (older edition still cited until a date) · WATCH (newer, not cited – gap test only)
//     BLOCKED (citation withdrawn, cited replacement exists) · SoA (no edition cited – current CEN/ISO edition) · UNVERIFIED
const TCS_STD_CHECKED = '2026-11-11';
const TCS_STD = {
  'EN 71-1': { use: 'EN 71-1:2014+A1:2018', st: 'CURRENT', ok: [/2014\s*\+\s*A1\s*:\s*2018/i], watch: [/:\s*202[5-9]/], note: 'OJ: CID (EU) 2023/740; no presumption for wave rollers (cl. 3.19, 4.15.1 – CID (EU) 2025/1785). EN 71-1:2026 = gap test only (rulebook §9).', src: 'https://eur-lex.europa.eu/eli/dec_impl/2023/740' },
  'EN 71-2': { use: 'EN 71-2:2020', st: 'CURRENT', ok: [/:\s*2020\b/], note: 'OJ: CID (EU) 2023/740.', src: 'https://eur-lex.europa.eu/eli/dec_impl/2023/740' },
  'EN 71-3': { use: 'EN 71-3:2019+A2:2024', st: 'CURRENT', ok: [/A2\s*:\s*2024/i], coex: [{ re: /A1\s*:\s*2021/i, ed: 'EN 71-3:2019+A1:2021', until: '2027-06-16' }], note: 'OJ: CID (EU) 2025/2519 amending 2023/740; EN 71-3:2019+A1:2021 PASS-COEX until 16 Jun 2027.', src: 'https://eur-lex.europa.eu/eli/dec_impl/2025/2519/oj/eng' },
  'EN 581-1': { use: 'EN 581-1:2017', st: 'SoA', ok: [/:\s*2017\b/], note: 'Not an hEN – current CEN edition is state of the art.', src: 'https://iteh.es/catalog/standards/cen/d37f0328-4bfd-4cc5-90df-c4c633f46258/en-581-1-2017' },
  'EN 581-2': { use: 'EN 581-2:2026', st: 'SoA', ok: [/:\s*2026\b/], note: 'Not an hEN; CEN 20 May 2026 (replaces 2015). Older edition only with the Ally\'s written acceptance (rulebook §3, §9).', src: 'https://standards.iteh.ai/catalog/standards/cen/982d2190-b0d0-471c-8546-1dd2107a15dc/en-581-2-2026' },
  'EN 581-3': { use: 'EN 581-3:2026', st: 'SoA', ok: [/:\s*2026\b/], note: 'Not an hEN; CEN 20 May 2026 (replaces 2017). Older edition only with the Ally\'s written acceptance (rulebook §3, §9).', src: 'https://standards.iteh.ai/catalog/standards/cen/145f3fc8-6168-4a96-8377-d6357c61a2a1/en-581-3-2026' },
  'AfPS GS 2019:01 PAK': { use: 'AfPS GS 2019:01 PAK (rev. 10 Apr 2020)', st: 'UNVERIFIED', note: 'German GS-mark specification (not a CE standard); no newer version found – confirm on the BAuA website before citing.', src: 'https://www.tuv.com/regulations-and-standards/en/eu-new-specification-afps-gs-2019-01-pak.html' },
};
const tcsStdAge = () => Math.round((Date.parse(tcsToday()) - Date.parse(TCS_STD_CHECKED)) / 864e5);
// edition of a standard stated in a report: "EN 71-3:2019+A2:2024", "EN 581-2: 2015" …
function tcsEdition(text, std){ const m = String(text).match(new RegExp(std.replace(/[ -]/g, '[\\s-]*') + '\\s*(:\\s*\\d{4}(?:\\s*\\+\\s*A\\d+\\s*:\\s*\\d{4})*)', 'i')); return m ? std + m[1].replace(/\s+/g, '') : ''; }
// rulebook §3 edition rule → { st: ok | coex | ed-soa | ed-watch | ed-blocked | ed-missing, ed }
function tcsEditionCheck(std, text, ref){
  const S = TCS_STD[std]; if (!S) return { st: 'ok' };
  const ed = tcsEdition(text, std); if (!ed) return { st: 'ed-missing', ed: '' };
  if ((S.ok || []).some(re => re.test(ed))) return { st: 'ok', ed };
  const c = (S.coex || []).find(x => x.re.test(ed)); if (c) return ref <= c.until ? { st: 'coex', ed, until: c.until } : { st: 'ed-blocked', ed, ended: c.until };
  if (S.st === 'SoA') return { st: 'ed-soa', ed };
  if ((S.watch || []).some(re => re.test(ed))) return { st: 'ed-watch', ed };
  if (S.st === 'UNVERIFIED') return { st: 'ok', ed };
  return { st: 'ed-blocked', ed };
}
// ── language ──
function BI(en, vi){ return TCS.lang === 'bi' && vi ? en + '\n' + vi : en; }
function tcsT(o, k){ return BI(o.en.replace(/\{(\w+)\}/g, (_, x) => k[x] ?? ''), o.vi && o.vi.replace(/\{(\w+)\}/g, (_, x) => k[x] ?? '')); }

// ═════ inputs ═════
function tcsMsg(t){ const m = g('tcs-msg'); if (m) m.innerHTML = t; }
async function tcsHash(f){ try { const b = await crypto.subtle.digest('SHA-256', await f.arrayBuffer()); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } catch(e) { return f.name + ':' + f.size; } }

// P.O. / P.I. — ARENA VPO template first, generic P.O. table reader otherwise
async function tcsAddPI(inp){
  const files = [...(inp.files || [])]; inp.value = ''; let n = 0;
  for (const f of files) {
    tcsMsg(`Reading ${tcsE(f.name)}…`);
    try { const pi = await tcsReadPI(f); if (!pi.lines.length) { tcsMsg(`No P.O. lines found in ${tcsE(f.name)}.`); continue; }
      // a "_revised" file supersedes the earlier one of the same P.O.
      TCS.pis = TCS.pis.filter(p => !(p.po === pi.po && (/_revised/i.test(f.name) || p.name === f.name)));
      if (!TCS.pis.some(p => p.po === pi.po && /_revised/i.test(p.name))) TCS.pis.push(pi); n++;
    } catch(e) { tcsMsg(`Could not read ${tcsE(f.name)}: ${tcsE(e.message)}`); }
  }
  if (n) tcsMsg(`${n} P.O. / P.I. file(s) read.`);
  tcsRender();
}
async function tcsReadPI(f){
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (['xlsx','xlsm','xls','csv'].includes(ext)) {
    const wb = XLSX.read(new Uint8Array(await f.arrayBuffer()), { type:'array', cellDates:true });
    for (const sn of [...wb.SheetNames].sort((a, b) => (/proforma/i.test(b) ? 1 : 0) - (/proforma/i.test(a) ? 1 : 0))) {
      const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header:1, raw:true, defval:'' });
      const hr = aoa.findIndex((r, i) => i < 40 && r.some(c => /supplier\s*ref/i.test(String(c))) && r.some(c => /q'?ty|quantity|ean/i.test(String(c))));
      if (hr < 0) continue;
      const H = aoa[hr].map(c => String(c).trim()), col = re => H.findIndex(h => re.test(h));
      const C = { sref: col(/supplier\s*ref/i), ally: col(/^(?!.*supplier).*(item\s*(number|no)|article)/i), hage: col(/^hage\b|\bhage\s*(no|number|nr)|second\s*(no|number)/i), desc: col(/descr/i), ean: col(/\b(ean|gtin|barcode)\b/i),
        qty: col(/order\s*q|^q'?ty|quantity/i), fri: col(/inspection|\bfri\b/i), etd: col(/\betd\b|shipment/i), arena: col(/arena.*id/i) };
      let po = String((aoa[10] || [])[13] || '').trim(), piDate = tcsDate((aoa[12] || [])[13]);
      if (!po) { for (let i = 0; i < hr && !po; i++) { const r = aoa[i]; const k = r.findIndex(c => /p\.?\s?o\.?\s*(no|number|#)/i.test(String(c))); if (k >= 0) po = String(r.slice(k + 1).find(c => String(c).trim()) || '').trim(); } }
      if (!po) po = (f.name.match(/_(\d{6,12})_/) || [])[1] || f.name.replace(/\.[^.]+$/, '');
      const lines = [];
      for (let i = hr + 1; i < aoa.length; i++) {
        const r = aoa[i]; if (r.some(c => /^\s*(grand\s*)?total\b/i.test(String(c)))) break;
        const get = k => C[k] >= 0 ? r[C[k]] : '';
        const sref = String(get('sref')).trim(), qty = +String(get('qty')).replace(/[^\d.]/g, '') || 0;
        if (!sref && !String(get('ean')).trim()) continue;
        lines.push({ line: lines.length + 1, sref, ally: String(get('ally')).trim(), hage: String(get('hage')).trim(), desc: String(get('desc')).trim(),
          ean: String(get('ean')).replace(/\D/g, ''), qty, fri: tcsDate(get('fri')), etd: tcsDate(get('etd')) });
      }
      return { name: f.name, po, piDate, lines, src: 'P.I.' };
    }
  }
  // other P.O. / P.I. layouts: the shared table reader; FRI / ETD from the master file for that P.O.
  const r = await friReadFileText(f), ls = await friReadPoDoc(f, r.text || '');
  const po = ((r.text || '').match(/\bP\.?\s?O\.?\s*(?:No\.?|Number|#)?\s*[:：]?\s*([A-Z0-9][A-Z0-9\-\/]{4,})/i) || [])[1] || (f.name.match(/(\d{6,12}|\d{2}-\d{4}-\d+)/) || [])[1] || f.name;
  const fu = friRows().find(x => String(x.po) === String(po)) || {};
  return { name: f.name, po, piDate: '', src: 'P.O. file', lines: ls.map((l, i) => ({ line: i + 1, sref: l.sref || '', ally: l.code || '', hage: '', desc: l.desc || '', ean: l.ean || '', qty: l.qty || 0, fri: tcsDate(fu.inspPlan), etd: tcsDate(fu.etd) })) };
}
function tcsPoOptions(){
  const s = g('tcs-po-pick'); if (!s) return;
  const rows = friRows().filter(r => r.status === 'Open');
  s.innerHTML = rows.length ? '<option value="">— open P.O. · lot —</option>' + rows.map(r => `<option value="${tcsE(r.po + '||' + friLotOf(r))}">${tcsE(r.po)} · ${tcsE(friLotOf(r))} — ${tcsE(r.ally || '')} · ${tcsE(r.sup || '')}${r.etd ? ' · ETD ' + tcsE(tcsFmt(tcsDate(r.etd))) : ''}</option>`).join('')
    : '<option value="">Load the master file to list open P.O.s</option>';
}
function tcsAddMasterPo(){
  const v = g('tcs-po-pick')?.value; if (!v) return; const [po, lot] = v.split('||');
  if (!TCS.masterPos.some(p => p.po === po && p.lot === lot)) TCS.masterPos.push({ po, lot });
  tcsRender();
}
function tcsDelPo(kind, i){ (kind === 'pi' ? TCS.pis : TCS.masterPos).splice(i, 1); tcsRender(); }
// master P.O. → P.I.-like lines (ETD / FRI of the lot)
function tcsMasterPI(p){
  const fu = friLotRow(p) || {}, items = friLotItems(p);
  return { name: 'Master file', po: p.po, lot: p.lot, src: 'master', ally: fu.ally, sup: fu.sup, lines: items.map((it, i) => ({ line: i + 1, dept: String(it.dept || fu.dept || '').toUpperCase(), sref: String(it.supRef || '').trim(), ally: String(it.allyRef || '').trim(), hage: '', desc: it.desc || '', ean: String(it.ean || '').replace(/\D/g, ''), qty: +it.qty || 0, fri: tcsDate(fu.inspPlan || fu.inspActual), etd: tcsDate(it.etd || fu.etd), cn: it.cn || it.hs || '' })) };
}

// Offer sheet (ARENA template) with pictures mapped by picture centre
async function tcsAddOffer(inp){
  const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
  tcsMsg(`Reading offer sheet ${tcsE(f.name)}…`);
  try { TCS.offer = await tcsReadOffer(f); tcsMsg(`Offer sheet: ${TCS.offer.items.length} item(s), ${TCS.offer.items.filter(i => i.pic).length} picture(s) mapped by picture centre.`); }
  catch(e) { tcsMsg(`Could not read the offer sheet: ${tcsE(e.message)}`); }
  tcsRender();
}
async function tcsReadOffer(f){
  const buf = await f.arrayBuffer(), wb = XLSX.read(new Uint8Array(buf), { type:'array', cellDates:true });
  const sn = wb.SheetNames.find(n => /^arena$/i.test(n)) || wb.SheetNames[0];
  const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header:1, raw:false, defval:'' });
  const hr = aoa.findIndex((r, i) => i < 20 && r.some(c => /supplier.*(ref|item)|item\s*description/i.test(String(c))));
  if (hr < 0) throw new Error('header row (Supplier Ref / Item Description) not found');
  const H = aoa[hr].map(c => String(c).replace(/\s+/g, ' ').trim()), col = re => H.findIndex(h => re.test(h));
  const C = { sref: col(/supplier.*(ref|item\s*no)/i), ean: col(/\b(ean|gtin)\b/i), name: col(/item\s*name|product\s*name|article\s*name/i), desc: col(/item\s*description/i), mat: col(/^material/i), pic: col(/picture/i) };
  const certCols = H.map((h, i) => /certif|test\s*report|report/i.test(h) && i !== C.desc ? i : -1).filter(i => i >= 0);
  const items = []; let blank = 0;
  for (let i = hr + 1; i < aoa.length && blank < 6; i++) {
    const r = aoa[i], get = k => C[k] >= 0 ? String(r[C[k]] || '').trim() : '';
    if (!get('sref') && !get('desc') && !get('name')) { blank++; continue; } blank = 0;
    items.push({ row: i + 1, sref: get('sref'), ean: get('ean').replace(/\D/g, ''), name: get('name'), desc: get('desc'), mat: get('mat'),
      certs: certCols.map(k => String(r[k] || '').trim()).filter(Boolean), pic: null, picAlt: 0 });
  }
  // pictures: drawing anchors of that sheet; centre row decides the item (offer pictures are often anchored in the row above)
  try {
    const z = await friUnzip(buf), txt = async n => z.names.includes(n) ? new TextDecoder().decode(await z.read(n)) : '';
    const wbx = await txt('xl/workbook.xml'), wbr = await txt('xl/_rels/workbook.xml.rels');
    const rid = ([...wbx.matchAll(/<sheet\b[^>]*>/g)].map(m => m[0]).find(t => (t.match(/name="([^"]*)"/) || [])[1]?.replace(/&amp;/g, '&') === sn) || '').match(/r:id="([^"]+)"/)?.[1];
    const tgt = rid && (wbr.match(new RegExp(`<Relationship[^>]*Id="${rid}"[^>]*Target="([^"]+)"`)) || wbr.match(new RegExp(`<Relationship[^>]*Target="([^"]+)"[^>]*Id="${rid}"`)) || [])[1];
    const sp = tgt ? 'xl/' + tgt.replace(/^\/?xl\//, '') : 'xl/worksheets/sheet1.xml';
    const sx = await txt(sp), sr = await txt(sp.replace(/worksheets\/([^/]+)$/, 'worksheets/_rels/$1.rels'));
    const did = (sx.match(/<drawing\b[^>]*\br:id="([^"]+)"/) || [])[1];
    const dt = did && (sr.match(new RegExp(`Id="${did}"[^>]*Target="([^"]+)"`)) || sr.match(new RegExp(`Target="([^"]+)"[^>]*Id="${did}"`)) || [])[1];
    if (dt) {
      const dp = 'xl/' + dt.replace(/^\.\.\//, '').replace(/^\/?xl\//, ''), dx = await txt(dp), dr = await txt(dp.replace(/drawings\/([^/]+)$/, 'drawings/_rels/$1.rels'));
      const defHt = +((sx.match(/<sheetFormatPr[^>]*defaultRowHeight="([\d.]+)"/) || [])[1] || 15), hts = {};
      for (const m of sx.matchAll(/<row\b[^>]*\br="(\d+)"[^>]*>/g)) { const h = (m[0].match(/\bht="([\d.]+)"/) || [])[1]; if (h) hts[+m[1] - 1] = +h; }
      const rowTop = r => { let t = 0; for (let i = 0; i < r; i++) t += (hts[i] ?? defHt); return t * 12700; };   // EMU
      const rowAt = y => { let t = 0, i = 0; while (i < 100000) { const h = (hts[i] ?? defHt) * 12700; if (y < t + h) return i; t += h; i++; } return i; };
      const anchors = [...dx.matchAll(/<((?:xdr:)?(?:twoCellAnchor|oneCellAnchor))\b[\s\S]*?<\/\1>/g)].map(m => m[0]);   // with or without the xdr: prefix
      const byRow = {};
      for (const a of anchors) {
        const fr = a.match(/<(?:xdr:)?from>[\s\S]*?<(?:xdr:)?col>(\d+)<\/(?:xdr:)?col>[\s\S]*?<(?:xdr:)?row>(\d+)<\/(?:xdr:)?row>[\s\S]*?<(?:xdr:)?rowOff>(-?\d+)<\/(?:xdr:)?rowOff>/);
        const emb = (a.match(/r:embed="([^"]+)"/) || [])[1]; if (!fr || !emb) continue;
        const col0 = +fr[1]; if (C.pic >= 0 && Math.abs(col0 - C.pic) > 1) continue;      // only the picture column (logos ignored)
        const top = rowTop(+fr[2]) + +fr[3]; let bot;
        const to = a.match(/<(?:xdr:)?to>[\s\S]*?<(?:xdr:)?row>(\d+)<\/(?:xdr:)?row>[\s\S]*?<(?:xdr:)?rowOff>(-?\d+)<\/(?:xdr:)?rowOff>/);
        if (to) bot = rowTop(+to[1]) + +to[2]; else bot = top + +((a.match(/<(?:xdr:)?ext cx="\d+" cy="(\d+)"/) || [])[1] || 0);
        const r0 = rowAt((top + bot) / 2) + 1;   // 1-based sheet row containing the picture centre
        const target = (dr.match(new RegExp(`Id="${emb}"[^>]*Target="([^"]+)"`)) || dr.match(new RegExp(`Target="([^"]+)"[^>]*Id="${emb}"`)) || [])[1];
        if (!target) continue;
        (byRow[r0] = byRow[r0] || []).push({ top, path: 'xl/' + target.replace(/^\.\.\//, '').replace(/^\/?xl\//, '') });
      }
      for (const it of items) {
        const list = (byRow[it.row] || []).sort((a, b) => a.top - b.top); if (!list.length) continue;
        const p = list[0], ext = (p.path.split('.').pop() || '').toLowerCase(); if (!['png','jpg','jpeg','gif'].includes(ext)) continue;
        const bytes = await z.read(p.path), blob = new Blob([bytes], { type: ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg' });
        let w = 0, h = 0; try { const bm = await createImageBitmap(blob); w = bm.width; h = bm.height; } catch(e) {}
        it.pic = { bytes, ext: ext === 'jpg' ? 'jpeg' : ext, w, h, url: URL.createObjectURL(blob), hash: await tcsHash(blob) };
        it.picAlt = list.length - 1;
      }
    }
  } catch(e) { console.warn('offer pictures', e); }
  return { name: f.name, items };
}

// Reports, declarations, certificates
async function tcsAddReports(inp){
  const files = [...(inp.files || [])]; inp.value = ''; let n = 0, dup = 0;
  for (const f of files) {
    tcsMsg(`Reading ${tcsE(f.name)}…`);
    try { const h = await tcsHash(f); if (TCS.reports.some(r => r.hash === h)) { dup++; continue; }
      const r = await friReadFileText(f); TCS.reports.push(tcsParseReport(f.name, r.text || '', h, f)); n++;
    } catch(e) { tcsMsg(`Could not read ${tcsE(f.name)}: ${tcsE(e.message)}`); }
  }
  TCS.reports.forEach((r, i) => { r.R = 'R' + (i + 1); });
  tcsMsg(`${n} document(s) added${dup ? `, ${dup} duplicate(s) skipped (same content)` : ''}.`);
  tcsRender();
}
const TCS_LABS = [['SGS',/\bSGS\b/],['Intertek',/intertek/i],['TÜV Rheinland',/t[uü]v\s*rheinland/i],['TÜV SÜD',/t[uü]v\s*s[uü]d/i],['Bureau Veritas',/bureau\s*veritas|\bBV\b/],['QIMA',/\bqima\b/i],['Eurofins',/eurofins/i],['UL',/\bUL\b/],['Hohenstein',/hohenstein/i],['Applus+',/applus/i],['CTI',/\bCTI\b/],['CCIC',/\bCCIC\b/],['Vinacontrol',/vinacontrol/i],['Quatest',/quatest/i]];
function tcsParseReport(name, text, hash, file){
  const t = String(text), head = t.slice(0, 2500);
  const isDecl = /declaration|statement|certificate of (conformity|compliance)|mill\s*cert|inspection certificate|EN\s*10204|3\.1\b/i.test(name + ' ' + head.slice(0, 600)) && !/test\s*report/i.test(head.slice(0, 600));
  const isAccr = /accreditation\s*certificate|certificate\s*of\s*accreditation/i.test(head);
  const no = ((t.match(/(?:test\s*)?report\s*(?:no\.?|number|#)\s*[:：]?\s*([A-Z0-9][A-Z0-9\-\/.]{4,}[A-Z0-9])/i) || [])[1]) || ((t.match(/certificate\s*(?:no\.?|number)\s*[:：]?\s*([A-Z0-9][A-Z0-9\-\/.]{3,})/i) || [])[1]) || '';
  const orig = t.match(/original\s*(?:report\s*)?(?:issue\s*)?date\s*[:：]?\s*([^\n|]{6,30})/i);
  const di = t.match(/(?:date\s*of\s*issue|issue\s*date|issued\s*(?:on|date)?|report\s*date|date)\s*[:：]?\s*([^\n|]{6,30})/i);
  const issue = tcsDate(orig ? orig[1] : '') || tcsDate(di ? di[1] : '') || '';
  const lab = (TCS_LABS.find(([, re]) => re.test(head)) || [])[0] || '';
  const applicant = ((t.match(/applicant\s*[:：]?\s*([^\n|]{3,80})/i) || [])[1] || '').trim();
  const fail = /\b(fail(ed)?|does\s*not\s*(comply|conform|meet)|non[-\s]?conform)/i.test(t.replace(/pass\s*\/\s*fail/ig, ''));
  const accredited = /ISO\/IEC\s*17025|accredit|CNAS|DAkkS|VILAS|UKAS|A2LA|ILAC/i.test(t);
  return { name, text: t, hash, file, kind: isAccr ? 'accr' : isDecl ? 'doc' : 'test', no, issue, lab, applicant, fail, accredited, R: '' };
}

// ═════ items ═════
const TCS_STREAM = { toy: 'Toy – TSD 2009/48/EC (CE)', ce: 'Other CE legislation (CE)', gpsr: 'GPSR (EU) 2023/988 – no CE' };
function tcsAutoStream(t){
  if (/\b(toys?|play(ing)?\s*(tent|house|set)?|sand\s*(box|pit)|kids?|child(ren)?'?s?|for\s*play|pretend)\b/i.test(t)) return 'toy';
  if (/\b(led|battery|batteries|electric(al)?|usb|solar|charger|volt|230\s*v|lamp|motor|radio|bluetooth)\b/i.test(t)) return 'ce';
  return 'gpsr';
}
function tcsFlags(t){
  const x = String(t).toLowerCase();
  return {
    wpc: /\bwpc\b|wood[\s-]*plastic/.test(x), coex: /co-?\s*extru|co-?\s*extrution|capped/.test(x), single: /single[\s-]*extru/.test(x),
    recycled: /recycl/.test(x), plastic: /\b(pp|pe|hdpe|ldpe|abs|pvc|ps|pet|pa6?|plastic|polypropylene|polyethylene|nylon|rubber|tpr|silicone|resin|bristles?)\b/.test(x),
    pvc: /\bpvc\b/.test(x), steel: /\b(steel|iron|galvani[sz]ed|zinc)\b/.test(x), stainless: /stainless|\b(304|201|430)\b/.test(x), alu: /alumin/.test(x),
    wood: /\b(wood(en)?|timber|pine|acacia|bamboo|fsc|eucalyptus|oak|beech|teak|rattan)\b/.test(x) && !/wood[\s-]*plastic|wood\s*flour/.test(x),
    board: /\b(mdf|plywood|particle\s*board|chipboard|hdf)\b/.test(x), coat: /coat|paint|lacquer|varnish|powder|enamel/.test(x),
    print: /print|logo/.test(x), textile: /textile|fabric|polyester|cotton|canvas|oxford|linen/.test(x),
    food: /\b(food|kitchen|cutlery|plates?|cups?|mugs?|bowls?|cook(ing|ware)?|bbq|barbecue|grill|lunch\s*box|bottles?|tableware|utensils?|spatula|tongs)\b/.test(x),
    brush: /brush|broom|bristle/.test(x), heat: /\b(bbq|barbecue|grill|oven|heat|fire\s*pit|stove)\b/.test(x),
    load: /\b(bed|table|chair|bench|shelf|shelves|stand|rack|stool|trellis|arch|pergola|planter|sand\s*(box|pit)|swing|hammock|cart|trolley)\b/.test(x),
    seat: /\b(chairs?|arm\s*chairs?|stools?|bench(es)?|loungers?|sun\s*beds?|deck\s*chairs?|recliners?|sofas?|settees?|rocking\s*chairs?|seats?|seating|bistro\s*set|dining\s*set|lounge\s*set|corner\s*set)\b/.test(x),
    table: /\b(tables?|bistro\s*set|dining\s*set|lounge\s*set|coffee\s*table|side\s*table)\b/.test(x),
    outdoor: /\b(garden|outdoor|patio|balcony|terrace|camping|bistro|deck|pool\s*side|poolside)\b/.test(x),
    loose: /accessory\s*for\s*assembly|\bset\s*:|\d+\s*x\s+\w|assembl|\bkit\b|screws?|bolts?|panels?/.test(x), fixing: /trellis|wall|fix(ing)?\b|mount/.test(x),
    ground: /\b(stakes?|spikes?|pegs?|edging|border|into\s*(the\s*)?ground)\b/.test(x),
    pack: ((x.match(/\b(pallet|sleeve|poly\s*bag|polybag|colou?r\s*box|gift\s*box|display\s*box|blister|shrink)\b/) || [])[1] || 'carton').replace(/\s+/g, ' '),
  };
}
function tcsItems(){
  const pis = [...TCS.pis, ...TCS.masterPos.filter(p => !TCS.pis.some(x => x.po === p.po)).map(tcsMasterPI)];
  const offer = (TCS.offer && TCS.offer.items) || [], items = [], key = l => tcsNorm(l.sref) || 'ean' + l.ean || 'ally' + tcsNorm(l.ally);
  const findOffer = l => offer.find(o => (l.sref && tcsNorm(o.sref) === tcsNorm(l.sref)) || (l.ean && o.ean && o.ean === l.ean));
  pis.forEach(pi => pi.lines.forEach(l => {
    let it = items.find(i => i.key === key(l));
    if (!it) { it = { key: key(l), sref: l.sref, ean: l.ean, ally: l.ally, hage: l.hage, poDesc: l.desc, lines: [], cn: l.cn || '', dept: l.dept || '', offer: findOffer(l) }; items.push(it); }
    it.lines.push(Object.assign({ po: pi.po }, l));
    if (!it.ally && l.ally) it.ally = l.ally; if (!it.ean && l.ean) it.ean = l.ean;
  }));
  const notOnPo = pis.length ? offer.filter(o => !items.some(i => i.offer === o)) : [];
  if (!pis.length) offer.forEach(o => items.push({ key: tcsNorm(o.sref) || 'ean' + o.ean, sref: o.sref, ean: o.ean, ally: '', hage: '', poDesc: '', lines: [], cn: '', offer: o }));
  const picHash = {};
  items.forEach((it, i) => {
    it.n = i + 1; const o = it.offer || {};
    it.text = [it.poDesc, o.name, o.desc, o.mat].filter(Boolean).join(' · ');
    it.f = tcsFlags(it.text);
    // item name: product noun of the P.O. description, dimensions / material from the quotation; WPC extrusion type stated
    let name = it.poDesc || o.name || o.desc || it.sref;
    if (it.poDesc && o.name) { const dim = (o.name.match(/\d+\s*(?:x\s*\d+\s*)*(?:cm|mm|m)\b/i) || [])[0]; if (dim && !tcsNorm(it.poDesc).includes(tcsNorm(dim))) name = it.poDesc.replace(/\s*\d+\s*(?:x\s*\d+\s*)*(?:cm|mm|m)\b/i, '').trim() + ' ' + dim; }
    if (it.f.wpc) name = name.replace(/\b(co-?extruded\s+|single-?extruded\s+)?WPC\b/i, '').replace(/\s{2,}/g, ' ').trim() + ', ' + (it.f.coex ? 'co-extruded WPC' : it.f.single ? 'single-extruded WPC' : 'WPC – extrusion type TBC');
    it.name = name;
    it.etd = it.lines.map(l => l.etd).filter(Boolean).sort()[0] || '';
    it.fri = it.lines.map(l => l.fri).filter(Boolean).sort()[0] || '';
    it.stream = TCS.streams[it.key] || tcsAutoStream(it.text);
    it.pic = o.pic || null;
    it.issues = [];
    if (!it.pic && TCS.offer) it.issues.push({ en: 'No picture in offer sheet – supplier to send a correct picture', vi: 'Không có hình trong offer sheet – NCC gửi hình đúng' });
    if (it.pic) { if (picHash[it.pic.hash]) it.issues.push({ en: `Offer picture is identical to item ${picHash[it.pic.hash]} – supplier to send the correct picture`, vi: `Hình trong offer giống mặt hàng ${picHash[it.pic.hash]} – NCC gửi hình đúng` }); else picHash[it.pic.hash] = it.n; }
    if (/\bnew\b/i.test(o.ean || '') || (it.ean && it.ean.length !== 13 && it.ean.length !== 8)) it.issues.push({ en: `GTIN "${it.ean || o.ean}" not a valid EAN-13 – Merchandiser to confirm`, vi: `GTIN "${it.ean || o.ean}" không phải EAN-13 hợp lệ – Merchandiser xác nhận` });
    if (it.offer && it.ean && it.offer.ean && it.offer.ean !== it.ean) it.issues.push({ en: `EAN on P.O. ${it.ean} differs from offer ${it.offer.ean} – confirm supplier ref ↔ Ally no. ↔ EAN before artwork release`, vi: `EAN trên P.O. ${it.ean} khác offer ${it.offer.ean} – xác nhận mã NCC ↔ mã Ally ↔ EAN trước khi duyệt artwork` });
  });
  return { items, pis, notOnPo };
}

// ═════ requirement catalogue (skill: Build procedure step 3) ═════
// type: mat / prod / doc / qc · by: lab / wit / li / qc / doc · sev: CRI / MAJ · kw: report text that evidences the line
const TCS_TYPE = { mat: ['Material test','Thử vật liệu'], prod: ['Product test','Thử sản phẩm'], doc: ['Document','Tài liệu'], qc: ['QC check','Kiểm tra QC'], sup: ['Supporting','Hỗ trợ'] };
const TCS_BY = { lab: ['Lab only (ISO/IEC 17025)','Chỉ PTN (ISO/IEC 17025)'], wit: ['Lab or internal – witnessed','PTN hoặc nội bộ – có QC chứng kiến'], li: ['Lab or internal','PTN hoặc nội bộ'], qc: ['Internal – A.R.E.N.A. QC','Nội bộ – QC A.R.E.N.A.'], doc: ['Document','Tài liệu'] };
const TCS_JOB = { J1: ['Toy / food contact tests','Thử nghiệm đồ chơi / tiếp xúc thực phẩm'], J2: ['Material chemistry per compound','Hóa chất vật liệu theo hỗn hợp'], J3: ['Coating / ink chemistry','Hóa chất lớp phủ / mực in'], J4: ['Physical tests per item','Thử nghiệm cơ lý theo mặt hàng'], J5: ['SVHC per material','SVHC theo vật liệu'], J6: ['Packaging heavy metals per packaging type','Kim loại nặng bao bì theo loại bao bì'], J7: ['Assembly instruction / instructions for use – document review','Hướng dẫn lắp ráp / sử dụng – xem xét tài liệu'] };
function tcsReqs(it){
  const f = it.f, L = [], add = (id, en, vi, type, by, sev, kw, job) => L.push({ id, en, vi, type, by, sev, kw, job });
  const layer = f.wpc && f.coex ? ' – core and cap layer tested separately' : '', layerVi = f.wpc && f.coex ? ' – thử riêng lõi và lớp phủ' : '';
  if (it.stream === 'toy') {
    add('t71_1', `${TCS_STD['EN 71-1'].use} mechanical and physical properties (sharp edges / points, small parts, stability)`, `${TCS_STD['EN 71-1'].use} tính chất cơ lý (cạnh sắc / đầu nhọn, chi tiết nhỏ, độ ổn định)`, 'prod', 'lab', 'CRI', /EN\s*71-1\b/i, 'J1'); L[L.length - 1].std = 'EN 71-1';
    add('t71_2', `${TCS_STD['EN 71-2'].use} flammability`, `${TCS_STD['EN 71-2'].use} tính dễ cháy`, 'prod', 'lab', 'MAJ', /EN\s*71-2\b/i, 'J1'); L[L.length - 1].std = 'EN 71-2';
    add('t71_3', `${TCS_STD['EN 71-3'].use} migration of certain elements (each material / colour)` + layer, `${TCS_STD['EN 71-3'].use} thôi nhiễm một số nguyên tố (mỗi vật liệu / màu)` + layerVi, 'mat', 'lab', 'CRI', /EN\s*71-3\b/i, 'J1'); L[L.length - 1].std = 'EN 71-3';
  }
  if (it.stream === 'ce') add('ceT', 'LVD / EMC / RoHS tests to the applicable harmonised standards', 'Thử nghiệm LVD / EMC / RoHS theo tiêu chuẩn hài hòa áp dụng', 'prod', 'lab', 'CRI', /\bEN\s*(60|61|55)\d{3}|\bLVD\b|\bEMC\b|RoHS|2011\/65/i, 'J4');
  if (f.food) {
    if (f.steel || f.stainless || f.alu) add('fcM', 'Food contact: metal release (EDQM CM/Res(2013)9, 3 migrations)', 'Tiếp xúc thực phẩm: thôi nhiễm kim loại (EDQM CM/Res(2013)9, 3 lần thôi nhiễm)', 'mat', 'lab', 'CRI', /metal\s*release|EDQM|CM\/Res/i, 'J1');
    if (f.plastic || f.wpc) { add('fcO', 'Food contact: overall migration (Reg. (EU) 10/2011)', 'Tiếp xúc thực phẩm: thôi nhiễm tổng (Quy định (EU) 10/2011)', 'mat', 'lab', 'CRI', /overall\s*migration|\bOML\b/i, 'J1');
      add('fcS', 'Food contact: specific migration (Reg. (EU) 10/2011 Annex I)', 'Tiếp xúc thực phẩm: thôi nhiễm riêng (Quy định (EU) 10/2011 Phụ lục I)', 'mat', 'lab', 'MAJ', /specific\s*migration|\bSML\b/i, 'J1'); }
    add('fcSe', 'Food contact: sensory test (odour, taste – DIN 10955)', 'Tiếp xúc thực phẩm: thử cảm quan (mùi, vị – DIN 10955)', 'prod', 'lab', 'MAJ', /sensory|organoleptic|odou?r|10955/i, 'J1');
  }
  if (f.plastic || f.wpc || f.recycled) add('chem', 'REACH Annex XVII: PAH (AfPS GS 2019:01 PAK – edition UNVERIFIED, see Standards check), Cd, Pb, phthalates in plastic / rubber / WPC parts' + layer, 'REACH Phụ lục XVII: PAH (AfPS GS 2019:01), Cd, Pb, phthalate trong chi tiết nhựa / cao su / WPC' + layerVi, 'mat', 'lab', 'MAJ', /\bPAH\b|\bPAK\b|phthalat|cadmium/i, 'J2');
  if (f.wpc || f.recycled) add('pops', 'POPs Reg. (EU) 2019/1021: SCCP / MCCP, PBDE (recycled plastic / WPC)' + layer, 'POPs Quy định (EU) 2019/1021: SCCP / MCCP, PBDE (nhựa tái chế / WPC)' + layerVi, 'mat', 'lab', 'MAJ', /SCCP|MCCP|PBDE|\bPOPs?\b|2019\/1021/i, 'J2');
  if (f.board) add('form', 'Formaldehyde emission of wood-based panels (REACH Annex XVII Entry 77)', 'Phát thải formaldehyde của ván gỗ (REACH Phụ lục XVII mục 77)', 'mat', 'lab', 'MAJ', /formaldehyde|717-1|16516/i, 'J2');
  if (f.textile) add('tex', 'Textile parts: azo dyes, phthalates, PAH (REACH Annex XVII)', 'Chi tiết vải: thuốc nhuộm azo, phthalate, PAH (REACH Phụ lục XVII)', 'mat', 'lab', 'MAJ', /\bazo\b|aromatic\s*amine/i, 'J2');
  if (f.coat) add('coat', 'Surface coating: Pb and Cd (REACH Annex XVII)', 'Lớp phủ bề mặt: Pb và Cd (REACH Phụ lục XVII)', 'mat', 'lab', 'MAJ', /(lead|\bPb\b|cadmium|\bCd\b)[^\n]{0,60}coating|coating[^\n]{0,60}(lead|\bPb\b|cadmium|\bCd\b)/i, 'J3');
  if (f.print) add('ink', 'Printed logo / ink: heavy metals and PAH of the ink', 'Logo in / mực in: kim loại nặng và PAH của mực', 'mat', 'lab', 'MAJ', /\bink\b|printing/i, 'J3');
  add('svhc', 'SVHC Candidate List screening per material (REACH Art. 33)', 'Sàng lọc SVHC theo Danh sách ứng viên cho mỗi vật liệu (REACH Điều 33)', 'mat', 'lab', 'MAJ', /SVHC|candidate\s*list|art(icle|\.)?\s*33/i, 'J5');
  add('pack', `Packaging heavy metals Pb+Cd+Hg+Cr(VI) ≤ 100 mg/kg (PPWR (EU) 2025/40 Art. 5) – packaging type: ${f.pack}`, `Kim loại nặng trong bao bì Pb+Cd+Hg+Cr(VI) ≤ 100 mg/kg (PPWR (EU) 2025/40 Điều 5) – loại bao bì: ${f.pack}`, 'mat', 'lab', 'MAJ', /packag[^\n]{0,60}(heavy\s*metal|\bPb\b|\bHg\b)|heavy\s*metals?[^\n]{0,30}packag|94\/62|2025\/40/i, 'J6');
  if (it.stream !== 'toy') add('edge', 'Sharp edges, points and burrs (all accessible parts)', 'Cạnh sắc, đầu nhọn và bavia (mọi chi tiết tiếp cận được)', 'prod', 'li', 'MAJ', /sharp\s*(edge|point)|burr/i, 'J4');
  // Outdoor furniture (rulebook §3 / §9): EN 581 parts are not hENs → SoA = current CEN edition (live-checked 11 Nov 2026:
  // EN 581-1:2017; EN 581-2:2026 and EN 581-3:2026, CEN 20 May 2026). An older-edition report only with the Ally's written acceptance.
  const furn = it.stream !== 'toy' && (f.seat || f.table) && (f.outdoor || it.dept === 'GARDEN');
  if (furn) {
    add('f581_1', `${TCS_STD['EN 581-1'].use} outdoor furniture – general safety requirements (SoA: current CEN edition)`, `${TCS_STD['EN 581-1'].use} đồ nội thất ngoài trời – yêu cầu an toàn chung (SoA: phiên bản CEN hiện hành)`, 'prod', 'li', 'MAJ', /EN\s*581-1\b/i, 'J4'); L[L.length - 1].std = 'EN 581-1';
    if (f.seat) { add('f581_2', `${TCS_STD['EN 581-2'].use} outdoor seating – mechanical safety requirements and test methods (SoA: current CEN edition; a report to an older edition only with the Ally's written acceptance)`, `${TCS_STD['EN 581-2'].use} ghế ngoài trời – yêu cầu an toàn cơ học và phương pháp thử (SoA: phiên bản CEN hiện hành; báo cáo theo phiên bản cũ chỉ khi Ally chấp nhận bằng văn bản)`, 'prod', 'li', 'MAJ', /EN\s*581-2\b/i, 'J4'); L[L.length - 1].std = 'EN 581-2'; }
    if (f.table) { add('f581_3', `${TCS_STD['EN 581-3'].use} outdoor tables – mechanical safety requirements and test methods (SoA: current CEN edition; a report to an older edition only with the Ally's written acceptance)`, `${TCS_STD['EN 581-3'].use} bàn ngoài trời – yêu cầu an toàn cơ học và phương pháp thử (SoA: phiên bản CEN hiện hành; báo cáo theo phiên bản cũ chỉ khi Ally chấp nhận bằng văn bản)`, 'prod', 'li', 'MAJ', /EN\s*581-3\b/i, 'J4'); L[L.length - 1].std = 'EN 581-3'; }
  }
  if (f.load && !furn && it.stream !== 'toy') add('load', 'Stability and strength under load (declared maximum load)', 'Độ ổn định và độ bền khi chịu tải (tải trọng tối đa công bố)', 'prod', 'li', 'MAJ', /stability|load\s*test|static\s*load|strength/i, 'J4');
  if (f.steel && !f.stainless) add('corr', 'Corrosion resistance of steel parts (neutral salt spray ISO 9227)', 'Khả năng chống ăn mòn chi tiết thép (phun muối trung tính ISO 9227)', 'prod', 'wit', 'MAJ', /salt\s*spray|\bNSS\b|9227|corrosion/i, 'J4');
  if (f.brush) add('bris', 'Bristle retention / pull-out force', 'Độ bám lông chổi / lực kéo bật', 'prod', 'wit', 'CRI', /bristle|pull-?\s*out|tuft/i, 'J4');
  if (f.heat) add('heat', 'Heat resistance / deformation', 'Khả năng chịu nhiệt / biến dạng', 'prod', 'li', 'MAJ', /heat\s*resist|deformation/i, 'J4');
  if (f.stainless || f.alu) add('xrf', 'Material identity of the declared metal grade (XRF at FRI or mill cert 3.1)', 'Xác định vật liệu theo mác kim loại công bố (XRF tại FRI hoặc chứng chỉ vật liệu 3.1)', 'qc', 'qc', 'MAJ', /\bXRF\b|mill\s*cert|EN\s*10204|3\.1\b/i, 'J4');
  // documents
  if (it.stream === 'toy') {
    add('tSA', 'Toy safety assessment (TSD Art. 18) and technical documentation (Annex IV) (Ally as manufacturer: safety assessment, technical documentation, EC DoC, CE marking)', 'Đánh giá an toàn đồ chơi (TSD Điều 18) và hồ sơ kỹ thuật (Phụ lục IV) (Ally là nhà sản xuất: đánh giá an toàn, hồ sơ kỹ thuật, tuyên bố hợp quy EC, dấu CE)', 'doc', 'doc', 'CRI', /safety\s*assessment|technical\s*documentation/i);
    add('tDoC', 'EC declaration of conformity (TSD Annex III) and CE marking (Ally as manufacturer: safety assessment, technical documentation, EC DoC, CE marking)', 'Tuyên bố hợp quy EC (TSD Phụ lục III) và dấu CE (Ally là nhà sản xuất: đánh giá an toàn, hồ sơ kỹ thuật, tuyên bố hợp quy EC, dấu CE)', 'doc', 'doc', 'CRI', /declaration\s*of\s*conformity|\bEC\s*DoC\b/i);
    add('tMark', 'Toy marking and warnings (TSD Art. 11, Annex V): type / batch, manufacturer name and address, warnings decided in the safety assessment', 'Ghi nhãn và cảnh báo đồ chơi (TSD Điều 11, Phụ lục V): kiểu / lô, tên và địa chỉ nhà sản xuất, cảnh báo theo đánh giá an toàn', 'doc', 'doc', 'MAJ', /toy\s*marking|warnings?\s*label/i);
  } else if (it.stream === 'ce') {
    add('ceDoC', 'EU declaration of conformity, technical documentation and CE marking (Decision 768/2008/EC Annex III) (Ally as manufacturer: safety assessment, technical documentation, EC DoC, CE marking)', 'Tuyên bố hợp quy EU, hồ sơ kỹ thuật và dấu CE (Quyết định 768/2008/EC Phụ lục III) (Ally là nhà sản xuất: đánh giá an toàn, hồ sơ kỹ thuật, tuyên bố hợp quy EC, dấu CE)', 'doc', 'doc', 'CRI', /declaration\s*of\s*conformity|\bDoC\b/i);
  } else {
    add('gpsr', 'GPSR Art. 9 marking: type / batch ID, manufacturer name, postal and electronic address, warnings; NO CE marking (GPSR product)', 'Ghi nhãn GPSR Điều 9: ID kiểu / lô, tên nhà sản xuất, địa chỉ bưu chính và điện tử, cảnh báo; KHÔNG dấu CE (sản phẩm GPSR)', 'doc', 'doc', 'MAJ', /GPSR|2023\/988/i);
  }
  if (f.food) add('fcD', 'Food contact declaration of compliance (Reg. (EC) 1935/2004; (EU) 10/2011 Annex IV for plastics)', 'Tuyên bố tuân thủ tiếp xúc thực phẩm (Quy định (EC) 1935/2004; (EU) 10/2011 Phụ lục IV cho nhựa)', 'doc', 'doc', 'MAJ', /declaration\s*of\s*compliance|1935\/2004/i);
  add('md', 'Material declaration per component (signed PDF; supplier ref, Ally no. / GTIN; metal grade, coating and weight %; polymer, recycled content, additives, binder, biocides, flame retardants' + (f.wpc ? '; WPC extrusion type' : '') + ')',
    'Khai báo vật liệu cho từng chi tiết (PDF có ký; mã NCC, mã Ally / GTIN; mác kim loại, lớp phủ và % khối lượng; polymer, hàm lượng tái chế, phụ gia, chất kết dính, chất diệt khuẩn, chất chống cháy' + (f.wpc ? '; kiểu đùn WPC' : '') + ')', 'doc', 'doc', 'MAJ', /material\s*(declaration|composition)|declaration\s*of\s*material/i);
  // assembly instruction / instructions for use — one line per item, by how it reaches the consumer
  const ally = tcsAlly();
  if (it.stream === 'toy' && f.loose) add('ai', 'Assembly instruction + instructions for use – toy (TSD Art. 11 + Annex V; EN 71-1; EN 82079-1: adult-assembly warning where required, parts and screw list, periodic check of fixings, care, warnings and age grading consistent with the packaging)', 'Hướng dẫn lắp ráp + hướng dẫn sử dụng – đồ chơi (TSD Điều 11 + Phụ lục V; EN 71-1; EN 82079-1: cảnh báo người lớn lắp ráp khi cần, danh sách chi tiết và vít, kiểm tra định kỳ liên kết, bảo quản, cảnh báo và độ tuổi khớp với bao bì)', 'doc', 'doc', 'MAJ', /assembly\s*instruction|instructions?\s*for\s*use|user\s*manual/i, 'J7');
  else if (f.loose && f.fixing) add('ai', 'Assembly instruction + fixing instruction (EN 82079-1; GPSR Art. 9(7): safety information first, parts and hardware list with quantities, tools, illustrated steps, fixing method, anchor type, max. load, care)', 'Hướng dẫn lắp ráp + hướng dẫn cố định (EN 82079-1; GPSR Điều 9(7): thông tin an toàn trước, danh sách chi tiết và phụ kiện kèm số lượng, dụng cụ, các bước có hình, cách cố định, loại tắc kê, tải tối đa, bảo quản)', 'doc', 'doc', 'MAJ', /assembly\s*instruction|fixing\s*instruction/i, 'J7');
  else if (f.loose) add('ai', 'Assembly instruction + instructions for use (EN 82079-1; GPSR Art. 9(7): safety information first, parts and hardware list with quantities, tools, illustrated steps, use limits, care, UV / weathering)', 'Hướng dẫn lắp ráp + hướng dẫn sử dụng (EN 82079-1; GPSR Điều 9(7): thông tin an toàn trước, danh sách chi tiết và phụ kiện kèm số lượng, dụng cụ, các bước có hình, giới hạn sử dụng, bảo quản, chống tia UV / thời tiết)', 'doc', 'doc', 'MAJ', /assembly\s*instruction|instructions?\s*for\s*use/i, 'J7');
  else if (f.ground) add('ai', 'Instructions for use / installation (GPSR Art. 9(7): installation depth, check for buried cables / pipes, CAUTION metal parts, care; may be on label / insert – Ally to confirm)', 'Hướng dẫn sử dụng / lắp đặt (GPSR Điều 9(7): độ sâu lắp đặt, kiểm tra cáp / ống ngầm, CẨN THẬN chi tiết kim loại, bảo quản; có thể in trên nhãn / tờ rời – Ally xác nhận)', 'doc', 'doc', 'MAJ', /instructions?\s*for\s*use|installation/i, 'J7');
  else add('ai', 'Instructions for use (GPSR Art. 9(7): safe use, care, warnings; may be printed on packaging / label insert)', 'Hướng dẫn sử dụng (GPSR Điều 9(7): sử dụng an toàn, bảo quản, cảnh báo; có thể in trên bao bì / tờ nhãn)', 'doc', 'doc', 'MAJ', /instructions?\s*for\s*use|user\s*manual/i, 'J7');
  L[L.length - 1].en += `; ${ally || 'Ally'} (manufacturer, own brand) name, postal + electronic address; product type / batch ID; language(s) of the Ally markets`;
  L[L.length - 1].vi += `; tên, địa chỉ bưu chính + điện tử của ${ally || 'Ally'} (nhà sản xuất, thương hiệu riêng); ID kiểu / lô; ngôn ngữ theo thị trường của Ally`;
  // CN code + overlays
  const ov = [], ovVi = [];
  if (f.steel || f.stainless) { ov.push('CBAM (CN 72/73 iron & steel: emissions data, authorised declarant)'); ovVi.push('CBAM (CN 72/73 sắt thép: dữ liệu phát thải, người khai báo được ủy quyền)'); }
  if (f.alu) { ov.push('CBAM (CN 76 aluminium)'); ovVi.push('CBAM (CN 76 nhôm)'); }
  if (f.wood) { ov.push('EUDR (wood CN 44 – A.R.E.N.A. has no EUDR role)'); ovVi.push('EUDR (gỗ CN 44 – A.R.E.N.A. không có vai trò EUDR)'); }
  if (f.wpc) { ov.push('WPC under CN 39xx: EUDR out of scope once the CN code is confirmed'); ovVi.push('WPC thuộc CN 39xx: ngoài phạm vi EUDR khi CN được xác nhận'); }
  add('cn', `CN code confirmation${it.cn ? ' (master: ' + it.cn + ')' : ''}${ov.length ? '; overlays: ' + ov.join('; ') : ''}`, `Xác nhận mã CN${it.cn ? ' (master: ' + it.cn + ')' : ''}${ovVi.length ? '; quy định liên quan: ' + ovVi.join('; ') : ''}`, 'doc', 'doc', 'MAJ', /\bCN\s*code|\bHS\s*code/i);
  if (it.issues.length) add('spec', 'Specification consistency: ' + it.issues.map(x => x.en).join('; '), 'Tính nhất quán quy cách: ' + it.issues.map(x => x.vi).join('; '), 'doc', 'doc', 'MAJ', null);
  return L;
}
function tcsAlly(){ const p = TCS.masterPos[0], fu = p ? friLotRow(p) : null; return (fu && fu.ally) || ((TCS.pis[0] || {}).ally) || (/hagebau/i.test(((TCS.pis[0] || {}).lines || []).map(l => l.ally).join(' ') + ' ' + (TCS.offer ? TCS.offer.name : '')) ? 'hagebau' : '') || 'Ally'; }

// ═════ evaluation (K-1 / K-2 / K-3) ═════
function tcsReportItems(r, items){
  // which items a document is about: by supplier ref / Ally no. / EAN (ref stated), else by the item name (ref missing)
  const T = tcsNorm(r.text), out = [];
  items.forEach(it => {
    const ids = [it.sref, it.ally, it.ean].filter(x => x && String(x).length >= 4);
    const refOk = !!(it.sref && T.includes(tcsNorm(it.sref)));
    const idHit = ids.some(x => T.includes(tcsNorm(x)));
    const words = String(it.poDesc || (it.offer && it.offer.name) || it.name).toLowerCase().match(/[a-z]{4,}/g) || [];
    const nameHit = words.length && words.filter(w => !/^(with|from|set|item|size|colou?r|wood|steel)$/.test(w)).every(w => r.text.toLowerCase().includes(w));
    if (idHit || nameHit) out.push({ it, refOk: refOk || (!it.sref && idHit) });
  });
  return out;
}
function tcsEvaluate(){
  const B = tcsItems(), items = B.items, today = tcsToday();
  TCS.reports.forEach(r => { r.valid = r.issue ? tcsAddYears(r.issue, 2) : ''; r.cover = tcsReportItems(r, items); });
  items.forEach(it => {
    it.reqs = tcsReqs(it);
    const ref = it.etd || today, etdTxt = it.etd ? tcsFmt(it.etd) : '';
    it.reqs.forEach(q => {
      const cands = TCS.reports.filter(r => r.kind !== 'accr' && q.kw && q.kw.test(r.text)).map(r => ({ r, c: r.cover.find(x => x.it === it) })).filter(x => x.c);
      const sev = q.sev, rep = x => `${x.r.R} ${x.r.no || x.r.name}`, ok = x => x.c.refOk && x.r.valid && x.r.valid >= ref && !x.r.fail;
      const best = cands.find(ok) || cands.find(x => x.c.refOk && !x.r.fail && !x.r.valid) || cands.find(x => !x.c.refOk) || cands.find(x => x.r.valid && x.r.valid < ref) || cands.find(x => x.r.fail) || cands[0];
      q.ev = best || null; q.etd = it.etd;
      const k = { sev, R: best ? best.r.R : '', no: best ? best.r.no : '', d: best ? tcsFmt(best.r.valid) : '', e: etdTxt, job: q.job || '', sref: it.sref || it.ally || '', n: it.n };
      if (!best) { q.st = 'OPEN'; q.status = { en: `OPEN (${sev}) – no evidence`, vi: `MỞ (${sev}) – chưa có bằng chứng` }; q.evText = { en: 'None', vi: 'Chưa có' }; }
      else if (q.type === 'doc' || best.r.kind === 'doc') {
        if (!best.c.refOk) { q.st = 'OPEN'; q.status = { en: `OPEN (${sev}) – ${k.R} without supplier ref (K-3); issuer to amend`, vi: `MỞ (${sev}) – ${k.R} thiếu mã NCC (K-3); đơn vị phát hành sửa đổi` }; q.evText = { en: `${k.R} ${best.r.name} – supplier ref missing`, vi: `${k.R} ${best.r.name} – thiếu mã NCC` }; q.rv = 'ref'; }
        else { q.st = 'CONDITIONAL'; q.status = { en: `CONDITIONAL – ${k.R} received; QS to check signature, stamp, signed PDF, components of this item`, vi: `CÓ ĐIỀU KIỆN – đã nhận ${k.R}; QS kiểm tra chữ ký, con dấu, PDF có ký, chi tiết của mặt hàng này` }; q.evText = { en: `${k.R} ${best.r.name} – received`, vi: `${k.R} ${best.r.name} – đã nhận` }; q.rv = 'cond'; }
      }
      else if (best.r.fail) { q.st = 'OPEN'; q.status = { en: `OPEN (${sev}) – ${k.R} failed result; correct and retest ASAP`, vi: `MỞ (${sev}) – ${k.R} kết quả không đạt; khắc phục và thử lại ngay` }; q.evText = { en: `${rep(best)} – failed result`, vi: `${rep(best)} – kết quả không đạt` }; q.rv = 'fail'; }
      else if (!best.c.refOk) { q.st = 'OPEN'; q.status = { en: `OPEN (${sev}) – ${k.R} without supplier ref (K-3); lab to amend report`, vi: `MỞ (${sev}) – ${k.R} thiếu mã NCC (K-3); PTN sửa đổi báo cáo` }; q.evText = { en: `${rep(best)} – supplier ref missing`, vi: `${rep(best)} – thiếu mã NCC` }; q.rv = 'ref'; }
      else if (!best.r.valid) { q.st = 'CONDITIONAL'; q.status = { en: `CONDITIONAL – ${k.R} issue date not readable; QS to confirm validity (K-1)`, vi: `CÓ ĐIỀU KIỆN – ${k.R} không đọc được ngày phát hành; QS xác nhận hiệu lực (K-1)` }; q.evText = { en: `${rep(best)} – issue date to confirm`, vi: `${rep(best)} – cần xác nhận ngày phát hành` }; q.rv = 'date'; }
      else if (best.r.valid < ref) { q.st = 'OPEN'; q.status = it.etd ? { en: `OPEN (${sev}) – ${k.R} expires ${k.d} before ETD ${k.e} (K-1); retest ${k.job} ASAP`, vi: `MỞ (${sev}) – ${k.R} hết hiệu lực ${k.d} trước ETD ${k.e} (K-1); thử lại ${k.job} ngay` } : { en: `OPEN (${sev}) – ${k.R} expired ${k.d} (K-1); ETD not yet available; retest ${k.job} ASAP`, vi: `MỞ (${sev}) – ${k.R} hết hiệu lực ${k.d} (K-1); chưa có ETD; thử lại ${k.job} ngay` };
        q.evText = { en: `${rep(best)} – expires ${k.d} before ETD ${k.e || '(n/a)'}`, vi: `${rep(best)} – hết hiệu lực ${k.d} trước ETD ${k.e || '(chưa có)'}` }; q.rv = 'exp'; }
      else if (q.std && (q.ec = tcsEditionCheck(q.std, best.r.text, ref)).st.startsWith('ed-')) { const ec = q.ec, U = TCS_STD[q.std].use, al = tcsAlly(); q.rv = 'ed';
        if (ec.st === 'ed-soa') { q.st = 'CONDITIONAL'; q.status = { en: `CONDITIONAL – ${k.R} tested to ${ec.ed}, not the current ${U} (SoA); accepted only with ${al}'s written acceptance`, vi: `CÓ ĐIỀU KIỆN – ${k.R} thử theo ${ec.ed}, không phải ${U} hiện hành (SoA); chỉ chấp nhận khi ${al} đồng ý bằng văn bản` }; }
        else if (ec.st === 'ed-watch') { q.st = 'CONDITIONAL'; q.status = { en: `CONDITIONAL – ${k.R} tested to ${ec.ed} (newer, not OJ-cited – gap test only); evidence to the cited ${U} needed`, vi: `CÓ ĐIỀU KIỆN – ${k.R} thử theo ${ec.ed} (mới hơn, chưa được trích dẫn trên OJ – chỉ là thử bổ sung); cần bằng chứng theo ${U}` }; }
        else if (ec.st === 'ed-missing') { q.st = 'CONDITIONAL'; q.status = { en: `CONDITIONAL – ${k.R}: edition of ${q.std} not stated; QS to confirm it is ${U}`, vi: `CÓ ĐIỀU KIỆN – ${k.R}: không ghi phiên bản ${q.std}; QS xác nhận là ${U}` }; }
        else { q.st = 'OPEN'; q.status = { en: `OPEN (${sev}) – ${k.R} tested to ${ec.ed}, ${ec.ended ? 'coexistence ended ' + tcsFmt(ec.ended) + ' before ETD' : 'edition no longer cited (BLOCKED)'}; retest to ${U} ASAP`, vi: `MỞ (${sev}) – ${k.R} thử theo ${ec.ed}, ${ec.ended ? 'hết thời gian chuyển tiếp ' + tcsFmt(ec.ended) + ' trước ETD' : 'phiên bản không còn được trích dẫn'}; thử lại theo ${U} ngay` }; }
        q.evText = { en: `${rep(best)} – ${ec.ed || q.std + ' (edition not stated)'}, valid to ${k.d}`, vi: `${rep(best)} – ${ec.ed || q.std + ' (không ghi phiên bản)'}, hiệu lực đến ${k.d}` }; }
      else { q.st = 'ACCEPTED'; q.status = it.etd ? { en: `ACCEPTED – ${k.R} ${k.no}, valid to ${k.d} ≥ ETD ${k.e}`, vi: `CHẤP NHẬN – ${k.R} ${k.no}, hiệu lực đến ${k.d} ≥ ETD ${k.e}` } : { en: `ACCEPTED – ${k.R} ${k.no}, valid to ${k.d}; ETD not yet available – re-check at P.O.`, vi: `CHẤP NHẬN – ${k.R} ${k.no}, hiệu lực đến ${k.d}; chưa có ETD – kiểm tra lại khi có P.O.` };
        q.evText = { en: `${rep(best)} – valid to ${k.d} / ETD ${k.e || '(n/a)'}`, vi: `${rep(best)} – hiệu lực đến ${k.d} / ETD ${k.e || '(chưa có)'}` }; q.rv = 'ok';
        if (q.ec && q.ec.st === 'coex') { q.evText.en += ` · ${q.ec.ed} PASS-COEX until ${tcsFmt(q.ec.until)}`; q.evText.vi += ` · ${q.ec.ed} còn chấp nhận đến ${tcsFmt(q.ec.until)}`; } }
      q.action = tcsAction(it, q, k); q.pic = q.st === 'ACCEPTED' ? 'QS' : q.by === 'qc' ? 'A.R.E.N.A. QC' : q.id === 'tDoC' || q.id === 'tSA' || q.id === 'ceDoC' ? `${tcsAlly()} / supplier` : 'Supplier';
      q.due = q.st === 'ACCEPTED' ? '' : (it.etd ? tcsAddDays(it.etd, -45) : '');
      q.done = q.st === 'ACCEPTED';
    });
    const tests = it.reqs.filter(q => q.type !== 'doc');
    it.verdict = tests.some(q => q.st === 'OPEN' && q.sev === 'CRI') ? 'NOT MET' : !tests.some(q => q.st === 'ACCEPTED' || q.st === 'CONDITIONAL') ? 'NOT MET – no evidence' : tests.some(q => q.st !== 'ACCEPTED') ? 'CONDITIONAL' : 'MET';
  });
  // report verdicts (10-point check, automatic part)
  TCS.reports.forEach(r => {
    const covers = r.cover, etds = covers.map(c => c.it.etd).filter(Boolean).sort(), etd = etds[0] || '';
    r.etd = etd; const refOk = covers.length && covers.every(c => c.refOk);
    r.verdict = r.kind === 'accr' ? 'ACCEPTED (supporting)' : r.fail ? 'NOT ACCEPTED – failed result' : !covers.length ? 'NOT ACCEPTED – item not identified' : !refOk ? 'NOT ACCEPTED – supplier ref missing'
      : r.kind === 'doc' ? 'CONDITIONAL – QS to check signature, stamp, components' : !r.valid ? 'CONDITIONAL – issue date to confirm' : r.valid < (etd || tcsToday()) ? 'NOT ACCEPTED – expires before ETD' : 'ACCEPTED';
  });
  return B;
}
function tcsAction(it, q, k){
  const by = q.by, sref = k.sref, J = q.job ? `${q.job} ${TCS_JOB[q.job][0].toLowerCase()}` : '', Jv = q.job ? `${q.job} ${TCS_JOB[q.job][1].toLowerCase()}` : '';
  const test = {
    lab: { en: `Send sample of item ${it.n} to an ISO/IEC 17025 lab accredited for the method (${J}); supplier ref ${sref} on the report; file the report in the TCF.`, vi: `Gửi mẫu mặt hàng ${it.n} đến PTN ISO/IEC 17025 được công nhận cho phương pháp (${Jv}); ghi mã NCC ${sref} trên báo cáo; lưu báo cáo vào hồ sơ TCF.` },
    li: { en: `Test item ${it.n} (${J}) at an ISO/IEC 17025 lab or in-house (IT-1…IT-5); supplier ref ${sref} on the report; file the report in the TCF.`, vi: `Thử mặt hàng ${it.n} (${Jv}) tại PTN ISO/IEC 17025 hoặc nội bộ (IT-1…IT-5); ghi mã NCC ${sref} trên báo cáo; lưu báo cáo vào hồ sơ TCF.` },
    wit: { en: `Test item ${it.n} (${J}) at an ISO/IEC 17025 lab, or in-house witnessed by A.R.E.N.A. QC (IT-1…IT-6); supplier ref ${sref} on the report; file the report in the TCF.`, vi: `Thử mặt hàng ${it.n} (${Jv}) tại PTN ISO/IEC 17025, hoặc nội bộ có QC A.R.E.N.A. chứng kiến (IT-1…IT-6); ghi mã NCC ${sref} trên báo cáo; lưu báo cáo vào hồ sơ TCF.` },
    qc: { en: `A.R.E.N.A. QC: XRF check at FRI (device ID, daily reference check, readings, photos), or supplier to submit mill cert 3.1 stating supplier ref ${sref}.`, vi: `QC A.R.E.N.A.: kiểm tra XRF tại FRI (mã thiết bị, kiểm tra chuẩn hằng ngày, kết quả, hình ảnh), hoặc NCC nộp chứng chỉ vật liệu 3.1 có mã NCC ${sref}.` },
  }[by];
  if (q.st === 'ACCEPTED') return { en: `Use existing report ${k.R} (valid to ${k.d}${k.e ? ' ≥ ETD ' + k.e : ''}); file in the item TCF; no retest.`, vi: `Sử dụng báo cáo hiện có ${k.R} (hiệu lực đến ${k.d}${k.e ? ' ≥ ETD ' + k.e : ''}); lưu vào hồ sơ TCF của mặt hàng; không thử lại.` };
  if (q.rv === 'ref') return { en: `${q.type === 'doc' ? 'Issuer' : 'Lab'} to amend ${k.R} with supplier ref ${sref}; re-submit.`, vi: `${q.type === 'doc' ? 'Đơn vị phát hành' : 'PTN'} sửa đổi ${k.R} bổ sung mã NCC ${sref}; nộp lại.` };
  if (q.rv === 'exp') return { en: `Retest ASAP – ${k.R} expires ${k.d}${k.e ? ' before ETD ' + k.e : ''}. ` + test.en, vi: `Thử nghiệm lại ngay – ${k.R} hết hiệu lực ${k.d}${k.e ? ' trước ETD ' + k.e : ''}. ` + test.vi };
  if (q.rv === 'fail') return { en: `Failed result in ${k.R}: supplier to find the root cause, correct and retest ASAP. ` + (test ? test.en : ''), vi: `Kết quả không đạt trong ${k.R}: NCC tìm nguyên nhân, khắc phục và thử lại ngay. ` + (test ? test.vi : '') };
  if (q.rv === 'ed') { const al = tcsAlly(), U = TCS_STD[q.std].use, ec = q.ec || {};
    if (ec.st === 'ed-soa') return { en: `${al}: decide in writing whether ${k.R} (${ec.ed}) is accepted for this shipment; if not, ` + test.en.replace(/^Test/, 'test').replace(/^Send/, 'send') + ` New testing to ${U}.`, vi: `${al}: quyết định bằng văn bản có chấp nhận ${k.R} (${ec.ed}) cho lô hàng này; nếu không, ` + test.vi + ` Thử nghiệm mới theo ${U}.` };
    if (ec.st === 'ed-missing') return { en: `QS: confirm the edition of ${q.std} in ${k.R} is ${U}; if older, lab to state it and follow the edition rule.`, vi: `QS: xác nhận phiên bản ${q.std} trong ${k.R} là ${U}; nếu cũ hơn, PTN ghi rõ và áp dụng quy tắc phiên bản.` };
    return { en: `Retest ASAP to ${U} – ${k.R} is to ${ec.ed}. ` + test.en, vi: `Thử lại ngay theo ${U} – ${k.R} theo ${ec.ed}. ` + test.vi }; }
  if (q.rv === 'cond' || q.rv === 'date') return { en: `QS to check ${k.R}: signature, stamp, signed PDF, components of this item only, supplier ref (K-3)${q.rv === 'date' ? ', issue date (K-1)' : ''}.`, vi: `QS kiểm tra ${k.R}: chữ ký, con dấu, PDF có ký, chỉ chi tiết của mặt hàng này, mã NCC (K-3)${q.rv === 'date' ? ', ngày phát hành (K-1)' : ''}.` };
  if (q.id === 'ai') return { en: `Supplier: submit draft artwork (PDF + editable file) for A.R.E.N.A. QS review; ${tcsAlly()} approves final artwork before printing. A.R.E.N.A. QC: check correct version in each carton at FRI.`, vi: `NCC: nộp bản nháp artwork (PDF + file chỉnh sửa được) để QS A.R.E.N.A. xem xét; ${tcsAlly()} duyệt artwork cuối trước khi in. QC A.R.E.N.A.: kiểm tra đúng phiên bản trong mỗi thùng tại FRI.` };
  if (q.id === 'tSA' || q.id === 'tDoC' || q.id === 'ceDoC') return { en: `${tcsAlly()} (manufacturer): complete safety assessment, technical documentation, EC DoC and CE marking (TSD Art. 15–19 / Annexes III–V); supplier provides samples, material declaration and test reports stating supplier ref ${sref}. A.R.E.N.A. validates, never signs.`, vi: `${tcsAlly()} (nhà sản xuất): hoàn thành đánh giá an toàn, hồ sơ kỹ thuật, tuyên bố hợp quy EC và dấu CE (TSD Điều 15–19 / Phụ lục III–V); NCC cung cấp mẫu, khai báo vật liệu và báo cáo thử nghiệm có mã NCC ${sref}. A.R.E.N.A. thẩm định, không ký.` };
  if (q.id === 'spec') return { en: 'Merchandiser: confirm supplier ref ↔ Ally no. ↔ EAN and the correct picture with the supplier before artwork / label release.', vi: 'Merchandiser: xác nhận mã NCC ↔ mã Ally ↔ EAN và hình đúng với NCC trước khi duyệt artwork / nhãn.' };
  if (q.type === 'doc') { const d = q.en.split(/[(:–]/)[0].trim(), dv = q.vi.split(/[(:–]/)[0].trim(); return { en: `Supplier: submit ${d.charAt(0).toLowerCase() + d.slice(1)} stating supplier ref ${sref} (signed PDF).`, vi: `NCC: nộp ${dv.charAt(0).toLowerCase() + dv.slice(1)} có ghi mã NCC ${sref} (PDF có ký).` }; }
  return test;
}
