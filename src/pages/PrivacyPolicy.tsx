import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 2025</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none space-y-8"
            >
              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Account information (name, email, phone number)</li>
                  <li>Profile information and preferences</li>
                  <li>Property listings and related details</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Communications with other users and support</li>
                  <li>Reviews and feedback</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">2. Automatically Collected Information</h2>
                <p className="text-muted-foreground mb-4">
                  When you use RoadBed, we automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide and improve our services</li>
                  <li>Process transactions and send transaction notifications</li>
                  <li>Verify identity and prevent fraud</li>
                  <li>Send important updates and promotional communications</li>
                  <li>Respond to customer service requests</li>
                  <li>Personalize your experience</li>
                  <li>Analyze usage patterns and trends</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Property owners/seekers:</strong> To facilitate bookings and communication</li>
                  <li><strong>Service providers:</strong> Payment processors, hosting services, analytics providers</li>
                  <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Restricted access to personal information</li>
                  <li>Secure payment processing through certified partners</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Lodge a complaint with data protection authorities</li>
                </ul>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver 
                  personalized content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  RoadBed is not intended for users under 18 years of age. We do not knowingly collect personal 
                  information from children. If we become aware of such collection, we will delete it promptly.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country of residence. 
                  We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">10. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically. We will notify you of significant changes through 
                  email or a prominent notice on our platform. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section className="bg-card rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  For questions or concerns about this Privacy Policy or our data practices, contact us at:
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Email:</strong> privacy@roadbed.com<br />
                  <strong>Phone:</strong> 1-800-ROADBED<br />
                  <strong>Address:</strong> RoadBed Privacy Team, India
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

export default PrivacyPolicy;
