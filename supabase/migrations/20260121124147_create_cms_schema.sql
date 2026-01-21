/*
  # Ketsuron Solutions CMS Database Schema

  ## Overview
  This migration creates the complete database schema for the Ketsuron Solutions content management system.

  ## 1. New Tables

  ### `pages`
  Stores website pages with full content and metadata
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Page title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Page HTML/text content
  - `meta_description` (text) - SEO meta description
  - `meta_keywords` (text) - SEO keywords
  - `status` (text) - Publication status (draft/published)
  - `published_at` (timestamptz) - When the page was published
  - `created_by` (uuid) - User who created the page
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `posts`
  Stores blog posts with full content and metadata
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Post HTML/text content
  - `excerpt` (text) - Short summary
  - `featured_image` (text) - URL to featured image
  - `meta_description` (text) - SEO meta description
  - `meta_keywords` (text) - SEO keywords
  - `status` (text) - Publication status (draft/published)
  - `published_at` (timestamptz) - When the post was published
  - `created_by` (uuid) - User who created the post
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `media`
  Stores uploaded media files and their metadata
  - `id` (uuid, primary key) - Unique identifier
  - `filename` (text) - Original filename
  - `url` (text) - Storage URL
  - `mime_type` (text) - File MIME type
  - `size` (integer) - File size in bytes
  - `uploaded_by` (uuid) - User who uploaded the file
  - `created_at` (timestamptz) - Upload timestamp

  ### `settings`
  Stores site-wide configuration settings
  - `id` (uuid, primary key) - Unique identifier
  - `key` (text, unique) - Setting key
  - `value` (text) - Setting value
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security (Row Level Security)

  All tables have RLS enabled with the following policies:

  ### Pages & Posts
  - Authenticated users can read all content (for CMS interface)
  - Authenticated users can create new content
  - Only content creators can update their own content
  - Only content creators can delete their own content

  ### Media
  - Authenticated users can read all media
  - Authenticated users can upload new media
  - Only uploaders can delete their own media

  ### Settings
  - Authenticated users can read all settings
  - Authenticated users can update settings

  ## 3. Indexes
  - Unique indexes on slugs for pages and posts
  - Indexes on status and published_at for filtering
  - Index on settings key for quick lookups
*/

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text DEFAULT '',
  excerpt text DEFAULT '',
  featured_image text DEFAULT '',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  mime_type text NOT NULL,
  size integer DEFAULT 0,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('site_name', 'Ketsuron Solutions'),
  ('site_description', 'Professional business solutions'),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('address', '')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Pages policies
CREATE POLICY "Authenticated users can view all pages"
  ON pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own pages"
  ON pages FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Posts policies
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Media policies
CREATE POLICY "Authenticated users can view all media"
  ON media FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own media"
  ON media FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Settings policies
CREATE POLICY "Authenticated users can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON pages(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);