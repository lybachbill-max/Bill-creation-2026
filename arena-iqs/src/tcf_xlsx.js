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

// ═════════════ the TCF workbook (full layout of the skill) ═════════════
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
function tcsBuildBook(B){
  const items = B.items, ally = tcsAlly(), lang = TCS.lang, today = tcsToday();
  const sup = (TCS.masterPos[0] && (friLotRow(TCS.masterPos[0]) || {}).sup) || ((TCS.pis[0] || {}).name || '').replace(/\.[^.]+$/, '').split('_').slice(3).join(' ') || 'supplier';
  const pos = [...new Set(B.pis.map(p => p.po))];
  const etdPerPo = B.pis.map(p => { const e = p.lines.map(l => l.etd).filter(Boolean).sort()[0]; return `${p.po}${p.lot ? ' · ' + p.lot : ''}: ETD ${e ? tcsFmt(e) : 'n/a'}`; });
  const noPo = !B.pis.length;
  const sheets = [];
  // ── sheet 1 ──
  const W = [5, 24, 21, 19, 27, 17, 42, 12, 16, 30, 36, 32, 16, 44, 13, 11, 13];
  const S1 = tcsSheet(`TCF status ${ally}`, W); sheets.push(S1);
  const LAST = W.length - 1;
  const title = `${ally} – TCF Status & Action Plan – ${sup} – ${pos.length ? 'P.O. ' + pos.join(', ') : 'order'} – ${lang === 'bi' ? 'EN / VI' : 'EN'} – ` + (noPo ? 'P.O. / P.I. not yet available – P.O. fields left blank; run the P.O. cross-check when received' : etdPerPo.join(' · '));
  const titleVi = `${ally} – Trạng thái TCF và Kế hoạch hành động – ${sup} – ${noPo ? 'Chưa có P.O. / P.I. – để trống các trường P.O.' : etdPerPo.join(' · ')} – lập ${tcsFmt(today)}`;
  tcsSet(S1, 1, 0, BI(title, titleVi), S_T); tcsMerge(S1, 1, 0, 1, LAST, S_T); S1.ht[1] = tcsHt(tcsLines(BI(title, titleVi), 300));
  const H = [['No.','STT'],['Item name','Tên mặt hàng'],['Picture','Hình ảnh'],['Supplier item no.','Mã hàng NCC'],[`${ally} ref (P.O. no.)`,`Tham chiếu ${ally} (số P.O.)`],[`${ally} no.`,`Mã ${ally}`],['TCF requirement (test / document)','Yêu cầu TCF (thử nghiệm / tài liệu)'],['Evidence type','Loại bằng chứng'],['Testing by (acceptable)','Đơn vị thử nghiệm được chấp nhận'],['Evidence submitted','Bằng chứng đã nộp'],['TCF assessment accumulated status','Trạng thái đánh giá TCF lũy kế'],['Q.S remark (item)','Nhận xét Q.S (mặt hàng)'],['Item verdict (test evidence)','Kết luận mặt hàng (bằng chứng thử nghiệm)']];
  H.forEach((h, c) => { tcsSet(S1, 2, c, BI(h[0], h[1]), S_H); tcsMerge(S1, 2, c, 3, c, S_H); });
  tcsSet(S1, 2, 13, BI('Action plan', 'Kế hoạch hành động'), S_H); tcsMerge(S1, 2, 13, 2, 16, S_H);
  [['Action required','Hành động cần thực hiện'],['PIC','Người phụ trách'],['Due date','Hạn hoàn thành'],['Status','Tình trạng']].forEach((h, i) => tcsSet(S1, 3, 13 + i, BI(h[0], h[1]), S_H));
  S1.ht[2] = tcsHt(lang === 'bi' ? 2 : 1); S1.ht[3] = tcsHt(lang === 'bi' ? 3 : 2);
  S1.freeze = { r: 3, c: 2 }; S1.titles = '$2:$3';
  let r = 4; const blocks = [];
  const tag = TCS.reports.length ? ` [Val. #1, ${tcsFmt(today)}]` : '';
  items.forEach((it, ii) => {
    const band = TCS_BANDS[ii % TCS_BANDS.length], base = { fill: band }, r0 = r, nT = it.reqs.filter(q => q.type !== 'doc').length;
    const dTxt = [it.sref, it.ean ? 'GTIN ' + it.ean : '', it.offer && it.offer.sref && it.offer.sref !== it.sref ? 'offer ' + it.offer.sref : ''].filter(Boolean).join('\n');
    const eTxt = noPo ? '' : it.lines.slice().sort((a, b) => String(a.po).localeCompare(String(b.po)) || String(a.etd).localeCompare(String(b.etd))).map(l => `${l.po} L${l.line} · ${l.qty} pcs · FRI ${l.fri ? tcsFmt(l.fri) : 'n/a'} · ETD ${l.etd ? tcsFmt(l.etd) : 'n/a'}`).join('\n');
    const fTxt = noPo ? '' : [it.ally, it.hage, it.poDesc ? `'${it.poDesc}'` : ''].filter(Boolean).join('\n');
    const rem = [];
    if (it.pic) rem.push(BI('Picture: offer reference (marketing) photo – not evidence of the actual product.', 'Hình: ảnh tham khảo trong offer (marketing) – không phải bằng chứng sản phẩm thực tế.') + (it.offer.picAlt ? ' ' + BI(`(${it.offer.picAlt} alternate view(s) in the offer row)`, `(${it.offer.picAlt} hình góc khác trong dòng offer)`) : ''));
    rem.push(BI(`Legal stream: ${TCS_STREAM[it.stream]}.`, `Luồng pháp lý: ${{ toy: 'Đồ chơi – TSD 2009/48/EC (CE)', ce: 'Văn bản CE khác (CE)', gpsr: 'GPSR (EU) 2023/988 – không CE' }[it.stream]}.`));
    if (it.f.wpc) rem.push(BI(`WPC: ${it.f.coex ? 'co-extruded – core and cap layer tested as separate materials; grouping only with the same core compound and cap-layer colour' : it.f.single ? 'single-extruded – grouping only with the same compound and colour' : 'extrusion type not stated – material declaration must state it'}.`, `WPC: ${it.f.coex ? 'đồng đùn – thử riêng lõi và lớp phủ; chỉ gộp khi cùng hỗn hợp lõi và màu lớp phủ' : it.f.single ? 'đùn đơn lớp – chỉ gộp khi cùng hỗn hợp và màu' : 'chưa nêu kiểu đùn – khai báo vật liệu phải nêu'}.`));
    if (!noPo && it.fri && it.fri <= tcsAddDays(today, 14) && it.reqs.some(q => q.st !== 'ACCEPTED')) rem.push(BI(`URGENT: FRI ${tcsFmt(it.fri)} within 14 days with open evidence.`, `KHẨN: FRI ${tcsFmt(it.fri)} trong vòng 14 ngày, còn bằng chứng mở.`));
    rem.push(BI('The full item TCF verdict also needs the document deliverables.', 'Kết luận TCF đầy đủ của mặt hàng còn cần các tài liệu.'));
    const remTxt = `IQA ${tcsFmt(today)}: ` + rem.join('\n');
    it.reqs.forEach((q, qi) => {
      const rr = r + qi, stFill = q.st === 'ACCEPTED' ? 'C6EFCE' : q.st === 'CONDITIONAL' ? 'FFEB9C' : q.st === 'N/A' ? 'EDEDED' : 'FFC7CE';
      const vals = [null, null, null, null, null, null, BI(q.en, q.vi), BI(TCS_TYPE[q.type][0], TCS_TYPE[q.type][1]), BI(TCS_BY[q.by][0], TCS_BY[q.by][1]), BI(q.evText.en + (q.ev ? tag : ''), q.evText.vi + (q.ev ? tag : '')), BI(q.status.en, q.status.vi)];
      vals.forEach((v, c) => { if (c >= 6) tcsSet(S1, rr, c, v, c === 10 ? { fill: stFill } : base); });
      tcsSet(S1, rr, 13, BI(q.action.en, q.action.vi), base); tcsSet(S1, rr, 14, q.pic, base);
      if (q.due) tcsSet(S1, rr, 15, tcsSerial(q.due), Object.assign({ date: true, h: 'center' }, base)); else tcsSet(S1, rr, 15, '', base);
      tcsSet(S1, rr, 16, q.done ? BI('Done', 'Hoàn thành') : BI('Open', 'Mở'), base);
      S1.ht[rr] = tcsHt(Math.max(...[6, 7, 8, 9, 10, 13].map(c => tcsLines(vals[c] ?? (c === 13 ? BI(q.action.en, q.action.vi) : ''), W[c]))));
    });
    const r1 = r + it.reqs.length - 1;
    tcsSet(S1, r0, 0, it.n, Object.assign({ h: 'center' }, base)); tcsSet(S1, r0, 1, it.name, Object.assign({ b: true }, base));
    tcsSet(S1, r0, 2, it.pic ? '' : (TCS.offer ? BI('No picture in offer sheet', 'Không có hình trong offer sheet') : ''), Object.assign({ h: 'center' }, base));
    tcsSet(S1, r0, 3, dTxt, base); tcsSet(S1, r0, 4, eTxt, base); tcsSet(S1, r0, 5, fTxt, base); tcsSet(S1, r0, 11, remTxt, base);
    const KR = `K${r0}:K${r0 + Math.max(nT, 1) - 1}`, bi = lang === 'bi';
    const vf = `IF(COUNTIF(${KR},"OPEN (CRI)*")>0,"NOT MET"${bi ? '&CHAR(10)&"CHƯA ĐẠT"' : ''},IF(COUNTIF(${KR},"ACCEPTED*")+COUNTIF(${KR},"CONDITIONAL*")=0,"NOT MET – no evidence"${bi ? '&CHAR(10)&"CHƯA ĐẠT – chưa có bằng chứng"' : ''},IF(COUNTIF(${KR},"OPEN*")+COUNTIF(${KR},"CONDITIONAL*")>0,"CONDITIONAL"${bi ? '&CHAR(10)&"CÓ ĐIỀU KIỆN"' : ''},"MET"${bi ? '&CHAR(10)&"ĐẠT"' : ''})))`;
    const vv = { 'NOT MET': ['NOT MET', 'CHƯA ĐẠT'], 'NOT MET – no evidence': ['NOT MET – no evidence', 'CHƯA ĐẠT – chưa có bằng chứng'], CONDITIONAL: ['CONDITIONAL', 'CÓ ĐIỀU KIỆN'], MET: ['MET', 'ĐẠT'] }[it.verdict];
    tcsSet(S1, r0, 12, BI(vv[0], vv[1]), Object.assign({ b: true, h: 'center', v: 'center' }, base), vf);
    [0, 1, 2, 3, 4, 5, 11, 12].forEach(c => tcsMerge(S1, r0, c, r1, c, (S1.cells[r0 + ',' + c] || {}).s));
    // block height: merged texts and the picture must fit
    let blockHt = 0; for (let x = r0; x <= r1; x++) blockHt += S1.ht[x];
    const need = Math.max(...[[1, it.name], [3, dTxt], [4, eTxt], [5, fTxt], [11, remTxt]].map(([c, t]) => tcsHt(tcsLines(t, W[c]))), it.pic ? 92 : 0);
    if (need > blockHt) S1.ht[r1] += need - blockHt;
    if (it.pic && it.pic.w) { const sc = Math.min(140 / it.pic.w, 105 / it.pic.h), w = it.pic.w * sc, h = it.pic.h * sc, colPx = W[2] * 7 + 5;
      S1.images.push({ r: r0, c: 2, bytes: it.pic.bytes, ext: it.pic.ext, cx: w * 9525, cy: h * 9525, colOff: Math.max(0, (colPx - w) / 2) * 9525, rowOff: 4 * 9525 }); }
    blocks.push({ it, r0, r1, nT }); r = r1 + 1;
  });
  const D1 = 4, DL = Math.max(r - 1, 4), rng = c => `${tcsCol(c)}${D1}:${tcsCol(c)}${DL}`;
  // colours that follow edits (begins-with rules, NOT MET before MET)
  S1.cf.push({ sqref: rng(10), formula: `LEFT($K${D1},4)="OPEN"`, fill: 'FFC7CE', color: '9C0006', stop: true }, { sqref: rng(10), formula: `LEFT($K${D1},4)="COND"`, fill: 'FFEB9C', color: '9C5700', stop: true }, { sqref: rng(10), formula: `LEFT($K${D1},3)="ACC"`, fill: 'C6EFCE', color: '006100', stop: true },
    { sqref: rng(12), formula: `LEFT($M${D1},7)="NOT MET"`, fill: 'FFC7CE', color: '9C0006', b: true, stop: true }, { sqref: rng(12), formula: `LEFT($M${D1},4)="COND"`, fill: 'FFEB9C', color: '9C5700', b: true, stop: true }, { sqref: rng(12), formula: `LEFT($M${D1},3)="MET"`, fill: 'C6EFCE', color: '006100', b: true, stop: true },
    { sqref: rng(15), formula: `AND($P${D1}<>"",$P${D1}<TODAY(),LEFT($Q${D1},4)<>"Done",LEFT($Q${D1},3)<>"N/A",LEFT($Q${D1},9)<>"Cancelled")`, color: 'C00000', b: true });
  // key requirements, summary, notes
  r = tcsKeyBlock(S1, DL + 2, LAST) + 1;
  const all = items.flatMap(i => i.reqs), cnt = p => all.filter(p).length;
  const sum = [
    [['Summary','Tổng hợp'], null, null, true],
    [['Lines OPEN (CRI)','Dòng MỞ (CRI)'], `COUNTIF(${rng(10)},"OPEN (CRI)*")`, cnt(q => q.st === 'OPEN' && q.sev === 'CRI')],
    [['Lines OPEN (MAJ)','Dòng MỞ (MAJ)'], `COUNTIF(${rng(10)},"OPEN (MAJ)*")`, cnt(q => q.st === 'OPEN' && q.sev === 'MAJ')],
    [['Lines CONDITIONAL','Dòng CÓ ĐIỀU KIỆN'], `COUNTIF(${rng(10)},"CONDITIONAL*")`, cnt(q => q.st === 'CONDITIONAL')],
    [['Lines ACCEPTED','Dòng CHẤP NHẬN'], `COUNTIF(${rng(10)},"ACCEPTED*")`, cnt(q => q.st === 'ACCEPTED')],
    [['Lines N/A','Dòng KHÔNG ÁP DỤNG'], `COUNTIF(${rng(10)},"N/A*")`, 0],
    [['Lines – Lab only (ISO/IEC 17025)','Dòng – Chỉ PTN (ISO/IEC 17025)'], `COUNTIF(${rng(8)},"Lab only*")`, cnt(q => q.by === 'lab')],
    [['Lines – Lab or internal – witnessed','Dòng – PTN hoặc nội bộ – có QC chứng kiến'], `COUNTIF(${rng(8)},"Lab or internal – witnessed*")`, cnt(q => q.by === 'wit')],
    [['Lines – Lab or internal','Dòng – PTN hoặc nội bộ'], `COUNTIF(${rng(8)},"Lab or internal*")-COUNTIF(${rng(8)},"Lab or internal – witnessed*")`, cnt(q => q.by === 'li')],
    [['Lines – Internal A.R.E.N.A. QC','Dòng – Nội bộ QC A.R.E.N.A.'], `COUNTIF(${rng(8)},"Internal*")`, cnt(q => q.by === 'qc')],
    [['Lines – Document','Dòng – Tài liệu'], `COUNTIF(${rng(8)},"Document*")`, cnt(q => q.by === 'doc')],
    [['Items NOT MET','Mặt hàng CHƯA ĐẠT'], `COUNTIF(${rng(12)},"NOT MET*")`, items.filter(i => i.verdict.startsWith('NOT MET')).length],
    [['Items CONDITIONAL','Mặt hàng CÓ ĐIỀU KIỆN'], `COUNTIF(${rng(12)},"CONDITIONAL*")`, items.filter(i => i.verdict === 'CONDITIONAL').length],
    [['Items MET','Mặt hàng ĐẠT'], `COUNTIF(${rng(12)},"MET*")`, items.filter(i => i.verdict === 'MET').length],
    [['Actions open','Hành động đang mở'], `COUNTIF(${rng(16)},"Open*")`, cnt(q => !q.done)],
    [['Actions done','Hành động hoàn thành'], `COUNTIF(${rng(16)},"Done*")`, cnt(q => q.done)],
    [['Actions overdue (due date < today, not Done / N/A / Cancelled)','Hành động quá hạn (hạn < hôm nay, chưa Hoàn thành / Không áp dụng / Hủy)'], `SUMPRODUCT((${rng(15)}<>"")*(${rng(15)}<TODAY())*(LEFT(${rng(16)},4)<>"Done")*(LEFT(${rng(16)},3)<>"N/A")*(LEFT(${rng(16)},9)<>"Cancelled"))`, cnt(q => q.due && q.due < today && !q.done)],
  ];
  sum.forEach(([l, f, v, head]) => { const s = head ? { b: true, fill: 'D9E1F2' } : {}; tcsSet(S1, r, 1, BI(l[0], l[1]), s); tcsMerge(S1, r, 1, r, 5, s); tcsSet(S1, r, 6, head ? '' : v, Object.assign({ h: 'center' }, s), f); S1.ht[r] = tcsHt(lang === 'bi' ? 2 : 1); r++; });
  r++;
  const legal = [...new Set(items.map(i => i.stream))].map(s => TCS_STREAM[s]).join(' · ');
  const notes = [
    [['Notes','Ghi chú'], null],
    [[`Assessment basis: ${noPo ? 'P.O. / P.I. not yet available – P.O. fields left blank; K-1 validity checked provisionally at today; re-check at P.O.' : etdPerPo.join(' · ')}. Sources: ${[...B.pis.map(p => p.src === 'master' ? `master file (${p.po})` : p.name), TCS.offer ? TCS.offer.name : ''].filter(Boolean).join('; ')}.${B.notOnPo.length ? ' Offer items not on any P.O. (not in this TCF): ' + B.notOnPo.map(o => o.sref || o.name).join(', ') + '.' : ''}${TCS.reports.length ? '' : ' No test report, certificate or declaration received – all lines OPEN.'}`,
      `Cơ sở đánh giá: ${noPo ? 'Chưa có P.O. / P.I. – để trống các trường P.O.; hiệu lực K-1 kiểm tra tạm theo ngày hôm nay; kiểm tra lại khi có P.O.' : etdPerPo.join(' · ')}.${B.notOnPo.length ? ' Mặt hàng offer không có trên P.O. (không đưa vào TCF): ' + B.notOnPo.map(o => o.sref || o.name).join(', ') + '.' : ''}${TCS.reports.length ? '' : ' Chưa nhận báo cáo, chứng chỉ hay tuyên bố nào – mọi dòng MỞ.'}`]],
    [[`Legal streams: ${legal}. A.R.E.N.A. is a sourcing office: never manufacturer, importer, operator or DoC signatory. CE is prohibited on GPSR products (Reg. (EC) 765/2008 Art. 30).`, `Luồng pháp lý: ${legal}. A.R.E.N.A. là văn phòng tìm nguồn: không bao giờ là nhà sản xuất, nhà nhập khẩu, nhà vận hành hay người ký DoC. Cấm dấu CE trên sản phẩm GPSR (Quy định (EC) 765/2008 Điều 30).`]],
    [['Status legend: OPEN (CRI / MAJ) red · CONDITIONAL amber · ACCEPTED green · N/A grey. Item verdict (test evidence): any OPEN (CRI) → NOT MET; no ACCEPTED or CONDITIONAL line → NOT MET – no evidence; any OPEN or CONDITIONAL → CONDITIONAL; else MET.', 'Chú thích: MỞ (CRI / MAJ) đỏ · CÓ ĐIỀU KIỆN vàng · CHẤP NHẬN xanh · KHÔNG ÁP DỤNG xám. Kết luận mặt hàng: có MỞ (CRI) → CHƯA ĐẠT; không có dòng CHẤP NHẬN hoặc CÓ ĐIỀU KIỆN → CHƯA ĐẠT – chưa có bằng chứng; có MỞ hoặc CÓ ĐIỀU KIỆN → CÓ ĐIỀU KIỆN; còn lại ĐẠT.']],
    [['How to close a line: file the evidence (report / document stating the supplier ref), QS validates it on sheet Report validation, then set the accumulated status to ACCEPTED and the action status to Done.', 'Cách đóng một dòng: lưu bằng chứng (báo cáo / tài liệu có mã NCC), QS thẩm định trên sheet Report validation, rồi đổi trạng thái lũy kế thành CHẤP NHẬN và tình trạng hành động thành Hoàn thành.']],
    [['Due dates: reports, declarations and technical file due ETD − 45 days (earliest ETD of the items covered); SRC issued at least the SRC buffer (default 7 days) before ETD. Blank due date = no ETD yet.', 'Hạn: báo cáo, tuyên bố và hồ sơ kỹ thuật đến hạn ETD − 45 ngày (ETD sớm nhất của các mặt hàng liên quan); SRC cấp trước ETD ít nhất khoảng đệm SRC (mặc định 7 ngày). Hạn trống = chưa có ETD.']],
    [['P-6: a MATERIAL test is accepted for any item of the same material (same grade; plastics / WPC same polymer, colour / compound and extrusion process); a PRODUCT test must be on the item itself or an identical part.', 'P-6: thử VẬT LIỆU được chấp nhận cho mọi mặt hàng cùng vật liệu (cùng mác; nhựa / WPC cùng polymer, màu / hỗn hợp và kiểu đùn); thử SẢN PHẨM phải trên chính mặt hàng hoặc chi tiết giống hệt.']],
    [['Automatic first pass by the A.R.E.N.A. IQS: reports are read by text (issue date, report no., supplier ref, tests); QS confirms every verdict against the full report (sheet Report validation, checks marked ~).', 'Lần đánh giá tự động đầu tiên bởi A.R.E.N.A. IQS: báo cáo được đọc theo văn bản (ngày phát hành, số báo cáo, mã NCC, phép thử); QS xác nhận mọi kết luận với báo cáo đầy đủ (sheet Report validation, các mục đánh dấu ~).']],
  ];
  notes.forEach(([t], i) => { const s = i ? {} : { b: true, fill: 'D9E1F2' }; const v = BI(t[0], t[1]); tcsSet(S1, r, 0, v, s); tcsMerge(S1, r, 0, r, LAST, s); S1.ht[r] = tcsHt(tcsLines(v, 300)); r++; });

  // ── CE & DoC guideline + EC DoC template (only with CE items) ──
  const ceItems = items.filter(i => i.stream !== 'gpsr');
  if (ceItems.length) tcsCeSheets(sheets, items, ceItems, ally);
  // ── Validation log ──
  if (TCS.reports.length) tcsLogSheet(sheets, blocks, S1, ally);
  // ── Report validation ──
  tcsRepSheet(sheets, items, etdPerPo, noPo);
  // ── Test plan ──
  tcsPlanSheet(sheets, items);
  // ── Testing body rules ──
  tcsRulesSheet(sheets, items);
  const fname = `${ally}_TCF_Status_Action_Plan_${sup}_${pos.length ? pos.join('-') : 'no-PO'}${lang === 'bi' ? '_EN-VI' : '_EN'}.xlsx`.replace(/[^\w.\-]+/g, '_');
  return { blob: tcsXlsx(sheets), name: fname };
}
function tcsRepSheet(sheets, items, etdPerPo, noPo){
  const W = [6, 24, 12, 20, 14, 26, 34, 11, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 24, 18, 30, 12, 12, 16, 26];
  const S = tcsSheet('Report validation', W); sheets.push(S); const L = W.length - 1;
  tcsSet(S, 1, 0, BI('Report validation – 10-point check per document (automatic first pass; QS confirms checks marked ~)', 'Thẩm định báo cáo thử nghiệm – kiểm tra 10 điểm cho mỗi tài liệu (đánh giá tự động; QS xác nhận các mục ~)'), S_T); tcsMerge(S, 1, 0, 1, L, S_T); S.ht[1] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  const y = { fill: 'FFFF99' };
  tcsSet(S, 2, 0, BI('ETD per P.O.:', 'ETD theo P.O.:'), { b: true, border: false }); tcsMerge(S, 2, 0, 2, 1, { b: true, border: false });
  tcsSet(S, 2, 2, noPo ? '' : etdPerPo.join(' · '), y); tcsMerge(S, 2, 2, 2, 7, y);
  const fris = [...new Set(items.map(i => i.fri).filter(Boolean))].map(tcsFmt).join(' · ');
  tcsSet(S, 2, 8, BI('FRI:', 'FRI:'), { b: true, border: false }); tcsSet(S, 2, 9, fris, y); tcsMerge(S, 2, 9, 2, 13, y); S.ht[2] = 20;
  const H = [['Ref','Ref'],['Report no. / lab','Số báo cáo / PTN'],['Issued / tested','Ngày phát hành'],['Applicant','Người yêu cầu'],['Supplier ref stated?','Có mã NCC?'],['Specimen as tested','Mẫu thử'],['Tests and result','Phép thử và kết quả'],['Type','Loại'],
    ['1 Lab competence','1 Năng lực PTN'],['2 Report integrity','2 Tính toàn vẹn'],['3 Specimen ↔ item (P-6)','3 Mẫu ↔ mặt hàng (P-6)'],['4 Applicant / supplier ref (K-3)','4 Người yêu cầu / mã NCC (K-3)'],['5 Standard edition','5 Phiên bản tiêu chuẩn'],['6 Scope (K-2)','6 Phạm vi (K-2)'],['7 Results vs limits','7 Kết quả so với giới hạn'],['8 Validity (K-1)','8 Hiệu lực (K-1)'],['9 Remarks','9 Ghi chú'],['10 Usable for the TCF','10 Dùng được cho TCF'],
    ['Verdict','Kết luận'],['Accepted for (item / component)','Chấp nhận cho (mặt hàng / chi tiết)'],['Conditions to close','Điều kiện để đóng'],['Valid until (issue + 2 years)','Hiệu lực đến (phát hành + 2 năm)'],['ETD (items covered)','ETD (mặt hàng liên quan)'],['Valid at ETD?','Còn hiệu lực tại ETD?'],['Report file','Tệp báo cáo']];
  H.forEach((h, c) => tcsSet(S, 4, c, BI(h[0], h[1]), S_H)); S.ht[4] = tcsHt(TCS.lang === 'bi' ? 4 : 2); S.freeze = { r: 4, c: 2 }; S.titles = '$4:$4';
  let r = 5;
  if (!TCS.reports.length) {
    const t = BI('No test report, certificate or declaration received – register each document here when received (one row per unique document R1…Rn).', 'Chưa nhận báo cáo thử nghiệm, chứng chỉ hay tuyên bố nào – đăng ký từng tài liệu tại đây khi nhận (mỗi tài liệu một dòng R1…Rn).');
    tcsSet(S, r, 0, t, {}); tcsMerge(S, r, 0, r, L, {}); S.ht[r] = tcsHt(2); r++;
  }
  const sym = s => ({ fill: s[0] === '✓' ? 'C6EFCE' : s[0] === '~' ? 'FFEB9C' : s[0] === '✗' ? 'FFC7CE' : 'EDEDED' });
  TCS.reports.forEach(rep => {
    const covers = rep.cover, tests = [...new Set(items.flatMap(i => i.reqs.filter(q => q.kw && q.kw.test(rep.text)).map(q => q.en.split(/[(:–]/)[0].trim())))];
    const refs = covers.map(c => `item ${c.it.n} ${c.it.sref || ''}: ${c.refOk ? '✓' : '✗'}`).join('\n') || '✗ item not identified';
    const verdOk = rep.verdict.startsWith('ACCEPTED'), exp = rep.valid && rep.etd && rep.valid < rep.etd;
    const checks = [
      rep.kind === 'accr' ? '✓ accreditation certificate' : rep.accredited ? '✓ accreditation stated – scope schedule to verify' : '~ accreditation not stated – verify the lab scope',
      '~ QS to read the full report (conclusion vs body, sums vs components)',
      covers.length ? `✓ item ${covers.map(c => c.it.n).join(', ')}` : '✗ item not identified',
      covers.length && covers.every(c => c.refOk) ? '✓ supplier ref stated' : '✗ supplier ref missing (K-3)',
      '~ verify the edition cited',
      tests.length ? '✓ ' + tests.join('; ') : '~ scope to confirm',
      rep.fail ? '✗ failed result' : '~ QS to confirm results vs limits',
      !rep.valid ? '~ issue date not readable' : exp ? `✗ expires ${tcsFmt(rep.valid)} before ETD ${tcsFmt(rep.etd)}` : `✓ valid to ${tcsFmt(rep.valid)}`,
      '~ check remarks / limitations',
      verdOk ? '✓' : rep.verdict.startsWith('CONDITIONAL') ? '~' : '✗',
    ];
    const cond = rep.verdict.startsWith('NOT ACCEPTED – supplier') ? 'Lab / issuer to amend with the supplier ref (K-3)' : rep.verdict.includes('expires') ? 'Retest ASAP (K-2) – report expires before ETD (K-1)' : rep.verdict.includes('failed') ? 'Root cause, correction and retest' : rep.verdict.startsWith('CONDITIONAL') ? 'QS check: signature, stamp, signed PDF, components, issue date' : rep.verdict.includes('not identified') ? 'Supplier to state which item (supplier ref) the document covers' : '';
    const row = [rep.R, `${rep.no || '—'}\n${rep.lab || ''}`.trim(), rep.issue ? tcsSerial(rep.issue) : '', rep.applicant, refs, covers.map(c => `item ${c.it.n} ${c.it.name}`).join('\n'), tests.join('; ') + (rep.fail ? '\nFAIL found in the text' : ''), rep.kind === 'test' ? 'Test report' : rep.kind === 'doc' ? 'Document' : 'Supporting', ...checks, rep.verdict, verdOk ? covers.map(c => 'item ' + c.it.n).join(', ') : '', cond];
    row.forEach((v, c) => tcsSet(S, r, c, v, c >= 8 && c <= 17 ? sym(String(v)) : c === 2 ? { date: true } : c === 18 ? { b: true, fill: verdOk ? 'C6EFCE' : rep.verdict.startsWith('CONDITIONAL') ? 'FFEB9C' : 'FFC7CE' } : {}));
    tcsSet(S, r, 21, rep.valid ? tcsSerial(rep.valid) : '', { date: true }, `IF(C${r}="","",DATE(YEAR(C${r})+2,MONTH(C${r}),DAY(C${r})))`);
    tcsSet(S, r, 22, rep.etd ? tcsSerial(rep.etd) : '', { date: true });
    tcsSet(S, r, 23, !rep.etd ? 'ETD not yet available' : rep.valid ? (rep.valid >= rep.etd ? 'Yes' : 'No') : '', { h: 'center' }, `IF(W${r}="","ETD not yet available",IF(V${r}="","",IF(V${r}>=W${r},"Yes","No")))`);
    tcsSet(S, r, 24, rep.name, {});
    S.ht[r] = tcsHt(Math.max(...row.map((v, c) => tcsLines(typeof v === 'number' ? '' : v, W[c])))); r++;
  });
  if (TCS.reports.length) { r++; const vs = {}; TCS.reports.forEach(x => { const k = x.verdict.split(' – ')[0]; vs[k] = (vs[k] || 0) + 1; });
    const t = 'Overall: ' + Object.entries(vs).map(([k, n]) => `${n} ${k}`).join(' · ') + '. Product tests need evidence on the item itself or an identical part (C-5).'; tcsSet(S, r, 0, t, { b: true }); tcsMerge(S, r, 0, r, L, { b: true }); S.ht[r] = 20; r++; }
  r++; tcsKeyBlock(S, r, L);
}
function tcsPlanSheet(sheets, items){
  const W = [7, 40, 22, 40, 13, 18, 16, 16, 13, 13, 14, 40];
  const S = tcsSheet('Test plan', W); sheets.push(S); const L = W.length - 1;
  tcsSet(S, 1, 0, BI('Test plan – open test and document jobs (existing valid reports used first, K-2)', 'Kế hoạch thử nghiệm – các việc thử nghiệm và tài liệu còn mở (ưu tiên báo cáo còn hiệu lực, K-2)'), S_T); tcsMerge(S, 1, 0, 1, L, S_T); S.ht[1] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  const H = [['Job','Việc'],['Test','Phép thử'],['Sample (item)','Mẫu (mặt hàng)'],['Items covered – pictures and supplier refs on the report','Mặt hàng liên quan – hình và mã NCC trên báo cáo'],['Evidence type','Loại bằng chứng'],['Testing by (acceptable)','Đơn vị thử nghiệm được chấp nhận'],['PIC','Người phụ trách'],['Sample / test start by','Gửi mẫu / bắt đầu thử trước'],['Report due (ETD − 45 d)','Hạn báo cáo (ETD − 45 ngày)'],['Status','Tình trạng'],['Earliest ETD (items covered)','ETD sớm nhất (mặt hàng liên quan)'],['Due per item (ETD − 45 d)','Hạn theo mặt hàng (ETD − 45 ngày)']];
  H.forEach((h, c) => tcsSet(S, 2, c, BI(h[0], h[1]), S_H)); S.ht[2] = tcsHt(TCS.lang === 'bi' ? 4 : 2); S.freeze = { r: 2, c: 1 }; S.titles = '$2:$2';
  // material tests grouped by the same material text (P-6); product tests per item; J7 per item
  const groups = [];
  items.forEach(it => it.reqs.filter(q => q.st !== 'ACCEPTED' && (q.type !== 'doc' || q.id === 'ai') && q.job).forEach(q => {
    const mat = tcsNorm((it.offer && it.offer.mat) || '') + (it.f.coex ? 'coex' : it.f.single ? 'single' : '');
    const gk = q.id === 'pack' && q.rv !== 'exp' ? `pack|${it.f.pack}` : q.type === 'mat' && mat && q.rv !== 'exp' ? `${q.id}|${mat}` : `${q.id}|item${it.n}`;   // one packaging sample per packaging type
    let g0 = groups.find(x => x.k === gk); if (!g0) groups.push(g0 = { k: gk, q, items: [] }); g0.items.push({ it, q });
  }));
  groups.sort((a, b) => a.q.job.localeCompare(b.q.job) || a.items[0].it.n - b.items[0].it.n);
  let r = 3;
  groups.forEach(gp => {
    const its = gp.items.map(x => x.it), etds = its.map(i => i.etd).filter(Boolean).sort(), e0 = etds[0] || '', sample = its.slice().sort((a, b) => String(a.etd || '9').localeCompare(String(b.etd || '9')))[0];
    const q = gp.q, retest = gp.items.find(x => x.q.rv === 'exp');
    const testTxt = (retest ? BI(`Retest ASAP – ${retest.q.ev.r.R} expires ${tcsFmt(retest.q.ev.r.valid)}${retest.it.etd ? ' before ETD ' + tcsFmt(retest.it.etd) : ''}: `, `Thử nghiệm lại ngay – ${retest.q.ev.r.R} hết hiệu lực ${tcsFmt(retest.q.ev.r.valid)}${retest.it.etd ? ' trước ETD ' + tcsFmt(retest.it.etd) : ''}: `) : '') + BI(q.en, q.vi);
    const covered = its.map(i => `item ${i.n} ${i.sref || ''}${i.ean ? ' / GTIN ' + i.ean : ''}`).join('\n') + (its.length > 1 ? '\n' + BI('(same material – identity statement C-2 or lab extension letter C-1 listing all supplier refs)', '(cùng vật liệu – cam kết đồng nhất C-2 hoặc thư mở rộng của PTN C-1 liệt kê mọi mã NCC)') : '');
    const byGroup = {}; its.forEach(i => { const d = i.etd ? tcsFmt(tcsAddDays(i.etd, -45)) : ''; if (d) (byGroup[d] = byGroup[d] || []).push(i.n); });
    const due = Object.entries(byGroup).map(([d, ns]) => `${ns.length > 1 ? 'items' : 'item'} ${ns.join(', ')}: ${d}`).join(' · ');
    const vals = [q.job, testTxt, `item ${sample.n} ${sample.sref || ''}\n${sample.name}`, covered, BI(TCS_TYPE[q.type][0], TCS_TYPE[q.type][1]), BI(TCS_BY[q.by][0], TCS_BY[q.by][1]), q.pic, retest ? 'ASAP' : '', null, BI('Open', 'Mở'), e0 ? tcsSerial(e0) : '', due];
    vals.forEach((v, c) => { if (c !== 8) tcsSet(S, r, c, v, c === 10 ? { date: true } : {}); });
    tcsSet(S, r, 8, e0 ? tcsSerial(tcsAddDays(e0, -45)) : '', { date: true }, `IF(K${r}="","",K${r}-45)`);
    S.ht[r] = tcsHt(Math.max(...vals.map((v, c) => tcsLines(typeof v === 'number' ? '' : v, W[c])))); r++;
  });
  if (!groups.length) { const t = BI('No open test job – every test line is covered by an existing valid report.', 'Không còn việc thử nghiệm mở – mọi dòng thử nghiệm đã có báo cáo còn hiệu lực.'); tcsSet(S, r, 0, t, {}); tcsMerge(S, r, 0, r, L, {}); S.ht[r] = 30; r++; }
  S.cf.push({ sqref: `I3:I${Math.max(r - 1, 3)}`, formula: 'AND($I3<>"",$I3<TODAY(),LEFT($J3,4)<>"Done",LEFT($J3,3)<>"N/A",LEFT($J3,9)<>"Cancelled")', color: 'C00000', b: true });
  r++; tcsKeyBlock(S, r, L);
}
function tcsRulesSheet(sheets, items){
  const W = [30, 70, 70]; const S = tcsSheet('Testing body rules', W); sheets.push(S); S.landscape = false;
  tcsSet(S, 1, 0, BI('Testing body rules (lab and / or internal)', 'Quy tắc đơn vị thử nghiệm (PTN và / hoặc nội bộ)'), S_T); tcsMerge(S, 1, 0, 1, 2, S_T); S.ht[1] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  [['Category','Phân loại'],['Applies to (this order)','Áp dụng cho (đơn hàng này)'],['Accepted evidence','Bằng chứng được chấp nhận']].forEach((h, c) => tcsSet(S, 2, c, BI(h[0], h[1]), S_H)); S.ht[2] = tcsHt(2);
  const used = by => [...new Set(items.flatMap(i => i.reqs.filter(q => q.by === by).map(q => q.en.split(/[(:–]/)[0].trim())))].join('; ') || '—';
  const rows = [
    ['lab', ['Report of a lab whose ISO/IEC 17025 accreditation scope covers the method.', 'Báo cáo của PTN có phạm vi công nhận ISO/IEC 17025 bao gồm phương pháp.']],
    ['wit', ['Lab report, or in-house report meeting IT-1…IT-5 witnessed and countersigned by A.R.E.N.A. QC (IT-6).', 'Báo cáo PTN, hoặc báo cáo nội bộ đạt IT-1…IT-5 có QC A.R.E.N.A. chứng kiến và ký xác nhận (IT-6).']],
    ['li', ['Lab report, or in-house report meeting IT-1…IT-5.', 'Báo cáo PTN, hoặc báo cáo nội bộ đạt IT-1…IT-5.']],
    ['qc', ['QC record: device ID, daily reference check, readings, photos; lab OES / XRF or mill cert 3.1 also accepted; supplier in-house OES = supporting only.', 'Hồ sơ QC: mã thiết bị, kiểm tra chuẩn hằng ngày, kết quả, hình ảnh; chấp nhận cả OES / XRF của PTN hoặc chứng chỉ vật liệu 3.1; OES nội bộ của NCC chỉ là hỗ trợ.']],
    ['doc', ['Signed document reviewed by QS, stating the supplier ref (K-3).', 'Tài liệu có ký được QS xem xét, có ghi mã NCC (K-3).']],
  ];
  let r = 3;
  rows.forEach(([k, ev]) => { const v = [BI(TCS_BY[k][0], TCS_BY[k][1]), used(k), BI(ev[0], ev[1])]; v.forEach((x, c) => tcsSet(S, r, c, x, c ? {} : { b: true })); S.ht[r] = tcsHt(Math.max(...v.map((x, c) => tcsLines(x, W[c])))); r++; });
  r++;
  const IT = [['IT-1 Written method = standard clause and criteria.', 'IT-1 Phương pháp bằng văn bản = điều khoản và tiêu chí của tiêu chuẩn.'], ['IT-2 Calibrated equipment, traceable certificate.', 'IT-2 Thiết bị đã hiệu chuẩn, có chứng nhận truy xuất.'], ['IT-3 Trained tester.', 'IT-3 Người thử được đào tạo.'], ['IT-4 Sample ID (supplier ref, Ally article no. / GTIN, batch) + photos before / after.', 'IT-4 Nhận diện mẫu (mã NCC, mã Ally / GTIN, lô) + hình trước / sau.'], ['IT-5 Raw data, pass / fail, signed by the factory QA manager.', 'IT-5 Dữ liệu gốc, đạt / không đạt, có chữ ký trưởng QA nhà máy.'], ['IT-6 A.R.E.N.A. QC witness (on site or live video) + countersign.', 'IT-6 QC A.R.E.N.A. chứng kiến (tại chỗ hoặc video trực tiếp) + ký xác nhận.'], ['IT-7 Failure, doubt or Ally request → ISO/IEC 17025 retest; the lab result prevails. Unless the Ally nominates a lab.', 'IT-7 Không đạt, nghi ngờ hoặc Ally yêu cầu → thử lại tại PTN ISO/IEC 17025; kết quả PTN được ưu tiên. Trừ khi Ally chỉ định PTN.']];
  tcsSet(S, r, 0, BI('In-house test conditions', 'Điều kiện thử nghiệm nội bộ'), S_H); tcsMerge(S, r, 0, r, 2, S_H); S.ht[r] = tcsHt(2); r++;
  IT.forEach(t => { const v = BI(t[0], t[1]); tcsSet(S, r, 0, v, {}); tcsMerge(S, r, 0, r, 2, {}); S.ht[r] = tcsHt(tcsLines(v, 170)); r++; });
}
function tcsLogSheet(sheets, blocks, S1, ally){
  const W = [7, 12, 12, 30, 22, 16, 7, 14, 14, 40, 13, 36, 40, 12];
  const S = tcsSheet('Validation log', W); sheets.push(S); const L = W.length - 1, today = tcsToday();
  tcsSet(S, 1, 0, BI('Validation log', 'Nhật ký thẩm định'), S_T); tcsMerge(S, 1, 0, 1, L, S_T);
  const rule = BI('Each supplier submission = one validation round, numbered from 1; new rounds are added below with the next number, never overwriting earlier rounds. An identical resubmission is still a new round, noted "identical to Val. #n – nothing changed".', 'Mỗi lần NCC nộp = một vòng thẩm định, đánh số từ 1; vòng mới được thêm bên dưới với số tiếp theo, không ghi đè vòng trước. Nộp lại giống hệt vẫn là vòng mới, ghi chú "giống Val. #n – không thay đổi".');
  tcsSet(S, 2, 0, rule, { border: false }); tcsMerge(S, 2, 0, 2, L, { border: false }); S.ht[2] = tcsHt(tcsLines(rule, 230));
  // rows of the log (document × requirement)
  const log = [];
  TCS.reports.forEach(rep => rep.cover.forEach(c => {
    const it = c.it;
    it.reqs.forEach(q => {
      const hit = q.kw && q.kw.test(rep.text);
      if (!hit && (q.type === 'doc' || rep.kind !== 'test')) return;
      let res, find, act = '';
      if (!hit) { res = 'Not covered'; find = 'Requirement not covered by this document'; act = q.action.en; }
      else if (rep.kind === 'accr') { res = 'Info'; find = 'Accreditation certificate (supporting)'; }
      else if (!c.refOk) { res = 'Rejected'; find = 'Supplier ref missing (K-3)'; act = `Lab / issuer to amend ${rep.R} with supplier ref ${it.sref}; re-submit.`; }
      else if (rep.fail) { res = 'Rejected'; find = 'Failed result'; act = 'Root cause, correction and retest ASAP.'; }
      else if (rep.kind === 'doc') { res = 'Partial'; find = 'Received – QS to check signature, stamp, components'; }
      else if (!rep.valid) { res = 'Partial'; find = 'Issue date not readable – QS to confirm validity'; }
      else if (it.etd && rep.valid < it.etd) { res = 'Rejected'; find = `Expires ${tcsFmt(rep.valid)} before ETD ${tcsFmt(it.etd)} (K-1)`; act = `Retest ASAP (K-2).`; }
      else { res = 'Accepted'; find = `Valid to ${tcsFmt(rep.valid)}${it.etd ? ' ≥ ETD ' + tcsFmt(it.etd) : ''}`; }
      log.push([1, tcsSerial(today), tcsSerial(today), rep.name, `${rep.no || ''}${rep.issue ? ' / ' + tcsFmt(rep.issue) : ''}`, rep.lab, it.n, it.sref, it.ally, q.en, res, find, act, res === 'Accepted' || res === 'Info' || !it.etd ? '' : tcsSerial(tcsAddDays(it.etd, -45))]);
    });
  }));
  const R1 = 4 + 3 + 3 + blocks.length + 3, LOG0 = R1 + 1, LOGN = 500;
  // summary by round
  let r = 4; tcsSet(S, r, 0, BI('Summary by round', 'Tổng hợp theo vòng'), { b: true, fill: 'D9E1F2' }); tcsMerge(S, r, 0, r, 7, { b: true, fill: 'D9E1F2' }); r++;
  const RES = ['Accepted', 'Partial', 'Rejected', 'Not covered', 'Not submitted', 'Info'];
  ['Val. #', 'Lines', ...RES].forEach((h, c) => tcsSet(S, r, c, h, S_H)); r++;
  tcsSet(S, r, 0, 1, { h: 'center' }); tcsSet(S, r, 1, log.length, { h: 'center' }, `COUNTIF($A$${LOG0}:$A$${LOGN},A${r})`);
  RES.forEach((x, i) => tcsSet(S, r, 2 + i, log.filter(l => l[10] === x).length, { h: 'center' }, `COUNTIFS($A$${LOG0}:$A$${LOGN},$A${r},$K$${LOG0}:$K$${LOGN},"${x}")`)); r += 2;
  // live status per item (from sheet 1)
  tcsSet(S, r, 0, BI('Current TCF status per item (live)', 'Trạng thái TCF hiện tại theo mặt hàng (trực tiếp)'), { b: true, fill: 'D9E1F2' }); tcsMerge(S, r, 0, r, 8, { b: true, fill: 'D9E1F2' }); S.ht[r] = tcsHt(TCS.lang === 'bi' ? 2 : 1); r++;
  ['Item', 'Supplier ref', 'TCF rows', 'Open', 'In progress', 'Done', 'N/A', 'Cancelled'].forEach((h, c) => tcsSet(S, r, c, h, S_H)); r++;
  const sn = `'${S1.name.replace(/'/g, "''")}'!`;
  blocks.forEach(b => { const Q = `${sn}$Q$${b.r0}:$Q$${b.r1}`, it = b.it;
    tcsSet(S, r, 0, it.n, { h: 'center' }, `${sn}A${b.r0}`); tcsSet(S, r, 1, it.sref, {}); tcsSet(S, r, 2, it.reqs.length, { h: 'center' }, `COUNTA(${Q})`);
    [['Open*', it.reqs.filter(q => !q.done).length], ['In progress*', 0], ['Done*', it.reqs.filter(q => q.done).length], ['N/A*', 0], ['Cancelled*', 0]].forEach(([k, v], i) => tcsSet(S, r, 3 + i, v, { h: 'center' }, `COUNTIF(${Q},"${k}")`)); r++; });
  r = R1;
  const LH = ['Val. #', 'Validation date', 'Date received', 'Document (file)', 'Doc. ref / issue date', 'Issued by', 'Item no.', 'Supplier item no.', `${ally} no.`, 'TCF requirement', 'Result', 'Findings', 'Action required (supplier)', 'Due'];
  LH.forEach((h, c) => tcsSet(S, r, c, h, S_H)); S.ht[r] = tcsHt(2); r++;
  const col = { Accepted: 'C6EFCE', Partial: 'FFEB9C', 'Not covered': 'FFEB9C', Rejected: 'FFC7CE', 'Not submitted': 'FFC7CE', Info: 'EDEDED' };
  log.forEach(l => { l.forEach((v, c) => tcsSet(S, r, c, v, c === 1 || c === 2 || c === 13 ? { date: true } : c === 10 ? { fill: col[v], b: true } : {})); S.ht[r] = tcsHt(Math.max(...l.map((v, c) => tcsLines(typeof v === 'number' ? '' : v, W[c])))); r++; });
  S.cf.push({ sqref: `N${LOG0}:N${LOGN}`, formula: `AND($N${LOG0}<>"",$N${LOG0}<TODAY(),$K${LOG0}<>"Accepted",$K${LOG0}<>"Info")`, color: 'C00000', b: true });
  S.titles = `$${R1}:$${R1}`;
}
function tcsCeSheets(sheets, items, ceItems, ally){
  const W = [8, 34, 60, 22, 26, 30, 16]; const S = tcsSheet('CE & DoC guideline', W); sheets.splice(1, 0, S); const L = W.length - 1;
  tcsSet(S, 1, 0, BI('CE marking and EC declaration of conformity – guideline', 'Dấu CE và Tuyên bố hợp quy EC – hướng dẫn'), S_T); tcsMerge(S, 1, 0, 1, L, S_T); S.ht[1] = tcsHt(TCS.lang === 'bi' ? 2 : 1);
  let r = 2; const sec = (en, vi) => { tcsSet(S, r, 0, BI(en, vi), S_H); tcsMerge(S, r, 0, r, L, S_H); S.ht[r] = tcsHt(TCS.lang === 'bi' ? 2 : 1); r++; };
  const para = (en, vi) => { const v = BI(en, vi); tcsSet(S, r, 0, v, {}); tcsMerge(S, r, 0, r, L, {}); S.ht[r] = tcsHt(tcsLines(v, 230)); r++; };
  sec('A. Which items need CE + DoC', 'A. Mặt hàng cần CE + DoC');
  items.forEach(it => para(`Item ${it.n} ${it.name} (${it.sref}): ${it.stream === 'toy' ? 'CE mandatory – Toy Safety Directive 2009/48/EC' : it.stream === 'ce' ? 'CE mandatory – the applicable CE act (LVD / EMC / RoHS …) to be confirmed' : 'NO CE – GPSR (EU) 2023/988; GPSR Art. 9 marking instead (CE on a non-CE product is misleading, Reg. (EC) 765/2008 Art. 30)'}.`,
    `Mặt hàng ${it.n} ${it.name} (${it.sref}): ${it.stream === 'toy' ? 'bắt buộc CE – Chỉ thị an toàn đồ chơi 2009/48/EC' : it.stream === 'ce' ? 'bắt buộc CE – văn bản CE áp dụng (LVD / EMC / RoHS …) cần xác nhận' : 'KHÔNG CE – GPSR (EU) 2023/988; ghi nhãn theo GPSR Điều 9 (CE trên sản phẩm không thuộc CE là gây hiểu nhầm, Quy định (EC) 765/2008 Điều 30)'}.`));
  sec('B. Roles', 'B. Vai trò');
  para(`${ally} = manufacturer (own brand): signs the DoC, keeps the technical documentation 10 years. Factory = producer: samples, material declaration, SDS, test reports, production control, applies the marking as specified. A.R.E.N.A. = validates, checks the marking at FRI, never signs.`, `${ally} = nhà sản xuất (thương hiệu riêng): ký DoC, lưu hồ sơ kỹ thuật 10 năm. Nhà máy = đơn vị sản xuất: mẫu, khai báo vật liệu, SDS, báo cáo thử nghiệm, kiểm soát sản xuất, in dấu theo quy định. A.R.E.N.A. = thẩm định, kiểm tra dấu tại FRI, không ký.`);
  sec('C. Steps (toys – TSD 2009/48/EC; adapt module / DoC model for other CE acts)', 'C. Các bước (đồ chơi – TSD 2009/48/EC; điều chỉnh mô-đun / mẫu DoC cho văn bản CE khác)');
  ['Step','Task','What to do / criterion','Who','Output (TCF)','Reference','Target'].forEach((h, c) => tcsSet(S, r, c, h, S_H)); S.ht[r] = 18; r++;
  const steps = [
    ['Classification', 'Toy = designed or intended for play by children under 14 (not public playground equipment, EN 1176).', ally, 'Classification note', 'TSD Art. 2'],
    ['Safety assessment', 'Physical / mechanical, flammability, chemical (CMR, element migration, PAH, phthalates, POPs), hygiene, electrical, radioactivity; decides warnings and age grading.', `${ally} (supplier input)`, 'Safety assessment', 'TSD Art. 18'],
    ['Conformity route', 'Internal production control only when harmonised standards cover ALL hazards and are applied in full; otherwise EC-type examination by a notified body.', ally, 'Route decision', 'TSD Art. 19(2) / 19(3)'],
    ['Tests', 'Cited EN 71 parts on samples from the approved / new tooling; existing valid reports first (K-2), supplier ref on every report (K-3).', 'Supplier / lab', 'Test reports', 'EN 71-1, -2, -3'],
    ['Technical documentation', 'Annex IV a–g: design and manufacture, safety assessment, conformity route, test reports, copy of the DoC, addresses.', ally, 'Technical file', 'TSD Annex IV'],
    ['EC DoC', 'Annex III model, colour image of the toy, language of each Member State of sale; see sheet EC DoC template.', ally, 'Signed DoC', 'TSD Art. 15, Annex III'],
    ['CE marking', 'Visible, legible, ≥ 5 mm, on the toy / label / packaging; also on the packaging if not visible through it.', 'Supplier (prints) / ' + ally, 'Approved artwork', 'TSD Art. 16–17; Reg. (EC) 765/2008 Annex II'],
    ['Traceability and manufacturer marking', 'Type / batch, manufacturer name, trade mark, postal address, electronic contact, GTIN.', 'Supplier / ' + ally, 'Approved artwork', 'TSD Art. 4(5), 4(6)'],
    ['Warnings and instructions', '"Warning" / "Achtung"; decided in the safety assessment, no copied generic age warnings; instructions and assembly instruction.', ally, 'Approved artwork', 'TSD Art. 11, Annex V'],
    ['Series conformity and FRI', 'Retest on material / mould / supplier change; A.R.E.N.A. QC checks marking and warnings at FRI.', 'Supplier / A.R.E.N.A. QC', 'FRI report', 'TSD Art. 4(1)'],
    ['Retention', 'Technical documentation and DoC kept 10 years after placing on the market.', ally, 'Archive', 'TSD Art. 4(3)'],
    ['Outlook', 'Toy Safety Regulation (EU) 2025/2509 applies from 1 Aug 2030: digital product passport replaces the DoC; TSD toys placed earlier stay available.', ally, 'Plan', 'Reg. (EU) 2025/2509'],
  ];
  const tgt = ceItems.map(i => i.etd).filter(Boolean).sort()[0];
  steps.forEach((s, i) => { const v = [i + 1, s[0], s[1], s[2], s[3], s[4], tgt ? tcsSerial(tcsAddDays(tgt, -45)) : '']; v.forEach((x, c) => tcsSet(S, r, c, x, c === 6 ? { date: true } : c === 0 ? { h: 'center' } : {})); S.ht[r] = tcsHt(Math.max(...v.map((x, c) => tcsLines(typeof x === 'number' ? '' : x, W[c])))); r++; });
  sec('D. CE artwork specification', 'D. Quy cách artwork dấu CE');
  para('CE logo per Reg. (EC) 765/2008 Annex II, proportions kept, height ≥ 5 mm; notified-body number only if a notified body is involved; on the product label and the packaging, next to the traceability data; A.R.E.N.A. QC checks presence and legibility at FRI. GPSR items: no CE anywhere.', 'Logo CE theo Quy định (EC) 765/2008 Phụ lục II, giữ tỷ lệ, cao ≥ 5 mm; số tổ chức thông báo chỉ khi có tổ chức thông báo; trên nhãn sản phẩm và bao bì, cạnh thông tin truy xuất; QC A.R.E.N.A. kiểm tra tại FRI. Mặt hàng GPSR: không có CE ở bất kỳ đâu.');
  para('Standards to cite – verify every edition and transition date against the Official Journal before use (EUR-Lex): EN 71-1:2014+A1:2018, EN 71-2:2020, EN 71-3:2019+A2:2024 (Impl. Dec. (EU) 2023/740 as amended by (EU) 2025/2519; EN 71-3:2019+A1:2021 listed until 16 Jun 2027).', 'Tiêu chuẩn trích dẫn – kiểm tra phiên bản và ngày chuyển tiếp với Công báo EU trước khi dùng (EUR-Lex): EN 71-1:2014+A1:2018, EN 71-2:2020, EN 71-3:2019+A2:2024 (Quyết định thực thi (EU) 2023/740 sửa đổi bởi (EU) 2025/2519; EN 71-3:2019+A1:2021 còn trong danh mục đến 16/06/2027).');
  // EC DoC template
  const T = tcsSheet('EC DoC template', [6, 30, 52, 52, 40]); sheets.splice(2, 0, T); T.landscape = false;
  tcsSet(T, 1, 0, BI('EC declaration of conformity – template (TSD Annex III); [___] = filled by the manufacturer (Ally), never by A.R.E.N.A.', 'Mẫu Tuyên bố hợp quy EC (TSD Phụ lục III); [___] = nhà sản xuất (Ally) điền, không bao giờ do A.R.E.N.A.'), S_T); tcsMerge(T, 1, 0, 1, 4, S_T); T.ht[1] = tcsHt(TCS.lang === 'bi' ? 3 : 2);
  ['No.', 'Element', 'English text', 'Deutsch (market language – confirm)', BI('Fill-in source / QS check', 'Nguồn điền / QS kiểm tra')].forEach((h, c) => tcsSet(T, 2, c, h, S_H)); T.ht[2] = tcsHt(2);
  const doc = [
    ['', 'Title', 'EC declaration of conformity', 'EG-Konformitätserklärung', ['Fixed text', 'Văn bản cố định']],
    ['1', 'Unique identification of the toy', 'Product / type / batch: [___]; GTIN [___]', 'Produkt / Typ / Charge: [___]; GTIN [___]', ['Ally: product number, batch; supplier ref in the technical file', 'Ally: mã sản phẩm, lô; mã NCC trong hồ sơ kỹ thuật']],
    ['2', 'Manufacturer', 'Name and address of the manufacturer: [___]', 'Name und Anschrift des Herstellers: [___]', ['Ally (own brand) – never the supplier or A.R.E.N.A.', 'Ally (thương hiệu riêng) – không phải NCC hay A.R.E.N.A.']],
    ['3', 'Sole responsibility', 'This declaration of conformity is issued under the sole responsibility of the manufacturer.', 'Die alleinige Verantwortung für die Ausstellung dieser Konformitätserklärung trägt der Hersteller.', ['Fixed text', 'Văn bản cố định']],
    ['4', 'Object of the declaration', 'Toy identification allowing traceability, incl. a colour image: [___]', 'Gegenstand der Erklärung (Identifizierung zur Rückverfolgbarkeit, mit Farbabbildung): [___]', ['Colour image mandatory', 'Bắt buộc hình màu']],
    ['5', 'Union legislation', 'The object described above is in conformity with Directive 2009/48/EC.', 'Der oben beschriebene Gegenstand erfüllt die Richtlinie 2009/48/EG.', ['CE legislation only (REACH / GPSR are not CE acts)', 'Chỉ văn bản CE (REACH / GPSR không phải văn bản CE)']],
    ['6', 'Harmonised standards', 'EN 71-1:2014+A1:2018; EN 71-2:2020; EN 71-3:2019+A2:2024 [verify against the OJ]', 'EN 71-1:2014+A1:2018; EN 71-2:2020; EN 71-3:2019+A2:2024 [mit dem ABl. abgleichen]', ['Editions and dates as cited in the OJ', 'Phiên bản và ngày theo Công báo EU']],
    ['7', 'Notified body', 'Not applicable – internal production control (Art. 19(2)) [or: notified body name, number, EC-type examination certificate]', 'Nicht zutreffend – interne Fertigungskontrolle (Art. 19(2)) [oder: benannte Stelle, Nummer, EG-Baumusterprüfbescheinigung]', ['From the conformity route decision', 'Theo quyết định quy trình đánh giá']],
    ['8', 'Additional information', 'Test reports: [report numbers, labs, dates]', 'Prüfberichte: [Nummern, Labore, Daten]', ['From sheet Report validation (ACCEPTED reports)', 'Từ sheet Report validation (báo cáo CHẤP NHẬN)']],
    ['', 'Signature', 'Signed for and on behalf of: [___]; place and date: [___]; name, function: [___]; signature: [___]', 'Unterzeichnet für und im Namen von: [___]; Ort und Datum: [___]; Name, Funktion: [___]; Unterschrift: [___]', ['Ally signatory', 'Người ký của Ally']],
  ];
  doc.forEach((d, i) => { const v = [d[0], d[1], d[2], d[3], BI(d[4][0], d[4][1])]; v.forEach((x, c) => tcsSet(T, 3 + i, c, x, c === 1 ? { b: true } : {})); T.ht[3 + i] = tcsHt(Math.max(...v.map((x, c) => tcsLines(x, T.cols[c])))); });
}
