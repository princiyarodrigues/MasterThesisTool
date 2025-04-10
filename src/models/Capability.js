const mongoose = require('mongoose');

const capabilitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'Capability'
  },
  category: {
    type: String,
    enum: ['Factory Planning', 'Production Planning', 'Technical']
  },
  // New fields for parent-child relationships
  parentId: {
    type: String,
    ref: 'Capability',
    required: false
  },
  isParent: {
    type: Boolean,
    default: false
  }
}, { strict: false });

module.exports = mongoose.models.Capability || mongoose.model('Capability', capabilitySchema);