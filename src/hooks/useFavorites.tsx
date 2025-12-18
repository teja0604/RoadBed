import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  property_id: string;
  created_at: string;
  property?: {
    id: string;
    title: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    images: string[] | null;
    property_type: string;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      
      const channel = supabase
        .channel('favorites-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'favorites',
            filter: `user_id=eq.${user.id}`
          },
          () => fetchFavorites()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          property:properties(id, title, city, price, bedrooms, bathrooms, area, images, property_type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error('Error fetching favorites:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId });

      if (error) throw error;
      toast.success('Added to favorites');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;
      toast.success('Removed from favorites');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.some(f => f.property_id === propertyId);
  };

  return { favorites, loading, addFavorite, removeFavorite, isFavorite, refetch: fetchFavorites };
};
