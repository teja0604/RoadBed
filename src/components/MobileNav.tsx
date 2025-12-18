import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Heart, User, Building2, Search } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FocusLock from 'react-focus-lock';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/utils/accessibility';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/map-search', label: 'Map Search', icon: Search },
  { to: '/compare', label: 'Compare', icon: Building2 },
  { to: '/rent-prediction', label: 'Rent Predictor', icon: Building2 },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
];

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <FocusLock returnFocus>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: prefersReducedMotion ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : '100%' }}
              transition={{
                type: 'tween',
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: 'easeOut'
              }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-card shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Close Button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Menu</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted focus-ring"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10 focus-ring"
                    aria-label="Search properties"
                  />
                </div>

                {/* Navigation Links */}
                <motion.nav
                  className="space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.to}
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-muted transition-all duration-200 hover:-translate-y-0.5"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Auth & Actions */}
                <div className="space-y-3">
                  <NavLink to="/auth" onClick={onClose}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Login / Sign up
                    </Button>
                  </NavLink>
                  <NavLink to="/kyc" onClick={onClose}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Verify KYC
                    </Button>
                  </NavLink>
                  <NavLink to="/host" onClick={onClose}>
                    <Button className="w-full btn-hero justify-start gap-2">
                      <Building2 className="w-4 h-4" />
                      List Property
                    </Button>
                  </NavLink>
                </div>

                {/* App Download Section */}
                <div className="pt-6 space-y-3">
                  <p className="text-sm text-muted-foreground">Download our app</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                      App Store
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                      Play Store
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </FocusLock>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
