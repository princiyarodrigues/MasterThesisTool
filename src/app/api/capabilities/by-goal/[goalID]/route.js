import connectDB from '@/lib/mongodb';
import { Capability, Influence } from '@/models';

export async function GET(request, { params }) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // In Next.js 15, params must be awaited
    const goalId = params.goalId;
    
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
      
      // 4. Map to a client-friendly format
      const formattedCapabilities = capabilities.map(cap => ({
        id: cap._id,
        name: cap.name,
        type: cap.type,
        category: cap.category
      }));
      
      return new Response(JSON.stringify(formattedCapabilities), {
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