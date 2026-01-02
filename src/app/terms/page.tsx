import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <p>Last updated: January 2024</p>

                    <h2 className="text-xl font-bold text-white mt-8">1. Acceptance of Terms</h2>
                    <p>By using Harun Store, you agree to these terms. If you disagree, please do not use our services.</p>

                    <h2 className="text-xl font-bold text-white mt-8">2. User Accounts</h2>
                    <p>You are responsible for maintaining the security of your account and all activities under it.</p>

                    <h2 className="text-xl font-bold text-white mt-8">3. Orders & Payments</h2>
                    <p>All orders are subject to availability. We reserve the right to cancel orders due to pricing errors or stock issues. Payment must be made at checkout.</p>

                    <h2 className="text-xl font-bold text-white mt-8">4. Shipping & Delivery</h2>
                    <p>Delivery times are estimates. We are not responsible for delays caused by shipping carriers or external factors.</p>

                    <h2 className="text-xl font-bold text-white mt-8">5. Returns</h2>
                    <p>Returns are accepted within 7 days of delivery. Items must be unused and in original packaging. See our Returns page for details.</p>

                    <h2 className="text-xl font-bold text-white mt-8">6. Limitation of Liability</h2>
                    <p>Harun Store is not liable for indirect damages arising from use of our services or products.</p>

                    <h2 className="text-xl font-bold text-white mt-8">7. Changes to Terms</h2>
                    <p>We may update these terms. Continued use of the site constitutes acceptance of changes.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
