import { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Upload, X, GripVertical, Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';

export interface UploadedImage {
  id: string;
  url: string;
  storagePath?: string;
  file?: File;
  isCover: boolean;
  isCompressed: boolean;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  compressImages?: boolean;
  bucket?: string;
  folder?: string;
  uploadToStorage?: boolean;
}

export const ImageUploader = ({
  images,
  onChange,
  maxImages = 10,
  compressImages = true,
  bucket = 'property-images',
  folder = '',
  uploadToStorage = true,
}: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage, deleteImage } = useImageUpload();

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `You can only upload up to ${maxImages} images.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const newImages: UploadedImage[] = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        let processedFile: File = file;
        let isCompressed = false;

        if (compressImages) {
          try {
            const blob = await compressImage(file);
            processedFile = new File([blob], file.name, { type: 'image/jpeg' });
            isCompressed = true;
          } catch (error) {
            console.error('Compression failed, using original:', error);
          }
        }

        if (uploadToStorage) {
          const result = await uploadImage(processedFile, bucket, folder);
          if (result) {
            newImages.push({
              id: Math.random().toString(36).substr(2, 9),
              url: result.url,
              storagePath: result.storagePath,
              isCover: images.length === 0 && newImages.length === 0,
              isCompressed,
            });
          }
        } else {
          const url = URL.createObjectURL(processedFile);
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            url,
            file: processedFile,
            isCover: images.length === 0 && newImages.length === 0,
            isCompressed,
          });
        }
      }

      onChange([...images, ...newImages]);
      
      toast({
        title: `${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`,
        description: uploadToStorage ? 'Images saved to cloud storage' : 'Images processed locally',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to process images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [images, maxImages]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const removeImage = async (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    
    if (imageToRemove?.storagePath && uploadToStorage) {
      await deleteImage(imageToRemove.storagePath, bucket);
    }

    const newImages = images.filter((img) => img.id !== id);
    
    if (imageToRemove?.isCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }
    
    onChange(newImages);
  };

  const setCoverImage = (id: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all',
          isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-muted',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Uploading to cloud storage...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground mb-1">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Up to {maxImages} images, {compressImages ? 'automatically optimized' : 'max 5MB each'}
                </p>
              </div>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {images.length} / {maxImages} images • Drag to reorder
          </p>
          
          <Reorder.Group
            axis="y"
            values={images}
            onReorder={onChange}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {images.map((image) => (
              <Reorder.Item
                key={image.id}
                value={image}
                className="relative group"
                drag
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={image.url}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing">
                      <div className="bg-background/90 rounded-lg p-1.5">
                        <GripVertical className="h-4 w-4" />
                      </div>
                    </div>

                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setCoverImage(image.id)}
                      className="absolute bottom-2 left-2"
                      type="button"
                    >
                      <Badge
                        variant={image.isCover ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        <Star className={cn('h-3 w-3', image.isCover && 'fill-current')} />
                        {image.isCover ? 'Cover' : 'Set as cover'}
                      </Badge>
                    </button>

                    {image.storagePath && (
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 text-xs"
                      >
                        Cloud
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed rounded-xl">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;