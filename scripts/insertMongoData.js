require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/lib/mongodb'); // Adjust the path accordingly
const fs = require('fs');
const { Capability, Goal, Composition, Influence } = require('../src/models'); // Adjust path if needed
require('dotenv').config();

// Load JSON data
const factoryPlanningCapabilities = JSON.parse(fs.readFileSync('scripts/businessCapabilitiesFactory.json', 'utf8'));
const productionPlanningCapabilities = JSON.parse(fs.readFileSync('scripts/businessCapabilitiesProduction.json', 'utf8'));
const technicalCapabilities = JSON.parse(fs.readFileSync('scripts/technicalCapabilities.json', 'utf8'));
const goals = JSON.parse(fs.readFileSync('scripts/goals.json', 'utf8'));
const compositions = JSON.parse(fs.readFileSync('scripts/composition_relationships.json', 'utf8'));
const influences = JSON.parse(fs.readFileSync('scripts/influence_relationships.json', 'utf8'));

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

// Function to ensure `_id` is stored as a **valid ObjectId** or **string**
const convertToObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id) 
        ? new mongoose.Types.ObjectId(id) 
        : id; // Keep as a string if not valid ObjectId
};

// Convert fields where necessary
capabilities.forEach(item => {
    item._id = item.identifier; // Keep `_id` as a string
    item.name = String(item.name);
});
goals.forEach(item => {
    item._id = item.identifier;
    item.name = String(item.name);
});
// Self referenced relationship for capabilites. It is 1 to 1 relationship where there are parent and multiple capabilites
compositions.forEach(item => {
    item._id = item.identifier;
    item.source = convertToObjectId(item.source);
    item.target = convertToObjectId(item.target);
});
// Many to many relationship beween capabilites and goals with the source as capability and target as goal
influences.forEach(item => {
    item._id = item.identifier;
    item.source = convertToObjectId(item.source);
    item.target = convertToObjectId(item.target);
});

async function seedDatabase() {
    try {
        await connectDB(); // ✅ Connect to MongoDB
        console.log('Connected to MongoDB');

        // Optional: Clear existing data
        await Promise.all([
            Capability.deleteMany({}),
            Goal.deleteMany({}),
            Composition.deleteMany({}),
            Influence.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // ✅ Insert new data using Mongoose models
        await Promise.all([
            Capability.insertMany(capabilities),
            Goal.insertMany(goals),
            Composition.insertMany(compositions),
            Influence.insertMany(influences)
        ]);
        console.log('Database seeded successfully!');

        await mongoose.connection.close(); // ✅ Close the connection properly
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();