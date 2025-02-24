const mongoose = require('mongoose');

const influenceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: [true, 'Source capability is required']
  },
  target: {
    type: String,
    required: [true, 'Target goal is required']
  }
}, { strict: false });

const Influence = mongoose.models.Influence || mongoose.model('Influence', influenceSchema);
module.exports = Influence;
