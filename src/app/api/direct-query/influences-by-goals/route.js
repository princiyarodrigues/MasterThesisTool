import connectDB from '@/lib/mongodb';
import { Capability, Influence } from '@/models';

export async function POST(request) {
  try {
    await connectDB();
    
    // Parse request body to get goalIds
    let goalIds;
    try {
      const body = await request.json();
      goalIds = body.goalIds;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!goalIds || !Array.isArray(goalIds) || goalIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Goal IDs array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Direct Query API: Fetching influences for ${goalIds.length} goals:`, goalIds);
    
    try {
      // 1. Direct database query to get influences for all goals
      const influences = await Influence.find({ 
        target: { $in: goalIds } 
      });
      
      console.log(`Direct Query API: Found ${influences.length} influences for goals`);
      
      // If no influences found, return empty array
      if (!influences || influences.length === 0) {
        console.log('Direct Query API: No influences found');
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 2. Extract unique capability IDs (sources)
      const capabilityIds = [...new Set(influences.map(influence => influence.source))];
      console.log(`Direct Query API: Extracted ${capabilityIds.length} unique capability IDs`);
      
      // 3. Fetch all capabilities in a single query
      const allCapabilities = await Capability.find({});
      console.log(`Direct Query API: Fetched ${allCapabilities.length} total capabilities`);
      
      // Filter to ones we're looking for
      const capabilities = allCapabilities.filter(cap => 
        capabilityIds.includes(cap._id.toString())
      );
      console.log(`Direct Query API: Filtered to ${capabilities.length} relevant capabilities`);
      
      // 4. Group capabilities by parent-child relationships
      const parentCapabilities = capabilities.filter(cap => cap.isParent);
      const childCapabilities = capabilities.filter(cap => cap.parentId);
      
      // Get unique parent IDs from child capabilities
      const parentIds = [...new Set(childCapabilities.map(child => child.parentId))];
      
      // Find all parent capabilities, including ones that might not be directly related
      const allParents = allCapabilities.filter(cap => 
        cap.isParent || parentIds.includes(cap._id.toString())
      );
      
      // Identify target capability groups - update the detection logic to match actual capability names
      const targetParents = allParents.filter(parent => {
        const parentName = parent.name || '';
        // Check for various possible naming patterns
        return parentName.includes('Factory Planning') || 
              parentName.includes('Production Management') ||
              parentName.includes('FactoryPlanning') ||
              parentName.includes('ProductionManagement') ||
              parentName.includes('businessFactoryPlanningCapas') ||
              parentName.includes('BusinessProductionManagementCapas') ||
              // Log each parent to help debugging
              (console.log(`Checking parent: ${parent._id} - ${parentName}`), false);
      });
      
      // If no target parents found, add all capabilities as standalone
      if (targetParents.length === 0) {
        console.log('No target parents found, using all capabilities as is');
        
        // Return all relevant capabilities to ensure filtering works
        const allRelevantCapabilities = capabilities.map(capability => ({
          id: capability._id,
          name: capability.name,
          type: capability.type || 'Capability',
          category: capability.category,
          parentId: capability.parentId,
          isParent: capability.isParent
        }));
        
        return new Response(JSON.stringify(allRelevantCapabilities), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Direct Query API: Identified ${targetParents.length} target parent capabilities`);
      
      // Create a map of parent capabilities with their children
      const capabilitiesMap = targetParents.map(parent => {
        // Find children for this parent
        const children = allCapabilities.filter(cap => 
          cap.parentId === parent._id.toString()
        ).map(child => ({
          id: child._id,
          name: child.name,
          type: child.type || 'Capability',
          category: child.category,
          parentId: child.parentId
        }));
        
        return {
          id: parent._id,
          name: parent.name,
          type: parent.type || 'Capability',
          category: parent.category,
          isParent: true,
          children: children
        };
      });
      
      // Also include any standalone capabilities from our original list
      const standaloneCapabilities = capabilities.filter(cap => 
        !cap.isParent && !cap.parentId
      ).map(capability => ({
        id: capability._id,
        name: capability.name,
        type: capability.type || 'Capability',
        category: capability.category
      }));
      
      return new Response(JSON.stringify([...capabilitiesMap, ...standaloneCapabilities]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (queryError) {
      console.error('Direct Query API: Database query error:', queryError);
      
      return new Response(JSON.stringify({ error: queryError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Direct Query API Error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}