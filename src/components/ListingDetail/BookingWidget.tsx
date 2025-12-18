import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Users, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import CheckoutModal from '@/components/BookingFlow/CheckoutModal';

interface BookingWidgetProps {
  price: number;
  per: 'month' | 'night';
  listingId: string;
}

const BookingWidget = ({ price, per, listingId }: BookingWidgetProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const subtotal = nights > 0 ? price * (per === 'night' ? nights : 1) : price;
  const serviceFee = subtotal * 0.05;
  const gst = subtotal * 0.18;
  const total = subtotal + serviceFee + gst;

  const handleReserve = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 shadow-xl border-border sticky top-24">
          <div className="space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                ₹{price.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/ {per}</span>
            </div>

            {/* Date Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkIn && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'MMM dd') : 'Select'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !checkOut && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'MMM dd') : 'Select'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guests Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Guests</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="start">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Guests</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* Price Breakdown */}
            {nights > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 text-sm"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ₹{price.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee (5%)</span>
                  <span className="font-medium">₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">₹{gst.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </motion.div>
            )}

            {/* Reserve Button */}
            <Button
              onClick={handleReserve}
              disabled={!checkIn || !checkOut}
              className="w-full btn-hero"
              size="lg"
            >
              {checkIn && checkOut ? 'Reserve Now' : 'Select Dates'}
            </Button>

            {/* Security Badge */}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-medium">Secure Payment</p>
                <p className="text-muted-foreground">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="flex items-start gap-3 text-xs text-muted-foreground">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Free cancellation within 24 hours of booking. Review full cancellation policy.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        bookingDetails={{
          bookingId: listingId,
          propertyTitle: `Booking for ${guests} guests`,
          amount: total,
        }}
      />
    </>
  );
};

export default BookingWidget;
