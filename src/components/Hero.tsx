import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import heroLiving from '@/assets/hero-living.jpg';
import heroBalcony from '@/assets/hero-balcony.jpg';
import heroStudy from '@/assets/hero-study.jpg';
import SearchStrip from './SearchStrip';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const x1 = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const y1 = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);
  const x2 = useTransform(mouseX, [0, window.innerWidth], [-10, 10]);
  const y2 = useTransform(mouseY, [0, window.innerHeight], [-10, 10]);
  const x3 = useTransform(mouseX, [0, window.innerWidth], [-15, 15]);
  const y3 = useTransform(mouseY, [0, window.innerHeight], [-15, 15]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-soft-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 z-10"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
              >
                Brokerage-free homes,{' '}
                <span className="text-primary">direct from owners</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl"
              >
                Find your perfect rental or dream home with zero brokerage fees.
                Connect directly with verified property owners across India.
              </motion.p>
            </div>

            {/* Search Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <SearchStrip />
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>10,000+ Active Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Verified Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Zero Brokerage</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Images */}
          <div className="hidden lg:block relative h-[600px] w-full">
            {mounted && (
              <div className="relative w-full h-full max-w-xl mx-auto">
                {/* Image 1 - Large back */}
                <motion.div
                  style={{ x: x1, y: y1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute top-0 right-8 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={heroLiving}
                    alt="Modern living room with contemporary furniture"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
                </motion.div>

                {/* Image 2 - Medium front left */}
                <motion.div
                  style={{ x: x2, y: y2 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute top-24 left-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl z-10"
                >
                  <img
                    src={heroBalcony}
                    alt="Spacious balcony with city skyline view"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
                </motion.div>

                {/* Image 3 - Small front right */}
                <motion.div
                  style={{ x: x3, y: y3 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute bottom-8 right-0 w-52 h-64 rounded-2xl overflow-hidden shadow-2xl z-20"
                >
                  <img
                    src={heroStudy}
                    alt="Cozy study room with natural lighting"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
                </motion.div>

                {/* Floating accent elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-20 right-0 w-24 h-24 rounded-full bg-primary/10 blur-2xl"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-32 left-12 w-32 h-32 rounded-full bg-accent/10 blur-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
