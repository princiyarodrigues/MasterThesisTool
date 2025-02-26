// updateCapabilitiesCollections.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/lib/mongodb');
const fs = require('fs');
const path = require('path');
const { Capability, Composition, Influence } = require('../src/models');

async function updateCapabilitiesCollections() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Step 1: Clear existing capabilities but keep compositions and influences
    console.log('Clearing existing capabilities...');
    await Capability.deleteMany({});
    
    // Step 2: Load the three capability JSON files
    const scriptsDir = path.join(process.cwd(), 'scripts');
    
    const factoryPlanningCapabilities = JSON.parse(
      fs.readFileSync(path.join(scriptsDir, 'businessCapabilitiesFactory.json'), 'utf8')
    );
    const productionPlanningCapabilities = JSON.parse(
      fs.readFileSync(path.join(scriptsDir, 'businessCapabilitiesProduction.json'), 'utf8')
    );
    const technicalCapabilities = JSON.parse(
      fs.readFileSync(path.join(scriptsDir, 'technicalCapabilities.json'), 'utf8')
    );
    
    console.log(`Loaded ${factoryPlanningCapabilities.length} factory planning capabilities`);
    console.log(`Loaded ${productionPlanningCapabilities.length} production planning capabilities`);
    console.log(`Loaded ${technicalCapabilities.length} technical capabilities`);
    
    // Step 3: Add category to each capability
    factoryPlanningCapabilities.forEach(cap => {
      cap._id = cap.identifier; // Ensure _id is set to identifier
      cap.category = 'Factory Planning';
    });
    
    productionPlanningCapabilities.forEach(cap => {
      cap._id = cap.identifier;
      cap.category = 'Production Planning';
    });
    
    technicalCapabilities.forEach(cap => {
      cap._id = cap.identifier;
      cap.category = 'Technical';
    });
    
    // Step 4: Insert all capabilities
    const allCapabilities = [
      ...factoryPlanningCapabilities,
      ...productionPlanningCapabilities,
      ...technicalCapabilities
    ];
    
    const result = await Capability.insertMany(allCapabilities);
    console.log(`Successfully inserted ${result.length} capabilities into database`);
    
    // Step 5: Verify composition and influence relationships
    const compositions = await Composition.countDocuments();
    const influences = await Influence.countDocuments();
    console.log(`Verified ${compositions} compositions and ${influences} influences in database`);
    
    console.log('Capability collections update completed successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    return { success: true, count: result.length };
  } catch (error) {
    console.error('Error updating capabilities collections:', error);
    
    // Make sure to close the connection even if there's an error
    if (mongoose.connection) await mongoose.connection.close();
    
    throw error;
  }
}

// Run the function if executed directly
if (require.main === module) {
  updateCapabilitiesCollections()
    .then(result => {
      console.log('Update completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateCapabilitiesCollections };