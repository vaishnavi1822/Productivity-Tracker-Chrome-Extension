import mongoose from 'mongoose';

const siteDataSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  visits: {
    type: Number,
    default: 0,
    min: 0
  },
  lastVisit: Date,
  category: {
    type: String,
    enum: ['work', 'social', 'entertainment', 'productivity', 'other'],
    default: 'other'
  },
  productivityScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  }
});

const trackingDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sites: [siteDataSchema],
  dailySummary: {
    totalTime: {
      type: Number,
      default: 0
    },
    productiveTime: {
      type: Number,
      default: 0
    },
    unproductiveTime: {
      type: Number,
      default: 0
    },
    productivityScore: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
trackingDataSchema.index({ userId: 1, date: 1 });

// Method to calculate daily summary
trackingDataSchema.methods.calculateDailySummary = function() {
  const summary = {
    totalTime: 0,
    productiveTime: 0,
    unproductiveTime: 0,
    productivityScore: 0
  };

  this.sites.forEach(site => {
    summary.totalTime += site.timeSpent;
    
    if (site.productivityScore > 0) {
      summary.productiveTime += site.timeSpent;
    } else if (site.productivityScore < 0) {
      summary.unproductiveTime += site.timeSpent;
    }
  });

  if (summary.totalTime > 0) {
    summary.productivityScore = (summary.productiveTime - summary.unproductiveTime) / summary.totalTime;
  }

  this.dailySummary = summary;
};

// Pre-save middleware to calculate summary
trackingDataSchema.pre('save', function(next) {
  this.calculateDailySummary();
  next();
});

export default mongoose.model('TrackingData', trackingDataSchema); 