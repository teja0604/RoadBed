import { motion } from 'framer-motion';
import { Heart, MapPin, Star, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';

interface ListingCardProps {
  id: string;
  title: string;
  city: string;
  price: number;
  per: 'month' | 'night';
  rating?: number;
  verifiedOwner?: boolean;
  promoted?: boolean;
  image: string;
  amenities?: string[];
  type?: string;
}

const ListingCard = ({
  id,
  title,
  city,
  price,
  per,
  rating = 4.5,
  verifiedOwner = false,
  promoted = false,
  image,
  amenities = [],
  type = '2BHK'
}: ListingCardProps) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isPropertyFavorite = isFavorite(id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Let useFavorites handle the toast message
      addFavorite(id);
      return;
    }

    if (isPropertyFavorite) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover-lift cursor-pointer group">
        <Link to={`/listing/${id}`}>
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Quick Actions - Fade in on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent flex items-end justify-between p-4"
            >
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
              >
                Quick View
              </Button>
            </motion.div>

            {/* Favorite Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full w-9 h-9 shadow-lg"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isPropertyFavorite ? 'fill-accent text-accent' : ''
                }`}
              />
            </Button>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {promoted && (
                <Badge className="bg-accent text-accent-foreground gap-1 font-semibold">
                  ⭐ Featured
                </Badge>
              )}
              {verifiedOwner && (
                <Badge className="bg-success text-success-foreground gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              <Badge variant="secondary">{type}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title & Location */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{city}</span>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {amenities.slice(0, 3).map((amenity, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{amenities.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/{per}</span>
              </div>
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold">{rating}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ListingCard;
