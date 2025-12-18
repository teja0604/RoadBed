import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const KYC = () => {
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadhar: '',
    pan: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setVerificationStatus('pending');
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus('verified');
      toast({
        title: "Verification Complete",
        description: "Your KYC verification is successful.",
      });
    }, 3000);
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
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Owner Verification (KYC)</h1>
            <p className="text-xl text-muted-foreground">
              Complete your verification to list properties and build trust
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Verification Form */}
            <Card className="lg:col-span-2 p-6">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              
              {verificationStatus === 'verified' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-24 h-24 mx-auto mb-4 text-success" />
                  <h3 className="text-2xl font-bold mb-2">Verification Complete!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your account is now verified. You can start listing properties.
                  </p>
                  <Badge className="bg-success text-success-foreground">
                    Verified Owner
                  </Badge>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="As per Aadhar"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aadhar">Aadhar Number *</Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      value={formData.aadhar}
                      onChange={handleInputChange}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pan">PAN Number *</Label>
                    <Input
                      id="pan"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Documents *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4 border-dashed cursor-pointer hover:border-primary transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">Aadhar Card</p>
                          <p className="text-xs text-muted-foreground">Front & Back</p>
                        </div>
                      </Card>
                      <Card className="p-4 border-dashed cursor-pointer hover:border-primary transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">PAN Card</p>
                          <p className="text-xs text-muted-foreground">Clear copy</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={verificationStatus === 'pending'}
                    className="w-full"
                    size="lg"
                  >
                    {verificationStatus === 'pending' ? 'Verifying...' : 'Submit for Verification'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Benefits Sidebar */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Verification Benefits</h2>
              <ul className="space-y-3">
                {[
                  'Build trust with potential tenants',
                  'Get verified badge on listings',
                  'Faster property approval',
                  'Priority support',
                  'Higher visibility in search',
                  'Secure transaction protection',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  Your information is encrypted and secure. We comply with all data protection regulations.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default KYC;
