
function convertToNumber(text) {

  const persianToEnglishMap = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };

  const converted = text.replace(/[\u06F0-\u06F9]/g, char => persianToEnglishMap[char]);

  return Number(converted);
}


window.$docsify.plugins = window.$docsify.plugins.concat(function (hook) {
  hook.beforeEach(function (content) {
    return content.replace(/\.{3}نمودار\ درختی([\s\S]*?)\.{3}/g, function (match, content) {
      let maxWidth = '';
      const lines = content
        .trim()
        .split('\n')
        .map(line => line.trim()) // Trim all lines
        .filter(line => line); // Remove empty lines
      
      const regexNumber = /^[0-9\u06F0-\u06F9]*$/;

      if(regexNumber.test(lines[0])){
        let size = convertToNumber(lines[0]);
        if(size){
          maxWidth = 'style="max-width: '+size+'px;"'
        }
        
      }

      let timetreeHTML = '<div class="timetree"><div class="timetree-container" '+maxWidth+' >';
      let currentItem = null;
      const timetree = [];
      let currentSection = null;
      
      lines.forEach(line => {
        const sectionMatch = line.match(/^- (.+)$/);
        const entryMatch = line.match(/^(.+):(.+)$/);
        const continuationMatch = line.match(/^\s*:\s*(.+)$/);
        if (sectionMatch) {
          currentSection = { title: sectionMatch[1], entries: [] };
          timetree.push(currentSection);
        } else if (entryMatch) {
          const [_, period, item] = entryMatch;
          if(currentSection)
            currentSection.entries.push({ period, items: [item] });
          else{
            currentSection = { title: '', entries: [{ period, items: [item] }] };
            timetree.push(currentSection);
          }
        } else if (continuationMatch && continuationMatch[1]) {
          const item = continuationMatch[1];
          currentSection.entries[currentSection.entries.length - 1].items.push(item);
        }
      });
      console.log(timetree);

      timetree.forEach(section => {
        timetreeHTML += `
          <div class="section">
            ${(section.title)?`<div class="section-title">${marked(section.title)}</div>`:`<div class="section-free"></div>`}
              <div class="entries">
              ${section.entries
                .map(entry => {
                  return `
                    <div class="entry">
                      <div class="period">${marked(entry.period)}</div>
                      <div class="items">
                        ${entry.items.map((item)=>{
                            return `<div class="item">${marked(item)}</div>`
                        }).join("")}
                      </div>
                    </div>
                  `;
                })
                .join("")}
              </div>
          </div>
        `;
      });
      
      // Finalize the last item
      // if (currentItem) {
      
      // }

      timetreeHTML += '<span class="arrow">➤</span></div></div>';
      return timetreeHTML;
    });
  });
});