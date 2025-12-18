import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Home, CreditCard, FileCheck, BarChart3, 
  AlertTriangle, CheckCircle, Clock, Loader2 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  pendingKYC: number;
  totalPayments: number;
  recentPayments: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingKYC: 0,
    totalPayments: 0,
    recentPayments: 0,
  });

  useEffect(() => {
    const checkAdminAndFetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch stats using service role through edge function or direct queries
      const [
        { count: usersCount },
        { count: propertiesCount },
        { count: bookingsCount },
        { count: kycCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('kyc_verifications').select('*', { count: 'exact', head: true }).eq('verified', false),
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProperties: propertiesCount || 0,
        totalBookings: bookingsCount || 0,
        pendingKYC: kycCount || 0,
        totalPayments: 0,
        recentPayments: 0,
      });

      setLoading(false);
    };

    checkAdminAndFetchStats();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to access admin dashboard</h1>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Properties', value: stats.totalProperties, icon: Home, color: 'text-green-500' },
    { label: 'Bookings', value: stats.totalBookings, icon: CheckCircle, color: 'text-purple-500' },
    { label: 'Pending KYC', value: stats.pendingKYC, icon: Clock, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <BarChart3 className="w-8 h-8" />
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage users, properties, and platform operations
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">Admin</Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <span className="text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="kyc">KYC Review</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/admin/kyc-review')}>
                      <FileCheck className="w-6 h-6" />
                      Review KYC Documents
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/admin/users')}>
                      <Users className="w-6 h-6" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/admin/payments')}>
                      <CreditCard className="w-6 h-6" />
                      View Payments
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">User Management</h2>
                  <p className="text-muted-foreground">
                    Navigate to the Users page to manage user accounts and roles.
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/admin/users')}>
                    Go to Users
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="kyc">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">KYC Verification Queue</h2>
                  <p className="text-muted-foreground">
                    {stats.pendingKYC} documents pending review
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/admin/kyc-review')}>
                    Review Documents
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Overview</h2>
                  <p className="text-muted-foreground">
                    View and manage all platform payments.
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/admin/payments')}>
                    View All Payments
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
