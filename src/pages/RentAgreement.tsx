import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RentAgreement = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    landlordName: '',
    landlordAddress: '',
    tenantName: '',
    tenantAddress: '',
    propertyAddress: '',
    rentAmount: '',
    securityDeposit: '',
    leaseTerm: '',
    startDate: '',
    specialTerms: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    toast({
      title: "Agreement Generated",
      description: "Your rent agreement has been generated successfully.",
    });
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
            <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Online Rent Agreement</h1>
            <p className="text-xl text-muted-foreground">
              Create a legally valid rent agreement in minutes
            </p>
          </motion.div>

          <Card className="p-8">
            <form className="space-y-6">
              {/* Landlord Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Landlord Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landlordName">Full Name *</Label>
                    <Input
                      id="landlordName"
                      name="landlordName"
                      value={formData.landlordName}
                      onChange={handleInputChange}
                      placeholder="Enter landlord name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="landlordAddress">Address *</Label>
                    <Input
                      id="landlordAddress"
                      name="landlordAddress"
                      value={formData.landlordAddress}
                      onChange={handleInputChange}
                      placeholder="Enter landlord address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tenant Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Tenant Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tenantName">Full Name *</Label>
                    <Input
                      id="tenantName"
                      name="tenantName"
                      value={formData.tenantName}
                      onChange={handleInputChange}
                      placeholder="Enter tenant name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenantAddress">Address *</Label>
                    <Input
                      id="tenantAddress"
                      name="tenantAddress"
                      value={formData.tenantAddress}
                      onChange={handleInputChange}
                      placeholder="Enter tenant address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property & Rent Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Property & Rent Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyAddress">Property Address *</Label>
                    <Input
                      id="propertyAddress"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleInputChange}
                      placeholder="Enter property address"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rentAmount">Monthly Rent (₹) *</Label>
                      <Input
                        id="rentAmount"
                        name="rentAmount"
                        type="number"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        placeholder="25000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        type="number"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        placeholder="50000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaseTerm">Lease Term (months) *</Label>
                      <Input
                        id="leaseTerm"
                        name="leaseTerm"
                        type="number"
                        value={formData.leaseTerm}
                        onChange={handleInputChange}
                        placeholder="11"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Lease Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Special Terms */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Special Terms (Optional)</h2>
                <div>
                  <Label htmlFor="specialTerms">Additional Clauses</Label>
                  <Textarea
                    id="specialTerms"
                    name="specialTerms"
                    value={formData.specialTerms}
                    onChange={handleInputChange}
                    placeholder="Enter any special terms or conditions..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleGenerate}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <FileText className="w-5 h-5" />
                  Generate Agreement
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  size="lg"
                >
                  <Send className="w-5 h-5" />
                  Send via Email
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RentAgreement;
