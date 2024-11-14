const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['active', 'done', 'in-progress', 'review'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  tags: [String],
  lastUpdated: { type: Date, default: Date.now },
  content: {
    statement: String,
    rationale: String,
    implications: [String]
  }
});

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  tags: [String],
  items: [itemSchema]
});

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  categories: [categorySchema]
});

// Make sure we're not recompiling the model if it already exists
const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

// Export as CommonJS module
module.exports = Department;