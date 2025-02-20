// Check if current site is blocked
function checkIfBlocked() {
  const currentDomain = window.location.hostname;
  
  chrome.storage.local.get(['blockedSites', 'blockingSchedule'], (data) => {
    const { blockedSites = [], blockingSchedule = {} } = data;
    
    if (blockedSites.includes(currentDomain)) {
      const currentHour = new Date().getHours();
      const isBlockingTime = blockingSchedule[currentDomain]?.includes(currentHour);
      
      if (isBlockingTime) {
        document.body.innerHTML = `
          <div style="text-align: center; padding: 50px;">
            <h1>Site Blocked</h1>
            <p>This site has been blocked to help you stay productive.</p>
          </div>
        `;
      }
    }
  });
}

checkIfBlocked(); 