# Railway Deployment Setup

## Environment Variables Required

In your Railway project dashboard, you need to set these environment variables:

### Required Cloudinary Variables
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Optional Configuration
```
CLOUDINARY_UPLOAD_FOLDER=wedding-photos
```

## How to Set Environment Variables on Railway

1. Go to your Railway project dashboard
2. Click on your service/deployment
3. Go to the "Variables" tab
4. Add each environment variable:
   - Click "New Variable"
   - Enter the name (e.g., `CLOUDINARY_CLOUD_NAME`)
   - Enter the value (your actual Cloudinary credentials)
   - Click "Add"

## Getting Cloudinary Credentials

1. Sign up at https://cloudinary.com (free tier available)
2. Go to your Dashboard
3. Copy the credentials:
   - Cloud Name
   - API Key  
   - API Secret

## Testing the Fix

After setting the environment variables and deploying:

1. Upload a test photo via the Upload tab
2. Switch to the Gallery tab
3. Photos should now display correctly in the slideshow

## Previous Issue

The slideshow wasn't working because:
1. Environment variables weren't set on Railway (photos API returned empty)
2. Upload API had a bug creating nested folders (fixed in latest commit)

The fallback sample photos in development mode don't affect production - they only show when Cloudinary isn't configured locally.
