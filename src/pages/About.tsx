import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Users, Shield, TrendingUp } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize your needs and ensure a seamless property search experience.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every listing is verified and every owner is authenticated for your peace of mind.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building a community of property owners and seekers who value transparency.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Using technology to make property rental and purchase hassle-free.',
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About RoadBed</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                India's first brokerage-free property platform connecting owners directly with seekers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-lg p-8 md:p-12 mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  RoadBed was born from a simple observation: finding a home in India shouldn't cost you months of rent in brokerage fees. We witnessed countless families struggling with inflated costs and lack of transparency in the rental market.
                </p>
                <p>
                  In 2024, we launched RoadBed with a mission to revolutionize how Indians find homes. By connecting property owners directly with seekers, we've eliminated the middleman and put the power back in your hands.
                </p>
                <p>
                  Today, thousands of property owners and seekers trust RoadBed for honest, transparent, and affordable property transactions. We're proud to be building the future of Indian real estate.
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card rounded-lg p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Over 50,000+ properties listed by verified owners across India
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <p className="text-muted-foreground">Active Listings</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100K+</div>
                  <p className="text-muted-foreground">Happy Users</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <p className="text-muted-foreground">Cities Covered</p>
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

export default About;
