import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  visit_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  property?: {
    title: string;
    city: string;
    price: number;
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
      
      // Real-time subscription
      const channel = supabase
        .channel('bookings-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `user_id=eq.${user.id}`
          },
          () => fetchBookings()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setBookings([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(title, city, price)
        `)
        .eq('user_id', user.id)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return { bookings, loading, cancelBooking, refetch: fetchBookings };
};
