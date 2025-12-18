import { motion } from 'framer-motion';
import { Wifi, Wind, Car, Dumbbell, Waves, Sofa, Shield, Tv, Coffee, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AmenitiesListProps {
  amenities: string[];
}

const amenityIcons: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  AC: Wind,
  Parking: Car,
  Gym: Dumbbell,
  Pool: Waves,
  Furnished: Sofa,
  Security: Shield,
  TV: Tv,
  'Washing Machine': Coffee,
  Kitchen: UtensilsCrossed,
  Workspace: Coffee,
};

const AmenitiesList = ({ amenities }: AmenitiesListProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 border border-border"
    >
      <h2 className="text-2xl font-bold mb-6">Amenities</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => {
          const Icon = amenityIcons[amenity] || Wifi;
          
          return (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">{amenity}</span>
            </motion.div>
          );
        })}
      </div>

      {amenities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Amenity details not available</p>
        </div>
      )}

      {amenities.length > 6 && (
        <div className="mt-6 pt-6 border-t border-border">
          <Badge variant="outline" className="gap-2">
            <Shield className="w-3 h-3" />
            All amenities are verified and maintained
          </Badge>
        </div>
      )}
    </motion.section>
  );
};

export default AmenitiesList;
