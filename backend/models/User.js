import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const productivityRuleSchema = new mongoose.Schema({
  domain: String,
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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    blockedSites: [String],
    blockingSchedule: {
      type: Map,
      of: [Number],
      default: {}
    },
    dailyGoals: {
      productiveHours: {
        type: Number,
        default: 6
      },
      maxUnproductiveHours: {
        type: Number,
        default: 2
      }
    },
    workingHours: {
      start: {
        type: Number,
        default: 9,
        min: 0,
        max: 23
      },
      end: {
        type: Number,
        default: 17,
        min: 0,
        max: 23
      }
    },
    productivityRules: [productivityRuleSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to check if a site should be blocked
userSchema.methods.shouldBlockSite = function(domain, hour) {
  if (!this.preferences.blockedSites.includes(domain)) {
    return false;
  }

  const schedule = this.preferences.blockingSchedule.get(domain);
  if (!schedule) {
    return true; // Always block if no schedule is set
  }

  return schedule.includes(hour);
};

// Method to get productivity score for a domain
userSchema.methods.getProductivityScore = function(domain) {
  const rule = this.preferences.productivityRules.find(r => r.domain === domain);
  return rule ? rule.productivityScore : 0;
};

export default mongoose.model('User', userSchema); 