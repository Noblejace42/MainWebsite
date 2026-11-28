(() => {
  const line = document.getElementById('line');
  const button = document.getElementById('again');
  const modelUrl = new URL('../assets/data/line-model.js', document.currentScript.src);
  let chain;

  function draw() {
    line.textContent = chain.draw();
    button.textContent = 'Draw another line';
    button.disabled = false;
  }

  function load() {
    if (chain) return draw();
    if (button.hasAttribute('aria-busy')) return;
    button.setAttribute('aria-busy', 'true');
    const script = document.createElement('script');
    script.src = modelUrl.href;
    function failed() {
      script.remove();
      line.textContent = 'The writing couldn’t be loaded.';
      button.textContent = 'Try again';
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
    script.onerror = failed;
    script.onload = () => {
      try {
        chain = new PassageChain(globalThis.lineModel);
        draw();
        button.removeAttribute('aria-busy');
      } catch {
        chain = null;
        failed();
      }
    };
    document.head.append(script);
  }

  button.addEventListener('click', load);
  load();
})();
