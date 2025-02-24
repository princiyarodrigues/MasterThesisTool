const mongoose = require('mongoose');
const { Capability, Composition, Influence } = require('../src/models'); // Adjust path if needed

async function getCapabilitiesForGoals(goalIds) {
    try {
        // Ensure goalIds are strings (avoiding ObjectId usage)
        goalIds = goalIds.map(id => String(id));

        // 1️⃣ Find all influences where target is one of the given goals
        const influences = await Influence.find({ target: { $in: goalIds } });

        // Extract unique capability IDs that influence the goals
        const capabilityIds = [...new Set(influences.map(influence => String(influence.source)))];

        if (capabilityIds.length === 0) {
            return { message: "No capabilities found for the given goals." };
        }

        // 2️⃣ Fetch capabilities that influence the goals
        const capabilities = await Capability.find({ _id: { $in: capabilityIds } });

        // 3️⃣ Find parent-child relationships from the Composition collection
        const compositions = await Composition.find({ target: { $in: capabilityIds } });

        // Create a map of child -> parent relationships
        const parentMap = {};
        compositions.forEach(comp => {
            parentMap[String(comp.target)] = String(comp.source);
        });

        // 4️⃣ Fetch parent capabilities
        const parentIds = [...new Set(compositions.map(comp => String(comp.source)))];
        const parentCapabilities = await Capability.find({ _id: { $in: parentIds } });

        // Create a map for parent capability details
        const parentDetailsMap = {};
        parentCapabilities.forEach(parent => {
            parentDetailsMap[String(parent._id)] = {
                _id: parent._id,
                name: parent.name,
                type: parent.type
            };
        });

        // 5️⃣ Create a mapping of capabilities to goals
        const capabilityGoalMap = {};
        influences.forEach(influence => {
            const sourceId = String(influence.source);
            if (!capabilityGoalMap[sourceId]) {
                capabilityGoalMap[sourceId] = [];
            }
            capabilityGoalMap[sourceId].push(influence.target);
        });

        // 6️⃣ Organize the response into a structured format
        const responseMap = {};

        capabilities.forEach(capability => {
            const capabilityId = String(capability._id);
            const parentId = parentMap[capabilityId] || "no_parent";

            if (!responseMap[parentId]) {
                responseMap[parentId] = {
                    details: parentDetailsMap[parentId] || null,
                    childCapabilities: []
                };
            }

            responseMap[parentId].childCapabilities.push({
                details: {
                    _id: capability._id,
                    name: capability.name,
                    type: capability.type
                },
                goals: capabilityGoalMap[capabilityId] || []
            });
        });

        // Convert responseMap object to an array for better output format
        return Object.values(responseMap);
    } catch (error) {
        console.error("Error fetching capabilities:", error);
        return { error: "An error occurred while fetching capabilities." };
    }
}

// // Usage Example
// const goalIds = ["goal_1", "goal_2"]; // Replace with actual goal IDs
// getCapabilitiesForGoals(goalIds).then(result => console.log(JSON.stringify(result, null, 2)));

module.exports = getCapabilitiesForGoals;