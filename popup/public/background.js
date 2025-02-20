let startTime = Date.now();
let currentTab = null;
let isTracking = true;

// Track active tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (!isTracking) return;
  
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

// Track URL changes within the same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!isTracking || !changeInfo.url) return;
  
  handleTabChange(tab);
});

async function handleTabChange(tab) {
  if (!tab.url) return;

  const domain = new URL(tab.url).hostname;
  const endTime = Date.now();

  // Save previous tab's data if exists
  if (currentTab) {
    const duration = endTime - startTime;
    if (duration > 1000) { // Only track if spent more than 1 second
      await saveTracking({
        domain: currentTab.domain,
        startTime,
        endTime,
        duration
      });
    }
  }

  // Update current tab
  currentTab = {
    domain,
    url: tab.url,
    title: tab.title
  };
  startTime = Date.now();
}

async function saveTracking(data) {
  const token = await chrome.storage.local.get('token');
  if (!token) return;

  try {
    const response = await fetch('http://localhost:5000/api/tracking/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error('Failed to save tracking data');
    }
  } catch (error) {
    console.error('Error saving tracking data:', error);
  }
}

// Check for blocked sites
chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    const token = await chrome.storage.local.get('token');
    if (!token) return { cancel: false };

    try {
      const url = new URL(details.url);
      const domain = url.hostname;

      const response = await fetch(`http://localhost:5000/api/settings/should-block?domain=${domain}`, {
        headers: {
          'Authorization': `Bearer ${token.token}`
        }
      });

      if (response.ok) {
        const { blocked } = await response.json();
        if (blocked) {
          return { 
            cancel: true,
            redirectUrl: chrome.runtime.getURL('blocked.html')
          };
        }
      }
    } catch (error) {
      console.error('Error checking blocked status:', error);
    }

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
); 