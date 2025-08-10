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
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Search for photos in the wedding folder
    const result = await cloudinary.search
      .expression('folder:wedding-photos/*')
      .sort_by('uploaded_at', 'desc')
      .max_results(limit)
      .execute();

    // Transform the results to include optimized URLs
    const photos = result.resources.map((resource: {
      public_id: string;
      uploaded_at: string;
      tags?: string[];
    }) => ({
      id: resource.public_id,
      url: cloudinary.url(resource.public_id, {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      }),
      thumbnail: cloudinary.url(resource.public_id, {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
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
