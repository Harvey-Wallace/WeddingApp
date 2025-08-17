import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary not configured - returning empty result');
      return NextResponse.json({
        photos: [],
        hasMore: false,
        total: 0,
        message: 'Cloudinary not configured'
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Use the same folder configuration as upload
    const customFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'wedding-photos';
    
    // Search for photos - try multiple approaches for flexibility
    let result;
    
    try {
      // First try: search in the configured folder
      result = await cloudinary.search
        .expression(`folder:${customFolder}/*`)
        .sort_by('uploaded_at', 'desc')
        .max_results(limit)
        .execute();
    } catch (error) {
      console.warn(`Failed to search in folder ${customFolder}, trying broader search...`, error);
      
      // Fallback: search by tags (wedding photos should have 'wedding' tag)
      result = await cloudinary.search
        .expression('tags:wedding OR tags:guest-upload')
        .sort_by('uploaded_at', 'desc')
        .max_results(limit)
        .execute();
    }
    
    // If still no results, try searching in common folder names
    if (!result || result.resources.length === 0) {
      console.warn('No photos found with standard search, trying common folder names...');
      
      const commonFolders = ['KellysWedding', 'wedding-photos', 'wedding', 'photos'];
      
      for (const folder of commonFolders) {
        try {
          result = await cloudinary.search
            .expression(`folder:${folder}/*`)
            .sort_by('uploaded_at', 'desc')
            .max_results(limit)
            .execute();
            
          if (result && result.resources.length > 0) {
            console.log(`Found photos in folder: ${folder}`);
            break;
          }
        } catch (folderError) {
          console.warn(`Failed to search in folder ${folder}:`, folderError);
        }
      }
    }

    // Transform the results to include optimized URLs
    const photos = result.resources.map((resource: {
      public_id: string;
      uploaded_at: string;
      tags?: string[];
    }) => ({
      id: resource.public_id,
      url: cloudinary.url(resource.public_id, {
        width: 1200,
        height: 1200,
        crop: 'limit',
        quality: 'auto'
      }),
      thumbnail: cloudinary.url(resource.public_id, {
        width: 300,
        height: 300,
        crop: 'limit',
        quality: 'auto'
      }),
      uploadedAt: resource.uploaded_at,
      tags: resource.tags || []
    }));

    return NextResponse.json({
      photos,
      hasMore: result.resources.length === limit,
      total: result.total_count || 0
    });

  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
