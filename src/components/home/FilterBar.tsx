'use client';

import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const FILTERS = [
    { label: "Prime", param: "fast_delivery", value: "true" },
    { label: "4★ & up", param: "min_rating", value: "4" },
    { label: "Under ₹5,000", param: "max_price", value: "5000" },
    { label: "Under ₹15,000", param: "max_price", value: "15000" },
    { label: "Best Sellers", param: "sort", value: "popular" },
    { label: "Deals", param: "sale", value: "true" }
];

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilter = (param: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(param) === value) {
            params.delete(param);
        } else {
            params.set(param, value);
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.push(newUrl);
    };

    return (
        <div className="bg-[#1a1a1a] py-3 rounded-lg">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4">
                <span className="flex items-center gap-1 text-[13px] font-bold text-[#e3e6e6] whitespace-nowrap">
                    <Filter className="w-4 h-4" />
                    Filters
                </span>

                <div className="w-px h-5 bg-[#3d4f5f]" />

                {FILTERS.map((filter, i) => {
                    const isActive = searchParams.get(filter.param) === filter.value;
                    return (
                        <button
                            key={i}
                            onClick={() => handleFilter(filter.param, filter.value)}
                            className={`px-3 py-1.5 rounded text-[12px] sm:text-[13px] whitespace-nowrap transition-colors ${isActive
                                ? 'bg-[#febd69] text-[#0f1111] font-medium'
                                : 'bg-[#232323] text-[#e3e6e6] hover:bg-[#333] border border-[#3d4f5f]'
                                }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
