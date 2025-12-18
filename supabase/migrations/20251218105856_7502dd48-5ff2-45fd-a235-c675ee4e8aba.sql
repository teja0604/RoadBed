-- Fix security definer views by dropping and recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles;
DROP VIEW IF EXISTS public.property_images_public;

-- Recreate views with SECURITY INVOKER (default in PostgreSQL is INVOKER)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
SELECT id, full_name, avatar_url, bio, created_at
FROM public.profiles
WHERE id IN (SELECT owner_id FROM properties WHERE status = 'available');

CREATE VIEW public.property_images_public 
WITH (security_invoker = true) AS
SELECT id, property_id, url, is_primary, created_at
FROM public.properties_images;