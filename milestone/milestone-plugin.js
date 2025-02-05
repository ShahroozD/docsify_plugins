const milestonePlugin = (hook, vm) => {
  let timelineData = [];

  hook.beforeEach(function (content) {
    let events = [];

    const regex = /\.{3}رویدادنامه([\s\S]*?)\.{3}/g;
    const matches = content.match(regex);

    if (matches) {
      matches.forEach(match => {
        const lines = match
          .trim()
          .split('\n')
          .map(line => line.trim());

        lines.forEach(line => {
          if (line.startsWith('>')) {
            const [time, desc] = line.split(' : ');
            events.push({ time: parseInt(time.trim().replace(/>\s*/, '')), desc: desc.trim() });
          }
        });
        timelineData = [...timelineData, ...events];
        content = content.replace(match, '<div class="milestone" id="milestone-timeline"></div>');
      });
    }
    return content;
  });

  hook.doneEach(function () {
    const container = document.getElementById('milestone-timeline');
    if (!container || timelineData.length === 0) return;
    console.log(timelineData);
    const containerWidth = container.offsetWidth;
    const min = timelineData[0].time;
    const max = timelineData[timelineData.length - 1].time;

    // Split events into two groups
    const topEventsHTML = [];
    const bottomEventsHTML = [];

    // Reverse the array to match your original ordering
    timelineData.forEach((event, index) => {
      const normalized = (event.time - min) / (max - min);
      const positionPercent = (1-(1 - normalized)) * 100;

      // Build the event's HTML
      const eventHTML = `
        <div 
          class="timeline-event  ${index % 2 === 0 ? 'top' : 'bottom'}"
          style="right:${positionPercent}%; position: absolute;">
          <div class="timeline-item-arrow">
            <div class="timeline-connector"></div>
            <div class="timeline-circle"></div>
          </div>
          <div class="timeline-item-content">
            <div class="timeline-year">${event.time}</div>
            <div class="timeline-description">${event.desc}</div>
          </div>
        </div>
      `;

      if (index % 2 === 0) {
        topEventsHTML.push(eventHTML);
      } else {
        bottomEventsHTML.push(eventHTML);
      }
    });

    // Build the final HTML for the timeline container.
    const timelineHTML = `
      <div class="milestone-container">
        <div class="timeline-horizontal"></div>
        <div class="top-container">
          ${topEventsHTML.join('')}
        </div>
        <div class="bottom-container">
          ${bottomEventsHTML.join('')}
        </div>
      </div>
    `;

    container.innerHTML = timelineHTML;

    // After rendering the timeline, adjust for collisions
    adjustTimelineEvents();
  });


  const adjustment = 60;

  function adjustTimelineEvents() {
    // Process both groups independently.
    adjustGroup('.top-container', true); 
    adjustGroup('.bottom-container', false); 
  }

  function adjustGroup(selector, istop) {
    // Get all timeline events in the group
    let events = document.querySelectorAll(selector + ' .timeline-event');
    if (!events || events.length === 0) return;
  
    // Convert to an array and sort by their right position
    events = Array.from(events);
    events.sort((a, b) => {
      const aright = parseFloat(a.style.right) || 0;
      const bright = parseFloat(b.style.right) || 0;
      return aright - bright;
    });
  
    // First pass: Adjust events for overlap
    for (let i = events.length - 1; i >= 0; i--) {
      const current = events[i];
      let currentRect = current.getBoundingClientRect();
  
      if (i + 1 < events.length) {
        const nextEvent = events[i + 1];
        const nextRect = nextEvent.getBoundingClientRect();
  
        const horizontalOverlap = !(currentRect.left > nextRect.right || currentRect.right < nextRect.left);
        const verticalOverlap = !(currentRect.bottom < nextRect.top || currentRect.top > nextRect.bottom);
  
        if (horizontalOverlap && verticalOverlap) {
          
          let currentHeight = parseFloat(current.style.height) || adjustment;
          currentHeight += nextRect.height;
  
          current.style.height = currentHeight + 'px';
          if (istop) {
            current.style.top = -currentHeight + adjustment + 'px';
          }
          currentRect = current.getBoundingClientRect();
        }
      }
    }
  
    // Second pass: Check for overlaps with previous events and apply 'reverse' class
    for (let i = 1; i < events.length; i++) {
  
      const current = events[i];
      const prev = events[i - 1];
      const preprev = events[i - 2];
      const currentRect = current.getBoundingClientRect();
      const prevRect = prev.getBoundingClientRect();
      const preprevRect = preprev?.getBoundingClientRect();
      
      const horizontalOverlap = (currentRect.left+currentRect.width + 10 > prevRect.right || currentRect.right+currentRect.width + 10 < prevRect.left);
      const verticalOverlap = (currentRect.bottom < prevRect.top || currentRect.top > prevRect.bottom);
      
      if (horizontalOverlap) {
        current.classList.add('reverse');
        current.style.right = `calc(${current.style.right} - ${currentRect.width}px)`
        
        let currentHeight = adjustment;
        current.style.height = currentHeight + 'px';
        if (istop) {
          current.style.top = -currentHeight + adjustment + 'px';
        }
      } else if(currentRect.height > prevRect.height){
        current.classList.add('reverse');
        current.style.right = `calc(${current.style.right} - ${currentRect.width}px)`
        current.style.height = prevRect.height + adjustment + 'px';
        if (istop) {
          current.style.top = -prevRect.height  + 'px';
        }
      }
    }
  }
  
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(milestonePlugin);
