import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Capability } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all capabilities from the database
    const capabilities = await Capability.find({});
    
    // Group capabilities by parent-child relationships
    const parentCapabilities = capabilities.filter(cap => cap.isParent);
    const childCapabilities = capabilities.filter(cap => cap.parentId);
    
    // Create a map of parent capabilities with their children
    const capabilitiesMap = parentCapabilities.map(parent => {
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
    
    return NextResponse.json([...capabilitiesMap, ...standaloneCapabilities]);
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}