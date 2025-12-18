import { motion } from 'framer-motion';
import { Shield, Zap, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import Hero from '@/components/Hero';
import Chatbot from '@/components/Chatbot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProperties } from '@/hooks/useProperties';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { properties, loading } = useProperties();

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Value Propositions */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose RoadBed?</h2>
            <p className="text-xl text-muted-foreground">
              Experience hassle-free property search
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Zero Brokerage',
                description: 'Connect directly with verified property owners. No middlemen, no extra fees.',
                color: 'text-success'
              },
              {
                icon: Zap,
                title: 'Instant Connect',
                description: 'Contact owners directly through our platform. Get responses in minutes.',
                color: 'text-primary'
              },
              {
                icon: Heart,
                title: 'Verified Listings',
                description: 'All properties are verified for authenticity. Your safety is our priority.',
                color: 'text-accent'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 hover-lift text-center h-full">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked homes just for you</p>
            </div>
            <Link to="/search">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))
            ) : properties.length > 0 ? (
              properties.slice(0, 6).map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    city={listing.city}
                    price={listing.price}
                    per="month"
                    image={listing.images?.[0] || '/placeholder.svg'}
                    promoted={listing.is_promoted}
                    verifiedOwner={true}
                    amenities={listing.amenities || []}
                    type={`${listing.bedrooms}BHK`}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No properties available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Have a property to list?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Reach thousands of potential tenants and buyers directly
            </p>
            <Button size="lg" variant="secondary" className="gap-2">
              List Your Property Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
