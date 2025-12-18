-- Payments table for Stripe integration
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments" ON public.payments
  FOR UPDATE USING (true);

-- Conversations table for messaging
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  created_by uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  participant_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = created_by OR auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Participants can update conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = ANY(participant_ids));

-- Messages table for chat
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL,
  attachments jsonb DEFAULT '[]',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id 
      AND (auth.uid() = c.created_by OR auth.uid() = ANY(c.participant_ids))
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id 
      AND (auth.uid() = c.created_by OR auth.uid() = ANY(c.participant_ids))
    )
  );

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Properties images table
CREATE TABLE public.properties_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.properties_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view property images" ON public.properties_images
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage property images" ON public.properties_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_id AND p.owner_id = auth.uid()
    )
  );

-- Saved searches table
CREATE TABLE public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}',
  bounds jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches" ON public.saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Events table for analytics
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create events" ON public.events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view property events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_id AND p.owner_id = auth.uid()
    )
  );

-- Owner stats table for analytics
CREATE TABLE public.owner_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  date date NOT NULL,
  views integer DEFAULT 0,
  inquiries integer DEFAULT 0,
  bookings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(owner_id, property_id, date)
);

ALTER TABLE public.owner_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own stats" ON public.owner_stats
  FOR SELECT USING (auth.uid() = owner_id);

-- Add status 'paid' to bookings
ALTER TABLE public.bookings 
  DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'paid';

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-docs', 'kyc-docs', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('rent-agreements', 'rent-agreements', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true) ON CONFLICT DO NOTHING;

-- Storage policies for property-images
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own property images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own property images" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for kyc-docs
CREATE POLICY "Users can view own kyc docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'kyc-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own kyc docs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'kyc-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all kyc docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'kyc-docs' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for rent-agreements
CREATE POLICY "Users can view own rent agreements" ON storage.objects
  FOR SELECT USING (bucket_id = 'rent-agreements' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload rent agreements" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rent-agreements' AND auth.role() = 'authenticated');

-- Storage policies for chat-attachments
CREATE POLICY "Anyone can view chat attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can upload chat attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');