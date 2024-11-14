import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find({});
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}