# Media Library Setup Guide - Netlify Deployment

## Overview

The media library is now fully configured to work with **Netlify Functions** for secure R2 uploads. Here's what you need to know:

## Architecture

```
Frontend (React)
    ↓ (Upload request)
Netlify Function (netlify/functions/generate-presigned-url.ts)
    ↓ (Calls AWS SDK)
Cloudflare R2 Bucket
    ↓ (Direct upload via presigned URL)
Browser
    ↓ (Save metadata)
Supabase Database
```

## How It Works

1. **User selects files** → MediaUpload component validates them locally
2. **Frontend calls** `/api/generate-presigned-url` (Netlify Function)
3. **Netlify Function**:
   - Verifies Supabase auth token
   - Validates file type and size
   - Generates presigned URL using AWS SDK + R2 credentials
   - Returns presigned URL to browser (valid for 15 minutes)
4. **Browser uploads directly** to R2 using presigned URL with progress tracking
5. **On success**, metadata saved to Supabase `media` table
6. **MediaLibrary refreshes** and displays new file

## Local Development with Netlify

### Install Dependencies (Already Done)
```bash
npm install  # Includes netlify-cli
```

### Run Local Dev Server
```bash
npm run dev
```

This command:
- Starts Vite dev server (http://localhost:3000)
- Starts Netlify Functions server (http://localhost:8888)
- Proxies `/api/*` to Netlify Functions

### Test the Media Upload
1. Go to http://localhost:3000
2. Click "Media" in sidebar
3. Click "Upload Files"
4. Drag and drop files or click to select
5. Watch upload progress
6. Files appear in grid after upload

## Environment Variables

Your `.env` file already has all required variables:

```bash
# Frontend (visible in browser)
VITE_R2_ACCOUNT_ID=d4c23ede1b944d66353daa2df1ee804b
VITE_R2_BUCKET_NAME=177dff3c-4769-4bca-a398-0df6f32b177f
VITE_R2_PUBLIC_URL=https://ketsuronmedia.com

# Backend (server-side only, kept secure)
R2_ACCESS_KEY_ID=c7a5710ed21813b5e9e2c2077835f1aa
R2_SECRET_ACCESS_KEY=24a1e81f11eee188b01a7a3f778fe88f88979050337e66044619a6f46bd1745b
```

**⚠️ Security Note**: The `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are only used server-side in Netlify Functions and are never exposed to the client.

## Netlify Configuration

### netlify.toml

```toml
[build]
command = "npm run build"
functions = "netlify/functions"
publish = "dist"

[dev]
command = "vite"
port = 5173

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200
```

This tells Netlify:
- **Build**: Run `npm run build`, output in `dist/`
- **Functions**: Look for functions in `netlify/functions/`
- **Redirects**: Route `/api/*` to Netlify Functions

## Deployment to Netlify

### Step 1: Push to Git
```bash
git add .
git commit -m "Add media library with Netlify Functions"
git push
```

### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Netlify detects `netlify.toml` automatically

### Step 3: Set Environment Variables in Netlify UI
1. Go to Site settings → Environment
2. Add these variables:
   ```
   VITE_R2_ACCOUNT_ID = d4c23ede1b944d66353daa2df1ee804b
   VITE_R2_BUCKET_NAME = 177dff3c-4769-4bca-a398-0df6f32b177f
   VITE_R2_PUBLIC_URL = https://ketsuronmedia.com
   R2_ACCESS_KEY_ID = c7a5710ed21813b5e9e2c2077835f1aa
   R2_SECRET_ACCESS_KEY = 24a1e81f11eee188b01a7a3f778fe88f88979050337e66044619a6f46bd1745b
   ```
3. Click "Save"

### Step 4: Netlify Auto-Deploys
- Any push to your connected branch triggers automatic deployment
- Functions are deployed with your site
- Environment variables are available to functions at runtime

## File Structure

```
project-root/
├── netlify/
│   └── functions/
│       └── generate-presigned-url.ts    ← Netlify Function (server-side)
├── src/
│   ├── components/
│   │   └── Media/
│   │       ├── Media.tsx               ← Container
│   │       ├── MediaLibrary.tsx        ← Grid view
│   │       ├── MediaUpload.tsx         ← Upload UI
│   │       └── MediaCard.tsx           ← Card component
│   ├── lib/
│   │   ├── r2.ts                       ← Upload utilities (client)
│   │   └── fileValidation.ts           ← File validation
│   └── App.tsx                         ← Includes Media route
├── netlify.toml                         ← Netlify config
├── package.json                         ← Updated scripts
└── .env                                 ← Your R2 credentials
```

## Features

### Upload
✅ Drag & drop support
✅ File validation (type, size, magic bytes)
✅ Progress tracking per file
✅ Direct R2 upload (not through your server)
✅ Secure presigned URLs (15 min expiry)

### Management
✅ Grid view with thumbnails
✅ Search by filename
✅ Filter by type (images/documents)
✅ Copy URL button
✅ Download button
✅ Delete (owner only)

### Security
✅ Backend generates presigned URLs
✅ R2 credentials never exposed to client
✅ File type validation on client & server
✅ MIME type whitelist
✅ Magic byte verification
✅ Supabase auth token verification
✅ 15-minute URL expiry

## Troubleshooting

### Uploads not working locally?
1. Make sure `.env` file exists and has all variables
2. Run `npm install` to install netlify-cli
3. Try `npm run dev` (not `vite dev`)
4. Check browser console for errors

### Function not found on deploy?
1. Verify `netlify.toml` exists in root
2. Verify `netlify/functions/generate-presigned-url.ts` exists
3. Check Netlify Function logs in dashboard

### Presigned URL generation fails?
1. Verify R2 credentials in Netlify environment variables
2. Check function logs: `netlify functions:list`
3. Make sure auth token is being sent

### Files not uploading to R2?
1. Verify R2 bucket name is correct
2. Check CORS configuration in Cloudflare dashboard
3. Verify bucket allows PUT operations for your domain

## Next Steps

1. **Test locally**: `npm run dev` → Visit http://localhost:3000 → Upload test file
2. **Deploy to Netlify**: Push to git, Netlify auto-deploys
3. **Set environment variables** in Netlify dashboard
4. **Test on live site** after deployment

## Support

For issues with:
- **Media uploads**: Check browser console
- **Netlify Functions**: Check function logs in Netlify dashboard
- **R2 uploads**: Verify CORS and bucket settings in Cloudflare dashboard
- **Supabase**: Check auth token and database permissions

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
