# Netlify Setup Checklist for Media Library

## ✅ Local Development Setup

- [x] AWS SDK packages installed (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- [x] Netlify CLI installed (`netlify-cli`)
- [x] `netlify.toml` created in project root
- [x] `netlify/functions/generate-presigned-url.ts` created
- [x] Environment variables in `.env`

## 🚀 Before Deploying to Netlify

### Prerequisites
- [ ] GitHub account and repository
- [ ] Netlify account (https://app.netlify.com)
- [ ] Your Ketsuron app pushed to GitHub

### Configuration Files
- [x] `netlify.toml` exists
- [x] `netlify/functions/` directory exists with function
- [x] `package.json` scripts updated

## 🔧 Netlify Setup Steps

### 1. Connect Repository to Netlify
- [ ] Login to Netlify dashboard
- [ ] Click "New site from Git"
- [ ] Select "GitHub" and authorize
- [ ] Choose your repository
- [ ] Click "Deploy"

### 2. Set Environment Variables
In Netlify dashboard (Site settings → Environment):
- [ ] Add `VITE_R2_ACCOUNT_ID`
- [ ] Add `VITE_R2_BUCKET_NAME`
- [ ] Add `VITE_R2_PUBLIC_URL`
- [ ] Add `R2_ACCESS_KEY_ID`
- [ ] Add `R2_SECRET_ACCESS_KEY`
- [ ] Add `VITE_SUPABASE_URL` (from .env)
- [ ] Add `VITE_SUPABASE_ANON_KEY` (from .env)

### 3. Verify Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Functions directory: `netlify/functions`

## 🧪 Testing Checklist

### Local Testing (npm run dev)
- [ ] Media page loads
- [ ] Upload button visible
- [ ] Drag & drop area renders
- [ ] File selection works
- [ ] Upload progress shows
- [ ] Files appear in grid after upload
- [ ] Copy URL button works
- [ ] Download button works
- [ ] Delete button works (for own files)

### Live Testing (After Deployment)
- [ ] Site loads at Netlify URL
- [ ] Media page accessible
- [ ] Upload functions work
- [ ] Files upload to R2 successfully
- [ ] Files accessible at ketsuronmedia.com URLs
- [ ] Metadata saved to Supabase

## 📝 Important Notes

- **R2 Credentials**: Never commit `.env` to git (it's in .gitignore)
- **Netlify Env Vars**: Set separately in Netlify dashboard for production
- **CORS**: Make sure Cloudflare R2 CORS includes your Netlify domain
- **Functions**: Deployed automatically with your site

## 🆘 If Something Goes Wrong

1. Check Netlify Function logs:
   - Dashboard → Functions → generate-presigned-url → Logs

2. Check build logs:
   - Dashboard → Deploys → Select failed deploy → View deploy log

3. Check browser console:
   - Open DevTools → Console tab → Look for errors

4. Verify environment variables:
   - Dashboard → Site settings → Environment → Check all vars present

## 📚 Documentation

See `MEDIA_LIBRARY_SETUP.md` for complete setup guide.
