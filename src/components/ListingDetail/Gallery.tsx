import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FocusLock from 'react-focus-lock';

interface GalleryProps {
  images: string[];
  title: string;
}

const Gallery = ({ images, title }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Main Image */}
        <motion.div
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={images[0]}
            alt={`${title} - Main view`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors" />
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
            View all {images.length} photos
          </div>
        </motion.div>

        {/* Thumbnail Strip */}
        <div className="grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index + 1)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={image}
                alt={`${title} - View ${index + 2}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <FocusLock returnFocus>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary/95 backdrop-blur-sm z-50 flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-label="Image gallery"
              onClick={closeLightbox}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-foreground hover:bg-muted z-10"
                onClick={closeLightbox}
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="container mx-auto px-4 max-w-6xl" onClick={(e) => e.stopPropagation()}>
                {/* Main Lightbox Image */}
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={images[selectedIndex]}
                    alt={`${title} - Image ${selectedIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                  />
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="ghost"
                    onClick={goToPrevious}
                    className="gap-2"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-foreground">
                    {selectedIndex + 1} / {images.length}
                  </span>

                  <Button
                    variant="ghost"
                    onClick={goToNext}
                    className="gap-2"
                    aria-label="Next image"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex gap-2 justify-center mt-6 overflow-x-auto pb-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        selectedIndex === index
                          ? 'ring-2 ring-primary scale-105'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </FocusLock>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
