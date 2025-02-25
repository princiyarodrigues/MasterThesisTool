import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Goal } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all goals from the database
    const goals = await Goal.find({});
    
    // Transform the data to match the format expected by the frontend
    const formattedGoals = goals.map(goal => ({
      id: goal._id,
      name: goal.name,
      type: goal.type || 'Goal' // Set a default type if not available
    }));
    
    return NextResponse.json(formattedGoals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}