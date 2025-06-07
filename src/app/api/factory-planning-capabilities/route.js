import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the BusinessFactoryPlanningCapas.json file
    const filePath = path.join(process.cwd(), 'BusinessFactoryPlanningCapas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const capabilities = JSON.parse(fileContents);
    
    return NextResponse.json(capabilities);
  } catch (error) {
    console.error('Error reading factory planning capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to load factory planning capabilities' },
      { status: 500 }
    );
  }
} 