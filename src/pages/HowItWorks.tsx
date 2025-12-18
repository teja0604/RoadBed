import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Home, MessageSquare, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: 'Search Properties',
      description: 'Browse through verified listings directly from property owners. Filter by location, price, and amenities.',
    },
    {
      icon: MessageSquare,
      title: 'Connect with Owners',
      description: 'Chat directly with property owners. No middlemen, no brokerage fees. Get instant responses.',
    },
    {
      icon: Home,
      title: 'Schedule Viewing',
      description: 'Book a property viewing at your convenience. Meet owners in person and inspect the property.',
    },
    {
      icon: CheckCircle,
      title: 'Book & Pay',
      description: 'Complete your booking securely online. Pay directly to the owner with our secure payment system.',
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
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">How RoadBed Works</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Finding your perfect home is simple with RoadBed. No brokers, no hassle.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-lg p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Why Choose RoadBed?</h2>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">0%</h3>
                  <p className="text-muted-foreground">Brokerage Fees</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">100%</h3>
                  <p className="text-muted-foreground">Verified Owners</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-muted-foreground">Support Available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
