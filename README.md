# 💕 Wedding Photo Sharing App

A beautiful, simple web application that allows wedding guests to upload and share photos from your special day! No login required - just drag, drop, and share the love.

## ✨ Features

- **Simple & Elegant**: Clean, wedding-appropriate design
- **No Authentication**: Guests can upload instantly without creating accounts  
- **Mobile-First**: Responsive design that works perfectly on phones and computers
- **Drag & Drop**: Easy photo uploads with modern drag-and-drop interface
- **Cloud Storage**: Photos are securely stored in Cloudinary with automatic optimization
- **Multiple Formats**: Supports JPEG, PNG, WebP, and HEIC files
- **Real-time Feedback**: Upload progress and success notifications

## 🚀 Quick Start

### 1. Clone and Install
```bash
npm install
```

### 2. Set up Environment Variables (Optional)
Copy the environment template:
```bash
cp .env.example .env.local
```

**For production**, add your Cloudinary credentials to `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**For development/testing**, you can leave the Cloudinary variables empty - the app will work but photos won't be permanently stored.

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ AWS S3 Setup (For Production)

1. **Create an S3 Bucket**:
   - Go to AWS S3 Console
   - Create a new bucket (e.g., `your-wedding-photos-2025`)
   - Enable public read access if you want to view photos later

2. **Create AWS IAM User**:
   - Go to AWS IAM Console
   - Create a new user with programmatic access
   - Attach policy with S3 permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-wedding-photos-bucket/*"
       }
     ]
   }
   ```

3. **Add credentials to `.env.local`** (see step 2 above)

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Deploy! Your guests can start uploading photos immediately.

### Other Deployment Options
- **Netlify**: Works great with Next.js
- **AWS Amplify**: Native AWS integration
- **Railway**: Simple deployment platform

## 🎨 Customization

### Change Colors & Styling
Edit `src/app/globals.css` and the Tailwind classes in components to match your wedding theme.

### Update Text & Messages
Modify the text in:
- `src/app/page.tsx` - Main page content
- `src/components/PhotoUpload.tsx` - Upload messages

### Add Your Names
Update the page title and messages to include your names and wedding details.

## 📱 How Guests Use It

1. **Visit your website** on any device
2. **Drag photos** into the upload area OR **click to browse**
3. **Watch the upload progress** - photos are automatically saved
4. **Get confirmation** when photos are successfully uploaded
5. **That's it!** No accounts, no hassle.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS v4** - Modern, utility-first CSS framework
- **React Dropzone** - Drag-and-drop file uploads
- **Cloudinary** - Reliable cloud storage with automatic image optimization
- **Lucide Icons** - Beautiful, consistent icons

## 📸 Photo Management

### Accessing Uploaded Photos
Photos are stored in your Cloudinary account. You can:
- View them in the Cloudinary Dashboard
- Download them via the web interface
- Use Cloudinary's API to build a photo gallery
- Get optimized URLs for sharing

### Photo Organization
Photos are automatically organized in Cloudinary with:
- **Date-based folders**: Photos grouped by upload date (YYYY-MM-DD)
- **Unique identifiers**: Timestamp + random string for each photo
- **Automatic tagging**: 'wedding', 'guest-upload', and date tags
- **Metadata preservation**: Original filename and upload timestamp
- **Automatic optimization**: Multiple formats and sizes generated

Example structure:
```
your-wedding-photos/
├── 2025-08-10/
│   ├── 1691234567890-abc123.jpg
│   └── 1691234567891-def456.jpg
├── 2025-08-11/
│   └── 1691321234567-ghi789.jpg
```

## 🎉 Perfect for Your Big Day!

This app is designed to capture all the candid, beautiful moments that professional photographers might miss. Your guests become your photographers, sharing their unique perspectives of your special day.

## 📄 License

MIT License - feel free to customize and use for your wedding!

---

**Made with 💕 for an unforgettable wedding day**
