import express from 'express';
import { auth } from '../middleware/auth.js';
import Tracking from '../models/Tracking.js';
import User from '../models/User.js';

const router = express.Router();

// Save tracking data
router.post('/save', auth, async (req, res) => {
  try {
    const { domain, startTime, endTime, duration } = req.body;
    
    const tracking = new Tracking({
      userId: req.user.id,
      domain,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration
    });

    await tracking.save();
    res.status(201).json(tracking);
  } catch (error) {
    res.status(500).json({ message: 'Error saving tracking data' });
  }
});

// Get tracking data
router.get('/data', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const tracking = await Tracking.find({
      userId: req.user.id,
      startTime: { 
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json(tracking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracking data' });
  }
});

export default router; 