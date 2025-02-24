const mongoose = require('mongoose');

const capabilitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Capability name is required']
  },
  type: {
    type: String
  }
}, { strict: false });

const Capability = mongoose.models.Capability || mongoose.model('Capability', capabilitySchema);
module.exports = Capability;
