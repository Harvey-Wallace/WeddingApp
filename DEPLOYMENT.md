# 🚀 Railway Deployment Guide

This guide will help you deploy your Wedding Photo Sharing App to Railway.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **AWS S3 Setup** (Optional but recommended for production)

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
   
   **Required for S3 (Production)**:
   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-wedding-photos-bucket
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
| `AWS_ACCESS_KEY_ID` | Production | Your AWS access key for S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | Production | Your AWS secret key for S3 uploads |
| `AWS_REGION` | Production | AWS region where your S3 bucket is located |
| `AWS_S3_BUCKET_NAME` | Production | Name of your S3 bucket for storing photos |

**Note**: The app works without S3 credentials for testing, but photos won't be permanently stored.

## Troubleshooting

### Build Issues
- Check the Railway build logs in your dashboard
- Ensure all dependencies are in `package.json`
- Make sure your Node.js version is compatible (18+ recommended)

### Upload Issues
- Verify S3 credentials are correct
- Check S3 bucket permissions
- Look at Railway logs for error details

### Performance
- Railway automatically handles scaling
- For high traffic, consider upgrading your Railway plan
- Monitor your S3 usage and costs

## Cost Estimates

### Railway
- **Hobby Plan**: $5/month (perfect for weddings)
- **Pro Plan**: $20/month (if you need more resources)

### AWS S3
- **Storage**: ~$0.023 per GB per month
- **Requests**: ~$0.0004 per 1,000 requests
- **Typical wedding**: $1-5 total for hundreds of photos

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
