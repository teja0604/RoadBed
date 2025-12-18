import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, Loader2, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId?: string;
    propertyTitle?: string;
    amount?: number;
  };
}

const CheckoutModal = ({ isOpen, onClose, bookingDetails }: CheckoutModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  const handleStripeCheckout = async () => {
    if (!bookingDetails.bookingId) {
      toast({
        title: "Error",
        description: "Booking ID is required for payment",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          bookingId: bookingDetails.bookingId, 
          amount: bookingDetails.amount || 5000,
          currency: 'INR',
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to start payment process",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoConfirm = () => {
    toast({
      title: "Booking Confirmed! 🎉",
      description: "You'll receive a confirmation email shortly.",
    });
    setStep(3);
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-4">
                <h3 className="font-semibold">Guest Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="John Doe" 
                      value={guestDetails.fullName}
                      onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      placeholder="+91 98765 43210" 
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="w-full">Continue to Payment</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Options
                </h3>

                {bookingDetails.amount && (
                  <Card className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount to Pay</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{bookingDetails.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Card>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure payment powered by Stripe</span>
                </div>

                {/* Stripe Checkout Button */}
                <Button 
                  onClick={handleStripeCheckout} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Pay with Stripe
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Demo Payment */}
                <Button 
                  variant="outline" 
                  onClick={handleDemoConfirm} 
                  className="w-full"
                  disabled={loading}
                >
                  Demo Payment (Skip Stripe)
                </Button>

                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="text-xs">Visa</Badge>
                  <Badge variant="secondary" className="text-xs">Mastercard</Badge>
                  <Badge variant="secondary" className="text-xs">UPI</Badge>
                  <Badge variant="secondary" className="text-xs">Net Banking</Badge>
                </div>

                <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                  Back
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground">Check your email for details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;