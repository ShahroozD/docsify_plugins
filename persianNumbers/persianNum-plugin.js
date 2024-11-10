window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
  hook.beforeEach(function (content) {
    const lines = content.split('\n');
    let result = [];
    let listHtml = '';
    let previousIndentLevel = 0;
    let inList = false;

    lines.forEach(line => {
      const match = line.match(/^(\s*)([\u06F0-\u06F9]+)\.\s(.*)/);

      if (match) {
        const [_, spaces, num, itemContent] = match;
        const currentIndentLevel = spaces.length / 2; 

        if (!inList) {
          listHtml += '<ol class="persian">';
          inList = true;
        }

        if (currentIndentLevel > previousIndentLevel) {
          listHtml += '<ol class="persian">';
        } else if (currentIndentLevel < previousIndentLevel) {
          listHtml += '</li>' + '</ol>'.repeat(previousIndentLevel - currentIndentLevel);
        } else {
          listHtml += '</li>'; 
        }

        // Add the current list item
        listHtml += `<li>${itemContent}`;
        previousIndentLevel = currentIndentLevel;
      } else {

        if (inList) {
          listHtml += '</li>' + '</ol>'.repeat(previousIndentLevel + 1);
          result.push(listHtml);  
          listHtml = ''; 
          inList = false;
          previousIndentLevel = 0;
        }

        result.push(line);
      }
    });

    if (inList) {
      listHtml += '</li>' + '</ol>'.repeat(previousIndentLevel + 1);
      result.push(listHtml);
    }

    return result.join('\n');
  });
});
