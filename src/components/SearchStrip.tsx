import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useFormPersistence } from '@/hooks/useFormPersistence';

interface SearchState {
  location: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
}

const SearchStrip = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useFormPersistence<SearchState>('roadbed-search', {
    location: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  const checkIn = searchState.checkIn ? new Date(searchState.checkIn) : undefined;
  const checkOut = searchState.checkOut ? new Date(searchState.checkOut) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchState.location) params.set('query', searchState.location);
    if (searchState.checkIn) params.set('checkIn', searchState.checkIn);
    if (searchState.checkOut) params.set('checkOut', searchState.checkOut);
    if (searchState.guests > 1) params.set('guests', searchState.guests.toString());
    navigate(`/search?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      className="glass-effect p-2 rounded-2xl shadow-xl border border-border/50 max-w-4xl"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2">
        {/* Location Input */}
        <div className="relative group">
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <Input
            id="location"
            type="text"
            placeholder="City, landmark, or area..."
            value={searchState.location}
            onChange={(e) => setSearchState(prev => ({ ...prev, location: e.target.value }))}
            className="pl-12 h-14 border-0 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Search location"
          />
        </div>

        {/* Check-in Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-14 justify-start text-left font-normal border-0 bg-background/50 hover:bg-background',
                !checkIn && 'text-muted-foreground'
              )}
              aria-label="Select check-in date"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, 'MMM dd') : 'Check-in'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={checkIn}
              onSelect={(date) => setSearchState(prev => ({ ...prev, checkIn: date?.toISOString() || null }))}
              initialFocus
              disabled={(date) => date < new Date()}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Check-out Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-14 justify-start text-left font-normal border-0 bg-background/50 hover:bg-background',
                !checkOut && 'text-muted-foreground'
              )}
              aria-label="Select check-out date"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, 'MMM dd') : 'Check-out'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={checkOut}
              onSelect={(date) => setSearchState(prev => ({ ...prev, checkOut: date?.toISOString() || null }))}
              initialFocus
              disabled={(date) => date < (checkIn || new Date())}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Guests Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-14 justify-start text-left font-normal border-0 bg-background/50 hover:bg-background"
              aria-label="Select number of guests"
            >
              <Users className="mr-2 h-4 w-4" />
              {searchState.guests} {searchState.guests === 1 ? 'Guest' : 'Guests'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="guests-input" className="text-sm font-medium">
                  Guests
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSearchState(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                    aria-label="Decrease guests"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{searchState.guests}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSearchState(prev => ({ ...prev, guests: Math.min(10, prev.guests + 1) }))}
                    aria-label="Increase guests"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Button
            type="submit"
            size="lg"
            className="h-14 px-8 btn-hero"
            aria-label="Search for homes"
          >
            <Search className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Find Homes</span>
            <span className="md:hidden">Search</span>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SearchStrip;
