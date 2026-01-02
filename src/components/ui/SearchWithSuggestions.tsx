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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Search for products, brands and more"
                    className="w-full pl-12 pr-10 py-2.5 bg-blue-50/50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-500 focus:border-primary focus:bg-white focus:shadow-md outline-none transition-all"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50">
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="py-2">
                            {suggestions.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/product/${s.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                                >
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-800">{s.name}</p>
                                        {s.category && <p className="text-xs text-primary font-medium">{s.category}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && query.length < 2 && (
                        <div className="py-2 border-t border-gray-100">
                            <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Recent Searches</p>
                            {recentSearches.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition group"
                                >
                                    <button
                                        onClick={() => handleSearch(item)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </button>
                                    <button
                                        onClick={() => removeRecent(item)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trending */}
                    {query.length < 2 && (
                        <div className="py-2 border-t border-gray-100">
                            <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trending Now</p>
                            {TRENDING.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleSearch(item)}
                                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition text-left"
                                >
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.length >= 2 && suggestions.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No results found for &quot;{query}&quot;
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="p-4 text-center text-gray-400 text-sm animate-pulse">
                            Searching...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
