# CMS Boilerplate Setup Guide

This guide walks you through setting up a new instance of the CMS.

## Prerequisites

Before starting, you'll need:

1. **Node.js** (v18 or higher)
2. **A Supabase account** - [Sign up free](https://supabase.com)
3. **A Cloudflare account** with R2 enabled - [Sign up](https://cloudflare.com)
4. **A Netlify account** (for deployment) - [Sign up free](https://netlify.com)

## Step 1: Clone the Repository

```bash
git clone <your-repo-url> my-cms
cd my-cms
npm install
```

## Step 2: Set Up Supabase

### Create a New Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and name your project
4. Set a secure database password (save this!)
5. Select a region close to your users
6. Wait for the project to be provisioned

### Run the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase/schema/complete-schema.sql`
4. Paste and run the query
5. You should see "Success. No rows returned."

### Deploy Edge Functions

The CMS uses a Supabase Edge Function for admin user creation:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy setup-admin-user
```

### Get Your API Keys

1. Go to **Settings > API** in your Supabase project
2. Copy the following values:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Up Cloudflare R2

See [R2-SETUP.md](./R2-SETUP.md) for detailed instructions.

Quick summary:
1. Create an R2 bucket in Cloudflare Dashboard
2. Enable public access or set up a custom domain
3. Create an API token with R2 permissions
4. Note your Account ID, Bucket Name, and Public URL

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in all the values from Steps 2 and 3

## Step 5: Run the Setup Wizard

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to the URL shown (usually http://localhost:8888)

3. The Setup Wizard will guide you through:
   - Verifying your Supabase connection
   - Configuring R2 media storage
   - Setting up your branding (logo, colors)
   - Creating your admin account

4. After completing the wizard, you'll be redirected to the login page

## Step 6: Deploy to Netlify

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (first time) or link (existing site)
netlify init
# OR
netlify link

# Set environment variables
netlify env:import .env

# Deploy
netlify deploy --prod
```

### Via Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect your Git provider and select the repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add all environment variables from your `.env` file
6. Deploy!

## Troubleshooting

### "Failed to connect to Supabase"
- Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that you've run the database schema

### "Failed to upload media"
- Verify your R2 credentials are correct
- Check that CORS is configured on your R2 bucket
- Ensure the Netlify function has access to R2 credentials

### "Admin creation failed"
- Deploy the `setup-admin-user` edge function
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

## Next Steps

After setup is complete:

1. **Add Content Models** - Define custom content types
2. **Upload Media** - Add images and files to your media library
3. **Create Content** - Start creating pages and posts
4. **Invite Users** - Add editors and viewers in Settings > Users
