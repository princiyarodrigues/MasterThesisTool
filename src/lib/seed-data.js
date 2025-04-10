const connectDB = require('./mongodb');
const Department = require('../models/Department'); 
const { Capability, Goal, Composition, Influence, UseCase } = require('../models');
const { data } = require('./data');
const fs = require('fs');
const path = require('path');
const { seedUseCases } = require('./seed-use-cases');

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
    
    // Load JSON capability data from new locations
    const scriptsDir = path.join(process.cwd(), 'scripts');
    const rootDir = process.cwd();
    
    const factoryPlanningCapabilitiesData = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'BusinessFactoryPlanningCapas.json'), 'utf8')
    );
    const productionPlanningCapabilitiesData = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'BusinessProductionManagementCapas.json'), 'utf8')
    );
    const technicalCapabilities = JSON.parse(
      fs.readFileSync(path.join(scriptsDir, 'technicalCapabilities.json'), 'utf8')
    );
    
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
    
    // Load other data from new locations
    const goals = JSON.parse(fs.readFileSync(path.join(rootDir, 'goalsfirst.json'), 'utf8'));
    const compositionsRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'composition_capabilities_capabilitiesfirst.json'), 'utf8'));
    const influencesRaw = JSON.parse(fs.readFileSync(path.join(rootDir, 'influence_capabilities_goalsfirst.json'), 'utf8'));
    
    // Map the source and target fields correctly
    const compositions = compositionsRaw.map(item => ({
      ...item,
      source: item.source_id,
      target: item.target_id,
      _id: item.identifier
    }));
    
    const influences = influencesRaw.map(item => ({
      ...item,
      source: item.source_id,
      target: item.target_id,
      _id: item.identifier
    }));
    
    // Insert all data
    await Promise.all([
      Capability.insertMany(capabilities),
      Goal.insertMany(goals),
      Composition.insertMany(compositions),
      Influence.insertMany(influences)
    ]);
    console.log('Inserted capabilities, goals, compositions, and influences');
    
    // Seed use cases
    await seedUseCases();
    console.log('Use cases seeded successfully');
    
    return departmentResult;
  } catch (error) {
    console.error('Error in seed process:', error);
    throw error;
  }
}

module.exports = { seedDatabase };