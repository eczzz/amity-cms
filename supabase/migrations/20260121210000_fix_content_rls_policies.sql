-- Fix RLS policies for content_models and content_entries
-- Allow any authenticated user to manage all content (admin panel behavior)

-- Drop existing restrictive policies on content_models
DROP POLICY IF EXISTS "Users can update their own content models" ON content_models;
DROP POLICY IF EXISTS "Users can delete their own content models" ON content_models;

-- Create permissive policies for content_models
CREATE POLICY "Authenticated users can update all content models"
  ON content_models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete all content models"
  ON content_models FOR DELETE
  TO authenticated
  USING (true);

-- Drop existing restrictive policies on content_entries
DROP POLICY IF EXISTS "Users can update their own content entries" ON content_entries;
DROP POLICY IF EXISTS "Users can delete their own content entries" ON content_entries;

-- Create permissive policies for content_entries
CREATE POLICY "Authenticated users can update all content entries"
  ON content_entries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete all content entries"
  ON content_entries FOR DELETE
  TO authenticated
  USING (true);
