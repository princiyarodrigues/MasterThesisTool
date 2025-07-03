const mongoose = require('mongoose');

// Task schema for individual tasks within a timeline
const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true
  },
  start: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end: {
    type: Date,
    required: [true, 'End date is required']
  },
  duration: {
    type: Number,
    required: true
  }
}, { _id: false }); // Don't create separate _id for tasks

// Main timeline schema
const timelineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous timelines for now
  },
  userEmail: {
    type: String,
    required: false // Allow anonymous timelines for now
  },
  title: {
    type: String,
    required: [true, 'Timeline title is required'],
    trim: true,
    default: 'Untitled Timeline'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  startYear: {
    type: Number,
    required: true,
    min: 2020,
    max: 2050
  },
  endYear: {
    type: Number,
    required: true,
    min: 2020,
    max: 2050
  },
  tasks: {
    type: [taskSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field on save
timelineSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
timelineSchema.index({ userId: 1, createdAt: -1 });
timelineSchema.index({ userEmail: 1, createdAt: -1 });

// Virtual for task count
timelineSchema.virtual('taskCount').get(function() {
  return this.tasks.length;
});

const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', timelineSchema);

module.exports = Timeline; 