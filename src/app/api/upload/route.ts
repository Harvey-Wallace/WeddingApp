import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // If Cloudinary is not configured, simulate success for development
    if (!isCloudinaryConfigured) {
      console.log('Cloudinary not configured - simulating upload for development');
      return NextResponse.json({
        message: `Simulated upload of ${files.length} photo(s) - Cloudinary not configured`,
        successful: files.length,
        failed: 0,
        results: files.map(file => ({
          success: true,
          fileName: file.name,
          url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`,
          publicId: `simulated-upload-${Date.now()}`,
        })),
        development: true,
      });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert buffer to base64 for Cloudinary
      const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Generate unique public ID
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const publicId = `wedding-photos/${timestamp}-${randomString}`;

      try {
        const result = await cloudinary.uploader.upload(base64String, {
          public_id: publicId,
          folder: 'wedding-photos',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
          context: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
          },
        });

        return {
          success: true,
          fileName: file.name,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return {
          success: false,
          fileName: file.name,
          error: 'Failed to upload to cloud storage',
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return NextResponse.json({
      message: `Uploaded ${successful.length} photo(s) successfully`,
      successful: successful.length,
      failed: failed.length,
      results,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For development/testing without S3 credentials
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
