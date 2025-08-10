# 🚀 Railway Deployment Guide

This guide will help you deploy your Wedding Photo Sharing App to Railway.

## Prerequisit- **Monitor Railway dashboard** for any issues
4. **Check Cloudinary dashboard** to confirm photos are uploading and view them

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **Cloudinary Account** - Sign up for free at [cloudinary.com](https://cloudinary.com)

## Quick Deployment Steps

### 1. Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Wedding Photo Sharing App"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name it something like `wedding-photo-sharing`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wedding-photo-sharing.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Railway

1. **Login to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `wedding-photo-sharing` repository

3. **Configure Environment Variables**:
   Click on your service → Variables → Add the following:
   
   **Required for Cloudinary (Production)**:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   
   **Optional**:
   ```
   NODE_ENV=production
   ```

4. **Deploy**:
   - Railway will automatically detect your Next.js app
   - It will build and deploy automatically
   - You'll get a public URL like `https://your-app.railway.app`

### 3. Custom Domain (Optional)

1. **In Railway Dashboard**:
   - Go to your service → Settings → Domains
   - Add your custom domain (e.g., `photos.yourwedding.com`)
   - Follow the DNS configuration instructions

## Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Production | Your Cloudinary cloud name (from dashboard) |
| `CLOUDINARY_API_KEY` | Production | Your Cloudinary API key (from dashboard) |
| `CLOUDINARY_API_SECRET` | Production | Your Cloudinary API secret (from dashboard) |

**Note**: The app works without Cloudinary credentials for testing, but photos won't be permanently stored.

## Troubleshooting

### Build Issues
- Check the Railway build logs in your dashboard
- Ensure all dependencies are in `package.json`
- Make sure your Node.js version is compatible (18+ recommended)

### Upload Issues
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for upload logs
- Look at Railway logs for error details

### Performance
- Railway automatically handles scaling
- For high traffic, consider upgrading your Railway plan
- Monitor your S3 usage and costs

## Cost Estimates

### Railway
- **Hobby Plan**: $5/month (perfect for weddings)
- **Pro Plan**: $20/month (if you need more resources)

### Cloudinary
- **Free Tier**: 25GB storage + 25GB bandwidth monthly (perfect for most weddings!)
- **Paid Plans**: Start at $89/month if you exceed free tier
- **Typical wedding**: Free tier should cover hundreds of photos easily

## Security Notes

1. **Environment Variables**: Never commit `.env` files to GitHub
2. **S3 Permissions**: Only give minimum required permissions
3. **Domain**: Use HTTPS (Railway provides this automatically)
4. **Rate Limiting**: Consider adding rate limiting for production use

## Post-Deployment

1. **Test the app** with a few photos
2. **Share the URL** with a small group first
3. **Monitor Railway dashboard** for any issues
4. **Check S3 bucket** to confirm photos are uploading

Your wedding photo sharing app will be live and ready for guests to use! 🎉
