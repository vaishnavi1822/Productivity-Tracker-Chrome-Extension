import express from 'express';
import { auth } from '../middleware/auth.js';
import ProductivityReport from '../models/ProductivityReport.js';
import TrackingData from '../models/TrackingData.js';
import { generateReport } from '../utils/reportGenerator.js';

const router = express.Router();

// Generate and save a new report
router.post('/generate', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Generate report using utility function
    const report = await generateReport(req.user.id, new Date(startDate), new Date(endDate));
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
});

// Get reports for a date range
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const reports = await ProductivityReport.find({
      userId: req.user.id,
      'period.start': { $gte: new Date(startDate) },
      'period.end': { $lte: new Date(endDate) }
    }).sort({ 'period.start': -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

export default router; 