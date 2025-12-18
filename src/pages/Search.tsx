import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import FiltersPanel from '@/components/FiltersPanel';
import MapToggle, { MapView } from '@/components/MapToggle';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { featuredListings } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const propertyTypes = ['1BHK', '2BHK', '3BHK', 'Studio'];
  const amenities = ['WiFi', 'AC', 'Parking', 'Gym', 'Pool', 'Furnished'];

  const selectedCity = searchParams.get('city');
  const searchQuery = searchParams.get('query');

  // Filter listings based on selected city and search query
  const filteredListings = useMemo(() => {
    let results = featuredListings;
    
    // Filter by city if selected
    if (selectedCity) {
      results = results.filter(
        (listing) => listing.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((listing) => {
        const matchesTitle = listing.title.toLowerCase().includes(query);
        const matchesCity = listing.city.toLowerCase().includes(query);
        const matchesType = listing.type?.toLowerCase().includes(query);
        const matchesAmenities = listing.amenities?.some(a => 
          a.toLowerCase().includes(query)
        );
        return matchesTitle || matchesCity || matchesType || matchesAmenities;
      });
    }
    
    return results;
  }, [selectedCity, searchQuery]);

  const handleClearCity = () => {
    searchParams.delete('city');
    setSearchParams(searchParams);
  };

  const handleClearQuery = () => {
    searchParams.delete('query');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {selectedCity ? `Properties in ${selectedCity}` : searchQuery ? `Search results for "${searchQuery}"` : 'Browse Properties'}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-muted-foreground">
                    {filteredListings.length} properties found
                  </p>
                  {selectedCity && (
                    <Badge 
                      variant="secondary" 
                      className="gap-1 cursor-pointer hover:bg-secondary/80"
                      onClick={handleClearCity}
                    >
                      {selectedCity}
                      <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge 
                      variant="secondary" 
                      className="gap-1 cursor-pointer hover:bg-secondary/80"
                      onClick={handleClearQuery}
                    >
                      {searchQuery}
                      <X className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-4">
                <MapToggle onViewChange={setViewMode} defaultView={viewMode} />
                
                {/* Mobile Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsMobileFiltersOpen(true);
                    } else {
                      setShowFilters(!showFilters);
                    }
                  }}
                  className="gap-2 lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
                
                {/* Desktop Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 hidden lg:flex"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Panel - Desktop */}
            {showFilters && (
              <div className="hidden lg:block lg:col-span-1">
                <FiltersPanel />
              </div>
            )}
            
            {/* Mobile Filters */}
            <FiltersPanel 
              isOpen={isMobileFiltersOpen}
              onClose={() => setIsMobileFiltersOpen(false)}
              isMobile={true}
            />

            {/* Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}
            >
              {viewMode === 'map' ? (
                <MapView />
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredListings.length > 0 ? (
                    filteredListings.map((listing) => (
                      <ListingCard key={listing.id} {...listing} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-xl text-muted-foreground mb-4">
                        No properties found {selectedCity ? `in ${selectedCity}` : searchQuery ? `for "${searchQuery}"` : ''}
                      </p>
                      <Button 
                        onClick={() => {
                          handleClearCity();
                          handleClearQuery();
                        }} 
                        variant="outline"
                      >
                        View All Properties
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
