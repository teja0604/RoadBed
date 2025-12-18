import { motion } from 'framer-motion';
import { Shield, MessageCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HostCardProps {
  name: string;
  avatar: string;
  verified: boolean;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  bio: string;
}

const HostCard = ({
  name,
  avatar,
  verified,
  joinedDate,
  responseRate,
  responseTime,
  bio,
}: HostCardProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 border border-border"
    >
      <h2 className="text-2xl font-bold mb-6">Meet Your Host</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Host Avatar */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            {verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-card">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Host Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{name}</h3>
              {verified && (
                <Badge variant="secondary" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Joined {joinedDate}</p>
          </div>

          <p className="text-muted-foreground">{bio}</p>

          {/* Host Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{responseRate}%</p>
                <p className="text-xs text-muted-foreground">Response rate</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">{responseTime}</p>
                <p className="text-xs text-muted-foreground">Response time</p>
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <Button className="w-full sm:w-auto gap-2 btn-hero" size="lg">
            <MessageCircle className="w-4 h-4" />
            Contact Host
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default HostCard;
