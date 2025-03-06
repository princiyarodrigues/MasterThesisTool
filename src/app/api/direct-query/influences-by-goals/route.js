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
      
      // 3. Fetch capabilities in a single query
      const capabilities = await Capability.find({ _id: { $in: capabilityIds } });
      console.log(`Direct Query API: Found ${capabilities.length} capabilities`);
      
      // 4. Format capabilities for response
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