import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, AlertTriangle, CheckCircle, Phone, MessageSquare, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SafetyTips = () => {
  const tips = [
    {
      icon: Shield,
      title: 'Verify Property Ownership',
      description: 'Always verify the owner\'s identity through RoadBed\'s verification badge. Check property documents before making any payment.',
      dos: [
        'Confirm the owner\'s verified badge on their profile',
        'Request to see original property documents',
        'Cross-check property details with government records',
      ],
      donts: [
        'Never deal with unverified owners',
        'Don\'t skip the verification process',
      ],
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Always make payments through RoadBed\'s secure payment gateway. Never pay in cash or through external methods.',
      dos: [
        'Use RoadBed\'s in-app payment system',
        'Keep receipts and transaction records',
        'Report any suspicious payment requests',
      ],
      donts: [
        'Never pay in cash before viewing property',
        'Don\'t share your banking credentials',
        'Avoid wire transfers to unverified accounts',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Communication Safety',
      description: 'Keep all communication within RoadBed\'s messaging system for your protection and record-keeping.',
      dos: [
        'Use RoadBed\'s in-app messaging',
        'Save important conversations',
        'Report suspicious messages immediately',
      ],
      donts: [
        'Don\'t share personal contact details immediately',
        'Avoid discussing payments outside the platform',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Property Inspection',
      description: 'Always visit the property in person before making any commitment or payment.',
      dos: [
        'Schedule property viewings during daytime',
        'Bring a friend or family member',
        'Check all amenities and facilities',
        'Verify the neighborhood and locality',
      ],
      donts: [
        'Never commit without visiting the property',
        'Don\'t visit properties alone at odd hours',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Safety Tips</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your safety is our priority. Follow these guidelines for a secure property search experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Alert className="bg-destructive/10 border-destructive">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-destructive ml-2">
                  <strong>Important:</strong> RoadBed staff will never ask for your password, OTP, or banking credentials. 
                  Report any such requests immediately to support@roadbed.com
                </AlertDescription>
              </Alert>
            </motion.div>

            <div className="space-y-8">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-lg p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">{tip.title}</h2>
                      <p className="text-muted-foreground mb-6">{tip.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Do's
                          </h3>
                          <ul className="space-y-2">
                            {tip.dos.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Don'ts
                          </h3>
                          <ul className="space-y-2">
                            {tip.donts.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-destructive mt-1">✗</span>
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 md:p-12 text-center mt-12"
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-4">Report Suspicious Activity</h2>
              <p className="text-xl text-muted-foreground mb-6">
                If you encounter any suspicious activity or feel unsafe, contact us immediately
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:1-800-ROADBED" className="text-primary hover:underline font-semibold">
                  Emergency: 1-800-ROADBED
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="mailto:safety@roadbed.com" className="text-primary hover:underline font-semibold">
                  safety@roadbed.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SafetyTips;
