const mongoose = require('mongoose');

const technicalCapabilitySchema = new mongoose.Schema({
  map: {
    identifier: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  children_capabilities: [
    {
      identifier: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'Capability'
      },
      name: {
        type: String,
        required: true
      }
    }
  ]
}, { strict: false });

module.exports = mongoose.models.TechnicalCapability || mongoose.model('TechnicalCapability', technicalCapabilitySchema); 