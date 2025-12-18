import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import AvatarUploader from '@/components/AvatarUploader';
import ListingCard from '@/components/ListingCard';
import { format } from 'date-fns';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings();
  const { favorites, loading: favoritesLoading, removeFavorite } = useFavorites();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Populate form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarUpload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAvatar(url);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({
      full_name: fullName,
      phone: phone,
      avatar_url: avatar
    });
    setSaving(false);
  };

  const handleCancelBooking = async (bookingId: string) => {
    await cancelBooking(bookingId);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
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
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
                <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="p-8">
                  <div className="flex flex-col items-center mb-8">
                    <AvatarUploader
                      currentAvatar={avatar}
                      onUpload={handleAvatarUpload}
                      size="lg"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {profile?.full_name || 'No name set'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={user?.email || ''}
                          disabled
                        />
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Check className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          placeholder="+91 (XXX) XXX-XXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveProfile} 
                      className="w-full"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card className="p-8">
                  {favoritesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))}
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start saving properties you love to see them here
                      </p>
                      <Button onClick={() => navigate('/search')}>Browse Listings</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.map((fav) => (
                        fav.property && (
                          <div key={fav.id} className="relative">
                            <ListingCard
                              id={fav.property.id}
                              title={fav.property.title}
                              city={fav.property.city}
                              price={Number(fav.property.price)}
                              image={fav.property.images?.[0] || '/placeholder.svg'}
                              type={fav.property.property_type}
                              per="month"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeFavorite(fav.property_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card className="p-8">
                  {bookingsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Schedule a visit to see your bookings here
                      </p>
                      <Button onClick={() => navigate('/search')}>Find Properties</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {booking.property?.title || 'Property'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.property?.city}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Note: {booking.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(booking.visit_date), 'PPP')}</span>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'default'
                                : booking.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {booking.status}
                          </Badge>
                          {booking.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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

export default Profile;
