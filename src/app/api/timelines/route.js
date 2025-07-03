import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Timeline from '@/models/Timeline';

// GET - Fetch all timelines or filter by user
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    
    let query = {};
    if (userId) {
      query.userId = userId;
    } else if (userEmail) {
      query.userEmail = userEmail;
    }
    
    const timelines = await Timeline.find(query)
      .sort({ updatedAt: -1 })
      .select('-__v');
    
    return NextResponse.json({
      success: true,
      data: timelines,
      count: timelines.length
    });
    
  } catch (error) {
    console.error('Error fetching timelines:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch timelines',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new timeline
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, description, startYear, endYear, tasks, userId, userEmail } = body;
    
    // Validate required fields
    if (!title || !startYear || !endYear) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: title, startYear, endYear' 
        },
        { status: 400 }
      );
    }
    
    // Validate year range
    if (startYear > endYear) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Start year cannot be greater than end year' 
        },
        { status: 400 }
      );
    }
    
    // Create new timeline
    const timeline = new Timeline({
      title,
      description: description || '',
      startYear,
      endYear,
      tasks: tasks || [],
      userId: userId || null,
      userEmail: userEmail || null
    });
    
    const savedTimeline = await timeline.save();
    
    return NextResponse.json(
      {
        success: true,
        data: savedTimeline,
        message: 'Timeline created successfully'
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating timeline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create timeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update an existing timeline
export async function PUT(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, title, description, startYear, endYear, tasks } = body;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline ID is required for updates' 
        },
        { status: 400 }
      );
    }
    
    // Find and update the timeline
    const updatedTimeline = await Timeline.findByIdAndUpdate(
      id,
      {
        title,
        description,
        startYear,
        endYear,
        tasks,
        updatedAt: new Date()
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!updatedTimeline) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTimeline,
      message: 'Timeline updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating timeline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update timeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a timeline
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline ID is required for deletion' 
        },
        { status: 400 }
      );
    }
    
    const deletedTimeline = await Timeline.findByIdAndDelete(id);
    
    if (!deletedTimeline) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Timeline deleted successfully',
      data: { id: deletedTimeline._id }
    });
    
  } catch (error) {
    console.error('Error deleting timeline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete timeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 