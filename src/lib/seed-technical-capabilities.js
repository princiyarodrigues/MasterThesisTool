const fs = require('fs');
const path = require('path');
const connectDB = require('./mongodb');
const { TechnicalCapability } = require('../models');

async function seedTechnicalCapabilities() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB for seeding technical capabilities');

    // Read the JSON file
    const filePath = path.join(process.cwd(), 'TechnicalFactoryTwinCapas.json');
    console.log('Reading technical capabilities data from', filePath);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const technicalCapabilities = JSON.parse(fileData);

    console.log(`Found ${technicalCapabilities.length} technical capability maps to seed`);

    // Clear existing collections
    await TechnicalCapability.deleteMany({});
    console.log('Cleared existing technical capabilities');

    // Insert new data
    const result = await TechnicalCapability.insertMany(technicalCapabilities);
    console.log(`Successfully seeded ${result.length} technical capability maps`);

    return result;
  } catch (error) {
    console.error('Error seeding technical capabilities:', error);
    throw error;
  }
}

// Export the function to be called from other files
module.exports = {
  seedTechnicalCapabilities
};

// Run the function directly if this file is executed
if (require.main === module) {
  seedTechnicalCapabilities()
    .then(() => {
      console.log('Technical capabilities seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Technical capabilities seeding failed:', error);
      process.exit(1);
    });
} 