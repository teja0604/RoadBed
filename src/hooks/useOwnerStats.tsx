import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface OwnerStat {
  id: string;
  owner_id: string;
  property_id: string;
  date: string;
  views: number;
  inquiries: number;
  bookings: number;
  created_at: string;
}

interface AggregatedStats {
  totalViews: number;
  totalInquiries: number;
  totalBookings: number;
  conversionRate: number;
  dailyStats: OwnerStat[];
}

export function useOwnerStats(days: number = 30) {
  const { user } = useAuth();
  const [stats, setStats] = useState<AggregatedStats>({
    totalViews: 0,
    totalInquiries: 0,
    totalBookings: 0,
    conversionRate: 0,
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('owner_stats')
      .select('*')
      .eq('owner_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching owner stats:', error);
    } else {
      const dailyStats = data || [];
      const totalViews = dailyStats.reduce((sum, s) => sum + s.views, 0);
      const totalInquiries = dailyStats.reduce((sum, s) => sum + s.inquiries, 0);
      const totalBookings = dailyStats.reduce((sum, s) => sum + s.bookings, 0);
      const conversionRate = totalViews > 0 ? (totalBookings / totalViews) * 100 : 0;

      setStats({
        totalViews,
        totalInquiries,
        totalBookings,
        conversionRate,
        dailyStats,
      });
    }
    setLoading(false);
  }, [user, days]);

  const exportToCSV = useCallback(() => {
    const headers = ['Date', 'Property ID', 'Views', 'Inquiries', 'Bookings'];
    const rows = stats.dailyStats.map((s) => [
      s.date,
      s.property_id,
      s.views,
      s.inquiries,
      s.bookings,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `owner-stats-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }, [stats.dailyStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    exportToCSV,
    refetch: fetchStats,
  };
}
