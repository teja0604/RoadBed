import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Gallery from '@/components/ListingDetail/Gallery';
import BookingWidget from '@/components/ListingDetail/BookingWidget';
import AmenitiesList from '@/components/ListingDetail/AmenitiesList';
import HostCard from '@/components/ListingDetail/HostCard';
import NeighbourhoodInsights from '@/components/ListingDetail/NeighbourhoodInsights';
import { featuredListings } from '@/lib/mockData';
import { MapPin, Star, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Listing = () => {
  const { id } = useParams();
  const listing = featuredListings.find(l => l.id === id) || featuredListings[0];
  const [showBooking, setShowBooking] = useState(false);

  const images = [listing.image, listing.image, listing.image, listing.image, listing.image];
  
  const amenities = listing.amenities || [];
  
  const host = {
    name: 'Rajesh Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    verified: true,
    joinedDate: 'Jan 2023',
    responseRate: 95,
    responseTime: '< 1 hour',
    bio: 'Property owner with 5+ years of experience. Committed to providing comfortable stays.'
  };

  const neighbourhood = {
    commuteTimes: [
      { destination: 'City Center', time: '15 mins', icon: '🏢' },
      { destination: 'Metro Station', time: '5 mins', icon: '🚇' },
      { destination: 'Shopping Mall', time: '10 mins', icon: '🛒' },
    ],
    rentHistory: [20000, 22000, 23000, 24000, 25000],
    confidence: 85,
  };

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/search" className="hover:text-primary transition-colors">Search</a>
            <span>/</span>
            <span className="text-foreground">{listing.title}</span>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                  </div>
                  {listing.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{listing.rating}</span>
                    </div>
                  )}
                  {listing.verifiedOwner && (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Verified Owner
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  ₹{listing.price.toLocaleString()}
                  <span className="text-lg text-muted-foreground">/{listing.per}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <Gallery images={images} title={listing.title} />

              {/* Property Highlights */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h2 className="text-2xl font-bold mb-4">Property Highlights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Experience comfortable living in this well-maintained {listing.type} property. 
                  Located in a prime area of {listing.city}, this home offers easy access to all major 
                  landmarks and amenities. Perfect for families and working professionals looking for 
                  a peaceful yet connected living space.
                </p>
              </motion.section>

              {/* Amenities */}
              <AmenitiesList amenities={amenities} />

              {/* Neighbourhood Insights */}
              <NeighbourhoodInsights {...neighbourhood} />

              {/* Host Card */}
              <HostCard {...host} />
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingWidget 
                  price={listing.price}
                  per={listing.per}
                  listingId={listing.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-2xl z-30"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">
              ₹{listing.price.toLocaleString()}
              <span className="text-sm text-muted-foreground">/{listing.per}</span>
            </div>
            <p className="text-sm text-muted-foreground">Excluding taxes & fees</p>
          </div>
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="btn-hero px-8 py-3 rounded-lg font-semibold"
          >
            Reserve Now
          </button>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Listing;
