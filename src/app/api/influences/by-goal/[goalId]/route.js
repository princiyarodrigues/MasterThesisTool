import connectDB from '@/lib/mongodb';
import { Influence } from '@/models';

export async function GET(request, context) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // In Next.js 15, access params via context
    const { params } = context;
    const goalId = params.goalId;
    
    if (!goalId) {
      return new Response(JSON.stringify({ error: 'Goal ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`API: Fetching influences for goal ${goalId}`);
    
    try {
      // Find all influences where this goal is the target
      const influences = await Influence.find({ target: goalId });
      
      console.log(`API: Found ${influences.length} influences for goal ${goalId}`);
      
      // Format influences for response
      const formattedInfluences = influences.map(influence => ({
        id: influence._id,
        source: influence.source,
        target: influence.target,
        type: influence.type
      }));
      
      return new Response(JSON.stringify(formattedInfluences), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (queryError) {
      console.error(`API: Database query error for goal ${goalId}:`, queryError);
      
      return new Response(JSON.stringify({ error: queryError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}