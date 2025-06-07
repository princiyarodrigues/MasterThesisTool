// src/app/api/compositions/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Composition } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all composition relationships from the database
    const compositions = await Composition.find({});
    
    // Transform the data to match the format expected by the frontend
    const formattedCompositions = compositions.map(composition => ({
      id: composition._id,
      source_id: composition.source_id,
      source_name: composition.source_name,
      target_id: composition.target_id,
      target_name: composition.target_name,
      type: composition.type || 'Composition'
    }));
    
    return NextResponse.json(formattedCompositions);
  } catch (error) {
    console.error('Error fetching compositions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Get the composition data from the request body
    const compositionData = await request.json();
    
    // Clear existing compositions
    await Composition.deleteMany({});
    
    // Insert new composition data
    const formattedCompositions = compositionData.map(comp => ({
      _id: comp.identifier,
      source_id: comp.source_id,
      source_name: comp.source_name,
      target_id: comp.target_id,
      target_name: comp.target_name,
      type: comp.type || 'Composition'
    }));
    
    await Composition.insertMany(formattedCompositions);
    
    console.log(`Successfully updated ${formattedCompositions.length} composition relationships`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${formattedCompositions.length} composition relationships` 
    });
  } catch (error) {
    console.error('Error updating compositions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}