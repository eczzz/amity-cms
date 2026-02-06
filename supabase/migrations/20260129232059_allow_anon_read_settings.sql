-- Allow anonymous users to read settings
-- Required so the app can check setup_complete before any user is logged in.
-- Without this, loading the CMS on a new domain (no localStorage session) triggers
-- the setup wizard because the settings query returns empty under the anon role.

CREATE POLICY "Anonymous users can view settings"
  ON settings FOR SELECT
  TO anon
  USING (true);
