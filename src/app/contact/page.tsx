import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-400">We'd love to hear from you</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Address</h3>
                                    <p className="text-gray-400">Pune, Maharashtra, India</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Phone</h3>
                                    <p className="text-gray-400">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Email</h3>
                                    <p className="text-gray-400">harun@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Hours</h3>
                                    <p className="text-gray-400">Mon - Sat: 9AM - 9PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                                    <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none resize-none"></textarea>
                            </div>
                            <button className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
