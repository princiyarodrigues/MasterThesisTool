const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { UseCase } = require('../models');
const connectDB = require('./mongodb');

async function seedUseCases() {
  try {
    // Connect to the database
    await connectDB();
    
    // Get the root directory
    const rootDir = process.cwd();
    
    // Read usecases.json
    console.log('Reading usecases.json...');
    const useCasesData = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'usecases.json'), 'utf8')
    );
    
    // Read usecases_flow_realization.json to get relationships
    console.log('Reading usecases_flow_realization.json...');
    const useCasesRelations = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'usecases_flow_realization.json'), 'utf8')
    );
    
    // Extract realization relationships (use case to capability)
    const realizationRelations = useCasesRelations.realization_relations || [];
    
    console.log(`Found ${useCasesData.length} use cases and ${realizationRelations.length} capability relationships`);
    
    // Create a map of use case to capabilities
    const useCaseToCapabilitiesMap = {};
    
    realizationRelations.forEach(relation => {
      const useCaseId = relation.source_id;
      const capabilityId = relation.target_id;
      
      if (!useCaseToCapabilitiesMap[useCaseId]) {
        useCaseToCapabilitiesMap[useCaseId] = [];
      }
      
      useCaseToCapabilitiesMap[useCaseId].push({
        capabilityId,
        capabilityName: relation.target_name
      });
    });
    
    // Enhance use cases with their related capabilities
    const enhancedUseCases = useCasesData.map(useCase => {
      // Extract use case number from name (e.g., "Use Case 1: ..." -> "1")
      const useCaseNumber = useCase.name.match(/Use Case (\d+):/);
      const number = useCaseNumber ? useCaseNumber[1] : '0';
      
      // Extract title from the name (e.g., "Use Case 1: Title" -> "Title")
      const title = useCase.name.replace(/^Use Case \d+: /, '');
      
      return {
        _id: useCase.identifier,
        identifier: useCase.identifier,
        name: useCase.name,
        type: useCase.type,
        title,
        // Add category based on the title for better filtering
        category: getCategoryFromTitle(title),
        // Add related capabilities
        relatedCapabilities: useCaseToCapabilitiesMap[useCase.identifier] || [],
        // Add a numeric field for sorting
        useCaseNumber: parseInt(number, 10) || 0
      };
    });
    
    // Clear existing use cases
    console.log('Clearing existing use cases...');
    await UseCase.deleteMany({});
    
    // Insert new use cases
    console.log('Inserting new use cases...');
    await UseCase.insertMany(enhancedUseCases);
    
    console.log(`${enhancedUseCases.length} use cases seeded successfully!`);
    
    return true;
  } catch (error) {
    console.error('Error seeding use cases:', error);
    throw error;
  }
}

// Helper function to determine category from title
function getCategoryFromTitle(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('monitor') || titleLower.includes('überwach')) {
    return 'Monitoring';
  } else if (titleLower.includes('optimier') || titleLower.includes('optimiz') || titleLower.includes('rekonfigur')) {
    return 'Prozessoptimierung';
  } else if (titleLower.includes('test') || titleLower.includes('virtuelle') || titleLower.includes('simulation')) {
    return 'Simulation';
  } else if (titleLower.includes('predictive') || titleLower.includes('wartung') || titleLower.includes('maintenance')) {
    return 'Instandhaltung';
  } else if (titleLower.includes('energie')) {
    return 'Energiemanagement';
  } else if (titleLower.includes('qualität')) {
    return 'Qualitätsmanagement';
  } else if (titleLower.includes('automatisier')) {
    return 'Automatisierung';
  } else if (titleLower.includes('worker') || titleLower.includes('personal') || titleLower.includes('mitarbeiter')) {
    return 'Personalmanagement';
  } else {
    return 'Factory Planning';
  }
}

module.exports = { seedUseCases }; 