/* The sheet, Word document and HTML clipboard share one ordered document model. */
window.AxialCharacterExport = (() => {
  'use strict';

  const wordNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const relNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const wordMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  function escapeText(value) {
    return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function paragraphs(text) {
    return String(text ?? '').split(/\r\n?|\n/).map(line => line.trim()).filter(Boolean);
  }

  function inventoryRow(item) {
    const struct = typeof item === 'string' ? item : String(item.struct ?? '');
    const split = struct.indexOf('|');
    if (split >= 0 && (!item.name || struct.slice(0, split).trim() === item.name)) {
      return [struct.slice(0, split).trim(), struct.slice(split + 1).trim()];
    }
    return [item.name || struct, item.name === struct || !item.name ? '' : struct];
  }

  function sheetBlocks(c) {
    const name = c.name?.trim() || 'Unnamed character';
    const blocks = [];
    const heading = text => blocks.push({ kind: 'heading', text });
    const line = text => blocks.push({ kind: 'text', text });
    const blank = (count = 1, field = '') => blocks.push({ kind: 'blank', count, field });
    const table = (rows, widths, style, fields = []) => blocks.push({ kind: 'table', rows, widths, style, fields });
    const identity = [c.pronouns, c.age != null && c.age !== '' ? `Age ${c.age}` : '', c.player && `Player: ${c.player}`].filter(Boolean);
    blocks.push({ kind: 'label', text: 'Axial character sheet' }, { kind: 'title', text: name });
    if (identity.length) blocks.push({ kind: 'subtitle', text: identity.join('   /   ') });
    paragraphs(c.concept).forEach(line);
    const history = [
      c.birth && `${c.birth} birth trait`, c.early && `${c.early} early lifepath`,
      ...(c.mains || []).map(m => {
        const choices = [m.years != null && m.years !== '' && `+${m.years} years`, m.skillChoice && `+1 ${m.skillChoice}`, m.power].filter(Boolean);
        return choices.length ? `${m.key} (${choices.join(', ')})` : m.key;
      })
    ].filter(Boolean);
    if (history.length) blocks.push({ kind: 'history', text: history.join('   /   ') });

    heading('Vitals');
    const values = Object.entries(c.vitals || {});
    const statRows = [];
    for (let i = 0; i < values.length; i += 3) {
      const cells = values.slice(i, i + 3).map(([label, value]) => ({ label, value }));
      while (cells.length < 3) cells.push({ label: '', value: '' });
      statRows.push(cells);
    }
    if (statRows.length) table(statRows, [33, 34, 33], 'stats');
    else blank();

    heading('Skills');
    const skills = Object.entries(c.skills || {});
    const skillRows = [];
    const half = Math.ceil(skills.length / 2);
    for (let i = 0; i < half; i++) skillRows.push([...skills[i], ...(skills[i + half] || ['', ''])]);
    if (skillRows.length) table(skillRows, [34, 16, 34, 16], 'skills', ['', 'Skill die', '', 'Skill die']);
    else blank();

    heading('Talents');
    const categories = new Map();
    for (const t of c.talents || []) {
      const category = t.category || 'Other';
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category).push(t);
    }
    const talentRows = [];
    for (const [category, list] of categories) {
      for (let i = 0; i < list.length; i += 2) {
        talentRows.push([i ? '' : category, list[i].name, list[i].die, list[i + 1]?.name || '', list[i + 1]?.die || '']);
      }
    }
    table(talentRows.length ? talentRows : [['', '', '', '', '']], [20, 28, 12, 28, 12], 'list',
      ['Talent category', 'Talent', 'Talent die', 'Talent', 'Talent die']);

    heading('Bonds');
    const bonds = (c.bonds || []).filter(b => b.text?.trim() || b.target?.trim());
    table(bonds.length ? bonds.map(b => [[b.type, b.target].filter(Boolean).join(' / '), b.text]) : [['', ''], ['', '']],
      [24, 76], 'list', ['Bond type and target', 'Bond']);
    heading('Wounds and scars');
    if (c.wounds) line(`Wounds — ${c.wounds}`);
    if (c.scars) line(`Scars — ${c.scars}`);
    blank(1, 'Wounds and scars');

    blocks.push({ kind: 'page', text: name });
    heading('Inventory');
    if (c.kit) blocks.push({ kind: 'subtitle', text: c.kit });
    table(c.gear?.length ? c.gear.map(inventoryRow) : [['', ''], ['', '']], [36, 64], 'list', ['Item', 'Object struct']);
    heading('Powers');
    if (c.powers?.length) {
      for (const p of c.powers) {
        const fields = [p.scope === 'Starship' && p.scope, p.type, p.cooldown, p.speed].filter(Boolean);
        blocks.push({ kind: 'power', text: p.name, metadata: fields.join(' | ') });
        const rich = window.AxialPowerText?.blocks(p) ||
          paragraphs(p.description).map(text => ({ kind: 'p', runs: [{ text }] }));
        blocks.push({ kind: 'description', paragraphs: rich });
        if (p.choice) line(`Choice — ${p.choice}`);
      }
    } else blank(2, 'Power');
    heading('Notes');
    paragraphs(c.notes).forEach(line);
    blank(2, 'Notes');
    return blocks;
  }

  const printStyle = `
    #axial-print-sheet { display: none; }
    @page { size: auto; margin: 15mm 17mm 17mm; }
    @page { @bottom-right { content: "AXIAL    /    " counter(page); font: 8pt Arial, sans-serif; color: #39574f; } }
    @media print {
      html, body.axial-printing { margin: 0 !important; padding: 0 !important; background: white !important; min-height: 0; }
      body.axial-printing > :not(#axial-print-sheet) { display: none !important; }
      #axial-print-sheet { display: block; color: #192421; font: 10pt/1.3 Arial, sans-serif;
        overflow-wrap: anywhere; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      #axial-print-sheet * { box-sizing: border-box; letter-spacing: normal; text-shadow: none; }
      #axial-print-sheet h1, #axial-print-sheet h2, #axial-print-sheet h3, #axial-print-sheet p { margin: 0; padding: 0; }
      #axial-print-sheet h1 { font: 32pt/1.04 Georgia, serif; color: #152620; margin: 3pt 0 5pt; }
      #axial-print-sheet h2 { font: 15pt/1.15 Georgia, serif; color: #254b3f; margin: 11pt 0 4pt;
        border-bottom: .75pt solid #718a80; padding-bottom: 3pt; break-after: avoid; }
      #axial-print-sheet h3 { font: bold 11pt/1.25 Arial, sans-serif; margin: 6pt 0 1pt; break-after: avoid; }
      #axial-print-sheet h3 em { font: italic 9pt Arial, sans-serif; color: #415c53; }
      #axial-print-sheet ul, #axial-print-sheet ol { margin: 0 0 4pt; padding-left: 19pt; }
      #axial-print-sheet li { margin: 0 0 2pt; padding: 0; }
      #axial-print-sheet p { margin: 0 0 3pt; white-space: pre-line; orphans: 2; widows: 2; }
      #axial-print-sheet .label { font: bold 8.5pt Arial, sans-serif; letter-spacing: 1.3pt; text-transform: uppercase; color: #39574f; }
      #axial-print-sheet .subtitle { font-size: 10pt; font-style: italic; color: #39574f; }
      #axial-print-sheet .history { font: 9pt/1.4 Arial, sans-serif; color: #39574f; margin: 5pt 0; }
      #axial-print-sheet .second { break-before: page; }
      #axial-print-sheet .rule { height: 17pt; border-bottom: .5pt solid #adb9b4; margin: 0; }
      #axial-print-sheet table { width: 100%; table-layout: fixed; border-collapse: collapse; font: inherit; }
      #axial-print-sheet td { padding: 3pt 5pt; vertical-align: top; border-bottom: .5pt solid #c2ccc7; white-space: pre-line; }
      #axial-print-sheet td:first-child, #axial-print-sheet .skills td:nth-child(3) { padding-left: 0; }
      #axial-print-sheet .skills td:nth-child(even), #axial-print-sheet .list td:first-child { font-weight: bold; }
      #axial-print-sheet .stats td { padding: 3pt 5pt 5pt 0; }
      #axial-print-sheet .stats small { display: block; font: 8pt Arial, sans-serif; color: #39574f; }
      #axial-print-sheet .stats strong { font: bold 13pt/1.3 Arial, sans-serif; }
      #axial-print-sheet tr { break-inside: avoid; }
    }`;

  function runsHtml(runs) {
    return runs.map(r => {
      let value = escapeText(r.text).replace(/\r\n?|\n/g, '<br>');
      if (r.italic) value = '<em>' + value + '</em>';
      if (r.bold) value = '<strong>' + value + '</strong>';
      return value;
    }).join('');
  }

  // The source describes each list item separately. Keep its grouping and nesting
  // so Docs, Word and screen readers can identify real list items after editing.
  function powerFlow(paragraphs) {
    const flow = [], stack = [];
    for (const p of paragraphs) {
      if (p.kind !== 'ul' && p.kind !== 'ol') {
        stack.length = 0;
        flow.push({ kind: 'p', runs: p.runs });
        continue;
      }
      const level = Math.max(0, Math.min(Number(p.level) || 0, stack.length, 8));
      stack.length = Math.min(stack.length, level + 1);
      const marker = p.kind === 'ul' && p.marker === '-' ? '-' : '';
      let list = stack[level];
      if (!list || list.kind !== p.kind || list.marker !== marker) {
        const parent = level ? stack[level - 1].items.at(-1).children : flow;
        list = { kind: p.kind, marker, items: [] };
        parent.push(list);
        stack[level] = list;
      }
      list.items.push({ runs: p.runs, children: [] });
    }
    return flow;
  }

  function powerHtml(flow) {
    return flow.map(block => {
      if (block.kind === 'p') return '<p>' + runsHtml(block.runs) + '</p>';
      const items = block.items.map(item => '<li>' + runsHtml(item.runs) + powerHtml(item.children) + '</li>').join('');
      const style = block.marker === '-' ? ' style="list-style-type:&quot;- &quot;;"' : '';
      return `<${block.kind}${style}>${items}</${block.kind}>`;
    }).join('');
  }

  function printBlock(b) {
    const t = escapeText(b.text).replace(/\r\n?|\n/g, '<br>');
    switch (b.kind) {
      case 'label': case 'history': case 'subtitle': return `<p class="${b.kind}">${t}</p>`;
      case 'title': return `<h1>${t}</h1>`;
      case 'heading': return `<h2>${t}</h2>`;
      case 'text': return `<p>${t}</p>`;
      case 'power': return `<h3><strong>${t}</strong>${b.metadata ? ` <em>${escapeText(b.metadata)}</em>` : ''}</h3>`;
      case 'description': return powerHtml(powerFlow(b.paragraphs));
      case 'page': return `<p class="label second">Axial character sheet</p><h1>${t}</h1>`;
      case 'blank': return '<p class="rule"></p>'.repeat(b.count);
      case 'table': {
        const cols = b.widths.map(w => `<col style="width:${w}%">`).join('');
        const rows = b.rows.map(row => '<tr>' + row.map(value => {
          const content = b.style === 'stats' ? `<small>${escapeText(value.label)}</small><strong>${escapeText(value.value)}</strong>` : escapeText(value).replace(/\r\n?|\n/g, '<br>');
          return `<td>${content}</td>`;
        }).join('') + '</tr>').join('');
        return `<table class="${b.style}"><colgroup>${cols}</colgroup><tbody>${rows}</tbody></table>`;
      }
    }
  }

  // Inline the styles used by rich paste. Clipboard consumers commonly discard
  // document stylesheets, while style attributes and native tables survive.
  function html(character) {
    const doc = document.implementation.createHTMLDocument(filename(character));
    doc.body.innerHTML = sheetBlocks(character).map(printBlock).join('');
    const body = 'font:10pt/1.3 Arial,sans-serif;color:#192421;';
    const section = 'font:15pt Georgia,serif;color:#254b3f;border-bottom:1px solid #718a80;margin:11pt 0 4pt;padding-bottom:3pt;';
    const rules = [
      ['body', body],
      ['p', body + 'margin:0 0 3pt;'],
      ['h1', 'font:32pt Georgia,serif;color:#152620;margin:3pt 0 5pt;'],
      ['h2', section], ['h3', 'font:bold 11pt Arial,sans-serif;margin:6pt 0 2pt;'],
      ['h3 em', 'font:italic 9pt Arial,sans-serif;color:#39574f;'],
      ['.label', 'font:bold 8.5pt Arial,sans-serif;color:#39574f;text-transform:uppercase;letter-spacing:1pt;'],
      ['.subtitle', 'font:italic 10pt Arial,sans-serif;color:#39574f;'],
      ['.history', 'font:9pt Arial,sans-serif;color:#39574f;'],
      ['.rule', 'height:14pt;border-bottom:1px solid #adb9b4;'],
      ['.second', 'page-break-before:always;'],
      ['table', 'width:100%;table-layout:fixed;border-collapse:collapse;'],
      ['td', body + 'vertical-align:top;border-bottom:1px solid #c2ccc7;padding:3pt 5pt 3pt 0;'],
      ['ul, ol', 'margin:0 0 3pt;padding-left:20pt;'],
      ['li', body + 'margin-bottom:2pt;'],
      ['.list td:first-child, .skills td:nth-child(even)', 'font-weight:bold;'],
      ['small', 'font:8pt Arial,sans-serif;color:#39574f;'],
      ['.stats strong', 'font:bold 13pt Arial,sans-serif;']
    ];
    for (const [selector, style] of rules) {
      doc.querySelectorAll(selector).forEach(el => el.setAttribute('style', (el.getAttribute('style') || '') + style));
    }
    // Explicit breaks and cell widths survive both clipboard paste and Drive import.
    doc.querySelectorAll('.stats small').forEach(el => el.after(doc.createElement('br')));
    doc.querySelectorAll('table').forEach(table => {
      const widths = [...table.querySelectorAll('col')].map(col => col.style.width);
      table.querySelectorAll('tr').forEach(row => [...row.cells].forEach((cell, i) => { cell.style.width = widths[i]; }));
    });
    doc.querySelectorAll('td:empty, .rule').forEach(el => { el.textContent = '\u00a0'; });
    doc.head.insertAdjacentHTML('afterbegin', '<meta charset="utf-8">');
    return '<!doctype html>' + doc.documentElement.outerHTML;
  }

  let finishPrint;
  function print(character) {
    if (finishPrint) finishPrint();
    const sheet = document.createElement('article');
    sheet.id = 'axial-print-sheet';
    sheet.innerHTML = sheetBlocks(character).map(printBlock).join('');
    const style = document.createElement('style');
    style.textContent = printStyle;
    document.head.append(style);
    document.body.append(sheet);
    document.body.classList.add('axial-printing');
    const previousTitle = document.title;
    document.title = filename(character);
    finishPrint = () => {
      window.removeEventListener('afterprint', finishPrint);
      sheet.remove();
      style.remove();
      document.body.classList.remove('axial-printing');
      document.title = previousTitle;
      finishPrint = null;
    };
    window.addEventListener('afterprint', finishPrint, { once: true });
    try {
      window.print();
    } catch (error) {
      finishPrint();
      throw error;
    }
  }

  function run(text, options = '') {
    const pieces = String(text ?? '').split(/\r\n?|\n/).map(t => `<w:t xml:space="preserve">${escapeText(t)}</w:t>`);
    return `<w:r>${options ? `<w:rPr>${options}</w:rPr>` : ''}${pieces.join('<w:br/>')}</w:r>`;
  }
  function para(style, content, extra = '') {
    return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${extra}</w:pPr>${content}</w:p>`;
  }
  const font = name => `<w:rFonts w:ascii="${name}" w:hAnsi="${name}"/>`;
  const color = value => `<w:color w:val="${value}"/>`;
  const size = points => `<w:sz w:val="${points * 2}"/>`;
  const space = (before, after) => `<w:spacing w:before="${before}" w:after="${after}"/>`;
  const border = (value, thickness) => `<w:pBdr><w:bottom w:val="single" w:sz="${thickness}" w:space="2" w:color="${value}"/></w:pBdr>`;
  function wordStyles() {
    function style(id, name, properties, text) {
      return `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:pPr>${properties}</w:pPr><w:rPr>${text}</w:rPr></w:style>`;
    }
    const neutral = color('39574F');
    const label = '<w:b/><w:caps/>' + neutral + '<w:spacing w:val="20"/>' + size(8.5);
    const styles = [
      style('Title', 'Title', '<w:keepNext/>' + space(20, 60), font('Georgia') + color('152620') + size(32)),
      style('Label', 'Sheet label', '<w:keepNext/>' + space(0, 10), label),
      style('Subtitle', 'Subtitle', space(0, 35), '<w:i/>' + neutral + size(10)),
      style('History', 'Lifepaths', space(40, 35), neutral + size(9)),
      style('Heading1', 'heading 1', '<w:keepNext/>' + border('718A80', 6) + space(155, 65) + '<w:outlineLvl w:val="0"/>', font('Georgia') + color('254B3F') + size(15)),
      style('Power', 'Power', '<w:keepNext/>' + space(70, 20), '<w:b/>' + size(11)),
      style('Cell', 'Table text', space(0, 0), size(10)),
      style('StatLabel', 'Statistic label', '<w:keepNext/>' + space(0, 0), neutral + size(8)),
      style('StatValue', 'Statistic value', space(0, 0), '<w:b/>' + size(13)),
      style('Rule', 'Writing line', border('ADB9B4', 4) + '<w:spacing w:after="0" w:line="300" w:lineRule="atLeast"/>', size(9)),
      style('Footer', 'Footer', '<w:jc w:val="right"/>', neutral + size(8))
    ].join('');
    return xmlHeader + `<w:styles xmlns:w="${wordNamespace}"><w:docDefaults><w:rPrDefault><w:rPr>${font('Arial')}${color('192421')}${size(10)}</w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:widowControl/><w:spacing w:after="45" w:line="250" w:lineRule="auto"/></w:pPr></w:style>${styles}</w:styles>`;
  }

  function wordTable(b, context) {
    const widths = b.widths.map(w => Math.round(w * 93.6));
    const rows = b.rows.map(row => '<w:tr><w:trPr><w:cantSplit/></w:trPr>' + row.map((v, i) => {
      const bold = b.style === 'skills' ? i % 2 === 1 : i === 0;
      const field = b.fields[i];
      const content = b.style === 'stats'
        ? para('StatLabel', run(v.label)) + para('StatValue', v.label ? context.field(v.label, run(v.value)) : '')
        : para('Cell', field ? context.field(field, run(v || ' ', bold ? '<w:b/>' : '')) : run(v, bold ? '<w:b/>' : ''));
      return `<w:tc><w:tcPr><w:tcW w:w="${widths[i]}" w:type="dxa"/></w:tcPr>${content}</w:tc>`;
    }).join('') + '</w:tr>').join('');
    const rule = 'w:val="single" w:sz="4" w:color="C2CCC7"';
    const margin = (side, amount) => `<w:${side} w:w="${amount}" w:type="dxa"/>`;
    return `<w:tbl><w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:bottom ${rule}/><w:insideH ${rule}/></w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar>${margin('top', 30)}${margin('left', 0)}${margin('bottom', 35)}${margin('right', 85)}</w:tblCellMar></w:tblPr><w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${rows}</w:tbl>`;
  }

  function wordPowerFlow(flow, context, level = 0) {
    const styledRuns = runs => runs.map(part => run(part.text, (part.bold ? '<w:b/>' : '') + (part.italic ? '<w:i/>' : ''))).join('');
    return flow.map(block => {
      if (block.kind === 'p') return para('Normal', styledRuns(block.runs));
      const style = block.kind === 'ol' ? 'decimal' : block.marker === '-' ? 'dash' : 'bullet';
      const numId = context.numberedLists.push(style);
      const numbering = `<w:numPr><w:ilvl w:val="${level}"/><w:numId w:val="${numId}"/></w:numPr>`;
      return block.items.map(item => para('Normal', styledRuns(item.runs), numbering) + wordPowerFlow(item.children, context, level + 1)).join('');
    }).join('');
  }

  function wordNumbering(listTypes) {
    const styles = ['bullet', 'decimal', 'dash'];
    const abstracts = styles.map((style, id) => {
      const levels = Array.from({ length: 9 }, (_, i) => {
        const left = (i + 1) * 320;
        const marker = style === 'decimal' ? '%' + (i + 1) + '.' : style === 'dash' ? '-' : '•';
        return `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${style === 'decimal' ? 'decimal' : 'bullet'}"/><w:lvlText w:val="${marker}"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="${left}"/></w:tabs><w:ind w:left="${left}" w:hanging="220"/></w:pPr></w:lvl>`;
      }).join('');
      return `<w:abstractNum w:abstractNumId="${id}"><w:multiLevelType w:val="multilevel"/>${levels}</w:abstractNum>`;
    }).join('');
    const nums = listTypes.map((style, i) => `<w:num w:numId="${i + 1}"><w:abstractNumId w:val="${styles.indexOf(style)}"/></w:num>`).join('');
    return xmlHeader + `<w:numbering xmlns:w="${wordNamespace}">${abstracts}${nums}</w:numbering>`;
  }

  function wordBlock(b, context) {
    const styles = { label: 'Label', title: 'Title', heading: 'Heading1', subtitle: 'Subtitle', history: 'History', text: 'Normal' };
    if (b.kind === 'title' && context.controls) {
      const editable = context.field('Character name', run(b.text));
      return para('Title', '<w:bookmarkStart w:id="0" w:name="CharacterName"/>' + editable + '<w:bookmarkEnd w:id="0"/>');
    }
    if (styles[b.kind]) return para(styles[b.kind], run(b.text));
    switch (b.kind) {
      case 'page': return para('Label', run('Axial character sheet'), '<w:pageBreakBefore/>') + para('Title', context.controls ? '<w:fldSimple w:instr="REF CharacterName">' + run(b.text) + '</w:fldSimple>' : run(b.text));
      case 'power': return para('Power', run(b.text) + (b.metadata ? run('   ' + b.metadata, '<w:b w:val="0"/><w:i/>' + color('39574F') + size(9)) : ''));
      case 'description': return wordPowerFlow(powerFlow(b.paragraphs), context);
      case 'blank': return Array.from({ length: b.count }, () => para('Rule', context.field(b.field || 'Notes', run(' ')), '<w:pBdr><w:between w:val="single" w:sz="4" w:space="2" w:color="ADB9B4"/></w:pBdr>')).join('');
      case 'table': return wordTable(b, context);
    }
  }

  // Store the small UTF-8 XML parts directly in a ZIP archive (OPC packaging).
  const crcTable = Uint32Array.from({ length: 256 }, (_, byte) => {
    let crc = byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    return crc;
  });
  function zip(parts) {
    const encode = new TextEncoder();
    const local = [], directory = [];
    let offset = 0;
    for (const [name, xml] of Object.entries(parts)) {
      const path = encode.encode(name), data = encode.encode(xml);
      let crc = 0xffffffff;
      for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
      crc = (crc ^ 0xffffffff) >>> 0;
      const header = new Uint8Array(30 + path.length), h = new DataView(header.buffer);
      h.setUint32(0, 0x04034b50, true);
      h.setUint16(4, 20, true); // Minimum ZIP reader version
      h.setUint16(12, 33, true); // 1 January 1980 in DOS date format
      h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true);
      h.setUint32(22, data.length, true);
      h.setUint16(26, path.length, true);
      header.set(path, 30);
      const entry = new Uint8Array(46 + path.length), e = new DataView(entry.buffer);
      e.setUint32(0, 0x02014b50, true);
      e.setUint16(4, 20, true);
      entry.set(header.subarray(4, 30), 6);
      e.setUint32(42, offset, true);
      entry.set(path, 46);
      local.push(header, data);
      directory.push(entry);
      offset += header.length + data.length;
    }
    const end = new Uint8Array(22), e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, directory.length, true);
    e.setUint16(10, directory.length, true);
    e.setUint32(12, directory.reduce((sum, bytes) => sum + bytes.length, 0), true);
    e.setUint32(16, offset, true);
    return new Blob([...local, ...directory, end], { type: wordMime });
  }

  function wordFile(character, { controls = true } = {}) {
    let nextFieldId = 1;
    const context = {
      controls,
      numberedLists: [],
      // Named plain-text controls preserve a field's surrounding layout and let
      // players select the entire value. The rest of the document remains editable.
      field(label, content) {
        if (!controls) return content;
        return `<w:sdt><w:sdtPr><w:alias w:val="${escapeText(label)}"/><w:id w:val="${nextFieldId++}"/><w:text w:multiLine="1"/></w:sdtPr><w:sdtContent>${content}</w:sdtContent></w:sdt>`;
      }
    };
    const body = sheetBlocks(character).map(block => wordBlock(block, context)).join('');
    const page = '<w:sectPr><w:footerReference w:type="default" r:id="rFooter"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="1440" w:bottom="900" w:left="1440" w:header="360" w:footer="480" w:gutter="0"/></w:sectPr>';
    const footer = para('Footer', run('AXIAL   /   ') + '<w:fldSimple w:instr="PAGE"><w:r><w:t>1</w:t></w:r></w:fldSimple>');
    const relationships = entries => xmlHeader + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      entries.map(([id, type, target]) => `<Relationship Id="${id}" Type="${relNamespace}/${type}" Target="${target}"/>`).join('') + '</Relationships>';
    const contentType = (name, type) => `<Override PartName="/word/${name}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`;
    return zip({
      '[Content_Types].xml': xmlHeader + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
        contentType('document', 'document.main') + contentType('styles', 'styles') + contentType('numbering', 'numbering') + contentType('footer1', 'footer') + '</Types>',
      '_rels/.rels': relationships([['rDocument', 'officeDocument', 'word/document.xml']]),
      'word/document.xml': xmlHeader + `<w:document xmlns:w="${wordNamespace}" xmlns:r="${relNamespace}"><w:body>${body}${page}</w:body></w:document>`,
      'word/_rels/document.xml.rels': relationships([['rStyles', 'styles', 'styles.xml'], ['rNumbers', 'numbering', 'numbering.xml'], ['rFooter', 'footer', 'footer1.xml']]),
      'word/styles.xml': wordStyles(),
      'word/numbering.xml': wordNumbering(context.numberedLists),
      'word/footer1.xml': xmlHeader + `<w:ftr xmlns:w="${wordNamespace}">${footer}</w:ftr>`
    });
  }

  function filename(character) {
    const name = (character.name || 'Unnamed character').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '').trim().slice(0, 100);
    return 'Axial - ' + (name || 'Character sheet');
  }
  function word(character) {
    const url = URL.createObjectURL(wordFile(character));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename(character) + '.docx';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  return { word, print, html, wordFile };
})();
