class SmartNotifications {
  constructor() {
    this.settings = {
      productivityAlerts: true,
      breakReminders: true,
      focusScoreUpdates: true,
      achievementAlerts: true
    };
    this.lastBreakTime = new Date();
    this.productivityThreshold = 0.7; // 70%
  }

  initialize() {
    this.setupNotificationListeners();
    this.startProductivityMonitoring();
  }

  setupNotificationListeners() {
    chrome.notifications.onClicked.addListener((notificationId) => {
      if (notificationId.startsWith('break_')) {
        this.handleBreakAction();
      } else if (notificationId.startsWith('focus_')) {
        this.handleFocusAction();
      }
    });
  }

  async checkProductivity(timeSpent, type) {
    if (!this.settings.productivityAlerts) return;

    const productiveTime = timeSpent.productive || 0;
    const totalTime = productiveTime + (timeSpent.unproductive || 0);
    
    if (totalTime > 30) { // Check after 30 minutes
      const productivityRatio = productiveTime / totalTime;
      
      if (productivityRatio < this.productivityThreshold) {
        this.sendProductivityAlert();
      }
    }
  }

  async checkBreakTime() {
    if (!this.settings.breakReminders) return;

    const now = new Date();
    const timeSinceBreak = (now - this.lastBreakTime) / (1000 * 60); // minutes

    if (timeSinceBreak >= 50) { // Suggest break after 50 minutes
      this.sendBreakReminder();
    }
  }

  async sendProductivityAlert() {
    chrome.notifications.create('productivity_alert', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Productivity Check',
      message: 'Your productivity seems lower than usual. Need help focusing?',
      buttons: [
        { title: 'Start Focus Mode' },
        { title: 'View Tips' }
      ]
    });
  }

  async sendBreakReminder() {
    chrome.notifications.create('break_reminder', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Time for a Break',
      message: 'You\'ve been working for a while. Take a short break to stay productive!',
      buttons: [
        { title: 'Take Break' },
        { title: 'Remind Later' }
      ]
    });
  }

  handleBreakAction() {
    this.lastBreakTime = new Date();
  }

  handleFocusAction() {
    // Start focus mode
  }

  startProductivityMonitoring() {
    setInterval(() => {
      this.checkBreakTime();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}

const smartNotifications = new SmartNotifications();
export default smartNotifications; 