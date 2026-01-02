'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
    onSortChange: (sort: string) => void;
}

export default function SidebarFilter({ minPrice, maxPrice, onPriceChange, onSortChange }: FilterProps) {
    const [priceOpen, setPriceOpen] = useState(true);
    const [sortOpen, setSortOpen] = useState(true);
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);

    return (
        <aside className="w-full md:w-64 flex-shrink-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Filters</h2>
            </div>

            {/* Sort By */}
            <div className="mb-8">
                <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <span className="font-bold text-sm uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">Sort By</span>
                    {sortOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {sortOpen && (
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="newest" onChange={(e) => onSortChange(e.target.value)} defaultChecked className="accent-primary w-4 h-4" />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Newest Arrivals</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="price_low" onChange={(e) => onSortChange(e.target.value)} className="accent-primary w-4 h-4" />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Price: Low to High</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="price_high" onChange={(e) => onSortChange(e.target.value)} className="accent-primary w-4 h-4" />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Price: High to Low</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="mb-4">
                <button
                    onClick={() => setPriceOpen(!priceOpen)}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <span className="font-bold text-sm uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">Price Range</span>
                    {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {priceOpen && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex-1">
                                <span className="text-xs text-gray-500 block">Min</span>
                                <input
                                    type="number"
                                    value={localMin}
                                    onChange={(e) => setLocalMin(Number(e.target.value))}
                                    className="w-full bg-transparent outline-none text-white text-sm font-bold"
                                />
                            </div>
                            <span className="text-gray-500">-</span>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex-1">
                                <span className="text-xs text-gray-500 block">Max</span>
                                <input
                                    type="number"
                                    value={localMax}
                                    onChange={(e) => setLocalMax(Number(e.target.value))}
                                    className="w-full bg-transparent outline-none text-white text-sm font-bold"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => onPriceChange(localMin, localMax)}
                            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-sm font-bold py-2 rounded-lg transition-all active:scale-95"
                        >
                            Apply Price
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
