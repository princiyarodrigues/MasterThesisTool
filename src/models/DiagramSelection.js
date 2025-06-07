const mongoose = require('mongoose');

// Define the block schema for elements that can be dropped
const blockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { _id: false }); // Don't create _id for subdocuments

// Define the use case connection schema
const useCaseConnectionSchema = new mongoose.Schema({
  blockId: {
    type: String,
    required: true
  },
  blockName: {
    type: String,
    required: true
  },
  containerId: {
    type: String,
    required: true
  },
  elementId: {
    type: String,
    required: true
  }
}, { _id: false }); // Don't create _id for subdocuments

const diagramSelectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  diagramType: {
    type: String,
    required: true,
    default: 'reference-architecture'
  },
  selections: {
    'datenquellen-grafisches-modell': {
      type: [blockSchema],
      default: []
    },
    'datenquellen-grafisches-datenmodell': {
      type: [blockSchema], 
      default: []
    },
    'datenquellen-datenmodell': {
      type: [blockSchema],
      default: []
    }
  },
  useCaseConnections: {
    type: [useCaseConnectionSchema],
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

// Compound index to ensure one selection per user per diagram type
diagramSelectionSchema.index({ userEmail: 1, diagramType: 1 }, { unique: true });

// Update the updatedAt field on save
diagramSelectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  console.log('DiagramSelection pre-save hook triggered');
  console.log('UseCaseConnections being saved:', this.useCaseConnections?.length || 0);
  next();
});

// Log validation errors
diagramSelectionSchema.post('validate', function(error, doc, next) {
  if (error) {
    console.error('DiagramSelection validation error:', error);
  }
  next();
});

const DiagramSelection = mongoose.models.DiagramSelection || mongoose.model('DiagramSelection', diagramSelectionSchema);
module.exports = DiagramSelection; 