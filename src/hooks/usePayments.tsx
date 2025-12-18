import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Payment {
  id: string;
  booking_id: string | null;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  created_at: string;
}

export function usePayments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
    } else {
      setPayments((data || []) as Payment[]);
    }
    setLoading(false);
  }, [user]);

  const createCheckoutSession = useCallback(async (
    bookingId: string,
    amount: number,
    propertyTitle: string
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to make a payment',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          bookingId,
          amount,
          propertyTitle,
          successUrl: `${window.location.origin}/payments?success=true`,
          cancelUrl: `${window.location.origin}/payments?canceled=true`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }

      return data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    createCheckoutSession,
    refetch: fetchPayments,
  };
}
