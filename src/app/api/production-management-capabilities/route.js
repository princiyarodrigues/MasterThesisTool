import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the BusinessProductionManagementCapas.json file
    const filePath = path.join(process.cwd(), 'BusinessProductionManagementCapas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const capabilities = JSON.parse(fileContents);
    
    return NextResponse.json(capabilities);
  } catch (error) {
    console.error('Error reading production management capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to load production management capabilities' },
      { status: 500 }
    );
  }
} 