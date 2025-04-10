const fs = require('fs');

// Read the influence_capabilities_goalsfirst.json file
const inputFile = '/Users/princiya/Desktop/knowledge-portal/influence_capabilities_goalsfirst.json';
const outputFile = '/Users/princiya/Desktop/knowledge-portal/scripts/influence_relationships.json';

try {
  // Read the input file
  const data = fs.readFileSync(inputFile, 'utf8');
  const influences = JSON.parse(data);
  
  // Transform the data to the required format
  const transformedInfluences = influences.map(influence => ({
    identifier: influence.identifier,
    type: influence.type,
    source: influence.source_id,
    target: influence.target_id
  }));
  
  // Write the transformed data to the output file
  fs.writeFileSync(outputFile, JSON.stringify(transformedInfluences, null, 2), 'utf8');
  
  console.log(`Successfully converted ${influences.length} influence relationships.`);
  console.log(`Output saved to ${outputFile}`);
} catch (error) {
  console.error('Error:', error.message);
} 