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
        <aside className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-sm p-5 h-fit sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
            </div>

            {/* Sort By */}
            <div className="mb-8">
                <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center justify-between w-full mb-4 group"
                >
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-900 group-hover:text-blue-600 transition-colors">Sort By</span>
                    {sortOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {sortOpen && (
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="newest" onChange={(e) => onSortChange(e.target.value)} defaultChecked className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Newest Arrivals</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="price_low" onChange={(e) => onSortChange(e.target.value)} className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Price: Low to High</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="sort" value="price_high" onChange={(e) => onSortChange(e.target.value)} className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Price: High to Low</span>
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
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-900 group-hover:text-blue-600 transition-colors">Price Range</span>
                    {priceOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {priceOpen && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-2 flex-1">
                                <span className="text-xs text-gray-500 block font-medium">Min</span>
                                <input
                                    type="number"
                                    value={localMin}
                                    onChange={(e) => setLocalMin(Number(e.target.value))}
                                    className="w-full bg-transparent outline-none text-gray-900 text-sm font-bold placeholder:text-gray-400"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-2 flex-1">
                                <span className="text-xs text-gray-500 block font-medium">Max</span>
                                <input
                                    type="number"
                                    value={localMax}
                                    onChange={(e) => setLocalMax(Number(e.target.value))}
                                    className="w-full bg-transparent outline-none text-gray-900 text-sm font-bold placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => onPriceChange(localMin, localMax)}
                            className="w-full bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 hover:border-blue-100 text-sm font-bold py-2.5 rounded-sm transition-all active:scale-95 shadow-sm"
                        >
                            Apply Price
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
