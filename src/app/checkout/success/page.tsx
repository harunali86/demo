'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-400 mb-8 max-w-md">
                Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
            </p>
            <Link href="/" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                Continue Shopping
            </Link>
        </main>
    );
}
