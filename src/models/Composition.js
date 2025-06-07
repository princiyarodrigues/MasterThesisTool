const mongoose = require('mongoose');

const compositionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  source_id: {
    type: String,
    required: [true, 'Source capability ID is required']
  },
  source_name: {
    type: String,
    required: [true, 'Source capability name is required']
  },
  target_id: {
    type: String,
    required: [true, 'Target capability ID is required']
  },
  target_name: {
    type: String,
    required: [true, 'Target capability name is required']
  },
  type: {
    type: String,
    default: 'Composition'
  }
}, { strict: false });

const Composition = mongoose.models.Composition || mongoose.model('Composition', compositionSchema);
module.exports = Composition;
