import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { UseCase, Capability } from '@/models';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const capabilityId = searchParams.get('capabilityId');
    
    // Create base query
    let query = {};
    
    // If capability ID is provided, find use cases related to this capability
    if (capabilityId) {
      console.log(`Filtering use cases by capability ID: ${capabilityId}`);
      
      // Array to hold all capability IDs to filter by (parent + children if applicable)
      let capabilityIds = [capabilityId];
      
      // Check if this is a parent capability and get its children
      try {
        const capability = await Capability.findById(capabilityId);
        if (capability && capability.isParent) {
          console.log(`Found parent capability: ${capability.name}`);
          
          // Find all child capabilities with this parent
          const childCapabilities = await Capability.find({ parentId: capabilityId });
          
          if (childCapabilities && childCapabilities.length > 0) {
            console.log(`Found ${childCapabilities.length} child capabilities`);
            
            // Add all child capability IDs to our filter array
            const childIds = childCapabilities.map(child => child._id.toString());
            capabilityIds = [...capabilityIds, ...childIds];
            
            console.log(`Filtering by capabilities: ${capabilityIds.join(', ')}`);
          }
        }
      } catch (err) {
        console.error('Error checking for child capabilities:', err);
        // Continue with just the parent ID if there's an error
      }
      
      try {
        // Read usecases_flow_realization.json to get relationships
        const rootDir = process.cwd();
        const relationsData = JSON.parse(
          fs.readFileSync(path.join(rootDir, 'usecases_flow_realization.json'), 'utf8')
        );
        
        // Extract realization relationships
        const realizationRelations = relationsData.realization_relations || [];
        console.log(`Total realization relations in file: ${realizationRelations.length}`);
        
        // Find relations where target_id matches any of our capability IDs
        const matchingRelations = realizationRelations.filter(relation => 
          capabilityIds.includes(relation.target_id)
        );
        
        if (matchingRelations.length > 0) {
          console.log(`Found ${matchingRelations.length} matching relations for capabilities ${capabilityIds.join(', ')}`);
          
          // Extract source_id (use case IDs) from matching relations
          const useCaseIds = matchingRelations.map(relation => relation.source_id);
          console.log(`Extracted use case IDs from flow relationships: ${useCaseIds.join(', ')}`);
          
          // Find use cases that match these IDs
          const flowRelatedUseCases = await UseCase.find({ 
            identifier: { $in: useCaseIds } 
          });
          
          if (flowRelatedUseCases.length > 0) {
            console.log(`Found ${flowRelatedUseCases.length} use cases from flow relationships`);
            
            // Get IDs of use cases from the flow relationships
            const flowUseCaseIds = flowRelatedUseCases.map(uc => uc._id.toString());
            
            // Also find any use cases directly tagged with these capabilities
            const directlyTaggedUseCases = await UseCase.find({ 
              'relatedCapabilities.capabilityId': { $in: capabilityIds },
              _id: { $nin: flowUseCaseIds } // Exclude the ones we already found
            });
            
            console.log(`Found ${directlyTaggedUseCases.length} additional directly tagged use cases`);
            
            // Combine both sets of use cases
            const combinedUseCases = [...flowRelatedUseCases, ...directlyTaggedUseCases];
            
            // Transform the data to match the format expected by the frontend
            const formattedUseCases = combinedUseCases.map(useCase => ({
              id: useCase._id,
              title: useCase.title || useCase.name.replace(/^Use Case \d+: /, ''),
              description: useCase.description || `Digital Twin Factory Use Case related to ${useCase.name}`,
              category: useCase.category || 'Factory Planning',
              type: useCase.type === 'BusinessService' ? 'production' : useCase.type,
              // Pass through any capabilities information
              relatedCapabilities: useCase.relatedCapabilities || []
            }));
            
            return NextResponse.json(formattedUseCases);
          }
        }
        
        console.log(`No flow relations found for capabilities ${capabilityIds.join(', ')} or no matching use cases`);
        // Fall through to check for directly tagged use cases
        
      } catch (error) {
        console.error('Error processing usecases_flow_realization.json:', error);
        // Fallback to direct capability matching if file processing fails
      }
      
      // Query by directly related capabilities 
      query = { 'relatedCapabilities.capabilityId': { $in: capabilityIds } };
    }
    
    // Fetch use cases from the database
    const useCases = await UseCase.find(query).sort({ useCaseNumber: 1 });
    
    // If no use cases found, return empty array
    if (!useCases || useCases.length === 0) {
      return NextResponse.json([]);
    }
    
    // Transform the data to match the format expected by the frontend
    const formattedUseCases = useCases.map(useCase => ({
      id: useCase._id,
      title: useCase.title || useCase.name.replace(/^Use Case \d+: /, ''),
      description: useCase.description || `Digital Twin Factory Use Case related to ${useCase.name}`,
      category: useCase.category || 'Factory Planning',
      type: useCase.type === 'BusinessService' ? 'production' : useCase.type,
      // Pass through any capabilities information
      relatedCapabilities: useCase.relatedCapabilities || []
    }));
    
    return NextResponse.json(formattedUseCases);
  } catch (error) {
    console.error('Error fetching use cases:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Parse the request body
    const body = await request.json();
    
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required fields' },
        { status: 400 }
      );
    }
    
    // Create a unique ID if not provided
    if (!body._id) {
      // Count existing use cases to generate next ID
      const count = await UseCase.countDocuments({});
      const nextId = count + 1;
      body._id = `uc-${nextId.toString().padStart(3, '0')}`;
    }
    
    // Create the new use case
    const newUseCase = await UseCase.create(body);
    
    return NextResponse.json({
      id: newUseCase._id,
      title: newUseCase.title,
      description: newUseCase.description,
      category: newUseCase.category,
      type: newUseCase.type || 'production'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating use case:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 