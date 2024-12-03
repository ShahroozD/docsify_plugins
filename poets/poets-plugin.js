window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
    hook.beforeEach(function (content) {
      return content.replace(/\.{3}شعر([\s\S]*?)\.{3}/g, function (match, content) {
        const lines = content
        .trim()
        .split('\n')
        .flatMap(line => line.split(' -- ').map(stanza => stanza.trim()))
        .filter(stanza => stanza);
        
        const wrappedLines = lines.map(line => `<div class="stanza">${marked(line)}</div>`).join('');
        return `<div class="persian poet">${wrappedLines}</div>`;
      });
    });
});