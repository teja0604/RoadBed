-- Fix profiles RLS - restrict to authenticated users only (not public)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Add policy for viewing property owner profiles (for bookings/listings)
CREATE POLICY "Users can view property owner profiles" ON public.profiles
FOR SELECT USING (
  id IN (SELECT owner_id FROM public.properties WHERE status = 'available')
);

-- Add admin KYC policies
CREATE POLICY "Admins can view all KYC" ON public.kyc_verifications
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update KYC" ON public.kyc_verifications
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add booking delete policy
CREATE POLICY "Users can delete own pending bookings" ON public.bookings
FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Owners can delete bookings on their properties" ON public.bookings
FOR DELETE USING (
  auth.uid() IN (SELECT owner_id FROM properties WHERE id = property_id)
);

-- Add rent_agreements UPDATE and DELETE policies
CREATE POLICY "Owners can update unsigned agreements" ON public.rent_agreements
FOR UPDATE USING (
  (auth.uid() IN (SELECT owner_id FROM properties WHERE id = property_id))
  AND signed = false
);

CREATE POLICY "Owners can delete unsigned agreements" ON public.rent_agreements
FOR DELETE USING (
  (auth.uid() IN (SELECT owner_id FROM properties WHERE id = property_id))
  AND signed = false
);

-- Add admin role management policies
CREATE POLICY "Admins can insert user roles" ON public.user_roles
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles" ON public.user_roles
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles" ON public.user_roles
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
FOR DELETE USING (auth.uid() = user_id);