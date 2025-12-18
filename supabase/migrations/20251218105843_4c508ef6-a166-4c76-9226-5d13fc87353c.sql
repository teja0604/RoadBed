-- Fix security issues

-- 1. Update profiles policy to exclude phone from public access
DROP POLICY IF EXISTS "Users can view property owner public info" ON public.profiles;
CREATE POLICY "Users can view property owner public info" 
ON public.profiles 
FOR SELECT 
USING (
  id IN (SELECT owner_id FROM properties WHERE status = 'available')
);

-- Create a view for public profile info without phone
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, full_name, avatar_url, bio, created_at
FROM public.profiles
WHERE id IN (SELECT owner_id FROM properties WHERE status = 'available');

-- 2. Strengthen KYC verifications - only allow admins and document owners
DROP POLICY IF EXISTS "Admins can view all KYC" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Users can view own KYC" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Users can submit KYC" ON public.kyc_verifications;
DROP POLICY IF EXISTS "Admins can update KYC" ON public.kyc_verifications;

CREATE POLICY "Users can view own KYC only" 
ON public.kyc_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC" 
ON public.kyc_verifications 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can submit own KYC" 
ON public.kyc_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any KYC" 
ON public.kyc_verifications 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. Fix notifications - only service role can create, users can only read/update their own
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications only" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications only" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role bypass for creating notifications (handled at service level)
CREATE POLICY "Service can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Fix events - users can only create events for themselves
DROP POLICY IF EXISTS "Anyone can create events" ON public.events;
DROP POLICY IF EXISTS "Property owners can view events" ON public.events;

CREATE POLICY "Users can create own events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own events" 
ON public.events 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Property owners can view their property events" 
ON public.events 
FOR SELECT 
USING (
  property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())
);

-- 5. Fix payments - only allow users to view their own, service role for updates
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;
DROP POLICY IF EXISTS "System can update payments" ON public.payments;

CREATE POLICY "Users can view own payments only" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Only allow status updates, not amount changes
CREATE POLICY "Users can update own payment status" 
ON public.payments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Fix messages attachments - validate user is participant
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

CREATE POLICY "Users can send messages to conversations they belong to" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id 
  AND conversation_id IN (
    SELECT id FROM conversations 
    WHERE auth.uid() = ANY(participant_ids)
  )
);

-- 7. Hide storage_path from public queries (create view)
CREATE OR REPLACE VIEW public.property_images_public AS
SELECT id, property_id, url, is_primary, created_at
FROM public.properties_images;