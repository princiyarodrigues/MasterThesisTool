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
      source: composition.source,
      target: composition.target,
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