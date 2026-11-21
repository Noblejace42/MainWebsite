/* Copy an editable, formatted character sheet into Google Docs. */
window.AxialGoogleDocs = (() => {
  'use strict';

  function open(character) {
    const html = AxialCharacterExport.html(character);
    const source = new DOMParser().parseFromString(html, 'text/html');
    const dialog = document.createElement('dialog');
    dialog.className = 'axial-docs-dialog';
    dialog.setAttribute('aria-labelledby', 'axial-docs-title');
    dialog.innerHTML = `
      <div class="docs-heading"><h2 id="axial-docs-title">Export to Google Docs</h2>
        <button type="button" data-close>Close</button></div>
      <p>Copy your formatted sheet, open a Google Doc, then paste it into the document body.</p>
      <div class="docs-steps">
        <button type="button" class="docs-copy">Copy formatted sheet</button>
        <a class="docs-link" href="https://docs.google.com/create" target="_blank" rel="noopener noreferrer">Open blank Google Doc</a>
      </div>
      <p class="docs-status docs-copy-status" role="status" aria-live="polite"></p>
      <div class="docs-preview" aria-label="Formatted character sheet for manual copying" tabindex="0" hidden></div>`;

    const preview = dialog.querySelector('.docs-preview');
    const status = dialog.querySelector('.docs-copy-status');
    const copy = dialog.querySelector('.docs-copy');
    const apple = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const modifier = apple ? '⌘' : 'Ctrl';
    const close = () => dialog.close();
    dialog.querySelector('[data-close]').addEventListener('click', close);
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    document.body.append(dialog);
    dialog.showModal();
    copy.focus();

    // The rendered text preserves table cells and paragraph breaks for plain-text destinations.
    preview.append(...Array.from(source.body.childNodes, node => document.importNode(node, true)));
    preview.hidden = false;
    const text = preview.innerText;
    preview.hidden = true;

    function selectSheet() {
      preview.hidden = false;
      preview.focus();
      const range = document.createRange();
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    copy.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.write && window.ClipboardItem) {
          const item = new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' })
          });
          await navigator.clipboard.write([item]);
        } else {
          selectSheet();
          if (!document.execCommand('copy')) throw new Error('Manual copy required');
        }
        preview.hidden = true;
        status.textContent = 'Sheet copied. Open your Google Doc and paste with ' + modifier + '+V or the Paste command.';
      } catch {
        selectSheet();
        status.textContent = 'The sheet is selected below. Press ' + modifier + '+C or choose Copy, then paste it into Google Docs.';
      }
    });
  }

  return { open };
})();
