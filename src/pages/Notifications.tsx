import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Heart, MessageSquare, Home, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => 
    filter === 'all' || !n.is_read
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageSquare className="w-5 h-5" />;
      case 'booking':
      case 'visit_scheduled':
        return <Home className="w-5 h-5" />;
      case 'favorite':
        return <Heart className="w-5 h-5" />;
      case 'payment_success':
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'new_message':
        return 'text-blue-500';
      case 'booking':
      case 'visit_scheduled':
        return 'text-green-500';
      case 'favorite':
        return 'text-red-500';
      case 'payment_success':
      case 'payment':
        return 'text-yellow-500';
      default:
        return 'text-orange-500';
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view notifications</h1>
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
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <Bell className="w-8 h-8" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount}</Badge>
                  )}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Stay updated with your latest activity
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                      <p className="text-muted-foreground">
                        {filter === 'unread'
                          ? "You're all caught up!"
                          : "You don't have any notifications yet."}
                      </p>
                    </Card>
                  ) : (
                    filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={cn(
                            'p-4 transition-all hover:shadow-md cursor-pointer',
                            !notification.is_read && 'border-l-4 border-l-primary bg-accent/50'
                          )}
                          onClick={() => {
                            if (!notification.is_read) {
                              markAsRead(notification.id);
                            }
                            if (notification.link) {
                              navigate(notification.link);
                            }
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                'p-3 rounded-full bg-muted',
                                getIconColor(notification.type)
                              )}
                            >
                              {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTimestamp(notification.created_at)}
                                </span>
                              </div>
                              {notification.body && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {notification.body}
                                </p>
                              )}

                              <div className="flex items-center gap-2">
                                {!notification.is_read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                                {notification.link && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(notification.link!);
                                    }}
                                  >
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
