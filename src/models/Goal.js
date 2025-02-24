const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required']
  }
}, { strict: false });

const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
module.exports = Goal;
