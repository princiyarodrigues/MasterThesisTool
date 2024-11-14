const connectDB = require('./mongodb');
const Department = require('../models/Department'); 
const { data } = require('./data');

async function seedDatabase() {
  try {
    const db = await connectDB();
    console.log('Connected to MongoDB');
    
    // Clear existing data
    const deleteResult = await Department.deleteMany({});
    console.log('Cleared existing data:', deleteResult);
    
    // Insert new data
    const result = await Department.insertMany(data);
    console.log(`Inserted ${result.length} departments`);
    
    return result;
  } catch (error) {
    console.error('Error in seed process:', error);
    throw error;
  }
}

module.exports = { seedDatabase };