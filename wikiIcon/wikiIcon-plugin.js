window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
  hook.beforeEach(function (content) {
    return content.replace(/\[(wikipedia|ویکی‌پدیا)\]\((.*?)\)/g, function (match, label, url) {
      const pageTitle = decodeURIComponent(url.split('/').pop()).replace('_', ' ');
      return `
        <span class="wikipedia-preview-container">
          <a href="${url}" target="_blank" class="wikipedia-link" title="${pageTitle}" data-page-href="${url}">
            <img src="https://en.wikipedia.org/favicon.ico" alt="${pageTitle}" class="wikipedia-icon">
          </a>
          <span class="wikipedia-preview-box">
            <iframe src="${url}" class="wikipedia-iframe"></iframe>
          </span>
        </span>
      `;
    });
  });
});