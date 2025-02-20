import TrackingData from '../models/TrackingData.js';
import User from '../models/User.js';

export async function handleTaskUpdate(payload) {
  try {
    // Save tasks to database
    await User.findByIdAndUpdate(payload.userId, {
      'preferences.tasks': payload.tasks
    });
    return true;
  } catch (error) {
    console.error('Error handling task update:', error);
    return false;
  }
}

export async function handleFocusSessionUpdate(payload) {
  try {
    // Save focus session data
    await TrackingData.findOneAndUpdate(
      { userId: payload.userId, date: new Date().toISOString().split('T')[0] },
      {
        $set: {
          'focusSession.stats': payload.stats,
          'focusSession.sessionCount': payload.sessionCount
        }
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error handling focus session update:', error);
    return false;
  }
} 