/*
  # Create Admin User

  ## Overview
  Creates the initial admin user for Ketsuron Solutions CMS.
  Email: kyle@bullfinch.io
  This user needs to be created via Supabase Auth in the dashboard.
  This migration just sets up the user record once the auth user exists.
*/

-- Insert admin user record (requires kyle@bullfinch.io to exist in auth.users first)
-- This is a placeholder - the actual user must be created via Supabase Auth dashboard
-- Then uncomment and run the INSERT below

-- DO $$
-- BEGIN
--   INSERT INTO public.users (id, email, first_name, last_name, role)
--   VALUES (
--     (SELECT id FROM auth.users WHERE email = 'kyle@bullfinch.io'),
--     'kyle@bullfinch.io',
--     'Kyle',
--     'Admin',
--     'admin'
--   )
--   ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();
-- END $$;