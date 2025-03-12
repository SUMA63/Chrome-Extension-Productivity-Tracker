
// This script runs in the context of web pages

// Check if current site is marked as distracting
chrome.runtime.sendMessage({ action: 'getBlockedSites' }, (response) => {
  if (!response || !response.data) return;
  
  const currentDomain = window.location.hostname.replace('www.', '');
  const blockedSite = response.data.find(site => 
    site.active && currentDomain.includes(site.domain)
  );
  
  if (blockedSite && blockedSite.schedule) {
    // Check if current time is within blocked schedule
    const [startTime, endTime] = blockedSite.schedule.split(' - ');
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const currentTimeValue = currentHour * 60 + currentMinute;
    const startTimeValue = startHour * 60 + startMinute;
    const endTimeValue = endHour * 60 + endMinute;
    
    if (currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue) {
      // Site is scheduled to be blocked now
      // This is a backup in case declarativeNetRequest doesn't work
      document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: sans-serif;">
          <h1>Site Blocked</h1>
          <p>This site is blocked during your scheduled productive hours (${blockedSite.schedule}).</p>
          <button id="override-block" style="padding: 10px 20px; margin-top: 20px;">
            Override for 5 minutes
          </button>
        </div>
      `;
      
      document.getElementById('override-block')?.addEventListener('click', () => {
        // Allow temporary access
        chrome.runtime.sendMessage({ 
          action: 'temporaryUnblock', 
          domain: blockedSite.domain 
        });
        window.location.reload();
      });
    }
  }
});

// Periodically send current page info to background
setInterval(() => {
  chrome.runtime.sendMessage({ 
    action: 'pageUpdate',
    url: window.location.href,
    title: document.title,
    favicon: document.querySelector('link[rel="icon"]')?.href || 
             document.querySelector('link[rel="shortcut icon"]')?.href
  });
}, 5000);
