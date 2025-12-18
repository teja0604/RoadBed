import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface City {
  name: string;
  properties: number;
}

const cities: City[] = [
  { name: 'Mumbai', properties: 12450 },
  { name: 'Delhi', properties: 10230 },
  { name: 'Bangalore', properties: 9870 },
  { name: 'Hyderabad', properties: 7540 },
  { name: 'Chennai', properties: 6820 },
  { name: 'Pune', properties: 6150 },
  { name: 'Kolkata', properties: 5430 },
  { name: 'Ahmedabad', properties: 4920 },
  { name: 'Jaipur', properties: 3680 },
  { name: 'Surat', properties: 3250 },
  { name: 'Lucknow', properties: 2940 },
  { name: 'Chandigarh', properties: 2710 },
  { name: 'Kochi', properties: 2480 },
  { name: 'Indore', properties: 2150 },
  { name: 'Coimbatore', properties: 1920 },
  { name: 'Bhopal', properties: 1680 },
  { name: 'Nagpur', properties: 1540 },
  { name: 'Goa', properties: 1320 },
  { name: 'Visakhapatnam', properties: 1150 },
  { name: 'Mysore', properties: 980 },
];

export const LocationSelector = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Set selected city from URL params on mount
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam) {
      const city = cities.find(c => c.name.toLowerCase() === cityParam.toLowerCase());
      if (city) {
        setSelectedCity(city);
      }
    }
  }, [searchParams]);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setOpen(false);
    setSearchQuery('');
    // Navigate to search page with city filter
    navigate(`/search?city=${encodeURIComponent(city.name)}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-auto justify-between gap-2"
        >
          <MapPin className="w-4 h-4" />
          <span>{selectedCity ? selectedCity.name : 'Select Location'}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <Input
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCities.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No cities found
            </div>
          ) : (
            <div className="p-2">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent text-left transition-colors"
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {city.properties.toLocaleString()} properties
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
