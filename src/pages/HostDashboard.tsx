import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, GripVertical, Home, MapPin, Image as ImageIcon, DollarSign, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HostDashboard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<Array<{ id: string; url: string; isCover: boolean }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  const steps = [
    { icon: Home, label: 'Basic Info', description: 'Property details' },
    { icon: MapPin, label: 'Location', description: 'Address & map' },
    { icon: ImageIcon, label: 'Photos', description: 'Upload images' },
    { icon: DollarSign, label: 'Pricing', description: 'Set your price' },
    { icon: CheckCircle, label: 'Review', description: 'Publish listing' },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          isCover: images.length === 0,
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            isCover: images.length === 0,
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const setCoverImage = (id: string) => {
    setImages(prev =>
      prev.map(img => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  const handlePublish = () => {
    toast({
      title: 'Listing published!',
      description: 'Your property is now live and visible to guests.',
    });
  };

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Create New Listing</h1>
              <p className="text-muted-foreground">
                Fill in the details to list your property
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`flex flex-col items-center gap-2 transition-colors ${
                        index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`rounded-full p-3 ${
                          index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs font-medium">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Basic Information</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Property Title</Label>
                          <Input id="title" placeholder="e.g., Sunny 2BHK near Central Park" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your property..."
                            rows={5}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Property Type</Label>
                            <Select>
                              <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="studio">Studio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bedrooms">Bedrooms</Label>
                            <Select>
                              <SelectTrigger id="bedrooms">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 BHK</SelectItem>
                                <SelectItem value="2">2 BHK</SelectItem>
                                <SelectItem value="3">3 BHK</SelectItem>
                                <SelectItem value="4">4+ BHK</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Location</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input id="address" placeholder="123 Main Street" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Hyderabad" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" placeholder="500001" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Photos</h2>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          isDragging ? 'border-primary bg-primary/5' : 'border-muted'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop images here, or click to browse
                        </p>
                        <input
                          type="file"
                          id="images"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="images">
                          <Button type="button" variant="outline" className="mt-2">
                            Choose Files
                          </Button>
                        </label>
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {images.map(image => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt="Upload preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(image.id)}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setCoverImage(image.id)}
                                className="absolute top-2 left-2"
                              >
                                <Badge variant={image.isCover ? 'default' : 'secondary'}>
                                  {image.isCover ? 'Cover' : 'Set as cover'}
                                </Badge>
                              </button>
                              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                                <GripVertical className="h-5 w-5 text-white drop-shadow" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Pricing</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price per Month</Label>
                          <Input id="price" type="number" placeholder="2500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deposit">Security Deposit</Label>
                          <Input id="deposit" type="number" placeholder="5000" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Review & Publish</h2>
                      <p className="text-muted-foreground">
                        Review your listing details and publish when ready.
                      </p>
                      <Button onClick={handlePublish} className="w-full" size="lg">
                        Publish Listing
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Live Preview */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {images.length > 0 ? (
                          <img
                            src={images.find(img => img.isCover)?.url || images[0].url}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">Property Title</h4>
                        <p className="text-sm text-muted-foreground">City, Location</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">₹2,500</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostDashboard;
