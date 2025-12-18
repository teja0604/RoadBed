import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I search for properties on RoadBed?',
          a: 'Simply enter your desired location, select your dates, and specify the number of guests on our homepage. You can also use advanced filters to narrow down your search by price, property type, and amenities.',
        },
        {
          q: 'Do I need to create an account?',
          a: 'You can browse properties without an account, but you need to sign up to contact owners, save favorites, and make bookings.',
        },
        {
          q: 'Is RoadBed really brokerage-free?',
          a: 'Yes! We connect you directly with property owners, eliminating all brokerage fees. You only pay the rent/purchase price set by the owner.',
        },
      ],
    },
    {
      category: 'Booking & Payments',
      questions: [
        {
          q: 'How do I book a property?',
          a: 'Once you find a property you like, click "Book Now", select your dates, and complete the secure payment process. You\'ll receive instant confirmation.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.',
        },
        {
          q: 'Can I cancel my booking?',
          a: 'Cancellation policies vary by property. Check the specific cancellation policy on the listing page before booking.',
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days according to the property\'s cancellation policy.',
        },
      ],
    },
    {
      category: 'Property Owners',
      questions: [
        {
          q: 'How can I list my property?',
          a: 'Click "List Property" in the header, create an account, and follow our simple step-by-step listing wizard. You\'ll need photos, property details, and verification documents.',
        },
        {
          q: 'What documents do I need to verify ownership?',
          a: 'You need property ownership documents (sale deed/registry), government-issued ID proof, and recent utility bills.',
        },
        {
          q: 'How do I receive payments?',
          a: 'Payments are transferred directly to your registered bank account within 24 hours of booking confirmation.',
        },
      ],
    },
    {
      category: 'Safety & Trust',
      questions: [
        {
          q: 'How are property owners verified?',
          a: 'Every owner undergoes a strict verification process including document verification, identity confirmation, and property ownership validation.',
        },
        {
          q: 'Is my personal information secure?',
          a: 'Yes, we use industry-standard encryption and never share your personal information without your consent.',
        },
        {
          q: 'What if I have an issue with a property?',
          a: 'Contact our 24/7 support team immediately. We have a dedicated resolution team to handle any disputes or issues.',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers to common questions about RoadBed
              </p>
              
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {filteredFaqs.map((category, catIndex) => (
                <div key={catIndex} className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${catIndex}-${faqIndex}`}
                        className="bg-card rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-lg p-8 text-center mt-12"
            >
              <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@roadbed.com" className="text-primary hover:underline">
                  support@roadbed.com
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="tel:1-800-ROADBED" className="text-primary hover:underline">
                  1-800-ROADBED
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
