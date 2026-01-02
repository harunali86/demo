'use client';

import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';
import { Check, Plus } from 'lucide-react';

interface Props {
    currentProductId: string;
    category: string;
}

export default function FrequentlyBoughtTogether({ currentProductId, category }: Props) {
    const addItem = useCartStore((state) => state.addItem);

    // Get related products from same category
    const relatedProducts = PRODUCTS
        .filter(p => p.cat === category && p.id !== currentProductId)
        .slice(0, 2);

    const currentProduct = PRODUCTS.find(p => p.id === currentProductId);

    if (!currentProduct || relatedProducts.length < 2) return null;

    const allProducts = [currentProduct, ...relatedProducts];
    const totalPrice = allProducts.reduce((sum, p) => sum + p.price, 0);
    const totalOriginal = allProducts.reduce((sum, p) => sum + (p.sale || p.price), 0);
    const savings = totalOriginal - totalPrice;

    const [selectedProducts, setSelectedProducts] = useState<string[]>(allProducts.map(p => p.id));

    const toggleProduct = (id: string) => {
        if (id === currentProductId) return; // Can't deselect current product
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleAddAll = () => {
        const productsToAdd = allProducts.filter(p => selectedProducts.includes(p.id));
        productsToAdd.forEach(product => {
            addItem({
                id: product.id,
                name: product.name,
                base_price: product.price,
                category_id: product.cat,
                images: [{ url: product.img }],
                slug: product.name.toLowerCase().replace(/ /g, '-'),
                description: '',
                compare_price: product.sale || null,
                is_active: true,
                is_featured: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as any);
        });
        toast.success(`Added ${productsToAdd.length} items to cart`);
    };

    const selectedTotal = allProducts
        .filter(p => selectedProducts.includes(p.id))
        .reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-lg font-bold text-[#e3e6e6] mb-4">Frequently bought together</h3>

            <div className="flex flex-wrap items-center gap-2 mb-4">
                {allProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center">
                        {index > 0 && (
                            <Plus className="w-5 h-5 text-[#999] mx-2" />
                        )}
                        <div
                            onClick={() => toggleProduct(product.id)}
                            className={`relative cursor-pointer transition-all ${selectedProducts.includes(product.id)
                                    ? 'opacity-100'
                                    : 'opacity-40'
                                }`}
                        >
                            <div className="w-24 h-24 bg-white rounded overflow-hidden">
                                <Image
                                    src={product.img}
                                    alt={product.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>
                            {/* Checkbox */}
                            <div className={`absolute -top-1 -left-1 w-5 h-5 rounded border-2 flex items-center justify-center ${selectedProducts.includes(product.id)
                                    ? 'bg-[#febd69] border-[#febd69]'
                                    : 'bg-[#1a1a1a] border-[#3d4f5f]'
                                }`}>
                                {selectedProducts.includes(product.id) && (
                                    <Check className="w-3 h-3 text-[#0f1111]" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Names */}
            <div className="space-y-1 mb-4 text-sm">
                {allProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProduct(product.id)}
                            disabled={product.id === currentProductId}
                            className="accent-[#febd69]"
                        />
                        <Link
                            href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                            className="text-[#56c5d3] hover:text-[#febd69] hover:underline truncate max-w-[200px]"
                        >
                            {index === 0 ? 'This item: ' : ''}{product.name}
                        </Link>
                        <span className="text-[#e3e6e6] font-medium">₹{product.price.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Total & Add Button */}
            <div className="flex items-center justify-between pt-3 border-t border-[#3d4f5f]">
                <div>
                    <span className="text-[#e3e6e6]">Total price: </span>
                    <span className="text-lg font-bold text-[#e3e6e6]">₹{selectedTotal.toLocaleString()}</span>
                    {savings > 0 && selectedProducts.length === allProducts.length && (
                        <span className="ml-2 text-sm text-[#3d9c4a]">Save ₹{savings.toLocaleString()}</span>
                    )}
                </div>
                <button
                    onClick={handleAddAll}
                    className="px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-[#0f1111] font-medium rounded text-sm hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734]"
                >
                    Add all to Cart
                </button>
            </div>
        </div>
    );
}
