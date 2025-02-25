import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Capability, Influence } from '@/models';

export async function GET(request, { params }) {
  try {
    const { goalId } = params;
    
    await connectDB();
    
    // Find influences where the target is the specified goalId
    const influences = await Influence.find({ target: goalId });
    
    // Extract capability IDs from influences
    const capabilityIds = influences.map(influence => influence.source);
    
    // Fetch the capabilities with those IDs
    const capabilities = await Capability.find({ 
      _id: { $in: capabilityIds } 
    });
    
    // Transform the data to match the format expected by the frontend
    const formattedCapabilities = capabilities.map(capability => ({
      id: capability._id,
      name: capability.name,
      type: capability.type || 'Capability'
    }));
    
    return NextResponse.json(formattedCapabilities);
  } catch (error) {
    console.error('Error fetching capabilities by goal:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}