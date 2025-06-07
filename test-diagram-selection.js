const mongoose = require('mongoose');

// Test schema directly
const useCaseConnectionSchema = new mongoose.Schema({
  blockId: { type: String, required: true },
  blockName: { type: String, required: true },
  containerId: { type: String, required: true },
  elementId: { type: String, required: true }
}, { _id: false });

const testSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  useCaseConnections: { type: [useCaseConnectionSchema], default: [] }
});

const TestModel = mongoose.model('TestDiagramSelection', testSchema);

async function testModel() {
  try {
    // Connect to MongoDB (you'll need to update this with your connection string)
    await mongoose.connect('mongodb://localhost:27017/knowledge-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Test creating a document with useCaseConnections
    const testDoc = new TestModel({
      userEmail: 'test@example.com',
      useCaseConnections: [{
        blockId: 'test-block-1',
        blockName: 'Test Block',
        containerId: 'datenquellen-grafisches-modell',
        elementId: 'arbeitsablaufschema'
      }]
    });
    
    console.log('Test document created:', testDoc);
    console.log('UseCaseConnections:', testDoc.useCaseConnections);
    
    // Try to save it
    const savedDoc = await testDoc.save();
    console.log('Document saved successfully:', savedDoc._id);
    console.log('Saved useCaseConnections:', savedDoc.useCaseConnections);
    
    // Try to find it
    const foundDoc = await TestModel.findById(savedDoc._id);
    console.log('Found document:', foundDoc);
    console.log('Found useCaseConnections:', foundDoc.useCaseConnections);
    
    // Clean up
    await TestModel.deleteOne({ _id: savedDoc._id });
    console.log('Test document deleted');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testModel(); 