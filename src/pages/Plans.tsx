import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Basic listing features',
    features: [
      '1 active listing',
      'Basic support',
      'Standard visibility',
      '5 images per listing',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    name: 'Relax',
    price: 999,
    description: 'For casual hosts',
    features: [
      '3 active listings',
      'Priority support',
      'Enhanced visibility',
      '15 images per listing',
      'Featured badge',
      'Basic analytics',
    ],
    cta: 'Upgrade to Relax',
    popular: false,
  },
  {
    name: 'Assure',
    price: 1999,
    description: 'Most popular choice',
    features: [
      '10 active listings',
      '24/7 priority support',
      'Premium visibility',
      'Unlimited images',
      'Featured + Verified badges',
      'Advanced analytics',
      'Promotional tools',
    ],
    cta: 'Upgrade to Assure',
    popular: true,
  },
  {
    name: 'Freedom',
    price: 4999,
    description: 'For professional hosts',
    features: [
      'Unlimited listings',
      'Dedicated account manager',
      'Maximum visibility',
      'Unlimited images',
      'All badges',
      'Full analytics suite',
      'Marketing automation',
      'API access',
      'White-label options',
    ],
    cta: 'Upgrade to Freedom',
    popular: false,
  },
];

const Plans = () => {
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
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Choose Your Plan
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the perfect plan for your hosting needs. Upgrade or downgrade
                anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`p-6 relative ${
                      plan.popular
                        ? 'border-primary shadow-lg ring-2 ring-primary/20'
                        : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">₹{plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      disabled={plan.price === 0}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                All plans include our money-back guarantee
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Cancel anytime
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Secure payments
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  24/7 support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Plans;
