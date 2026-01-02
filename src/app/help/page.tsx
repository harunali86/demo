import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown } from 'lucide-react';

const FAQS = [
    {
        q: 'How do I track my order?',
        a: 'Go to the Track Order page and enter your order number and email to see real-time updates on your shipment.'
    },
    {
        q: 'What is the return policy?',
        a: 'We offer 7-day easy returns for most products. Items must be unused and in original packaging.'
    },
    {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3-5 business days. Express delivery is available within 1-2 days for select areas.'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.'
    },
    {
        q: 'How do I cancel my order?',
        a: 'You can cancel within 24 hours of placing the order from your Orders page or by contacting support.'
    },
];

export default function HelpPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                    <p className="text-gray-400">How can we help you today?</p>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-primary/50 transition">
                        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-primary" />
                        <h3 className="font-bold mb-1">Live Chat</h3>
                        <p className="text-sm text-gray-400">Chat with our team</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-primary/50 transition">
                        <Phone className="w-10 h-10 mx-auto mb-3 text-primary" />
                        <h3 className="font-bold mb-1">Call Us</h3>
                        <p className="text-sm text-gray-400">+91 98765 43210</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-primary/50 transition">
                        <Mail className="w-10 h-10 mx-auto mb-3 text-primary" />
                        <h3 className="font-bold mb-1">Email</h3>
                        <p className="text-sm text-gray-400">support@harunstore.com</p>
                    </div>
                </div>

                {/* FAQs */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 group">
                                <summary className="flex items-center justify-between cursor-pointer font-medium">
                                    {faq.q}
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition" />
                                </summary>
                                <p className="mt-3 text-gray-400">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
