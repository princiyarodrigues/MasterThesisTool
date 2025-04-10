import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import { TechnicalCapability } from '@/models';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const mapId = searchParams.get('mapId');
    
    // Create base query
    let query = {};
    
    // If mapId is provided, filter by parent map
    if (mapId) {
      console.log(`Filtering technical capabilities by map ID: ${mapId}`);
      query = { "map.identifier": mapId };
    }
    
    // Fetch technical capabilities from the database
    const technicalCapabilities = await TechnicalCapability.find(query);
    
    // If no capabilities found, try to read from file as fallback
    if (!technicalCapabilities || technicalCapabilities.length === 0) {
      console.log('No technical capabilities found in database, using fallback file data');
      
      // Read from JSON file as fallback
      const filePath = path.join(process.cwd(), 'TechnicalFactoryTwinCapas.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileData);
      
      // Filter by mapId if provided
      const filteredData = mapId 
        ? jsonData.filter(item => item.map.identifier === mapId)
        : jsonData;
      
      return NextResponse.json(filteredData);
    }
    
    return NextResponse.json(technicalCapabilities);
  } catch (error) {
    console.error('Error fetching technical capabilities:', error);
    
    // Fallback to file if database error
    try {
      const filePath = path.join(process.cwd(), 'TechnicalFactoryTwinCapas.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileData);
      
      return NextResponse.json(jsonData);
    } catch (fileError) {
      console.error('Error reading fallback file:', fileError);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
} 