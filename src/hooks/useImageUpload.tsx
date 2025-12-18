import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  storagePath: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File,
    bucket: string = 'property-images',
    folder: string = ''
  ): Promise<UploadResult | null> => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        storagePath: filePath,
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    bucket: string = 'property-images',
    folder: string = ''
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await uploadImage(file, bucket, folder);
      if (result) {
        results.push(result);
      }
    }

    return results;
  };

  const deleteImage = async (
    storagePath: string,
    bucket: string = 'property-images'
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
      return false;
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    uploading,
  };
};