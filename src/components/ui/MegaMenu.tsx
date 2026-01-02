'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Laptop, Shirt, Watch, Headphones, Footprints, Gamepad2, Home, Briefcase } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
    {
        name: 'Premium Tech',
        slug: 'premium_tech',
        icon: Laptop,
        subcategories: ['Laptops', 'Smartphones', 'Tablets', 'Accessories']
    },
    {
        name: 'Fashion',
        slug: 'fashion',
        icon: Shirt,
        subcategories: ['Men', 'Women', 'Kids', 'Ethnic Wear']
    },
    {
        name: 'Watches',
        slug: 'watches',
        icon: Watch,
        subcategories: ['Smart Watches', 'Analog', 'Digital', 'Luxury']
    },
    {
        name: 'Audio',
        slug: 'audio',
        icon: Headphones,
        subcategories: ['Headphones', 'Earbuds', 'Speakers', 'Soundbars']
    },
    {
        name: 'Sneakers',
        slug: 'sneakers',
        icon: Footprints,
        subcategories: ['Running', 'Casual', 'Sports', 'Limited Edition']
    },
    {
        name: 'Gaming',
        slug: 'gaming',
        icon: Gamepad2,
        subcategories: ['Consoles', 'Controllers', 'Chairs', 'Keyboards']
    },
    {
        name: 'Lifestyle',
        slug: 'lifestyle',
        icon: Home,
        subcategories: ['Home Decor', 'Kitchen', 'Fitness', 'Travel']
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        icon: Briefcase,
        subcategories: ['Bags', 'Wallets', 'Belts', 'Sunglasses']
    },
];

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => { setIsOpen(false); setActiveCategory(null); }}
        >
            {/* Trigger Button */}
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-2">
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex"
                    >
                        {/* Main Categories */}
                        <div className="w-56 py-2 border-r border-white/10">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <Link
                                        key={cat.slug}
                                        href={`/category/${cat.slug}`}
                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${activeCategory === cat.slug ? 'bg-white/5 text-primary' : 'text-gray-300'}`}
                                        onMouseEnter={() => setActiveCategory(cat.slug)}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Subcategories */}
                        <div className="w-48 py-2">
                            {activeCategory && (
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Shop by</p>
                                    {CATEGORIES.find(c => c.slug === activeCategory)?.subcategories.map((sub, i) => (
                                        <Link
                                            key={i}
                                            href={`/category/${activeCategory}?sub=${sub.toLowerCase()}`}
                                            className="block py-2 text-sm text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {!activeCategory && (
                                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                    Hover a category
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
