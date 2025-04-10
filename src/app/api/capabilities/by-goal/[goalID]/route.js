import connectDB from '@/lib/mongodb';
import { Capability, Influence } from '@/models';

export async function GET(request, context) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // In Next.js 15, we need to access params after ensuring async context
    const { params } = context;
    const goalId = params.goalID;
    
    if (!goalId) {
      return new Response(JSON.stringify({ error: 'Goal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`API: Fetching capabilities for goal ${goalId}`);
    
    try {
      // 1. Find all influences where this goal is the target
      const influences = await Influence.find({ target: goalId });
      
      console.log(`API: Found ${influences.length} influences for goal ${goalId}`);
      
      // If no influences found, return empty array
      if (!influences || influences.length === 0) {
        console.log(`API: No influences found for goal ${goalId}`);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 2. Extract the capability IDs (sources)
      const capabilityIds = influences.map(influence => influence.source);
      console.log(`API: Extracted ${capabilityIds.length} capability IDs`);
      
      // 3. Fetch the actual capability documents
      const capabilities = await Capability.find({ _id: { $in: capabilityIds } });
      
      console.log(`API: Successfully found ${capabilities.length} capabilities for goal ${goalId}`);
      
      // 4. Group capabilities by parent-child relationships
      const parentCapabilities = capabilities.filter(cap => cap.isParent);
      const childCapabilities = capabilities.filter(cap => cap.parentId);
      
      // Get unique parent IDs from child capabilities
      const parentIdsFromChildren = [...new Set(
        childCapabilities
          .map(child => child.parentId)
          .filter(id => !capabilityIds.includes(id)) // Filter out parents already in our list
      )];
      
      // Fetch any parent capabilities that weren't directly part of the influence relationship
      let additionalParents = [];
      if (parentIdsFromChildren.length > 0) {
        additionalParents = await Capability.find({ _id: { $in: parentIdsFromChildren } });
      }
      
      // Combine all parent capabilities
      const allParentCapabilities = [...parentCapabilities, ...additionalParents];
      
      // Create a map of parent capabilities with their children
      const capabilitiesMap = allParentCapabilities.map(parent => {
        const children = childCapabilities.filter(child => 
          child.parentId === parent._id
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
      
      // Also include any capabilities that don't fit the parent-child model
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
      console.error(`API: Database query error for goal ${goalId}:`, queryError);
      
      // Return empty result instead of error to prevent UI from breaking
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    // Return empty result instead of error to prevent UI from breaking
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}