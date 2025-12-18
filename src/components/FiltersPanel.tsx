import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, MapPin, IndianRupee, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFormPersistence } from '@/hooks/useFormPersistence';

interface FiltersState {
  location: string;
  priceRange: [number, number];
  propertyTypes: string[];
  furnished: boolean;
  bedrooms: string;
}

interface FiltersPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (filters: FiltersState) => void;
  isMobile?: boolean;
}

const propertyTypeOptions = ['Studio', '1BHK', '2BHK', '3BHK', '4BHK+', 'Villa', 'Penthouse'];

const defaultFilters: FiltersState = {
  location: '',
  priceRange: [5000, 100000],
  propertyTypes: [],
  furnished: false,
  bedrooms: 'any',
};

const FiltersPanel = ({ isOpen = true, onClose, onApply, isMobile = false }: FiltersPanelProps) => {
  const [filters, setFilters, clearFilters] = useFormPersistence<FiltersState>('roadbed-filters', defaultFilters);
  const [appliedFilters, setAppliedFilters] = useFormPersistence<string[]>('roadbed-applied-filters', []);

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] as [number, number] }));
  };

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const handleApply = () => {
    const newAppliedFilters: string[] = [];
    if (filters.location) newAppliedFilters.push(`Location: ${filters.location}`);
    if (filters.propertyTypes.length > 0) newAppliedFilters.push(`Type: ${filters.propertyTypes.join(', ')}`);
    if (filters.furnished) newAppliedFilters.push('Furnished');
    if (filters.bedrooms !== 'any') newAppliedFilters.push(`${filters.bedrooms} Bedrooms`);
    
    setAppliedFilters(newAppliedFilters);
    onApply?.(filters);
    onClose?.();
  };

  const handleReset = () => {
    clearFilters();
    setAppliedFilters([]);
  };

  const removeFilter = (filter: string) => {
    setAppliedFilters(prev => prev.filter(f => f !== filter));
  };

  const content = (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="filter-location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="filter-location"
          placeholder="City, area, or landmark..."
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="focus-ring"
        />
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4" />
          Price Range (Monthly)
        </Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={200000}
            step={1000}
            className="py-4"
            aria-label="Price range slider"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>₹{filters.priceRange[0].toLocaleString()}</span>
          <span>₹{filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Property Type
        </Label>
        <div className="flex flex-wrap gap-2">
          {propertyTypeOptions.map((type) => (
            <Badge
              key={type}
              variant={filters.propertyTypes.includes(type) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                filters.propertyTypes.includes(type) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => togglePropertyType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
        >
          <SelectTrigger id="bedrooms" className="focus-ring">
            <SelectValue placeholder="Select bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1 Bedroom</SelectItem>
            <SelectItem value="2">2 Bedrooms</SelectItem>
            <SelectItem value="3">3 Bedrooms</SelectItem>
            <SelectItem value="4+">4+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Furnished */}
      <div className="flex items-center justify-between">
        <Label htmlFor="furnished" className="flex items-center gap-2 cursor-pointer">
          <Sparkles className="w-4 h-4" />
          Furnished Only
        </Label>
        <Switch
          id="furnished"
          checked={filters.furnished}
          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, furnished: checked }))}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 btn-hero"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-24 bg-card rounded-2xl shadow-lg border border-border max-h-[calc(100vh-7rem)] overflow-y-auto"
      aria-label="Filters sidebar"
    >
      {content}
      
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="p-6 pt-0 space-y-2">
          <Label className="text-sm">Applied Filters:</Label>
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => removeFilter(filter)}
              >
                {filter}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default FiltersPanel;
