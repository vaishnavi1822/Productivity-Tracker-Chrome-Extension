import TrackingData from '../models/TrackingData.js';
import ProductivityReport from '../models/ProductivityReport.js';
import User from '../models/User.js';

export async function generateReport(userId, startDate, endDate) {
  // Get user preferences for goals
  const user = await User.findById(userId);
  
  // Get tracking data for the period
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  // Initialize summary data
  const summary = {
    totalTime: 0,
    productiveTime: 0,
    unproductiveTime: 0,
    productivityScore: 0
  };

  // Initialize category breakdown
  const categoryBreakdown = {
    work: 0,
    social: 0,
    entertainment: 0,
    productivity: 0,
    other: 0
  };

  // Initialize site statistics
  const siteStats = new Map();

  // Process tracking data
  trackingData.forEach(day => {
    // Add to summary
    summary.totalTime += day.dailySummary.totalTime;
    summary.productiveTime += day.dailySummary.productiveTime;
    summary.unproductiveTime += day.dailySummary.unproductiveTime;

    // Process individual sites
    day.sites.forEach(site => {
      // Update site statistics
      if (!siteStats.has(site.domain)) {
        siteStats.set(site.domain, {
          timeSpent: 0,
          productivityScore: site.productivityScore,
          category: site.category
        });
      }
      const stats = siteStats.get(site.domain);
      stats.timeSpent += site.timeSpent;

      // Update category breakdown
      categoryBreakdown[site.category] += site.timeSpent;
    });
  });

  // Calculate overall productivity score
  if (summary.totalTime > 0) {
    summary.productivityScore = (summary.productiveTime - summary.unproductiveTime) / summary.totalTime;
  }

  // Check goals achievement
  const productiveHours = summary.productiveTime / (60 * 60 * 1000); // Convert to hours
  const unproductiveHours = summary.unproductiveTime / (60 * 60 * 1000);
  
  summary.goalsAchieved = {
    productiveHours: productiveHours >= user.preferences.dailyGoals.productiveHours,
    unproductiveHours: unproductiveHours <= user.preferences.dailyGoals.maxUnproductiveHours
  };

  // Get top productive and unproductive sites
  const sortedSites = Array.from(siteStats.entries())
    .map(([domain, stats]) => ({ domain, ...stats }))
    .sort((a, b) => b.timeSpent - a.timeSpent);

  const topProductiveSites = sortedSites
    .filter(site => site.productivityScore > 0)
    .slice(0, 5);

  const topUnproductiveSites = sortedSites
    .filter(site => site.productivityScore < 0)
    .slice(0, 5);

  // Create and save report
  const report = new ProductivityReport({
    userId,
    period: { start: startDate, end: endDate },
    summary,
    topProductiveSites,
    topUnproductiveSites,
    categoryBreakdown
  });

  await report.save();
  return report;
} 