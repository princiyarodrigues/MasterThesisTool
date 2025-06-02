const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for migration');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const migrate = async () => {
  try {
    await connectDB();
    
    // Get the DiagramSelection collection directly
    const db = mongoose.connection.db;
    const collection = db.collection('diagramselections');
    
    console.log('Starting migration...');
    
    // Find all documents without useCaseConnections field
    const documentsToUpdate = await collection.find({
      useCaseConnections: { $exists: false }
    }).toArray();
    
    console.log(`Found ${documentsToUpdate.length} documents to migrate`);
    
    if (documentsToUpdate.length > 0) {
      // Update all documents to add the useCaseConnections field
      const result = await collection.updateMany(
        { useCaseConnections: { $exists: false } },
        { $set: { useCaseConnections: [] } }
      );
      
      console.log(`Migration completed. Updated ${result.modifiedCount} documents.`);
    } else {
      console.log('No documents need migration.');
    }
    
    // Verify the migration
    const allDocs = await collection.find({}).toArray();
    console.log('Post-migration verification:');
    allDocs.forEach(doc => {
      console.log(`Document ${doc._id}: has useCaseConnections = ${!!doc.useCaseConnections}, length = ${doc.useCaseConnections?.length || 0}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the migration
migrate(); 