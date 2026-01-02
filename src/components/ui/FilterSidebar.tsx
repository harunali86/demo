'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRICE_RANGES = [
    { label: 'Under ₹1,000', max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
    { label: '₹15,000 - ₹50,000', min: 15000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000 },
];

const RATING_OPTIONS = [
    { label: '4★ & above', value: 4 },
    { label: '3★ & above', value: 3 },
    { label: '2★ & above', value: 2 },
];

const DISCOUNT_OPTIONS = [
    { label: '50% or more', value: 50 },
    { label: '40% or more', value: 40 },
    { label: '30% or more', value: 30 },
    { label: '20% or more', value: 20 },
    { label: '10% or more', value: 10 },
];

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null);
    const [minRating, setMinRating] = useState<number | null>(null);
    const [minDiscount, setMinDiscount] = useState<number | null>(null);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (priceRange?.min) params.set('min_price', String(priceRange.min));
        else params.delete('min_price');

        if (priceRange?.max) params.set('max_price', String(priceRange.max));
        else params.delete('max_price');

        if (minRating) params.set('min_rating', String(minRating));
        else params.delete('min_rating');

        if (minDiscount) params.set('min_discount', String(minDiscount));
        else params.delete('min_discount');

        router.push(`?${params.toString()}`);
        onClose();
    };

    const clearFilters = () => {
        setPriceRange(null);
        setMinRating(null);
        setMinDiscount(null);
        router.push(window.location.pathname);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                transition={{ type: 'spring', damping: 25 }}
                className={`fixed lg:relative left-0 top-0 h-full lg:h-auto w-72 bg-[#0a0a0a] lg:bg-transparent border-r border-white/10 lg:border-0 z-50 lg:z-auto overflow-y-auto lg:block ${isOpen ? 'block' : 'hidden lg:block'}`}
            >
                <div className="p-4 lg:p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h4 className="font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">Price</h4>
                        <div className="space-y-2">
                            {PRICE_RANGES.map((range, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={priceRange?.max === range.max && priceRange?.min === range.min}
                                        onChange={() => setPriceRange({ min: range.min, max: range.max })}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {range.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <h4 className="font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">Customer Rating</h4>
                        <div className="space-y-2">
                            {RATING_OPTIONS.map((option, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={minRating === option.value}
                                        onChange={() => setMinRating(option.value)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex items-center gap-1">
                                        {option.label}
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="mb-6">
                        <h4 className="font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">Discount</h4>
                        <div className="space-y-2">
                            {DISCOUNT_OPTIONS.map((option, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="discount"
                                        checked={minDiscount === option.value}
                                        onChange={() => setMinDiscount(option.value)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            onClick={clearFilters}
                            className="flex-1 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={applyFilters}
                            className="flex-1 py-2 bg-primary text-white font-bold text-sm rounded-full hover:bg-orange-600 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
