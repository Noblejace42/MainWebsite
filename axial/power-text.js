// Canonical effects, old plain-text saves, and custom powers share one rendering path.
window.AxialPowerText = (() => {
  'use strict';

  const normalize = value => String(value || '').trim().replace(/[‘’]/g, "'");
  const key = value => normalize(value).toLowerCase();
  const catalog = new Map(window.AXIAL_POWER_LIBRARY.map(power => [key(power.name), power]));
  const stripMarker = line => line.replace(/^\s*[-•●]\s+/, '').trim();
  const comparable = line => normalize(stripMarker(line));

  function sourceBlocks(body) {
    if (!Array.isArray(body)) return [];
    return body.map(block => {
      if (typeof block === 'string') return {kind: 'p', level: 0, runs: [{text: block}]};
      const kind = ['ul', 'ol'].includes(block?.kind) ? block.kind : 'p';
      const runs = Array.isArray(block?.runs) ? block.runs.flatMap(run => {
        if (typeof run === 'string') return [{text: run}];
        if (typeof run?.text !== 'string') return [];
        return [{text: run.text, bold: run.bold === true, italic: run.italic === true}];
      }) : [];
      return {kind, level: 0, marker: kind === 'ul' && block.marker === '-' ? '-' : undefined, runs};
    }).filter(block => block.runs.length);
  }

  function blocks(power) {
    const official = catalog.get(key(power?.name));
    const original = sourceBlocks(official?.body ?? power?.body);
    const description = power?.description ?? power?.desc;
    if (description == null) return original;
    const lines = String(description).split(/\r\n?|\n|\u000b/).map(s => s.trim()).filter(Boolean);
    const byLine = new Map(original.map(b => [comparable(b.runs.map(r => r.text).join('')), b]));
    // A hand-edited effect keeps the source styling of its untouched lines.
    return lines.map((line, index) => {
      const atIndex = original[index];
      const content = comparable(line);
      if (atIndex && comparable(atIndex.runs.map(r => r.text).join('')) === content) return atIndex;
      if (byLine.has(content)) return byLine.get(content);
      if (/^[-•●]\s+/.test(line)) return {kind: 'ul', level: 0, marker: line.startsWith('-') ? '-' : undefined, runs: [{text: stripMarker(line)}]};
      return {kind: 'p', level: 0, runs: [{text: line}]};
    });
  }

  const escape = text => text.replace(/[&<>]/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'})[ch]);
  function html(power) {
    const result = [];
    let list;
    let marker;
    for (const block of blocks(power)) {
      const kind = block.kind === 'p' ? null : block.kind;
      if (list !== kind || marker !== block.marker) {
        if (list) result.push('</' + list + '>');
        if (kind) result.push(block.marker === '-' ? '<ul style="list-style-type:\'-  \'">' : '<' + kind + '>');
      }
      list = kind;
      marker = block.marker;
      const content = block.runs.map(run => {
        let text = escape(run.text);
        if (run.italic) text = '<em>' + text + '</em>';
        if (run.bold) text = '<strong>' + text + '</strong>';
        return text;
      }).join('');
      result.push(kind ? '<li>' + content + '</li>' : '<p>' + content + '</p>');
    }
    if (list) result.push('</' + list + '>');
    return result.join('');
  }

  function render(power) {
    const element = document.createElement('div');
    element.innerHTML = html(power);
    return element;
  }
  return {blocks, html, render};
})();
