import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Timeline from '@/models/Timeline';

// GET - Fetch a single timeline by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline ID is required' 
        },
        { status: 400 }
      );
    }
    
    const timeline = await Timeline.findById(id).select('-__v');
    
    if (!timeline) {
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
      data: timeline
    });
    
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch timeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a timeline by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { title, description, startYear, endYear, tasks } = body;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline ID is required' 
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

// DELETE - Delete a timeline by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Timeline ID is required' 
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