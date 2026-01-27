# Cloudflare R2 Setup Guide

This guide walks you through setting up Cloudflare R2 for media storage.

## What is R2?

Cloudflare R2 is an S3-compatible object storage service with no egress fees. It's used by this CMS to store uploaded media files (images, documents, etc.).

## Prerequisites

- A Cloudflare account ([Sign up free](https://cloudflare.com))
- A payment method on file (R2 requires billing setup, but has a generous free tier)

## Step 1: Enable R2

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. In the left sidebar, click **R2**
3. If prompted, complete billing setup (you won't be charged for the free tier)

## Step 2: Create a Bucket

1. Click **Create bucket**
2. Enter a bucket name (e.g., `my-cms-media`)
3. Choose a location hint (optional, for performance)
4. Click **Create bucket**

## Step 3: Configure Public Access

You have two options for public access:

### Option A: R2.dev Subdomain (Quick Setup)

1. Go to your bucket's **Settings** tab
2. Under "Public access", click **Allow Access**
3. Copy the provided R2.dev URL (e.g., `https://pub-abc123.r2.dev`)
4. Use this as your `VITE_R2_PUBLIC_URL`

### Option B: Custom Domain (Recommended for Production)

1. Go to your bucket's **Settings** tab
2. Under "Custom Domains", click **Connect Domain**
3. Enter your subdomain (e.g., `media.yourdomain.com`)
4. Follow the DNS verification steps
5. Use this domain as your `VITE_R2_PUBLIC_URL`

## Step 4: Configure CORS

For browser uploads to work, you need to configure CORS:

1. Go to your bucket's **Settings** tab
2. Scroll to **CORS Policy**
3. Click **Edit CORS Policy**
4. Add the following configuration:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

For production, replace `"*"` in AllowedOrigins with your actual domains:

```json
[
  {
    "AllowedOrigins": [
      "https://yourcms.netlify.app",
      "https://yourdomain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 5: Create API Token

1. Go to **R2** > **Manage R2 API Tokens** (or click your bucket > Overview > Manage API tokens)
2. Click **Create API token**
3. Configure the token:
   - **Token name**: `CMS Media Upload`
   - **Permissions**: Object Read & Write
   - **Specify bucket(s)**: Select your bucket
   - **TTL**: Optional (leave blank for no expiration)
4. Click **Create API Token**
5. **IMPORTANT**: Copy both values immediately:
   - Access Key ID → `R2_ACCESS_KEY_ID`
   - Secret Access Key → `R2_SECRET_ACCESS_KEY`

   ⚠️ The secret is only shown once!

## Step 6: Get Your Account ID

1. Look at your browser URL when viewing any Cloudflare page
2. The Account ID is in the URL: `dash.cloudflare.com/ACCOUNT_ID/...`
3. Or go to **Account Home** > **Account ID** on the right sidebar
4. Copy this value → `VITE_R2_ACCOUNT_ID`

## Summary of Values Needed

| Variable | Where to Find |
|----------|---------------|
| `VITE_R2_ACCOUNT_ID` | Cloudflare Dashboard URL or Account Home |
| `VITE_R2_BUCKET_NAME` | The name you gave your bucket |
| `VITE_R2_PUBLIC_URL` | R2.dev URL or your custom domain |
| `R2_ACCESS_KEY_ID` | Generated API token |
| `R2_SECRET_ACCESS_KEY` | Generated API token (shown once!) |

## Testing Your Setup

After configuring environment variables, you can test the upload:

1. Start the dev server: `npm run dev`
2. Complete the setup wizard or log in
3. Go to **Media** in the sidebar
4. Try uploading an image

If the upload succeeds and the image displays, your R2 setup is complete!

## Troubleshooting

### "Failed to generate presigned URL"
- Verify `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are correct
- Check that the API token has write permissions
- Ensure the token isn't expired

### "CORS error" in browser console
- Double-check your CORS configuration
- Make sure AllowedOrigins includes your site URL
- Clear browser cache and try again

### "Image uploaded but not displaying"
- Verify public access is enabled on your bucket
- Check that `VITE_R2_PUBLIC_URL` matches your public URL
- Try accessing the URL directly in a new tab

### "403 Forbidden when viewing images"
- Public access might not be enabled
- Check bucket settings and enable public access
- Verify the custom domain is properly connected
