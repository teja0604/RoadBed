import { motion } from 'framer-motion';
import { MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CommuteTime {
  destination: string;
  time: string;
  icon: string;
}

interface NeighbourhoodInsightsProps {
  commuteTimes: CommuteTime[];
  rentHistory: number[];
  confidence: number;
}

const NeighbourhoodInsights = ({
  commuteTimes,
  rentHistory,
  confidence,
}: NeighbourhoodInsightsProps) => {
  // Calculate rent trend
  const currentRent = rentHistory[rentHistory.length - 1];
  const previousRent = rentHistory[rentHistory.length - 2];
  const trendPercentage = ((currentRent - previousRent) / previousRent * 100).toFixed(1);
  const isIncreasing = currentRent > previousRent;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Neighbourhood Insights</h2>
          <p className="text-muted-foreground">
            Know your surroundings better
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <TrendingUp className="w-3 h-3" />
          {confidence}% confident
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Commute Times */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Nearby Places
          </h3>
          <div className="grid gap-3">
            {commuteTimes.map((commute, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{commute.icon}</span>
                  <span className="font-medium">{commute.destination}</span>
                </div>
                <Badge variant="outline">{commute.time}</Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rent-o-meter */}
        <Card className="p-4 bg-muted/30 border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            Rent-o-meter
          </h3>
          
          {/* Sparkline */}
          <div className="relative h-24 mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <path
                d={`M 0 80 ${rentHistory
                  .map((rent, i) => {
                    const x = (i / (rentHistory.length - 1)) * 200;
                    const y = 80 - ((rent - Math.min(...rentHistory)) / (Math.max(...rentHistory) - Math.min(...rentHistory))) * 60;
                    return `L ${x} ${y}`;
                  })
                  .join(' ')} L 200 80 Z`}
                fill="url(#gradient)"
              />
              
              {/* Line */}
              <path
                d={`M ${rentHistory
                  .map((rent, i) => {
                    const x = (i / (rentHistory.length - 1)) * 200;
                    const y = 80 - ((rent - Math.min(...rentHistory)) / (Math.max(...rentHistory) - Math.min(...rentHistory))) * 60;
                    return `${x} ${y}`;
                  })
                  .join(' L ')}`}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Current Avg. Rent</p>
              <p className="text-lg font-bold">₹{currentRent.toLocaleString()}/month</p>
            </div>
            <Badge variant={isIncreasing ? 'destructive' : 'default'} className="gap-1">
              {isIncreasing ? '↑' : '↓'} {trendPercentage}%
            </Badge>
          </div>
        </Card>

        {/* Confidence Note */}
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Data based on recent transactions and market trends in this locality.
            Confidence score indicates data reliability.
          </p>
        </div>

        <Button variant="outline" className="w-full">
          View Detailed Neighbourhood Report
        </Button>
      </div>
    </motion.section>
  );
};

export default NeighbourhoodInsights;
