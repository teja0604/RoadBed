-- Enable RLS on the views (they inherit from base tables anyway)
-- Drop and recreate as tables are not needed, views bypass RLS by design with security_invoker
-- Just drop the views since they're not being used in the app
DROP VIEW IF EXISTS public.public_profiles;
DROP VIEW IF EXISTS public.property_images_public;