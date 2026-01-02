import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <p>Last updated: January 2024</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
                    <p>We collect information you provide directly, including name, email, phone number, and shipping address when you create an account or place an order.</p>

                    <h2 className="text-xl font-bold text-white mt-8">2. How We Use Your Information</h2>
                    <p>We use your information to process orders, send order updates, provide customer support, and improve our services.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Information Sharing</h2>
                    <p>We do not sell your personal information. We only share data with shipping partners to deliver your orders and payment processors to complete transactions.</p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Data Security</h2>
                    <p>We implement industry-standard security measures to protect your personal information from unauthorized access.</p>

                    <h2 className="text-xl font-bold text-white mt-8">5. Your Rights</h2>
                    <p>You can access, update, or delete your account information at any time from your profile settings.</p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Contact Us</h2>
                    <p>For privacy-related questions, contact us at harun@gmail.com</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
