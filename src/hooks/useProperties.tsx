import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  property_type: 'apartment' | 'house' | 'villa' | 'studio' | 'penthouse';
  status: 'available' | 'rented' | 'maintenance';
  price: number;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  amenities: string[] | null;
  images: string[] | null;
  is_promoted: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();

    // Set up realtime subscription
    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Property change:', payload);
          if (payload.eventType === 'INSERT') {
            setProperties((current) => [...current, payload.new as Property]);
            toast.success('New property added!');
          } else if (payload.eventType === 'UPDATE') {
            setProperties((current) =>
              current.map((prop) =>
                prop.id === payload.new.id ? (payload.new as Property) : prop
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProperties((current) =>
              current.filter((prop) => prop.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, refetch: fetchProperties };
};
