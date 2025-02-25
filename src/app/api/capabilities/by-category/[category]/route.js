import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Capability } from '@/models';

export async function GET(request, { params }) {
  try {
    const { category } = params;
    
    await connectDB();
    
    // Fetch capabilities by category
    const capabilities = await Capability.find({ category });
    
    // Transform the data to match the format expected by the frontend
    const formattedCapabilities = capabilities.map(capability => ({
      id: capability._id,
      name: capability.name,
      type: capability.type || 'Capability',
      category: capability.category
    }));
    
    return NextResponse.json(formattedCapabilities);
  } catch (error) {
    console.error('Error fetching capabilities by category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}