const mongoose = require('mongoose');

const useCaseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'BusinessService'
  },
  // Optional fields for compatibility with the frontend
  title: {
    type: String
  },
  description: {
    type: String,
    default: 'Digital Twin Factory Use Case'
  },
  category: {
    type: String,
    default: 'Factory Planning'
  }
}, { strict: false });

module.exports = mongoose.models.UseCase || mongoose.model('UseCase', useCaseSchema); 