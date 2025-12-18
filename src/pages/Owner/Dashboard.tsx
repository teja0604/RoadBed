import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, Eye, MessageSquare, Calendar, Download, 
  TrendingUp, Loader2, Home 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerStats } from '@/hooks/useOwnerStats';
import { useProperties } from '@/hooks/useProperties';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, loading: statsLoading, exportToCSV } = useOwnerStats(30);
  const { properties, loading: propertiesLoading } = useProperties();

  const myProperties = properties.filter(p => p.owner_id === user?.id);
  const loading = statsLoading || propertiesLoading;

  // Prepare chart data
  const chartData = stats.dailyStats.reduce((acc, stat) => {
    const existing = acc.find(d => d.date === stat.date);
    if (existing) {
      existing.views += stat.views;
      existing.inquiries += stat.inquiries;
      existing.bookings += stat.bookings;
    } else {
      acc.push({
        date: stat.date,
        views: stat.views,
        inquiries: stat.inquiries,
        bookings: stat.bookings,
      });
    }
    return acc;
  }, [] as { date: string; views: number; inquiries: number; bookings: number }[]);

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your dashboard</h1>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

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
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track your property performance and leads
                </p>
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Eye className="w-8 h-8 text-blue-500" />
                      <span className="text-3xl font-bold">{stats.totalViews}</span>
                    </div>
                    <p className="text-muted-foreground">Total Views</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <MessageSquare className="w-8 h-8 text-green-500" />
                      <span className="text-3xl font-bold">{stats.totalInquiries}</span>
                    </div>
                    <p className="text-muted-foreground">Inquiries</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Calendar className="w-8 h-8 text-purple-500" />
                      <span className="text-3xl font-bold">{stats.totalBookings}</span>
                    </div>
                    <p className="text-muted-foreground">Bookings</p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-orange-500" />
                      <span className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</span>
                    </div>
                    <p className="text-muted-foreground">Conversion Rate</p>
                  </Card>
                </div>

                {/* Chart */}
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Last 30 Days Performance</h2>
                  {chartData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                          <Line type="monotone" dataKey="inquiries" stroke="#22c55e" name="Inquiries" />
                          <Line type="monotone" dataKey="bookings" stroke="#a855f7" name="Bookings" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No data available yet. Stats are aggregated daily.
                    </div>
                  )}
                </Card>

                {/* My Properties */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Properties</h2>
                    <Badge variant="secondary">{myProperties.length} Listed</Badge>
                  </div>
                  
                  {myProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Home className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                      <Button onClick={() => navigate('/host-dashboard')}>
                        List a Property
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myProperties.slice(0, 5).map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => navigate(`/listing/${property.id}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
                              {property.images?.[0] && (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{property.title}</h3>
                              <p className="text-sm text-muted-foreground">{property.city}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{property.price.toLocaleString()}/mo</p>
                            <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                              {property.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
