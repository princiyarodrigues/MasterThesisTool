const connectDB = require('./mongodb');
const Department = require('../models/Department'); 
const { Capability, Goal, Composition, Influence } = require('../models');
const { data } = require('./data');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  try {
    const db = await connectDB();
    console.log('Connected to MongoDB');
    
    // Clear existing departments data
    const deleteResult = await Department.deleteMany({});
    console.log('Cleared existing department data:', deleteResult);
    
    // Insert new department data
    const departmentResult = await Department.insertMany(data);
    console.log(`Inserted ${departmentResult.length} departments`);
    
    // Clear existing capabilities, goals, compositions, influences data
    await Promise.all([
      Capability.deleteMany({}),
      Goal.deleteMany({}),
      Composition.deleteMany({}),
      Influence.deleteMany({})
    ]);
    console.log('Cleared existing capability data');
    
    // Load JSON capability data
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
    
    // Add categories
    factoryPlanningCapabilities.forEach(cap => cap.category = 'Factory Planning');
    productionPlanningCapabilities.forEach(cap => cap.category = 'Production Planning');
    technicalCapabilities.forEach(cap => cap.category = 'Technical');
    
    // Combine capabilities
    const capabilities = [
      ...factoryPlanningCapabilities,
      ...productionPlanningCapabilities,
      ...technicalCapabilities
    ];
    
    // Load other data
    const goals = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'goals.json'), 'utf8'));
    const compositions = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'composition_relationships.json'), 'utf8'));
    const influences = JSON.parse(fs.readFileSync(path.join(scriptsDir, 'influence_relationships.json'), 'utf8'));
    
    // Insert all data
    await Promise.all([
      Capability.insertMany(capabilities),
      Goal.insertMany(goals),
      Composition.insertMany(compositions),
      Influence.insertMany(influences)
    ]);
    console.log('Inserted capabilities, goals, compositions, and influences');
    
    return departmentResult;
  } catch (error) {
    console.error('Error in seed process:', error);
    throw error;
  }
}

module.exports = { seedDatabase };