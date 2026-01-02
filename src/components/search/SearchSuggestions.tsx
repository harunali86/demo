'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

interface SearchSuggestionsProps {
    query: string;
    onSelect: (query: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

const TRENDING_SEARCHES = [
    'iPhone 15 Pro',
    'MacBook',
    'AirPods Pro',
    'Samsung Galaxy',
    'Sony Headphones',
    'Nike Shoes',
];

export default function SearchSuggestions({ query, onSelect, onClose, isOpen }: SearchSuggestionsProps) {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const addToRecent = (search: string) => {
        const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recent-searches');
    };

    const handleSelect = (search: string) => {
        addToRecent(search);
        onSelect(search);
    };

    // Get matching products
    const matchingProducts = query.length > 0
        ? PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        : [];

    // Get search suggestions (product names that start with query)
    const suggestions = query.length > 0
        ? PRODUCTS
            .map(p => p.name)
            .filter(name => name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 6)
        : [];

    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#232323] border border-[#ddd] dark:border-[#3d4f5f] rounded-b-lg shadow-xl z-50 max-h-[70vh] overflow-y-auto">
            {query.length === 0 ? (
                <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div className="p-3 border-b border-[#eee] dark:border-[#3d4f5f]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-[#565959] dark:text-[#999] uppercase">Recent Searches</h4>
                                <button onClick={clearRecent} className="text-xs text-[#007185] dark:text-[#56c5d3] hover:underline">
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((search, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(search)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-left hover:bg-[#f0f2f2] dark:hover:bg-[#2a2a2a] rounded"
                                >
                                    <Clock className="w-4 h-4 text-[#999]" />
                                    <span className="text-sm text-[#0f1111] dark:text-[#e3e6e6]">{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trending Searches */}
                    <div className="p-3">
                        <h4 className="text-xs font-bold text-[#565959] dark:text-[#999] uppercase mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                        </h4>
                        {TRENDING_SEARCHES.map((search, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(search)}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-left hover:bg-[#f0f2f2] dark:hover:bg-[#2a2a2a] rounded"
                            >
                                <Search className="w-4 h-4 text-[#999]" />
                                <span className="text-sm text-[#0f1111] dark:text-[#e3e6e6]">{search}</span>
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="p-2 border-b border-[#eee] dark:border-[#3d4f5f]">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(suggestion)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-left hover:bg-[#f0f2f2] dark:hover:bg-[#2a2a2a] rounded"
                                >
                                    <Search className="w-4 h-4 text-[#999]" />
                                    <span className="text-sm text-[#0f1111] dark:text-[#e3e6e6]">
                                        {suggestion.split(new RegExp(`(${query})`, 'gi')).map((part, j) =>
                                            part.toLowerCase() === query.toLowerCase()
                                                ? <strong key={j}>{part}</strong>
                                                : part
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Matching Products */}
                    {matchingProducts.length > 0 && (
                        <div className="p-2">
                            <h4 className="text-xs font-bold text-[#565959] dark:text-[#999] uppercase mb-2 px-2">Products</h4>
                            {matchingProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-2 hover:bg-[#f0f2f2] dark:hover:bg-[#2a2a2a] rounded"
                                >
                                    <div className="w-10 h-10 bg-white rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#0f1111] dark:text-[#e3e6e6] truncate">{product.name}</p>
                                        <p className="text-sm font-medium text-[#0f1111] dark:text-[#e3e6e6]">₹{product.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {suggestions.length === 0 && matchingProducts.length === 0 && (
                        <div className="p-4 text-center text-sm text-[#999]">
                            No results found for "{query}"
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
