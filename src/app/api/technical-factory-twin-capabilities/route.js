import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the TechnicalFactoryTwinCapas.json file
    const filePath = path.join(process.cwd(), 'TechnicalFactoryTwinCapas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const capabilities = JSON.parse(fileContents);
    
    return NextResponse.json(capabilities);
  } catch (error) {
    console.error('Error reading technical factory twin capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to load technical factory twin capabilities' },
      { status: 500 }
    );
  }
} 