import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none space-y-8"
            >
              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using RoadBed, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">3. Property Listings</h2>
                <p className="text-muted-foreground mb-4">
                  Property owners agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide accurate property information and images</li>
                  <li>Have legal ownership or authorization to list the property</li>
                  <li>Honor confirmed bookings and agreements</li>
                  <li>Comply with local laws and regulations</li>
                  <li>Not discriminate against potential tenants</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">4. Booking and Payments</h2>
                <p className="text-muted-foreground mb-4">
                  When making a booking:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You agree to pay the full amount as displayed</li>
                  <li>All payments are processed securely through our platform</li>
                  <li>Cancellation policies are set by property owners</li>
                  <li>Refunds are subject to the applicable cancellation policy</li>
                  <li>RoadBed is not responsible for disputes between owners and seekers</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">
                  You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Post false or misleading information</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or threaten other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to circumvent our fee structure</li>
                  <li>Use automated systems to access the platform</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content on RoadBed, including text, graphics, logos, and software, is the property of 
                  RoadBed or its content suppliers and is protected by intellectual property laws.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  RoadBed acts as a platform connecting property owners and seekers. We are not responsible for 
                  the condition of properties, accuracy of listings, or interactions between users. Use of the 
                  platform is at your own risk.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">8. Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  Any disputes arising from use of RoadBed shall be resolved through arbitration in accordance 
                  with Indian law, with the jurisdiction being courts in the city where RoadBed is registered.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  RoadBed reserves the right to modify these terms at any time. Continued use of the platform 
                  after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Email:</strong> legal@roadbed.com<br />
                  <strong>Phone:</strong> 1-800-ROADBED
                </p>
              </section>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
