// src/app/api/capabilities/[capabilityId]/route.js
import { connectDB } from '@/lib/mongodb';
import { Capability } from '@/models';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { capabilityId } = params;
    
    if (!capabilityId) {
      return new Response(JSON.stringify({ error: 'Capability ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`API: Fetching capability with ID ${capabilityId}`);
    
    try {
      const capability = await Capability.findById(capabilityId);
      
      if (!capability) {
        console.log(`API: No capability found with ID ${capabilityId}`);
        return new Response(JSON.stringify({ error: 'Capability not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Format capability for response
      const formattedCapability = {
        id: capability._id,
        name: capability.name,
        type: capability.type,
        category: capability.category
      };
      
      return new Response(JSON.stringify(formattedCapability), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (queryError) {
      console.error(`API: Database query error for capability ${capabilityId}:`, queryError);
      
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