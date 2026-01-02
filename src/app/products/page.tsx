import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function ProductsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">All Products</h1>
                    <p className="text-gray-400">Browse our complete collection</p>
                </div>

                <div className="text-center py-20">
                    <p className="text-gray-400 mb-4">Products are loaded from database. Use the search or categories to find products.</p>
                    <Link href="/search" className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-xl">
                        Search Products
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
