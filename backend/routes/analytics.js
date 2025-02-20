import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import {
  getHourlyPatterns,
  getProductivityTrends,
  getCategoryDistribution,
  getProductivityInsights,
  getGoalAchievement
} from '../utils/dataAnalysis.js';

const router = express.Router();

// Get comprehensive analytics
router.get('/comprehensive', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = await User.findById(req.user.id);

    const [
      hourlyPatterns,
      trends,
      distribution,
      insights,
      goalAchievement
    ] = await Promise.all([
      getHourlyPatterns(req.user.id, startDate, endDate),
      getProductivityTrends(req.user.id, startDate, endDate),
      getCategoryDistribution(req.user.id, startDate, endDate),
      getProductivityInsights(req.user.id, startDate, endDate),
      getGoalAchievement(req.user.id, startDate, endDate, user.preferences.dailyGoals)
    ]);

    res.json({
      hourlyPatterns,
      trends,
      distribution,
      insights,
      goalAchievement
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Individual analytics endpoints
router.get('/hourly-patterns', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const patterns = await getHourlyPatterns(req.user.id, startDate, endDate);
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hourly patterns' });
  }
});

router.get('/trends', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const trends = await getProductivityTrends(req.user.id, startDate, endDate);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trends' });
  }
});

router.get('/insights', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const insights = await getProductivityInsights(req.user.id, startDate, endDate);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching insights' });
  }
});

export default router; 