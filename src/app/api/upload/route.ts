import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Check if S3 is configured
const isS3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY && 
  process.env.AWS_S3_BUCKET_NAME
);

// Configure S3 client only if credentials are available
const s3Client = isS3Configured ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}) : null;

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'wedding-photos-bucket';

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

    // If S3 is not configured, simulate success for development
    if (!isS3Configured || !s3Client) {
      console.log('S3 not configured - simulating upload for development');
      return NextResponse.json({
        message: `Simulated upload of ${files.length} photo(s) - S3 not configured`,
        successful: files.length,
        failed: 0,
        results: files.map(file => ({
          success: true,
          fileName: file.name,
          s3Key: `simulated-upload-${Date.now()}`,
        })),
        development: true,
      });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `wedding-photos/${timestamp}-${randomString}.${fileExtension}`;

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      };

      try {
        await s3Client.send(new PutObjectCommand(uploadParams));
        return {
          success: true,
          fileName: file.name,
          s3Key: fileName,
        };
      } catch (s3Error) {
        console.error('S3 upload error:', s3Error);
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
