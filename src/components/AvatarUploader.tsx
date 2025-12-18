import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Crop, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpload: (file: Blob) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarUploader = ({ currentAvatar, onUpload, size = 'md' }: AvatarUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-48 w-48',
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  }, []);

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setShowCropModal(true);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    setIsDraggingImage(true);
    e.preventDefault();
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingImage) return;
    
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleCrop = async () => {
    if (!imageRef.current || !originalImage) return;

    setIsUploading(true);

    try {
      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const img = new Image();
      img.src = originalImage;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const size = 512; // Output size
      canvas.width = size;
      canvas.height = size;

      // Calculate crop area
      const scale = zoom;
      const cropWidth = size / scale;
      const cropHeight = size / scale;
      
      const sourceX = (img.width - cropWidth) / 2 - position.x / scale;
      const sourceY = (img.height - cropHeight) / 2 - position.y / scale;

      // Draw cropped image
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        size,
        size
      );

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onUpload(blob);
            setCroppedImage(canvas.toDataURL());
            setShowCropModal(false);
            toast({
              title: 'Avatar updated',
              description: 'Your profile picture has been updated.',
            });
          }
          setIsUploading(false);
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      console.error('Crop error:', error);
      toast({
        title: 'Error',
        description: 'Failed to crop image. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'relative rounded-full border-4 border-border overflow-hidden bg-muted transition-all',
          sizeClasses[size],
          isDragging && 'border-primary scale-105'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {croppedImage || currentAvatar ? (
          <img
            src={croppedImage || currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center group"
        >
          <div className="text-white text-center">
            <Upload className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">Upload</p>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileSelect}
        />
      </div>

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Your Avatar</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Crop Area */}
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
              {originalImage && (
                <div
                  className="absolute inset-0 cursor-move select-none"
                  onMouseDown={handleImageMouseDown}
                  onMouseMove={handleImageMouseMove}
                  onMouseUp={handleImageMouseUp}
                  onMouseLeave={handleImageMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Crop preview"
                    className="absolute top-1/2 left-1/2 max-w-none"
                    style={{
                      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      cursor: isDraggingImage ? 'grabbing' : 'grab',
                    }}
                    draggable={false}
                  />
                  
                  {/* Crop circle overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <defs>
                        <mask id="crop-mask">
                          <rect width="100%" height="100%" fill="white" />
                          <circle cx="50%" cy="50%" r="40%" fill="black" />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.6)"
                        mask="url(#crop-mask)"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="40%"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCropModal(false)}
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="flex-1"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarUploader;
