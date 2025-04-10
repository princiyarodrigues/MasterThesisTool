require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/lib/mongodb'); // Adjust the path accordingly
const fs = require('fs');
const path = require('path');
const { Capability, Goal, Composition, Influence } = require('../src/models'); // Adjust path if needed

// Get the root directory
const rootDir = process.cwd();

// Load JSON data from new locations
const factoryPlanningCapabilitiesData = JSON.parse(fs.readFileSync(path.join(rootDir, 'BusinessFactoryPlanningCapas.json'), 'utf8'));
const productionPlanningCapabilitiesData = JSON.parse(fs.readFileSync(path.join(rootDir, 'BusinessProductionManagementCapas.json'), 'utf8'));
const technicalCapabilities = JSON.parse(fs.readFileSync(path.join(rootDir, 'scripts', 'technicalCapabilities.json'), 'utf8'));
const goals = JSON.parse(fs.readFileSync(path.join(rootDir, 'goalsfirst.json'), 'utf8'));
const compositions = JSON.parse(fs.readFileSync(path.join(rootDir, 'composition_capabilities_capabilitiesfirst.json'), 'utf8'));
const influences = JSON.parse(fs.readFileSync(path.join(rootDir, 'influence_capabilities_goalsfirst.json'), 'utf8'));

console.log(`Loaded data: ${goals.length} goals, ${influences.length} influences, ${compositions.length} compositions`);

// Extract capabilities from parent-child structure
const factoryPlanningCapabilities = [];
factoryPlanningCapabilitiesData.forEach(item => {
  // Add the parent capability
  const parent = {
    _id: item.map.identifier,
    identifier: item.map.identifier,
    name: item.map.name,
    type: 'Capability',
    isParent: true
  };
  factoryPlanningCapabilities.push(parent);
  
  // Add all children capabilities
  if (item.children_capabilities && Array.isArray(item.children_capabilities)) {
    item.children_capabilities.forEach(child => {
      child.parentId = item.map.identifier;
      factoryPlanningCapabilities.push(child);
    });
  }
});

const productionPlanningCapabilities = [];
productionPlanningCapabilitiesData.forEach(item => {
  // Add the parent capability
  const parent = {
    _id: item.map.identifier,
    identifier: item.map.identifier,
    name: item.map.name,
    type: 'Capability',
    isParent: true
  };
  productionPlanningCapabilities.push(parent);
  
  // Add all children capabilities
  if (item.children_capabilities && Array.isArray(item.children_capabilities)) {
    item.children_capabilities.forEach(child => {
      child.parentId = item.map.identifier;
      productionPlanningCapabilities.push(child);
    });
  }
});

// Add category to each capability
factoryPlanningCapabilities.forEach(cap => {
    cap.category = 'Factory Planning';
});

productionPlanningCapabilities.forEach(cap => {
    cap.category = 'Production Planning';
});

technicalCapabilities.forEach(cap => {
    cap.category = 'Technical';
});

// Combine all capabilities
const capabilities = [
    ...factoryPlanningCapabilities,
    ...productionPlanningCapabilities,
    ...technicalCapabilities
];

// Preserving IDs exactly as they are in the source files
// This ensures that string IDs like "id-88910bb6647348ea8a0ee615178a455a" are preserved
capabilities.forEach(item => {
    item._id = item.identifier; // Keep the ID exactly as it is in the source
    item.name = String(item.name);
});

goals.forEach(item => {
    item._id = item.identifier; // Keep the ID exactly as it is in the source
    item.name = String(item.name);
});

compositions.forEach(item => {
    item._id = item.identifier; // Keep the ID exactly as it is in the source
    item.source = item.source_id; // Use source_id as source
    item.target = item.target_id; // Use target_id as target
});

influences.forEach(item => {
    item._id = item.identifier; // Keep the ID exactly as it is in the source
    item.source = item.source_id; // Use source_id as source
    item.target = item.target_id; // Use target_id as target
});

// Log sample data for verification
console.log('Sample goal:', goals[0]);
console.log('Sample influence:', influences[0]);
console.log('Sample composition:', compositions[0]);
console.log('Sample capability:', capabilities[0]);

async function seedDatabase() {
    let connection;
    try {
        // Connect to MongoDB
        connection = await connectDB();
        console.log('Successfully connected to MongoDB');

        // Get the database instance
        const db = mongoose.connection.db;
        
        // Optional: Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            Capability.deleteMany({}),
            Goal.deleteMany({}),
            Composition.deleteMany({}),
            Influence.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // Insert capabilities
        console.log(`Inserting ${capabilities.length} capabilities...`);
        await Capability.insertMany(capabilities, { ordered: false });
        
        // Insert goals
        console.log(`Inserting ${goals.length} goals...`);
        await Goal.insertMany(goals, { ordered: false });
        
        // Insert compositions
        console.log(`Inserting ${compositions.length} compositions...`);
        await Composition.insertMany(compositions, { ordered: false });
        
        // Insert influences
        console.log(`Inserting ${influences.length} influences...`);
        await Influence.insertMany(influences, { ordered: false });
        
        console.log('Database seeded successfully!');
        
        // Verify data was inserted correctly
        const goalsCount = await Goal.countDocuments();
        const influencesCount = await Influence.countDocuments();
        const capabilitiesCount = await Capability.countDocuments();
        const compositionsCount = await Composition.countDocuments();
        
        console.log(`Verification: ${goalsCount} goals, ${influencesCount} influences, ${capabilitiesCount} capabilities, ${compositionsCount} compositions in database`);
        
        // Sample query to verify an ID can be found
        if (goals.length > 0) {
            const sampleGoalId = goals[0]._id;
            const foundGoal = await Goal.findById(sampleGoalId);
            console.log(`Verification query for goal ${sampleGoalId}: ${foundGoal ? 'FOUND' : 'NOT FOUND'}`);
        }
        
        if (influences.length > 0) {
            const sampleInfluenceId = influences[0]._id;
            const foundInfluence = await Influence.findById(sampleInfluenceId);
            console.log(`Verification query for influence ${sampleInfluenceId}: ${foundInfluence ? 'FOUND' : 'NOT FOUND'}`);
        }

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Close the connection properly
        if (connection) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    }
}

// Run the seed function
seedDatabase();