import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET: Fetch the user's strategic goal selections
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Find the user and get their selections
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's strategic goal selections or an empty object if none exist
    return NextResponse.json(user.strategicGoalSelections || {});
  } catch (error) {
    console.error('Error fetching strategic goal selections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Save the user's strategic goal selections
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { selections } = body;

    if (!selections) {
      return NextResponse.json(
        { error: 'No selections provided' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Update the user's strategic goal selections
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { strategicGoalSelections: selections } },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Selections saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving strategic goal selections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}