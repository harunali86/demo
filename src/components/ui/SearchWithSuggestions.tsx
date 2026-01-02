'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Suggestion {
    id: string;
    name: string;
    slug: string;
    category?: string;
}

const TRENDING = ['iPhone 15', 'Air Jordans', 'Smart Watch', 'Wireless Earbuds', 'Laptop'];

export default function SearchWithSuggestions({ className = '' }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) setRecentSearches(JSON.parse(saved));
    }, []);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await supabase
                    .from('products')
                    .select('id, name, slug, category')
                    .ilike('name', `%${query}%`)
                    .limit(5);

                if (data) setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));

        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    const removeRecent = (item: string) => {
        const updated = recentSearches.filter(s => s !== item);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none transition"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="p-2">
                            <p className="px-3 py-1 text-xs text-gray-500 uppercase">Products</p>
                            {suggestions.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/product/${s.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition"
                                >
                                    <Search className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm">{s.name}</p>
                                        {s.category && <p className="text-xs text-gray-500">{s.category}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && query.length < 2 && (
                        <div className="p-2 border-t border-white/5">
                            <p className="px-3 py-1 text-xs text-gray-500 uppercase">Recent Searches</p>
                            {recentSearches.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition group"
                                >
                                    <button
                                        onClick={() => handleSearch(item)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{item}</span>
                                    </button>
                                    <button
                                        onClick={() => removeRecent(item)}
                                        className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trending */}
                    {query.length < 2 && (
                        <div className="p-2 border-t border-white/5">
                            <p className="px-3 py-1 text-xs text-gray-500 uppercase">Trending</p>
                            {TRENDING.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleSearch(item)}
                                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/5 rounded-lg transition text-left"
                                >
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{item}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.length >= 2 && suggestions.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No products found for "{query}"
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            Searching...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
