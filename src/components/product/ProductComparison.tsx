'use client';

import { useState } from 'react';
import { X, Check, Minus, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

interface CompareItem {
    id: string;
    name: string;
    price: number;
    sale: number | null;
    img: string;
    cat: string;
}

interface ProductComparisonProps {
    products: CompareItem[];
    onRemove: (id: string) => void;
    onClose: () => void;
}

export default function ProductComparison({ products, onRemove, onClose }: ProductComparisonProps) {
    const addItem = useCartStore((state) => state.addItem);

    if (products.length === 0) return null;

    // Generate specs based on category
    const getSpecs = (product: CompareItem): Record<string, string> => {
        const hash = product.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const rating = (4.0 + (hash % 10) / 10).toFixed(1);
        const reviews = 100 + (hash % 500);

        const baseSpecs: Record<string, string> = {
            'Rating': `${rating} ★ (${reviews})`,
            'Price': `₹${product.price.toLocaleString()}`,
            'Brand': product.name.split(' ')[0],
            'Warranty': '1 Year',
            'Return Policy': '7 Days',
            'Delivery': 'Free',
        };

        const categorySpecs: Record<string, Record<string, string>> = {
            'premium_tech': {
                'Display': `${5.5 + (hash % 2)}″ AMOLED`,
                'Processor': hash % 2 === 0 ? 'Snapdragon 8 Gen 2' : 'A17 Pro',
                'RAM': `${8 + (hash % 8)}GB`,
                'Storage': `${128 * (1 + hash % 4)}GB`,
                'Battery': `${4000 + (hash % 1500)}mAh`,
                'Camera': `${48 + (hash % 50)}MP`,
            },
            'audio': {
                'Type': hash % 2 === 0 ? 'Over-ear' : 'In-ear',
                'Driver Size': `${10 + (hash % 40)}mm`,
                'Battery Life': `${20 + (hash % 30)}hrs`,
                'Noise Cancellation': hash % 2 === 0 ? 'Active' : 'Passive',
                'Connectivity': 'Bluetooth 5.3',
                'Water Resistant': hash % 2 === 0 ? 'IPX4' : 'IPX5',
            },
            'fashion': {
                'Material': hash % 2 === 0 ? 'Cotton' : 'Polyester Blend',
                'Fit': hash % 2 === 0 ? 'Regular' : 'Slim',
                'Wash Care': 'Machine Wash',
                'Pattern': hash % 2 === 0 ? 'Solid' : 'Printed',
                'Sleeve': 'Full Sleeve',
                'Occasion': 'Casual',
            },
        };

        return { ...baseSpecs, ...(categorySpecs[product.cat] || categorySpecs['premium_tech']) };
    };

    const allSpecs = products.map(p => getSpecs(p));
    const specKeys = Object.keys(allSpecs[0] || {});

    const handleAddToCart = (product: CompareItem) => {
        addItem({
            id: product.id,
            name: product.name,
            base_price: product.price,
            category_id: product.cat,
            images: [{ url: product.img }],
            slug: product.name.toLowerCase().replace(/ /g, '-'),
        } as any);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0f1111] rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#131921] p-4 flex items-center justify-between border-b border-[#3d4f5f]">
                    <h2 className="text-lg font-bold text-[#e3e6e6]">Compare Products</h2>
                    <button onClick={onClose} className="text-[#999] hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Product Images & Names */}
                        <thead>
                            <tr className="border-b border-[#3d4f5f]">
                                <th className="p-4 text-left text-sm text-[#999] w-40">Product</th>
                                {products.map((product) => (
                                    <th key={product.id} className="p-4 text-center min-w-[200px]">
                                        <div className="relative">
                                            <button
                                                onClick={() => onRemove(product.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#cc0c39] rounded-full flex items-center justify-center text-white hover:bg-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <Link href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}>
                                                <div className="w-32 h-32 mx-auto bg-white rounded overflow-hidden mb-3">
                                                    <Image
                                                        src={product.img}
                                                        alt={product.name}
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                                <p className="text-sm text-[#56c5d3] hover:text-[#febd69] line-clamp-2">
                                                    {product.name}
                                                </p>
                                            </Link>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="mt-3 px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-[#0f1111] text-sm font-medium rounded hover:from-[#f5d78e] hover:to-[#eeb933] flex items-center gap-1 mx-auto"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Specs */}
                        <tbody>
                            {specKeys.map((key, i) => (
                                <tr key={key} className={i % 2 === 0 ? 'bg-[#1a1a1a]' : ''}>
                                    <td className="p-4 text-sm font-medium text-[#999]">{key}</td>
                                    {products.map((product, j) => {
                                        const value = allSpecs[j][key];
                                        const isBest = products.length > 1 && key === 'Price'
                                            ? product.price === Math.min(...products.map(p => p.price))
                                            : false;

                                        return (
                                            <td
                                                key={product.id}
                                                className={`p-4 text-sm text-center ${isBest ? 'text-[#3d9c4a] font-bold' : 'text-[#e3e6e6]'}`}
                                            >
                                                {value || <Minus className="w-4 h-4 mx-auto text-[#666]" />}
                                                {isBest && <span className="ml-1 text-[10px] bg-[#3d9c4a]/20 px-1 rounded">Best</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Add to Compare Button Component
export function AddToCompareButton({ product, onAdd, isAdded }: {
    product: CompareItem;
    onAdd: (product: CompareItem) => void;
    isAdded: boolean;
}) {
    return (
        <button
            onClick={() => onAdd(product)}
            disabled={isAdded}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${isAdded
                ? 'bg-[#3d9c4a]/20 text-[#3d9c4a]'
                : 'bg-[#232323] text-[#999] hover:text-[#febd69] hover:bg-[#2a2a2a]'
                }`}
        >
            {isAdded ? <Check className="w-3 h-3" /> : null}
            {isAdded ? 'Added' : 'Compare'}
        </button>
    );
}
