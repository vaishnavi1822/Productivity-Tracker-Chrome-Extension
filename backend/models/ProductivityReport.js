import mongoose from 'mongoose';

const productivityReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    start: Date,
    end: Date
  },
  summary: {
    totalTime: Number,
    productiveTime: Number,
    unproductiveTime: Number,
    productivityScore: Number,
    goalsAchieved: {
      productiveHours: Boolean,
      unproductiveHours: Boolean
    }
  },
  topProductiveSites: [{
    domain: String,
    timeSpent: Number,
    productivityScore: Number
  }],
  topUnproductiveSites: [{
    domain: String,
    timeSpent: Number,
    productivityScore: Number
  }],
  categoryBreakdown: {
    work: Number,
    social: Number,
    entertainment: Number,
    productivity: Number,
    other: Number
  }
}, {
  timestamps: true
});

productivityReportSchema.index({ userId: 1, 'period.start': 1, 'period.end': 1 });

export default mongoose.model('ProductivityReport', productivityReportSchema); 