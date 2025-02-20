let activeTabId = null;
let startTime = null;
let timeData = {};
let intervalId = null;

// Initialize time tracking when a tab becomes active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();
  
  if (startTime && activeTabId) {
    updateTimeData();
  }

  activeTabId = activeInfo.tabId;
  startTime = now;
  
  // Start interval for real-time updates
  startRealtimeTracking();
});

// Update tracking when tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === activeTabId) {
    const now = Date.now();
    if (startTime) {
      updateTimeData();
    }
    startTime = now;
    startRealtimeTracking();
  }
});

function startRealtimeTracking() {
  // Clear existing interval if any
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Update every second
  intervalId = setInterval(async () => {
    if (activeTabId && startTime) {
      try {
        const tab = await chrome.tabs.get(activeTabId);
        if (tab.url) {
          const domain = new URL(tab.url).hostname;
          const currentTime = Date.now();
          const duration = currentTime - startTime;

          if (!timeData[domain]) {
            timeData[domain] = {
              category: 'neutral',
              visits: [],
              totalTime: 0,
              lastVisit: new Date().toISOString()
            };
          }

          // Update total time
          timeData[domain].totalTime = (timeData[domain].totalTime || 0) + 1000; // Add 1 second
          timeData[domain].lastVisit = new Date().toISOString();

          // Save to storage only, remove the runtime message
          chrome.storage.local.set({ timeData });
        }
      } catch (error) {
        // Tab might have been closed
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }
  }, 1000);
}

function updateTimeData() {
  if (!activeTabId || !startTime) return;

  chrome.tabs.get(activeTabId, (tab) => {
    if (chrome.runtime.lastError || !tab.url) return;

    const domain = new URL(tab.url).hostname;
    const currentTime = Date.now();
    const timeSpent = currentTime - startTime;

    if (!timeData[domain]) {
      timeData[domain] = {
        category: 'neutral',
        visits: [],
        totalTime: 0,
        lastVisit: new Date().toISOString()
      };
    }

    timeData[domain].visits.push({
      startTime: startTime,
      endTime: currentTime,
      duration: timeSpent
    });

    // Save to storage
    chrome.storage.local.set({ timeData });
  });
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    updateTimeData();
    activeTabId = null;
    startTime = null;
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('dist/index.html')
  });
});

// Listen for connection errors and handle them gracefully
chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(() => {
    // Handle disconnection gracefully
    console.log('Port disconnected');
  });
}); 