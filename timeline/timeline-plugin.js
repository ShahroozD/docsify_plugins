window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
  hook.beforeEach(function (content) {
    return content.replace(/\.{3}گاهشمار([\s\S]*?)\.{3}/g, function (match, content) {
      const lines = content
        .trim()
        .split('\n')
        .map(line => line.trim()) // Trim all lines
        .filter(line => line); // Remove empty lines

      let timelineHTML = '<div class="timeline"><div class="timeline-container">';
      let currentItem = null;

      lines.forEach(line => {
        if (line.startsWith('-')) {
          // If there's an active item, finalize it
          if (currentItem) {
            timelineHTML += `
              <div class="timeline-item">
                <div class="timeline-item-content">
                  ${currentItem.image ? `<div class="box"><div class="image"><img src="${currentItem.image}" alt="Madh Image"></div></div>` : ''}
                  <div class="text">
                    <h3>${marked(currentItem.title)}</h3>
                    <span>${marked(currentItem.date)}</span>
                    ${marked(currentItem.description)}
                  </div>
                </div>
                <div class="timeline-circle"></div>
              </div>
            `;
          }

          // Start a new timeline item
          currentItem = {
            title: line.substring(1).trim(),
            image: '',
            date: '',
            description: ''
          };
        } else if (line.startsWith(':[[')) {
          // Image subdata
          currentItem.image = line.substring(3, line.length - 2).trim();
        } else if (line.startsWith(':سال')) {
          // Date subdata
          currentItem.date = line.substring(1).trim();
        } else if (line.startsWith(':')) {
          // Description subdata
          currentItem.description += line.substring(1).trim() + '<br>';
        }
      });

      // Finalize the last item
      if (currentItem) {
        timelineHTML += `
          <div class="timeline-item">
            <div class="timeline-item-content">
              ${currentItem.image ? `<div class="box"><div class="image"><img src="${currentItem.image}" alt="Madh Image"></div></div>` : ''}
              <div class="text">
                <h3>${marked(currentItem.title)}</h3>
                <span>${marked(currentItem.date)}</span><br>
                ${marked(currentItem.description)}
              </div>
            </div>
            <div class="timeline-circle"></div>
          </div>
        `;
      }

      timelineHTML += '</div></div>';
      return timelineHTML;
    });
  });
});