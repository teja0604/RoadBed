import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ScheduleVisit = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';
  const propertyTitle = searchParams.get('title') || 'Property';
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData, clearFormData] = useFormPersistence('schedule-visit-form', {
    name: '',
    email: '',
    phone: '',
    timeSlot: '',
    message: '',
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.timeSlot || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to schedule a visit.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Convert time slot to proper datetime
      const [time, period] = formData.timeSlot.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const visitDate = new Date(date);
      visitDate.setHours(hour, parseInt(minutes), 0);

      const { data, error } = await supabase.functions.invoke('book-visit', {
        body: {
          propertyId: propertyId || 'demo-property',
          userId: user.id,
          visitDate: visitDate.toISOString(),
          notes: formData.message,
          userEmail: formData.email,
          userName: formData.name,
          propertyTitle: propertyTitle,
          ownerEmail: 'owner@example.com', // This would come from the property data
          ownerName: 'Property Owner',
        }
      });

      if (error) throw error;

      setSuccess(true);
      clearFormData();
      
      toast({
        title: "Visit Scheduled!",
        description: "You'll receive a confirmation email shortly.",
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to schedule visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-12">
                <CheckCircle className="w-24 h-24 mx-auto mb-6 text-success" />
                <h1 className="text-3xl font-bold mb-4">Visit Scheduled!</h1>
                <p className="text-muted-foreground mb-8">
                  Your visit request has been submitted successfully. The property owner will confirm your visit shortly.
                </p>
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="font-semibold">{propertyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {date?.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {formData.timeSlot}
                  </p>
                </div>
                <Button onClick={() => setSuccess(false)}>Schedule Another Visit</Button>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Schedule a Visit</h1>
            <p className="text-xl text-muted-foreground">
              Book a time to view your dream property
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Property Info & Calendar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">{propertyTitle || 'Selected Property'}</p>
                      <p className="text-sm text-muted-foreground">Property ID: {propertyId || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Verified Property Owner</p>
                      <p className="text-sm text-muted-foreground">Will confirm your visit</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Date</h2>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </Card>
            </div>

            {/* Booking Form */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Details</h2>
                <Button variant="ghost" size="sm" onClick={clearFormData}>
                  Clear Form
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeSlot">Preferred Time Slot *</Label>
                  <Select
                    value={formData.timeSlot}
                    onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {slot}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any special requests or questions..."
                    rows={3}
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="p-4 bg-muted rounded-lg text-sm">
                    <p className="font-semibold mb-2">Selected Date & Time:</p>
                    <p className="text-muted-foreground">
                      {date?.toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      {formData.timeSlot && ` at ${formData.timeSlot}`}
                    </p>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    disabled={loading || !date || !formData.timeSlot}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Scheduling...
                      </>
                    ) : (
                      'Confirm Visit'
                    )}
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-destructive">
                      Please login to schedule a visit
                    </p>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    You'll receive a confirmation via email
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScheduleVisit;
