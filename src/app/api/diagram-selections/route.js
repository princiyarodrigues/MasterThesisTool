import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { DiagramSelection, User } from '@/models';

// GET - Load user's diagram selections
export async function GET(req) {
  try {
    console.log('GET /api/diagram-selections - Starting request');
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log('GET - No session found');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('GET - Session found for:', session.user.email);
    await connectDB();
    console.log('GET - Connected to database');
    
    const { searchParams } = new URL(req.url);
    const diagramType = searchParams.get('diagramType') || 'reference-architecture';
    console.log('GET - Looking for diagram type:', diagramType);
    
    const selection = await DiagramSelection.findOne({ 
      userEmail: session.user.email,
      diagramType: diagramType
    });

    if (!selection) {
      // Return empty selections if none found
      console.log('GET - No existing selection found, returning empty defaults');
      return NextResponse.json({
        selections: {
          'datenquellen-grafisches-modell': [],
          'datenquellen-grafisches-datenmodell': [],
          'datenquellen-datenmodell': []
        },
        useCaseConnections: []
      });
    }

    console.log('GET - Found selection:', selection._id);
    console.log('GET - Selection has useCaseConnections field:', 'useCaseConnections' in selection);
    console.log('GET - UseCaseConnections length:', selection.useCaseConnections?.length || 0);
    
    // Ensure useCaseConnections exists for backward compatibility
    const responseData = {
      ...selection.toObject(),
      useCaseConnections: selection.useCaseConnections || []
    };
    
    console.log('GET - Returning data with useCaseConnections:', responseData.useCaseConnections?.length || 0);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('GET - Error loading diagram selections:', error);
    console.error('GET - Error stack:', error.stack);
    return NextResponse.json(
      { message: 'Error loading diagram selections', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Save user's diagram selections
export async function POST(req) {
  try {
    console.log('POST /api/diagram-selections - Starting request');
    
    const session = await getServerSession(authOptions);
    console.log('Session retrieved:', session ? 'Valid session' : 'No session');

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Request body parsed successfully');
    const { selections, useCaseConnections = [], diagramType = 'reference-architecture' } = body;

    if (!selections || typeof selections !== 'object') {
      console.log('Invalid selections data:', selections);
      return NextResponse.json(
        { message: 'Invalid selections data provided' },
        { status: 400 }
      );
    }

    // Validate useCaseConnections structure
    if (!Array.isArray(useCaseConnections)) {
      console.log('Invalid useCaseConnections data:', useCaseConnections);
      return NextResponse.json(
        { message: 'Invalid useCaseConnections data provided' },
        { status: 400 }
      );
    }

    // Validate each use case connection
    for (const connection of useCaseConnections) {
      if (!connection || typeof connection !== 'object' || 
          !connection.blockId || !connection.blockName || 
          !connection.containerId || !connection.elementId) {
        console.log('Invalid use case connection structure:', connection);
        return NextResponse.json(
          { message: 'Invalid use case connection structure' },
          { status: 400 }
        );
      }
    }

    // Validate selections structure
    const requiredContainers = [
      'datenquellen-grafisches-modell',
      'datenquellen-grafisches-datenmodell', 
      'datenquellen-datenmodell'
    ];
    
    for (const container of requiredContainers) {
      if (!Array.isArray(selections[container])) {
        console.log(`Invalid container format for: ${container}`);
        return NextResponse.json(
          { message: `Invalid selections format for container: ${container}` },
          { status: 400 }
        );
      }
      
      // Validate each block in the container
      for (const block of selections[container]) {
        if (!block || typeof block !== 'object' || !block.id || !block.name || !block.type) {
          console.log(`Invalid block structure in container ${container}:`, block);
          return NextResponse.json(
            { message: `Invalid block structure in container: ${container}` },
            { status: 400 }
          );
        }
      }
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Get user ID
    console.log('Finding user with email:', session.user.email);
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    console.log('User found:', user._id);

    // Upsert the diagram selection with better error handling
    console.log('POST - Attempting to save diagram selection...');
    console.log('POST - User ID:', user._id);
    console.log('POST - User Email:', session.user.email);
    console.log('POST - Diagram Type:', diagramType);
    console.log('POST - Selections count:', Object.values(selections).reduce((total, arr) => total + arr.length, 0));
    console.log('POST - Use case connections count:', useCaseConnections.length);
    console.log('POST - Use case connections data:', JSON.stringify(useCaseConnections, null, 2));
    
    const updateData = {
      userId: user._id,
      userEmail: session.user.email,
      diagramType: diagramType,
      selections: selections,
      useCaseConnections: useCaseConnections,
      updatedAt: new Date()
    };
    
    console.log('POST - Update data prepared:', {
      userId: updateData.userId,
      userEmail: updateData.userEmail,
      diagramType: updateData.diagramType,
      selectionsCount: Object.values(updateData.selections).reduce((total, arr) => total + arr.length, 0),
      useCaseConnectionsCount: updateData.useCaseConnections.length
    });
    
    const selection = await DiagramSelection.findOneAndUpdate(
      { 
        userEmail: session.user.email,
        diagramType: diagramType
      },
      updateData,
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );
    console.log('POST - Diagram selection saved successfully:', selection._id);
    console.log('POST - Saved use case connections count:', selection.useCaseConnections?.length || 0);
    console.log('POST - Saved use case connections data:', JSON.stringify(selection.useCaseConnections, null, 2));

    return NextResponse.json({
      message: 'Diagram selections saved successfully',
      selection: {
        id: selection._id,
        selections: selection.selections,
        useCaseConnections: selection.useCaseConnections,
        updatedAt: selection.updatedAt
      }
    });
  } catch (error) {
    console.error('Error saving diagram selections:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error while saving selections' },
      { status: 500 }
    );
  }
} 