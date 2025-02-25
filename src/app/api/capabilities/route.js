import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Capability } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all capabilities from the database
    const capabilities = await Capability.find({});
    
    // Transform the data to match the format expected by the frontend
    const formattedCapabilities = capabilities.map(capability => ({
      id: capability._id,
      name: capability.name,
      type: capability.type || 'Capability' // Set a default type if not available
    }));
    
    return NextResponse.json(formattedCapabilities);
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}