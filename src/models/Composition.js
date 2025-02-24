const mongoose = require('mongoose');

const compositionSchema = new mongoose.Schema({
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
    required: [true, 'Target capability is required']
  }
}, { strict: false });

const Composition = mongoose.models.Composition || mongoose.model('Composition', compositionSchema);
module.exports = Composition;
