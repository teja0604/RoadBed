import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, List, Search, AlertCircle, Save, Bookmark, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCard from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProperties } from '@/hooks/useProperties';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapSearch = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useFormPersistence('map-search-query', '');
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useFormPersistence('mapbox-token', '');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { properties, loading } = useProperties();
  const { savedSearches, saveSearch, loading: searchLoading } = useSavedSearches();
  const { user } = useAuth();

  // Filter properties based on search
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (mapboxToken) {
      setShowTokenInput(false);
    }
  }, []);

  // Initialize map with clustering
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [77.5946, 12.9716],
        zoom: 11,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }));

      map.current.on('load', () => {
        if (!map.current) return;

        // Add cluster source
        map.current.addSource('properties', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        // Cluster circles
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'properties',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#7c3aed',
              10, '#6d28d9',
              30, '#5b21b6'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20, 10, 30, 30, 40
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        });

        // Cluster count labels
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'properties',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        // Individual property points
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'properties',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#7c3aed',
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        });

        // Click on cluster to zoom
        map.current.on('click', 'clusters', (e) => {
          const features = map.current!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0].properties!.cluster_id;
          const source = map.current!.getSource('properties') as mapboxgl.GeoJSONSource;
          
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !map.current) return;
            
            map.current.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom || 14
            });
          });
        });

        // Click on individual point to show popup
        map.current.on('click', 'unclustered-point', (e) => {
          if (!e.features?.[0]) return;
          
          const coordinates = (e.features[0].geometry as any).coordinates.slice();
          const props = e.features[0].properties;

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${props?.title}</h3>
                <p style="color: #666; font-size: 12px;">${props?.city}</p>
                <p style="font-weight: bold;">₹${Number(props?.price).toLocaleString('en-IN')}/month</p>
                <a href="/listing/${props?.id}" style="
                  display: block;
                  text-align: center;
                  margin-top: 8px;
                  padding: 6px;
                  background: #7c3aed;
                  color: white;
                  border-radius: 4px;
                  text-decoration: none;
                  font-size: 12px;
                ">View Details</a>
              </div>
            `)
            .addTo(map.current!);
        });

        // Cursor changes
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });

      setMapError(null);
      setShowTokenInput(false);
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map. Please check your Mapbox token.');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Update map data when properties change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource;
    if (!source) return;

    const features = filteredProperties.map((property) => ({
      type: 'Feature' as const,
      properties: {
        id: property.id,
        title: property.title,
        city: property.city,
        price: property.price,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          property.longitude || (77.5946 + (Math.random() - 0.5) * 0.1),
          property.latitude || (12.9716 + (Math.random() - 0.5) * 0.1)
        ]
      }
    }));

    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [filteredProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!saveSearchName.trim()) {
      toast.error('Please enter a name for this search');
      return;
    }

    const bounds = map.current?.getBounds();
    const boundsData = bounds ? {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    } : null;

    await saveSearch(saveSearchName, { query: searchQuery }, boundsData);
    setSaveSearchName('');
    setShowSaveDialog(false);
  };

  const handleApplySearch = (search: any) => {
    if (search.filters?.query) {
      setSearchQuery(search.filters.query);
    }
    
    if (search.bounds && map.current) {
      map.current.fitBounds([
        [search.bounds.west, search.bounds.south],
        [search.bounds.east, search.bounds.north]
      ], { padding: 50 });
    }
    
    toast.success('Search applied');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Card className="p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, property type..."
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="gap-2">
                <MapPin className="w-4 h-4" />
                Search
              </Button>
              
              {user && (
                <>
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Search
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save This Search</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          value={saveSearchName}
                          onChange={(e) => setSaveSearchName(e.target.value)}
                          placeholder="Enter search name..."
                        />
                        <Button onClick={handleSaveSearch} className="w-full">
                          Save
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {savedSearches.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Bookmark className="w-4 h-4" />
                          Saved ({savedSearches.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Saved Searches</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
                          {savedSearches.map((search) => (
                            <Button
                              key={search.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleApplySearch(search)}
                            >
                              {search.name}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
            </form>
          </Card>

          {showTokenInput && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <form onSubmit={handleTokenSubmit} className="space-y-3 mt-2">
                  <p className="text-sm">
                    Enter your Mapbox public token to enable the map. Get it from{' '}
                    <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      mapbox.com
                    </a>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={mapboxToken}
                      onChange={(e) => setMapboxToken(e.target.value)}
                      placeholder="pk.eyJ1..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">Load Map</Button>
                  </div>
                </form>
              </AlertDescription>
            </Alert>
          )}

          {mapError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{mapError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Map Search
              <span className="text-lg font-normal text-muted-foreground ml-2">
                ({filteredProperties.length} properties)
              </span>
            </h1>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List View
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {viewMode === 'map' && (
              <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden border">
                {mapboxToken && !showTokenInput ? (
                  <div ref={mapContainer} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Enter your Mapbox token above to view the map</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, i) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ListingCard
                        id={property.id}
                        title={property.title}
                        city={property.city}
                        price={property.price}
                        per="month"
                        image={property.images?.[0] || '/placeholder.svg'}
                        promoted={property.is_promoted}
                        verifiedOwner={true}
                        amenities={property.amenities || []}
                        type={`${property.bedrooms}BHK`}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No properties found matching your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MapSearch;