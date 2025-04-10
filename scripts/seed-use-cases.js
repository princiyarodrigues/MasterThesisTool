// Load environment variables from .env file
require('dotenv').config();

const { seedUseCases } = require('../src/lib/seed-use-cases');

async function runSeed() {
  try {
    await seedUseCases();
    console.log('Use cases seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding use cases:', error);
    process.exit(1);
  }
}

runSeed(); 