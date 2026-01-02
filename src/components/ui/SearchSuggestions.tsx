'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: { url: string }[];
}

interface SearchSuggestionsProps {
    query: string;
    onClose: () => void;
}

export default function SearchSuggestions({ query, onClose }: SearchSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                // Search by name or description
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%`) // Case-insensitive, partial match
                    .limit(5); // Limit to top 5 results

                if (error) throw error;
                setSuggestions(data || []);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300); // Debounce search API calls
        return () => clearTimeout(debounce);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!query || query.length < 2) return null;

    return (
        <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {loading ? (
                <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Searching...</span>
                </div>
            ) : suggestions.length > 0 ? (
                <div>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Products
                    </div>
                    {suggestions.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 border-gray-100 dark:border-white/5"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0 relative">
                                <Image
                                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560393464-5c56cfaad484?q=80&w=100&auto=format&fit=crop'}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{product.category.replace('_', ' ')}</p>
                            </div>
                            <div className="font-bold text-primary whitespace-nowrap">
                                ₹{product.price.toLocaleString()}
                            </div>
                        </Link>
                    ))}
                    <Link
                        href={`/search?q=${query}`}
                        onClick={onClose}
                        className="block p-3 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                        View all results for &quot;{query}&quot;
                    </Link>
                </div>
            ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products found for &quot;{query}&quot;</p>
                </div>
            )}
        </div>
    );
}
