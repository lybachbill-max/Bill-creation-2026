// ═════════════ minimal styled .xlsx writer (cells, formulas with cached values, merges, fills, wrap, freeze panes,
// conditional formats, row heights, pictures, A3 landscape fit-to-width, print titles) — zipped by friZip ═════════════
const tcsCol = n => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
const tcsRef = (r, c) => tcsCol(c) + r;
const tcsX = s => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function tcsSheet(name, cols){ return { name: name.replace(/[\[\]:*?/\\]/g, ' ').slice(0, 31), cols, cells: {}, ht: {}, merges: [], cf: [], images: [], freeze: null, titles: null, landscape: true }; }
function tcsSet(sh, r, c, v, s, f){ sh.cells[r + ',' + c] = { v, s: s || {}, f }; }
function tcsMerge(sh, r1, c1, r2, c2, s){ if (r1 === r2 && c1 === c2) return; sh.merges.push(`${tcsRef(r1, c1)}:${tcsRef(r2, c2)}`);
  for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (!(r === r1 && c === c1) && !sh.cells[r + ',' + c]) sh.cells[r + ',' + c] = { v: null, s: s || (sh.cells[r1 + ',' + c1] || {}).s || {} }; }
function tcsXlsx(sheets, definedNames){
  const fonts = [], fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'], borders = ['<border><left/><right/><top/><bottom/><diagonal/></border>'], xfs = [], dxfs = [];
  const idx = (arr, x) => { let i = arr.indexOf(x); if (i < 0) { arr.push(x); i = arr.length - 1; } return i; };
  const font = s => idx(fonts, `<font>${s.b ? '<b/>' : ''}${s.i ? '<i/>' : ''}${s.u ? '<u/>' : ''}<sz val="${s.sz || 9}"/><color rgb="FF${s.color || '000000'}"/><name val="Arial"/><family val="2"/></font>`);
  idx(fonts, '<font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>');   // default font sets the column-width unit (7 px per char)
  const xf = s => {
    const fi = font(s), fl = s.fill ? idx(fills, `<fill><patternFill patternType="solid"><fgColor rgb="FF${s.fill}"/><bgColor indexed="64"/></patternFill></fill>`) : 0;
    const bc = s.bc || 'A6A6A6', bo = s.border === false ? 0 : idx(borders, `<border><left style="thin"><color rgb="FF${bc}"/></left><right style="thin"><color rgb="FF${bc}"/></right><top style="thin"><color rgb="FF${bc}"/></top><bottom style="thin"><color rgb="FF${bc}"/></bottom><diagonal/></border>`);
    const nf = s.date ? 164 : 0;
    return idx(xfs, `<xf numFmtId="${nf}" fontId="${fi}" fillId="${fl}" borderId="${bo}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"${nf ? ' applyNumberFormat="1"' : ''}><alignment horizontal="${s.h || 'left'}" vertical="${s.v || 'top'}" wrapText="${s.wrap === false ? 0 : 1}"/></xf>`);
  };
  xf({ border: false });
  const files = [], ct = [], wbSheets = [], wbRels = [];
  let imgN = 0, drawN = 0;
  sheets.forEach((sh, si) => {
    const rows = {};
    Object.entries(sh.cells).forEach(([k, c]) => { const [r, col] = k.split(',').map(Number); (rows[r] = rows[r] || []).push([col, c]); });
    const rnums = Object.keys(rows).map(Number).concat(Object.keys(sh.ht).map(Number)).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
    const data = rnums.map(r => {
      const cs = (rows[r] || []).sort((a, b) => a[0] - b[0]).map(([c, cell]) => {
        const s = xf(cell.s), ref = tcsRef(r, c), v = cell.v;
        if (cell.f) { const isNum = typeof v === 'number'; return `<c r="${ref}" s="${s}"${isNum || v === null || v === undefined ? '' : ' t="str"'}><f>${tcsX(cell.f)}</f>${v === null || v === undefined || v === '' ? '' : `<v>${tcsX(v)}</v>`}</c>`; }
        if (v === null || v === undefined || v === '') return `<c r="${ref}" s="${s}"/>`;
        if (typeof v === 'number') return `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
        return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${tcsX(v)}</t></is></c>`;
      }).join('');
      return `<row r="${r}"${sh.ht[r] ? ` ht="${sh.ht[r].toFixed(1)}" customHeight="1"` : ''}>${cs}</row>`;
    }).join('');
    const cfx = sh.cf.map((c, i) => `<conditionalFormatting sqref="${c.sqref}"><cfRule type="expression" dxfId="${idx(dxfs, `<dxf><font>${c.b ? '<b/>' : ''}<color rgb="FF${c.color}"/></font>${c.fill ? `<fill><patternFill patternType="solid"><fgColor rgb="FF${c.fill}"/><bgColor rgb="FF${c.fill}"/></patternFill></fill>` : ''}</dxf>`)}" priority="${i + 1}"${c.stop ? ' stopIfTrue="1"' : ''}><formula>${tcsX(c.formula)}</formula></cfRule></conditionalFormatting>`).join('');
    const pane = sh.freeze ? `<pane xSplit="${sh.freeze.c}" ySplit="${sh.freeze.r}" topLeftCell="${tcsRef(sh.freeze.r + 1, sh.freeze.c)}" activePane="bottomRight" state="frozen"/><selection pane="bottomRight"/>` : '';
    let drawing = '';
    if (sh.images.length) {
      drawN++; const dn = drawN, rels = [];
      const anchors = sh.images.map((im, i) => { imgN++; const nm = `image${imgN}.${im.ext}`; files.push([`xl/media/${nm}`, im.bytes]); rels.push(`<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${nm}"/>`);
        return `<xdr:oneCellAnchor><xdr:from><xdr:col>${im.c}</xdr:col><xdr:colOff>${Math.round(im.colOff)}</xdr:colOff><xdr:row>${im.r - 1}</xdr:row><xdr:rowOff>${Math.round(im.rowOff)}</xdr:rowOff></xdr:from><xdr:ext cx="${Math.round(im.cx)}" cy="${Math.round(im.cy)}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${i + 2}" name="Picture ${i + 1}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="rId${i + 1}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${Math.round(im.cx)}" cy="${Math.round(im.cy)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`; }).join('');
      files.push([`xl/drawings/drawing${dn}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">${anchors}</xdr:wsDr>`]);
      files.push([`xl/drawings/_rels/drawing${dn}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join('')}</Relationships>`]);
      files.push([`xl/worksheets/_rels/sheet${si + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${dn}.xml"/></Relationships>`]);
      ct.push(`<Override PartName="/xl/drawings/drawing${dn}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`);
      drawing = '<drawing r:id="rId1"/>';
    }
    const lastR = rnums.length ? rnums[rnums.length - 1] : 1;
    files.push([`xl/worksheets/sheet${si + 1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:${tcsRef(lastR, sh.cols.length - 1)}"/><sheetViews><sheetView workbookViewId="0"${si === 0 ? ' tabSelected="1"' : ''} zoomScale="90">${pane}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="12.75"/><cols>${sh.cols.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${data}</sheetData>${sh.merges.length ? `<mergeCells count="${sh.merges.length}">${sh.merges.map(m => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : ''}${cfx}<printOptions horizontalCentered="1"/><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="8" orientation="${sh.landscape ? 'landscape' : 'portrait'}" fitToWidth="1" fitToHeight="0"/><headerFooter><oddFooter>&amp;L&amp;8${tcsX(sh.name)}&amp;R&amp;8&amp;P / &amp;N</oddFooter></headerFooter>${drawing}</worksheet>`]);
    ct.push(`<Override PartName="/xl/worksheets/sheet${si + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
    wbSheets.push(`<sheet name="${tcsX(sh.name)}" sheetId="${si + 1}" r:id="rId${si + 1}"/>`);
    wbRels.push(`<Relationship Id="rId${si + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${si + 1}.xml"/>`);
  });
  const n = sheets.length;
  const dn = sheets.map((sh, i) => sh.titles ? `<definedName name="_xlnm.Print_Titles" localSheetId="${i}">'${tcsX(sh.name.replace(/'/g, "''"))}'!${sh.titles}</definedName>` : '').join('') + (definedNames || '');
  files.unshift(
    ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="gif" ContentType="image/gif"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>${ct.join('')}</Types>`],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'],
    ['docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>TCF Status and Action Plan</dc:title><dc:creator>A.R.E.N.A. IQS</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${wbSheets.join('')}</sheets>${dn ? `<definedNames>${dn}</definedNames>` : ''}<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`],
    ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${wbRels.join('')}<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="dd mmm yyyy"/></numFmts><fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills.join('')}</fills><borders count="${borders.length}">${borders.join('')}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="${dxfs.length}">${dxfs.join('')}</dxfs></styleSheet>`]
  );
  return new Blob([friZip(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
const tcsSerial = d => d ? Math.round((Date.parse(d + 'T00:00:00Z') - Date.UTC(1899, 11, 30)) / 864e5) : '';
// row height from wrapped text: 12.5 pt per line + 6 (Arial 9); chars per line ≈ column width × 1.2
function tcsLines(text, width){ if (text === null || text === undefined || text === '') return 1; const cpl = Math.max(4, Math.floor(width * 1.15)); return String(text).split('\n').reduce((a, p) => a + Math.max(1, Math.ceil(p.length / cpl)), 0); }
const tcsHt = n => 12.5 * n + 6;

const TCS_K = [
  { en: 'Report validity: an accredited (ISO/IEC 17025) laboratory test report is accepted for 2 years from its issue date and must remain valid up to the ETD of the shipment.', vi: 'Hiệu lực báo cáo: báo cáo thử nghiệm của phòng thử nghiệm được công nhận (ISO/IEC 17025) được chấp nhận trong 2 năm kể từ ngày phát hành và phải còn hiệu lực đến ngày ETD của lô hàng.' },
  { en: 'Existing reports first: review and identify existing valid reports that can be leveraged for this shipment, to reduce testing cost and shorten the project timeline. For reports that expire before the shipment ETD or do not fully cover the product scope, arrange retesting as soon as possible to avoid delays in shipment approval and compliance clearance.', vi: 'Ưu tiên báo cáo hiện có: rà soát và xác định các báo cáo còn hiệu lực có thể sử dụng cho lô hàng này, nhằm giảm chi phí thử nghiệm và rút ngắn tiến độ dự án. Với báo cáo hết hiệu lực trước ngày ETD hoặc không bao phủ đầy đủ phạm vi sản phẩm, sắp xếp thử nghiệm lại càng sớm càng tốt để tránh chậm trễ phê duyệt xuất hàng và phê duyệt tuân thủ.' },
  { en: 'Supplier reference: the supplier item reference must be stated in every test report and in every requested or concerned document; reports or documents without it are not accepted until amended by the issuer.', vi: 'Mã tham chiếu NCC: mã hàng của nhà cung cấp phải được ghi trên mọi báo cáo thử nghiệm và mọi tài liệu được yêu cầu hoặc liên quan; báo cáo hoặc tài liệu không có thông tin này không được chấp nhận cho đến khi được đơn vị phát hành sửa đổi.' },
];
const TCS_BANDS = ['EAF2FB', 'EEF7EC', 'FDF3E6', 'F3EEFA', 'E9F6F5', 'FBEFF2'];
const S_H = { b: true, fill: '1F3864', color: 'FFFFFF', h: 'center', v: 'center' }, S_T = { b: true, sz: 12, color: '1F3864', border: false, v: 'center' };
function tcsKeyBlock(sh, r, c2){
  const y = { fill: 'FFF2CC', bc: 'D6B656' };
  tcsSet(sh, r, 0, BI('Key requirements (mandatory in every build and revision)', 'Yêu cầu chính (bắt buộc cho mọi lần lập và sửa đổi)'), Object.assign({ b: true }, y)); tcsMerge(sh, r, 0, r, c2, y); sh.ht[r] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  TCS_K.forEach((k, i) => { const t = `K-${i + 1}  ` + BI(k.en, k.vi); tcsSet(sh, r + 1 + i, 0, t, y); tcsMerge(sh, r + 1 + i, 0, r + 1 + i, c2, y); sh.ht[r + 1 + i] = tcsHt(tcsLines(t, 230)); });
  return r + 4;
}
// ═════════════ the TCF workbook — compact layout of the skill: two worksheets (TCF status + Test plan) ═════════════
function tcsBuildBook(B){
  const items = B.items, ally = tcsAlly(), lang = TCS.lang, today = tcsToday();
  const sup = (TCS.masterPos[0] && (friLotRow(TCS.masterPos[0]) || {}).sup) || ((TCS.pis[0] || {}).name || '').replace(/\.[^.]+$/, '').split('_').slice(3).join(' ') || '';
  const pos = [...new Set(B.pis.map(p => p.po))], noPo = !B.pis.length;
  const etdPerPo = B.pis.map(p => { const e = p.lines.map(l => l.etd).filter(Boolean).sort()[0]; return `${p.po}${p.lot ? ' · ' + p.lot : ''}: ETD ${e ? tcsFmt(e) : 'n/a'}`; });
  // ── sheet 1: 13 columns ──
  const W = [5, 24, 21, 19, 27, 17, 44, 12, 17, 34, 36, 46, 12];
  const S1 = tcsSheet(`TCF status ${ally}`, W), LAST = W.length - 1;
  const title = `${ally} – TCF Status & Action Plan${sup ? ' – ' + sup : ''} – ${pos.length ? 'P.O. ' + pos.join(', ') : 'order'} – ` + (noPo ? 'P.O. / P.I. not yet available – P.O. fields left blank; run the P.O. cross-check when received' : etdPerPo.join(' · '));
  const titleVi = `${ally} – Trạng thái TCF và Kế hoạch hành động – ${noPo ? 'Chưa có P.O. / P.I. – để trống các trường P.O.' : etdPerPo.join(' · ')} – lập ${tcsFmt(today)}`;
  tcsSet(S1, 1, 0, BI(title, titleVi), S_T); tcsMerge(S1, 1, 0, 1, LAST, S_T); S1.ht[1] = tcsHt(tcsLines(BI(title, titleVi), 260));
  const H = [['No.','STT'],['Item name','Tên mặt hàng'],['Picture','Hình ảnh'],['Supplier item no.','Mã hàng NCC'],[`${ally} ref (P.O. no.)`,`Tham chiếu ${ally} (số P.O.)`],[`${ally} no.`,`Mã ${ally}`],['TCF requirement (test / document)','Yêu cầu TCF (thử nghiệm / tài liệu)'],['Evidence type','Loại bằng chứng'],['Testing by (acceptable)','Đơn vị thử nghiệm được chấp nhận'],['Evidence submitted','Bằng chứng đã nộp'],['Q.S remark (item)','Nhận xét Q.S (mặt hàng)'],['Action required','Hành động cần thực hiện'],['Status','Tình trạng']];
  H.forEach((h, c) => tcsSet(S1, 2, c, BI(h[0], h[1]), S_H)); S1.ht[2] = tcsHt(lang === 'bi' ? 3 : 2);
  S1.freeze = { r: 2, c: 2 }; S1.titles = '$2:$2';
  let r = 3;
  items.forEach((it, ii) => {
    const base = { fill: TCS_BANDS[ii % TCS_BANDS.length] }, r0 = r;
    const dTxt = [it.sref, it.ean ? 'GTIN ' + it.ean : (it.offer && /new/i.test(it.offer.ean || '') ? 'GTIN: NEW' : '')].filter(Boolean).join('\n');
    const eTxt = noPo ? '' : it.lines.slice().sort((a, b) => String(a.po).localeCompare(String(b.po)) || String(a.etd).localeCompare(String(b.etd))).map(l => `${l.po} L${l.line} · ${l.qty} pcs · FRI ${l.fri ? tcsFmt(l.fri) : 'n/a'} · ETD ${l.etd ? tcsFmt(l.etd) : 'n/a'}`).join('\n');
    const fTxt = noPo ? '' : [it.ally, it.hage, it.poDesc ? `'${it.poDesc}'` : ''].filter(Boolean).join('\n');
    const rem = [];
    if (it.pic) rem.push(BI('Picture: offer reference (marketing) photo – not evidence of the actual product.', 'Hình: ảnh tham khảo trong offer (marketing) – không phải bằng chứng sản phẩm thực tế.'));
    rem.push(BI(`Legal stream: ${TCS_STREAM[it.stream]}.`, `Luồng pháp lý: ${{ toy: 'Đồ chơi – TSD 2009/48/EC (CE)', ce: 'Văn bản CE khác (CE)', gpsr: 'GPSR (EU) 2023/988 – không CE' }[it.stream]}.`));
    if (it.f.wpc) rem.push(BI(`WPC: ${it.f.coex ? 'co-extruded – core and cap layer tested as separate materials' : it.f.single ? 'single-extruded' : 'extrusion type not stated – material declaration must state it'}.`, `WPC: ${it.f.coex ? 'đồng đùn – thử riêng lõi và lớp phủ' : it.f.single ? 'đùn đơn lớp' : 'chưa nêu kiểu đùn – khai báo vật liệu phải nêu'}.`));
    const nOpen = it.reqs.filter(q => q.st === 'OPEN').length, nCri = it.reqs.filter(q => q.st === 'OPEN' && q.sev === 'CRI').length;
    rem.push(BI(`Test evidence: ${it.verdict}${nOpen ? ` – ${nOpen} line(s) open${nCri ? `, ${nCri} critical (CRI)` : ''}` : ''}.`, `Bằng chứng thử nghiệm: ${{ 'NOT MET': 'CHƯA ĐẠT', 'NOT MET – no evidence': 'CHƯA ĐẠT – chưa có bằng chứng', CONDITIONAL: 'CÓ ĐIỀU KIỆN', MET: 'ĐẠT' }[it.verdict]}${nOpen ? ` – ${nOpen} dòng mở${nCri ? `, ${nCri} nghiêm trọng (CRI)` : ''}` : ''}.`));
    if (!noPo && it.etd) rem.push(BI(`Reports and documents due ${tcsFmt(tcsAddDays(it.etd, -45))} (ETD − 45 d)${tcsAddDays(it.etd, -45) < today ? ' – already past' : ''}.`, `Hạn báo cáo và tài liệu ${tcsFmt(tcsAddDays(it.etd, -45))} (ETD − 45 ngày)${tcsAddDays(it.etd, -45) < today ? ' – đã quá hạn' : ''}.`));
    if (!noPo && it.fri && it.fri <= tcsAddDays(today, 14) && it.reqs.some(q => q.st !== 'ACCEPTED')) rem.push(BI(`URGENT: FRI ${tcsFmt(it.fri)} within 14 days with open evidence.`, `KHẨN: FRI ${tcsFmt(it.fri)} trong vòng 14 ngày, còn bằng chứng mở.`));
    const remTxt = `IQA ${tcsFmt(today)}: ` + rem.join('\n');
    it.reqs.forEach((q, qi) => {
      const rr = r + qi, evFill = q.st === 'ACCEPTED' ? 'C6EFCE' : q.st === 'CONDITIONAL' ? 'FFEB9C' : q.ev ? 'FFC7CE' : null;
      const ev = BI(q.evText.en + (q.ev && TCS.reports.length ? ` [Val. #1, ${tcsFmt(today)}]` : ''), q.evText.vi);
      const vals = { 6: BI(q.en, q.vi), 7: BI(TCS_TYPE[q.type][0], TCS_TYPE[q.type][1]), 8: BI(TCS_BY[q.by][0], TCS_BY[q.by][1]), 9: ev, 11: BI(q.action.en, q.action.vi), 12: q.done ? BI('Done', 'Hoàn thành') : BI('Open', 'Mở') };
      Object.entries(vals).forEach(([c, v]) => tcsSet(S1, rr, +c, v, +c === 9 && evFill ? { fill: evFill } : +c === 12 ? Object.assign({ h: 'center' }, base) : base));
      S1.ht[rr] = tcsHt(Math.max(...Object.entries(vals).map(([c, v]) => tcsLines(v, W[c]))));
    });
    const r1 = r + it.reqs.length - 1;
    tcsSet(S1, r0, 0, it.n, Object.assign({ h: 'center' }, base)); tcsSet(S1, r0, 1, it.name, Object.assign({ b: true }, base));
    tcsSet(S1, r0, 2, it.pic ? '' : (TCS.offer ? BI('No picture in offer sheet', 'Không có hình trong offer sheet') : ''), Object.assign({ h: 'center' }, base));
    tcsSet(S1, r0, 3, dTxt, base); tcsSet(S1, r0, 4, eTxt, base); tcsSet(S1, r0, 5, fTxt, base); tcsSet(S1, r0, 10, remTxt, base);
    [0, 1, 2, 3, 4, 5, 10].forEach(c => tcsMerge(S1, r0, c, r1, c, (S1.cells[r0 + ',' + c] || {}).s));
    let blockHt = 0; for (let x = r0; x <= r1; x++) blockHt += S1.ht[x];
    const need = Math.max(...[[1, it.name], [3, dTxt], [4, eTxt], [5, fTxt], [10, remTxt]].map(([c, t]) => tcsHt(tcsLines(t, W[c]))), it.pic ? 92 : 0);
    if (need > blockHt) S1.ht[r1] += need - blockHt;
    if (it.pic && it.pic.w) { const sc = Math.min(140 / it.pic.w, 105 / it.pic.h), w = it.pic.w * sc, h = it.pic.h * sc, colPx = W[2] * 7 + 5;
      S1.images.push({ r: r0, c: 2, bytes: it.pic.bytes, ext: it.pic.ext, cx: w * 9525, cy: h * 9525, colOff: Math.max(0, (colPx - w) / 2) * 9525, rowOff: 4 * 9525 }); }
    r = r1 + 1;
  });
  const DL = Math.max(r - 1, 3);
  S1.cf.push({ sqref: `M3:M${DL}`, formula: 'LEFT($M3,4)="Done"', fill: 'C6EFCE', color: '006100', stop: true }, { sqref: `M3:M${DL}`, formula: 'LEFT($M3,4)="Open"', fill: 'FFC7CE', color: '9C0006', stop: true });
  r = tcsKeyBlock(S1, DL + 2, LAST) + 1;
  { // Standards check (rulebook §4.2): every standard cited in this workbook, edition, status, date checked, source
    const used = [...new Set(items.flatMap(i => i.reqs.map(q => q.std).filter(Boolean)).concat(items.some(i => i.reqs.some(q => q.id === 'chem')) ? ['AfPS GS 2019:01 PAK'] : []))];
    if (used.length) {
      const hs = { b: true, fill: 'D9E1F2' }, age = tcsStdAge();
      tcsSet(S1, r, 0, BI(`Standards check – editions live-checked ${tcsFmt(TCS_STD_CHECKED)}${age > 30 ? ` (${age} days ago – RE-CHECK before use)` : ''}; status per rulebook §4.2`, `Kiểm tra tiêu chuẩn – phiên bản kiểm tra trực tiếp ${tcsFmt(TCS_STD_CHECKED)}${age > 30 ? ` (${age} ngày trước – KIỂM TRA LẠI trước khi dùng)` : ''}; trạng thái theo quy tắc §4.2`), hs); tcsMerge(S1, r, 0, r, LAST, hs); S1.ht[r] = tcsHt(TCS.lang === 'bi' ? 2 : 1); r++;
      [['Standard', 0, 1], ['Edition to use', 2, 4], ['Status', 5, 5], ['Notes', 6, 9], ['Source', 10, 12]].forEach(([h, a1, a2]) => { tcsSet(S1, r, a1, h, S_H); tcsMerge(S1, r, a1, r, a2, S_H); }); S1.ht[r] = 18; r++;
      used.forEach(k => { const S = TCS_STD[k], stf = { fill: S.st === 'CURRENT' || S.st === 'SoA' ? 'C6EFCE' : S.st === 'PASS-COEX' || S.st === 'WATCH' || S.st === 'UNVERIFIED' ? 'FFEB9C' : 'FFC7CE', h: 'center', b: true };
        [[k, 0, 1, { b: true }], [S.use, 2, 4, {}], [S.st, 5, 5, stf], [S.note, 6, 9, {}], [S.src, 10, 12, { color: '1F4E79' }]].forEach(([v, a1, a2, st]) => { tcsSet(S1, r, a1, v, st); tcsMerge(S1, r, a1, r, a2, st); });
        S1.ht[r] = tcsHt(Math.max(tcsLines(S.note, W[6] + W[7] + W[8] + W[9]), tcsLines(S.src, W[10] + W[11] + W[12]))); r++; });
      r++;
    }
  }
  const notes = [
    BI(`Basis: ${noPo ? 'P.O. / P.I. not yet available – validity (K-1) checked at today; re-check at P.O.' : etdPerPo.join(' · ')}.${B.notOnPo.length ? ' Offer items not on any P.O. (not in this TCF): ' + B.notOnPo.map(o => o.sref || o.name).join(', ') + '.' : ''} A.R.E.N.A. validates only – never manufacturer, importer or DoC signatory; CE is prohibited on GPSR products.`,
       `Cơ sở: ${noPo ? 'Chưa có P.O. / P.I. – hiệu lực (K-1) kiểm tra theo ngày hôm nay; kiểm tra lại khi có P.O.' : etdPerPo.join(' · ')}. A.R.E.N.A. chỉ thẩm định – không là nhà sản xuất, nhà nhập khẩu hay người ký DoC; cấm dấu CE trên sản phẩm GPSR.`),
    BI('Evidence submitted: green = accepted, amber = conditional, red = not accepted (expired before ETD, supplier ref missing, failed). Automatic first pass – QS confirms every report against the full document.', 'Bằng chứng đã nộp: xanh = chấp nhận, vàng = có điều kiện, đỏ = không chấp nhận (hết hiệu lực trước ETD, thiếu mã NCC, không đạt). Đánh giá tự động – QS xác nhận từng báo cáo với tài liệu đầy đủ.'),
  ];
  notes.forEach(v => { tcsSet(S1, r, 0, v, {}); tcsMerge(S1, r, 0, r, LAST, {}); S1.ht[r] = tcsHt(tcsLines(v, 260)); r++; });
  const S2 = tcsPlanSheet(items);
  const fname = `${ally}_TCF_${pos.length ? pos.join('-') : 'no-PO'}${lang === 'bi' ? '_EN-VI' : '_EN'}.xlsx`.replace(/[^\w.\-]+/g, '_');
  return { blob: tcsXlsx([S1, S2]), name: fname };
}
function tcsPlanSheet(items){
  const W = [7, 44, 22, 40, 13, 18, 13, 13, 14, 40];
  const S = tcsSheet('Test plan', W), L = W.length - 1;
  tcsSet(S, 1, 0, BI('Test plan – open test and document jobs (existing valid reports used first, K-2)', 'Kế hoạch thử nghiệm – các việc thử nghiệm và tài liệu còn mở (ưu tiên báo cáo còn hiệu lực, K-2)'), S_T); tcsMerge(S, 1, 0, 1, L, S_T); S.ht[1] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  const H = [['Job','Việc'],['Test','Phép thử'],['Sample (item)','Mẫu (mặt hàng)'],['Items covered – pictures and supplier refs on the report','Mặt hàng liên quan – hình và mã NCC trên báo cáo'],['Evidence type','Loại bằng chứng'],['Testing by (acceptable)','Đơn vị thử nghiệm được chấp nhận'],['Report due (ETD − 45 d)','Hạn báo cáo (ETD − 45 ngày)'],['Status','Tình trạng'],['Earliest ETD (items covered)','ETD sớm nhất (mặt hàng liên quan)'],['Due per item (ETD − 45 d)','Hạn theo mặt hàng (ETD − 45 ngày)']];
  H.forEach((h, c) => tcsSet(S, 2, c, BI(h[0], h[1]), S_H)); S.ht[2] = tcsHt(TCS.lang === 'bi' ? 4 : 2); S.freeze = { r: 2, c: 1 }; S.titles = '$2:$2';
  const groups = [];
  items.forEach(it => it.reqs.filter(q => q.st !== 'ACCEPTED' && (q.type !== 'doc' || q.id === 'ai') && q.job).forEach(q => {
    const mat = tcsNorm((it.offer && it.offer.mat) || '') + (it.f.coex ? 'coex' : it.f.single ? 'single' : '');
    const gk = q.id === 'pack' && q.rv !== 'exp' ? `pack|${it.f.pack}` : q.type === 'mat' && mat && q.rv !== 'exp' ? `${q.id}|${mat}` : `${q.id}|item${it.n}`;
    let g0 = groups.find(x => x.k === gk); if (!g0) groups.push(g0 = { k: gk, q, items: [] }); g0.items.push({ it, q });
  }));
  groups.sort((a, b) => a.q.job.localeCompare(b.q.job) || a.items[0].it.n - b.items[0].it.n);
  let r = 3;
  groups.forEach(gp => {
    const its = gp.items.map(x => x.it), e0 = its.map(i => i.etd).filter(Boolean).sort()[0] || '', sample = its.slice().sort((a, b) => String(a.etd || '9').localeCompare(String(b.etd || '9')))[0];
    const q = gp.q, retest = gp.items.find(x => x.q.rv === 'exp'), edq = gp.items.find(x => x.q.rv === 'ed');
    const testTxt = (retest ? BI(`Retest ASAP – ${retest.q.ev.r.R} expires ${tcsFmt(retest.q.ev.r.valid)}${retest.it.etd ? ' before ETD ' + tcsFmt(retest.it.etd) : ''}: `, `Thử nghiệm lại ngay – ${retest.q.ev.r.R} hết hiệu lực ${tcsFmt(retest.q.ev.r.valid)}${retest.it.etd ? ' trước ETD ' + tcsFmt(retest.it.etd) : ''}: `) : '')
      + (edq ? BI(`Only if ${tcsAlly()} does not accept ${edq.q.ev.r.R} (older edition): `, `Chỉ khi ${tcsAlly()} không chấp nhận ${edq.q.ev.r.R} (phiên bản cũ): `) : '') + BI(q.en, q.vi);
    const covered = its.map(i => `item ${i.n} ${i.sref || ''}${i.ean ? ' / GTIN ' + i.ean : ''}`).join('\n') + (its.length > 1 ? '\n' + BI('(same material / packaging type – identity statement C-2 or lab extension letter C-1 listing all supplier refs)', '(cùng vật liệu / loại bao bì – cam kết đồng nhất C-2 hoặc thư mở rộng của PTN C-1 liệt kê mọi mã NCC)') : '');
    const byGroup = {}; its.forEach(i => { const d = i.etd ? tcsFmt(tcsAddDays(i.etd, -45)) : ''; if (d) (byGroup[d] = byGroup[d] || []).push(i.n); });
    const due = Object.entries(byGroup).map(([d, ns]) => `${ns.length > 1 ? 'items' : 'item'} ${ns.join(', ')}: ${d}`).join(' · ');
    const vals = [q.job, testTxt, `item ${sample.n} ${sample.sref || ''}\n${sample.name}`, covered, BI(TCS_TYPE[q.type][0], TCS_TYPE[q.type][1]), BI(TCS_BY[q.by][0], TCS_BY[q.by][1]), null, BI('Open', 'Mở'), e0 ? tcsSerial(e0) : '', due];
    vals.forEach((v, c) => { if (c !== 6) tcsSet(S, r, c, v, c === 8 ? { date: true } : {}); });
    tcsSet(S, r, 6, e0 ? tcsSerial(tcsAddDays(e0, -45)) : '', { date: true }, `IF(I${r}="","",I${r}-45)`);
    S.ht[r] = tcsHt(Math.max(...vals.map((v, c) => tcsLines(typeof v === 'number' ? '' : v, W[c])))); r++;
  });
  if (!groups.length) { const t = BI('No open test job – every test line is covered by an existing valid report.', 'Không còn việc thử nghiệm mở – mọi dòng thử nghiệm đã có báo cáo còn hiệu lực.'); tcsSet(S, r, 0, t, {}); tcsMerge(S, r, 0, r, L, {}); S.ht[r] = 30; r++; }
  S.cf.push({ sqref: `G3:G${Math.max(r - 1, 3)}`, formula: 'AND($G3<>"",$G3<TODAY(),LEFT($H3,4)<>"Done",LEFT($H3,3)<>"N/A",LEFT($H3,9)<>"Cancelled")', color: 'C00000', b: true });
  r++; tcsKeyBlock(S, r, L);
  return S;
}
