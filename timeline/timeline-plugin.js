window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
  hook.beforeEach(function (content) {
    return content.replace(/\.{3}گاهشمار([\s\S]*?)\.{3}/g, function (match, content) {
      const lines = content
      .trim()
      .split('\n')
      .filter(stanza => stanza);
      
      const wrappedLines = lines.map(line => line).join('');
      return `<div class="persian timeline">${wrappedLines}</div>`;
    });
  });
});