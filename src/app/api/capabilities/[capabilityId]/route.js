// src/app/api/capabilities/[capabilityId]/route.js
import { connectDB } from '@/lib/mongodb';
import { Capability } from '@/models';

export async function GET(request, context) {
  try {
    await connectDB();
    
    // In Next.js 15, access params via context parameter
    const { params } = context;
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
      
      // Check if this is a parent capability
      if (capability.isParent) {
        // Fetch its children
        const children = await Capability.find({ parentId: capabilityId });
        
        // Format parent with children
        const formattedCapability = {
          id: capability._id,
          name: capability.name,
          type: capability.type || 'Capability',
          category: capability.category,
          isParent: true,
          children: children.map(child => ({
            id: child._id,
            name: child.name,
            type: child.type || 'Capability',
            category: child.category,
            parentId: child.parentId
          }))
        };
        
        return new Response(JSON.stringify(formattedCapability), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Format standalone capability
      const formattedCapability = {
        id: capability._id,
        name: capability.name,
        type: capability.type || 'Capability',
        category: capability.category
      };
      
      return new Response(JSON.stringify(formattedCapability), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (dbError) {
      console.error(`API: Database error for capability ${capabilityId}:`, dbError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}