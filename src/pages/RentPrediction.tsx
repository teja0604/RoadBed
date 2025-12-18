import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Layers, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { supabase } from '@/integrations/supabase/client';

interface PredictionResult {
  estimatedRent: number;
  minRange: number;
  maxRange: number;
  factors: string[];
  marketInsight: string;
}

const RentPrediction = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData, clearFormData] = useFormPersistence('rent-prediction-form', {
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    amenities: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!formData.location || !formData.propertyType || !formData.bedrooms || !formData.sqft) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('rent-prediction', {
        body: {
          city: formData.location,
          propertyType: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms) || 1,
          area: parseInt(formData.sqft),
          amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        }
      });

      if (error) throw error;

      setPrediction(data);
      toast({
        title: "Prediction Complete",
        description: "Your AI-powered rent estimate is ready!",
      });
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: error.message || "Unable to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-primary" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">AI Rent Price Predictor</h1>
            <p className="text-xl text-muted-foreground">
              Get AI-powered rent estimates based on real market data
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Property Details</h2>
                <Button variant="ghost" size="sm" onClick={clearFormData}>
                  Clear Form
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Location / City *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter city name (e.g., Bangalore, Mumbai)"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Independent Villa</SelectItem>
                      <SelectItem value="house">Independent House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="2"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="2"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sqft">Area (sq ft) *</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="sqft"
                      name="sqft"
                      type="number"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      placeholder="1200"
                      className="pl-10"
                      min="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input
                    id="amenities"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="parking, gym, pool, furnished"
                  />
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Predict Rent
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Prediction Result */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">AI Prediction</h2>
              
              {prediction ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="p-8 bg-primary/10 rounded-lg text-center">
                    <p className="text-muted-foreground mb-2">Estimated Monthly Rent</p>
                    <p className="text-5xl font-bold text-primary">
                      ₹{prediction.estimatedRent.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">Low Range</span>
                      <span className="font-semibold">₹{prediction.minRange.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <span className="text-muted-foreground">High Range</span>
                      <span className="font-semibold">₹{prediction.maxRange.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {prediction.factors && prediction.factors.length > 0 && (
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <p className="font-semibold text-accent mb-2">Price Factors</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {prediction.factors.map((factor, i) => (
                          <li key={i}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.marketInsight && (
                    <div className="p-4 bg-success/10 rounded-lg">
                      <p className="font-semibold text-success mb-2">Market Insight</p>
                      <p className="text-sm text-muted-foreground">{prediction.marketInsight}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-24 h-24 mx-auto mb-4 opacity-20" />
                  <p>Fill in the property details to get your AI-powered rent prediction</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RentPrediction;
