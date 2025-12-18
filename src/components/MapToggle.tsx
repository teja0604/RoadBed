import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list' | 'map';

interface MapToggleProps {
  onViewChange?: (view: ViewMode) => void;
  defaultView?: ViewMode;
}

const MapToggle = ({ onViewChange, defaultView = 'grid' }: MapToggleProps) => {
  const [activeView, setActiveView] = useState<ViewMode>(defaultView);

  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const views: { value: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
    { value: 'grid', icon: LayoutGrid, label: 'Grid view' },
    { value: 'list', icon: List, label: 'List view' },
    { value: 'map', icon: MapIcon, label: 'Map view' },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.value;
        
        return (
          <motion.div key={view.value} className="relative">
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange(view.value)}
              className={cn(
                'relative gap-2',
                isActive && 'shadow-md'
              )}
              aria-label={view.label}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{view.label.split(' ')[0]}</span>
            </Button>
            
            {isActive && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-primary rounded-md -z-10"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Map View Component (Placeholder)
export const MapView = () => {
  return (
    <div className="relative w-full h-[600px] bg-muted rounded-2xl overflow-hidden border border-border">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapIcon className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Map View</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Interactive map with property pins will be displayed here.
              Integrate with Google Maps or Mapbox for full functionality.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mock pins */}
      <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-primary rounded-full shadow-lg animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-accent rounded-full shadow-lg animate-pulse" />
      <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-success rounded-full shadow-lg animate-pulse" />
    </div>
  );
};

export default MapToggle;
