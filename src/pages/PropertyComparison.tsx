import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, X, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProperties } from '@/hooks/useProperties';
import { Link } from 'react-router-dom';

const PropertyComparison = () => {
  const { properties, loading } = useProperties();
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);

  const selectedProperties = properties.filter(p => selectedPropertyIds.includes(p.id));

  const addProperty = (propertyId: string) => {
    if (selectedPropertyIds.length < 3 && !selectedPropertyIds.includes(propertyId)) {
      setSelectedPropertyIds([...selectedPropertyIds, propertyId]);
    }
  };

  const removeProperty = (id: string) => {
    setSelectedPropertyIds(selectedPropertyIds.filter(pid => pid !== id));
  };

  const comparisonFeatures = [
    { label: 'Price', key: 'price', format: (val: number) => `₹${val.toLocaleString('en-IN')}/month` },
    { label: 'City', key: 'city' },
    { label: 'Property Type', key: 'property_type', format: (val: string) => val.charAt(0).toUpperCase() + val.slice(1) },
    { label: 'Bedrooms', key: 'bedrooms', format: (val: number) => `${val} BHK` },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Area', key: 'area', format: (val: number | null) => val ? `${val} sq.ft` : 'N/A' },
    { label: 'Status', key: 'status', format: (val: string) => val.charAt(0).toUpperCase() + val.slice(1) },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <GitCompare className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Compare Properties</h1>
            <p className="text-xl text-muted-foreground">
              Compare up to 3 properties side by side
            </p>
          </motion.div>

          {/* Property Selection */}
          {selectedPropertyIds.length < 3 && (
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Select Properties to Compare</h2>
              {properties.length === 0 ? (
                <p className="text-muted-foreground">No properties available to compare.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {properties.slice(0, 8).map((property) => (
                    <Card
                      key={property.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedPropertyIds.includes(property.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => addProperty(property.id)}
                    >
                      <img
                        src={property.images?.[0] || '/placeholder.svg'}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-1 truncate">{property.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{property.city}</p>
                      <p className="font-bold text-primary">₹{property.price.toLocaleString('en-IN')}</p>
                      {selectedPropertyIds.includes(property.id) && (
                        <Badge className="mt-2">Selected</Badge>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Comparison Table */}
          {selectedProperties.length > 0 && (
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-4 border-b font-semibold">Features</th>
                      {selectedProperties.map((property) => (
                        <th key={property.id} className="p-4 border-b text-center min-w-[200px]">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => removeProperty(property.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <img
                              src={property.images?.[0] || '/placeholder.svg'}
                              alt={property.title}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-sm">{property.title}</h3>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature.key} className="border-b">
                        <td className="p-4 font-semibold text-muted-foreground">{feature.label}</td>
                        {selectedProperties.map((property) => {
                          const value = property[feature.key as keyof typeof property];
                          const displayValue = feature.format 
                            ? feature.format(value as never) 
                            : String(value ?? 'N/A');
                          return (
                            <td key={property.id} className="p-4 text-center">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="border-b">
                      <td className="p-4 font-semibold text-muted-foreground">Amenities</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {property.amenities?.slice(0, 4).map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            )) || <span className="text-muted-foreground">N/A</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-muted-foreground">Action</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center">
                          <Link to={`/listing/${property.id}`}>
                            <Button className="w-full">View Details</Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {selectedProperties.length === 0 && properties.length > 0 && (
            <Card className="p-12 text-center">
              <GitCompare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Select properties above to start comparing
              </p>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyComparison;