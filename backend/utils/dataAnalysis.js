import TrackingData from '../models/TrackingData.js';

// Analyze productivity patterns by hour
export async function getHourlyPatterns(userId, startDate, endDate) {
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  // Initialize hourly patterns
  const hourlyPatterns = Array(24).fill(0).map(() => ({
    totalTime: 0,
    productiveTime: 0,
    unproductiveTime: 0,
    visits: 0
  }));

  trackingData.forEach(day => {
    day.sites.forEach(site => {
      const hour = new Date(site.lastVisit).getHours();
      hourlyPatterns[hour].totalTime += site.timeSpent;
      hourlyPatterns[hour].visits += site.visits;
      
      if (site.productivityScore > 0) {
        hourlyPatterns[hour].productiveTime += site.timeSpent;
      } else if (site.productivityScore < 0) {
        hourlyPatterns[hour].unproductiveTime += site.timeSpent;
      }
    });
  });

  return hourlyPatterns;
}

// Analyze productivity trends over time
export async function getProductivityTrends(userId, startDate, endDate) {
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });

  return trackingData.map(day => ({
    date: day.date,
    productivityScore: day.dailySummary.productivityScore,
    totalTime: day.dailySummary.totalTime,
    productiveTime: day.dailySummary.productiveTime,
    unproductiveTime: day.dailySummary.unproductiveTime
  }));
}

// Get site category distribution
export async function getCategoryDistribution(userId, startDate, endDate) {
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const distribution = {
    work: 0,
    social: 0,
    entertainment: 0,
    productivity: 0,
    other: 0
  };

  trackingData.forEach(day => {
    day.sites.forEach(site => {
      distribution[site.category] += site.timeSpent;
    });
  });

  return distribution;
}

// Get productivity insights
export async function getProductivityInsights(userId, startDate, endDate) {
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const insights = {
    mostProductiveDay: null,
    leastProductiveDay: null,
    mostVisitedSites: [],
    longestSessions: [],
    distractions: []
  };

  // Find most/least productive days
  trackingData.forEach(day => {
    if (!insights.mostProductiveDay || 
        day.dailySummary.productivityScore > insights.mostProductiveDay.score) {
      insights.mostProductiveDay = {
        date: day.date,
        score: day.dailySummary.productivityScore
      };
    }
    if (!insights.leastProductiveDay || 
        day.dailySummary.productivityScore < insights.leastProductiveDay.score) {
      insights.leastProductiveDay = {
        date: day.date,
        score: day.dailySummary.productivityScore
      };
    }
  });

  // Aggregate site statistics
  const siteStats = new Map();
  trackingData.forEach(day => {
    day.sites.forEach(site => {
      if (!siteStats.has(site.domain)) {
        siteStats.set(site.domain, {
          totalTime: 0,
          visits: 0,
          productivityScore: site.productivityScore
        });
      }
      const stats = siteStats.get(site.domain);
      stats.totalTime += site.timeSpent;
      stats.visits += site.visits;
    });
  });

  // Get most visited sites
  insights.mostVisitedSites = Array.from(siteStats.entries())
    .map(([domain, stats]) => ({ domain, ...stats }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  // Get longest sessions
  insights.longestSessions = Array.from(siteStats.entries())
    .map(([domain, stats]) => ({ 
      domain, 
      averageSessionTime: stats.totalTime / stats.visits 
    }))
    .sort((a, b) => b.averageSessionTime - a.averageSessionTime)
    .slice(0, 5);

  // Get top distractions (unproductive sites with high visit counts)
  insights.distractions = Array.from(siteStats.entries())
    .map(([domain, stats]) => ({ domain, ...stats }))
    .filter(site => site.productivityScore < 0)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  return insights;
}

// Get goal achievement statistics
export async function getGoalAchievement(userId, startDate, endDate, userGoals) {
  const trackingData = await TrackingData.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const totalDays = trackingData.length;
  const achievementStats = {
    productiveHoursGoal: {
      achieved: 0,
      total: totalDays,
      targetHours: userGoals.productiveHours
    },
    unproductiveHoursGoal: {
      achieved: 0,
      total: totalDays,
      targetHours: userGoals.maxUnproductiveHours
    }
  };

  trackingData.forEach(day => {
    const productiveHours = day.dailySummary.productiveTime / (60 * 60 * 1000);
    const unproductiveHours = day.dailySummary.unproductiveTime / (60 * 60 * 1000);

    if (productiveHours >= userGoals.productiveHours) {
      achievementStats.productiveHoursGoal.achieved++;
    }
    if (unproductiveHours <= userGoals.maxUnproductiveHours) {
      achievementStats.unproductiveHoursGoal.achieved++;
    }
  });

  return achievementStats;
} 