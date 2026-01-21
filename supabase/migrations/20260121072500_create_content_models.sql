/*
  # Content Models System

  ## Overview
  This migration creates tables for a flexible content modeling system similar to Contentful.
  Administrators can define custom content types with field definitions (content_models)
  and create content entries based on those models (content_entries).

  ## Tables

  ### `content_models`
  Stores content type definitions with field schemas in JSONB
  - id (uuid, primary key)
  - name (text) - Display name like "Blog Article"
  - api_identifier (text, unique) - API/slug name like "blog_article"
  - description (text) - Purpose of this content type
  - icon (text) - FontAwesome icon name
  - fields (jsonb) - Array of field definitions
  - created_by (uuid) - Reference to auth.users
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### `content_entries`
  Stores actual content entries based on models
  - id (uuid, primary key)
  - content_model_id (uuid) - Reference to content_models
  - title (text) - Entry display title
  - fields (jsonb) - Dynamic content data matching model schema
  - status (text) - draft/published/archived
  - published_at (timestamptz)
  - created_by (uuid) - Reference to auth.users
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ## Security
  Row Level Security (RLS) enabled on all tables with policies for:
  - Viewing: All authenticated users can view all models/entries
  - Creating: All authenticated users can create
  - Updating/Deleting: Only content creators can modify/delete their own content
*/

-- Create content_models table
CREATE TABLE IF NOT EXISTS content_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  api_identifier text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'faFileAlt',
  fields jsonb NOT NULL DEFAULT '[]',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_entries table
CREATE TABLE IF NOT EXISTS content_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_model_id uuid NOT NULL REFERENCES content_models(id) ON DELETE CASCADE,
  title text NOT NULL,
  fields jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_models_api_identifier ON content_models(api_identifier);
CREATE INDEX IF NOT EXISTS idx_content_models_created_by ON content_models(created_by);
CREATE INDEX IF NOT EXISTS idx_content_entries_model ON content_entries(content_model_id);
CREATE INDEX IF NOT EXISTS idx_content_entries_status ON content_entries(status);
CREATE INDEX IF NOT EXISTS idx_content_entries_published_at ON content_entries(published_at);
CREATE INDEX IF NOT EXISTS idx_content_entries_created_by ON content_entries(created_by);

-- Enable Row Level Security
ALTER TABLE content_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;

-- Content Models Policies
CREATE POLICY "Authenticated users can view all content models"
  ON content_models FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create content models"
  ON content_models FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own content models"
  ON content_models FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own content models"
  ON content_models FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Content Entries Policies
CREATE POLICY "Authenticated users can view all content entries"
  ON content_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create content entries"
  ON content_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own content entries"
  ON content_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own content entries"
  ON content_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);
