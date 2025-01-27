window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
  hook.beforeEach(function (htmlContent) {
    // Find and replace the ...جستجو block
    return  htmlContent.replace(/\.{3}جستجو([\s\S]*?)\.{3}/g, function (match, tableContent) {
      const rows = tableContent.trim().split('\n').slice(1); // Skip header
      const data = rows.map((row) => {
        const cols = row.split('|').map((col) => col.trim());
        return { title: cols[1], translate: cols[2], description: cols[3] };
      });
      console.log(data);
      
      const jsonData = JSON.stringify(data);

      return `<div class="persian search-box" ><div class="search-box-container" data-data='${jsonData}'></div></div>`;
    });
  });

  hook.doneEach(function () {
    
    // Replace the placeholder with the real search UI
    const containers = document.querySelectorAll('.search-box-container');

    containers.forEach((container) => {
      const jsonData = container.getAttribute('data-data');
      const data = JSON.parse(jsonData);

      const searchBox = document.createElement('div');
      searchBox.className = 'persian search-box-container';
      searchBox.innerHTML = `
        <input type="text" class="search-input" placeholder="جستجو..." />
        <ul class="search-results"></ul>
      `;

      container.replaceWith(searchBox);

      // Add the search functionality
      const input = searchBox.querySelector('.search-input');
      const results = searchBox.querySelector('.search-results');

      input.addEventListener('input', function () {
        const query = input.value.toLowerCase();
        results.innerHTML = '';

        if (query.trim() === '') return;

        const filtered = data.filter((item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );

        filtered.forEach((item) => {
          const li = document.createElement('li');
          li.innerHTML = `<div class="item">${item.title}:  ${marked(item.translate)} - ${marked(item.description)}</div class="item">`;
          results.appendChild(li);
        });
      });
    });
  });
});
