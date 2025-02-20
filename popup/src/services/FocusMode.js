class FocusMode {
  constructor() {
    this.isActive = false;
    this.startTime = null;
    this.settings = {
      blockAllNotifications: true,
      allowedApps: [],
      autoReply: true,
      focusDuration: 25, // minutes
      breakDuration: 5 // minutes
    };
    this.isExtension = typeof chrome !== 'undefined' && chrome.runtime;
  }

  async start() {
    this.isActive = true;
    this.startTime = new Date();
    
    // Enable Do Not Disturb
    if (this.settings.blockAllNotifications && this.isExtension) {
      try {
        if (chrome.notifications) {
          chrome.notifications.getPermissionLevel((level) => {
            if (level === 'granted') {
              chrome.notifications.clear('*');
            }
          });
        }
      } catch (error) {
        console.warn('Notifications API not available:', error);
      }
    }

    // Set status in communication apps
    if (this.settings.autoReply) {
      this.setFocusStatus();
    }

    // Start focus timer
    setTimeout(() => this.endFocusSession(), this.settings.focusDuration * 60 * 1000);

    // Notify background script
    if (this.isExtension) {
      try {
        chrome.runtime.sendMessage({ type: 'FOCUS_MODE_STARTED' });
      } catch (error) {
        console.warn('Runtime messaging not available:', error);
      }
    }
  }

  async end() {
    this.isActive = false;
    this.startTime = null;
    
    // Disable Do Not Disturb
    if (this.settings.blockAllNotifications && this.isExtension) {
      try {
        if (chrome.notifications) {
          chrome.notifications.getPermissionLevel((level) => {
            if (level === 'granted') {
              chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'Focus Session Ended',
                message: 'Great job! Take a break.'
              });
            }
          });
        }
      } catch (error) {
        console.warn('Notifications API not available:', error);
      }
    }

    // Clear focus status
    this.clearFocusStatus();

    // Notify background script
    if (this.isExtension) {
      try {
        chrome.runtime.sendMessage({ type: 'FOCUS_MODE_ENDED' });
      } catch (error) {
        console.warn('Runtime messaging not available:', error);
      }
    }
  }

  setFocusStatus() {
    // Implementation for different communication platforms
  }

  clearFocusStatus() {
    // Clear status in communication platforms
  }
}

const focusMode = new FocusMode();
export default focusMode; 