import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { payments, loading, refetch } = usePayments();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });
      refetch();
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: 'Payment Canceled',
        description: 'Your payment was canceled.',
        variant: 'destructive',
      });
    }
  }, [searchParams, toast, refetch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Pending</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const downloadReceipt = (payment: typeof payments[0]) => {
    const receiptData = {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      date: payment.created_at,
      stripe_payment_intent: payment.stripe_payment_intent,
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-soft-bg">
        <Header />
        <div className="pt-32 pb-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view payments</h1>
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
            <h1 className="text-4xl font-bold mb-8">Payments & Invoices</h1>

            {/* Payment Method */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Stripe Checkout</p>
                    <p className="text-sm text-muted-foreground">Secure payment processing</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment History */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium font-mono text-sm">
                            {payment.id.slice(0, 8)}...
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.booking_id ? `Booking: ${payment.booking_id.slice(0, 8)}...` : 'Direct Payment'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(payment.created_at)}</span>
                        </div>
                        <p className="font-bold">
                          {payment.currency === 'INR' ? '₹' : payment.currency}
                          {payment.amount.toLocaleString()}
                        </p>
                        {payment.status === 'succeeded' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => downloadReceipt(payment)}
                          >
                            <Download className="h-4 w-4" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
