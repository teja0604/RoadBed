import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Json } from '@/integrations/supabase/types';

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, unknown>;
  bounds: Record<string, unknown> | null;
  created_at: string;
}

export function useSavedSearches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedSearches = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved searches:', error);
    } else {
      setSavedSearches((data || []).map(s => ({
        ...s,
        filters: typeof s.filters === 'object' && s.filters !== null ? s.filters as Record<string, unknown> : {},
        bounds: typeof s.bounds === 'object' ? s.bounds as Record<string, unknown> | null : null,
      })));
    }
    setLoading(false);
  }, [user]);

  const saveSearch = useCallback(async (
    name: string,
    filters: Record<string, unknown>,
    bounds?: { north: number; south: number; east: number; west: number }
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please login to save searches',
        variant: 'destructive',
      });
      return null;
    }

    const { data, error } = await supabase
      .from('saved_searches')
      .insert([{
        user_id: user.id,
        name,
        filters: filters as Json,
        bounds: (bounds || null) as Json,
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save search',
        variant: 'destructive',
      });
      return null;
    }

    toast({
      title: 'Success',
      description: 'Search saved successfully',
    });

    await fetchSavedSearches();
    return data;
  }, [user, toast, fetchSavedSearches]);

  const deleteSearch = useCallback(async (searchId: string) => {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        variant: 'destructive',
      });
      return false;
    }

    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
    return true;
  }, [toast]);

  useEffect(() => {
    fetchSavedSearches();
  }, [fetchSavedSearches]);

  return {
    savedSearches,
    loading,
    saveSearch,
    deleteSearch,
    refetch: fetchSavedSearches,
  };
}
