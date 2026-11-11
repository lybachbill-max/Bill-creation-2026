// Word-HTML (.doc) → real Word .docx, for the private-link edition (the link refuses .doc files).
// The HTML is rendered in a hidden frame; paragraphs, runs and tables are written from the browser's computed styles
// (colours, shading, bold/italic, font size, alignment, borders, merged cells, page breaks, landscape @page).
// Uses the IQS's own Word writer friDocx() and escaper friX().
window.iqsHtmlToDocx = async function(html){
  const landscape = /mso-page-orientation\s*:\s*landscape|size\s*:\s*29\.7cm\s+21cm/i.test(html);
  const pageW = landscape ? 16838 : 11906, margin = 1134, textW = pageW - 2 * margin;  // twips, 2 cm margins
  const fr = document.createElement('iframe');
  fr.setAttribute('aria-hidden', 'true');
  fr.style.cssText = `position:fixed;left:-20000px;top:0;width:${Math.round(textW / 15)}px;height:800px;border:0;visibility:hidden`;
  document.body.appendChild(fr);
  try {
    await new Promise(ok => { fr.onload = ok; fr.srcdoc = html.replace(/^﻿/, ''); });
    const d = fr.contentDocument, win = fr.contentWindow, X = friX;
    const cs = el => win.getComputedStyle(el);
    const hex = c => { const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (!m || (m[4] !== undefined && +m[4] < 0.1)) return null;
      return [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('').toUpperCase(); };
    const BLOCK = /^(block|flex|grid|table|list-item|flow-root)$/;
    const isBlock = el => el.nodeType === 1 && (BLOCK.test(cs(el).display) || /^(TABLE|P|DIV|H[1-6]|UL|OL|LI|SECTION|ARTICLE|HEADER|FOOTER|HR)$/.test(el.tagName));
    const hidden = el => el.nodeType === 1 && (cs(el).display === 'none' || /^(STYLE|SCRIPT|HEAD|TITLE|META)$/.test(el.tagName));
    const brd = (w, st, c) => parseFloat(w) > 0 && st !== 'none' && st !== 'hidden' ? `w:val="single" w:sz="${Math.max(2, Math.min(24, Math.round(parseFloat(w) * 6)))}" w:space="0" w:color="${hex(c) || '000000'}"` : 'w:val="nil"';

    function run(text, el){
      const s = cs(el), rp = [];
      if (parseInt(s.fontWeight) >= 600) rp.push('<w:b/>');
      if (s.fontStyle === 'italic') rp.push('<w:i/>');
      if (/underline/.test(s.textDecorationLine || s.textDecoration)) rp.push('<w:u w:val="single"/>');
      const c = hex(s.color); if (c && c !== '000000') rp.push(`<w:color w:val="${c}"/>`);
      const hp = Math.round(parseFloat(s.fontSize) * 1.5); if (hp) rp.push(`<w:sz w:val="${hp}"/><w:szCs w:val="${hp}"/>`);
      if (/uppercase/.test(s.textTransform)) text = text.toUpperCase();
      const pre = /pre/.test(s.whiteSpace);
      const parts = pre ? text.split('\n') : [text];
      return parts.map((t, i) => (i ? '<w:r><w:br/></w:r>' : '') + (t ? `<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>${rp.join('')}</w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>` : '')).join('');
    }
    function inlineRuns(nodes){
      let out = '';
      nodes.forEach(n => {
        if (n.nodeType === 3) { const pre = /pre/.test(cs(n.parentElement).whiteSpace); const t = pre ? n.textContent : n.textContent.replace(/\s+/g, ' '); if (t) out += run(t, n.parentElement); }
        else if (n.nodeType === 1 && !hidden(n)) {
          if (n.tagName === 'BR') out += '<w:r><w:br/></w:r>';
          else if (n.tagName === 'IMG') { if (n.alt) out += run(`[${n.alt}]`, n); }
          else if (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName)) out += run(n.value || '', n);
          else out += inlineRuns([...n.childNodes]);
        }
      });
      return out;
    }
    function pPr(el, shade){
      const s = cs(el), p = [];
      const bl = parseFloat(s.borderLeftWidth) > 0 && s.borderLeftStyle !== 'none', bt = parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' && el.tagName !== 'TD' && el.tagName !== 'TH';
      if (bl || bt) p.push(`<w:pBdr>${bt ? `<w:top ${brd(s.borderTopWidth, s.borderTopStyle, s.borderTopColor)}/>` : ''}${bl ? `<w:left ${brd(s.borderLeftWidth, s.borderLeftStyle, s.borderLeftColor)}/>` : ''}</w:pBdr>`);
      if (shade) p.push(`<w:shd w:val="clear" w:color="auto" w:fill="${shade}"/>`);
      const after = Math.min(400, Math.round((parseFloat(s.marginBottom) || 0) * 15)), before = Math.min(400, Math.round((parseFloat(s.marginTop) || 0) * 15));
      p.push(`<w:spacing w:before="${before}" w:after="${after}" w:line="252" w:lineRule="auto"/>`);
      const ind = Math.round((parseFloat(s.paddingLeft) || 0) * 15); if (ind && el.tagName !== 'TD' && el.tagName !== 'TH') p.push(`<w:ind w:left="${Math.min(ind, 1440)}"/>`);
      const a = { center:'center', right:'right', end:'right', justify:'both' }[s.textAlign]; if (a) p.push(`<w:jc w:val="${a}"/>`);
      return `<w:pPr>${p.join('')}</w:pPr>`;
    }
    const para = (el, runs, shade) => `<w:p>${pPr(el, shade)}${runs}</w:p>`;
    const pageBreak = el => { const s = cs(el); return s.breakAfter === 'page' || /always|page/.test(s.pageBreakAfter || '') || /page-break-after\s*:\s*always/i.test(el.getAttribute('style') || ''); };

    function blocks(el, shade){
      if (hidden(el)) return '';
      if (el.tagName === 'TABLE') return table(el);
      if (el.tagName === 'HR') return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr></w:pPr></w:p>';
      const own = hex(cs(el).backgroundColor); if (own && el !== d.body) shade = own;
      const kids = [...el.childNodes];
      let out = '';
      if (!kids.some(k => isBlock(k) && !hidden(k))) {
        let runs = inlineRuns(kids);
        if (el.tagName === 'LI') runs = run(el.parentElement && el.parentElement.tagName === 'OL' ? `${[...el.parentElement.children].indexOf(el) + 1}. ` : '• ', el) + runs;
        if (runs || el !== d.body) out = para(el, runs, shade);
      } else {
        let buf = [];
        const flush = () => { const r = inlineRuns(buf); if (r.replace(/<w:r><w:rPr>.*?<\/w:rPr><w:t xml:space="preserve"> ?<\/w:t><\/w:r>/g, '')) out += para(el, r, shade); buf = []; };
        kids.forEach(k => { if (isBlock(k)) { flush(); out += blocks(k, shade); } else buf.push(k); });
        flush();
      }
      if (pageBreak(el)) out += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      return out;
    }
    function table(t){
      const rows = [...t.rows].filter(r => !hidden(r));
      if (!rows.length) return '';
      // grid occupancy (rowspan / colspan)
      const grid = [], cells = [];
      rows.forEach((r, ri) => { grid[ri] = grid[ri] || []; let c = 0;
        [...r.cells].filter(x => !hidden(x)).forEach(td => { while (grid[ri][c]) c++;
          const cspan = Math.max(1, td.colSpan || 1), rspan = Math.max(1, td.rowSpan || 1);
          for (let i = 0; i < rspan; i++) for (let j = 0; j < cspan; j++) { grid[ri + i] = grid[ri + i] || []; grid[ri + i][c + j] = i === 0 && j === 0 ? td : { cont: td, first: j === 0 }; }
          cells.push(td); c += cspan; }); });
      const nCols = Math.max(...grid.map(r => r.length));
      const tw = t.getBoundingClientRect().width || 1, scale = Math.min(1, textW / (tw * 15));
      // column widths from single-span cells
      const colW = new Array(nCols).fill(0);
      grid.forEach(r => r.forEach((x, ci) => { if (x && x.tagName && (x.colSpan || 1) === 1) colW[ci] = Math.max(colW[ci], x.getBoundingClientRect().width); }));
      const known = colW.reduce((a, b) => a + b, 0), missing = colW.filter(w => !w).length;
      for (let i = 0; i < nCols; i++) if (!colW[i]) colW[i] = missing ? Math.max(20, (tw - known) / missing) : tw / nCols;
      const tw2 = colW.reduce((a, b) => a + b, 0), twips = colW.map(w => Math.max(200, Math.round(w / tw2 * Math.min(textW, tw * 15 * scale))));
      let out = `<w:tbl><w:tblPr><w:tblW w:w="${twips.reduce((a, b) => a + b, 0)}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${twips.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`;
      grid.forEach((r, ri) => {
        const head = ri === 0 && [...rows[ri].cells].every(c => c.tagName === 'TH');
        const hPx = Math.max(0, ...[...rows[ri].cells].map(c => /height/i.test(c.getAttribute('style') || '') ? c.getBoundingClientRect().height : 0));
        out += `<w:tr><w:trPr>${head ? '<w:tblHeader/>' : ''}<w:cantSplit/>${hPx ? `<w:trHeight w:val="${Math.round(hPx * 15)}" w:hRule="atLeast"/>` : ''}</w:trPr>`;
        for (let ci = 0; ci < nCols; ci++) {
          const x = r[ci];
          if (!x) { out += `<w:tc><w:tcPr><w:tcW w:w="${twips[ci]}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`; continue; }
          if (!x.tagName) { if (!x.first) continue; const td = x.cont, span = Math.max(1, td.colSpan || 1);   // continued rowspan
            out += `<w:tc><w:tcPr><w:tcW w:w="${twips.slice(ci, ci + span).reduce((a, b) => a + b, 0)}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ''}<w:vMerge/>${tcStyle(td)}</w:tcPr><w:p/></w:tc>`; continue; }
          const span = Math.max(1, x.colSpan || 1);
          const body = blocks(x, null) || '<w:p/>';
          out += `<w:tc><w:tcPr><w:tcW w:w="${twips.slice(ci, ci + span).reduce((a, b) => a + b, 0)}" w:type="dxa"/>${span > 1 ? `<w:gridSpan w:val="${span}"/>` : ''}${(x.rowSpan || 1) > 1 ? '<w:vMerge w:val="restart"/>' : ''}${tcStyle(x)}</w:tcPr>${body.endsWith('</w:p>') ? body : body + '<w:p/>'}</w:tc>`;
        }
        out += '</w:tr>';
      });
      out += '</w:tbl>';
      const after = Math.round((parseFloat(cs(t).marginBottom) || 0) * 15);
      return out + `<w:p><w:pPr><w:spacing w:before="0" w:after="${Math.min(200, after)}" w:line="120" w:lineRule="exact"/></w:pPr></w:p>`;
    }
    function tcStyle(td){
      const s = cs(td), sh = hex(s.backgroundColor);
      const b = ['Top', 'Left', 'Bottom', 'Right'].map(k => `<w:${k.toLowerCase()} ${brd(s['border' + k + 'Width'], s['border' + k + 'Style'], s['border' + k + 'Color'])}/>`).join('');
      const va = { middle:'center', bottom:'bottom' }[s.verticalAlign];
      return `<w:tcBorders>${b}</w:tcBorders>${sh ? `<w:shd w:val="clear" w:color="auto" w:fill="${sh}"/>` : ''}${va ? `<w:vAlign w:val="${va}"/>` : ''}`;
    }
    const body = blocks(d.body, null) || '<w:p/>';
    const margins = `<w:pgMar w:top="${margin}" w:right="${margin}" w:bottom="${margin}" w:left="${margin}" w:header="567" w:footer="567" w:gutter="0"/>`;
    return friDocx(body, landscape, [], { margins });
  } finally { fr.remove(); }
};
