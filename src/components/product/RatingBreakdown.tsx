'use client';

import { Star } from 'lucide-react';

interface Props {
    productId: string;
    productName: string;
}

export default function RatingBreakdown({ productId, productName }: Props) {
    // Generate consistent ratings based on product ID
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

    const totalReviews = 100 + (hash % 900);
    const avgRating = (4.0 + (hash % 10) / 10);

    // Generate rating distribution
    const star5 = Math.floor(totalReviews * (0.5 + (hash % 20) / 100));
    const star4 = Math.floor(totalReviews * (0.25 + (hash % 10) / 100));
    const star3 = Math.floor(totalReviews * 0.1);
    const star2 = Math.floor(totalReviews * 0.05);
    const star1 = totalReviews - star5 - star4 - star3 - star2;

    const ratings = [
        { stars: 5, count: star5, percentage: Math.round((star5 / totalReviews) * 100) },
        { stars: 4, count: star4, percentage: Math.round((star4 / totalReviews) * 100) },
        { stars: 3, count: star3, percentage: Math.round((star3 / totalReviews) * 100) },
        { stars: 2, count: star2, percentage: Math.round((star2 / totalReviews) * 100) },
        { stars: 1, count: star1, percentage: Math.round((star1 / totalReviews) * 100) },
    ];

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-lg font-bold text-[#e3e6e6] mb-4">Customer reviews</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left - Average Rating */}
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        <div className="flex text-[#de7921]">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.floor(avgRating) ? 'fill-current' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="text-[#e3e6e6] font-medium">{avgRating.toFixed(1)} out of 5</span>
                    </div>
                    <p className="text-sm text-[#999]">{totalReviews.toLocaleString()} global ratings</p>
                </div>

                {/* Right - Rating Bars */}
                <div className="space-y-2">
                    {ratings.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm text-[#56c5d3] hover:text-[#febd69] hover:underline cursor-pointer whitespace-nowrap w-16">
                                {stars} star
                            </span>
                            <div className="flex-1 h-5 bg-[#232323] rounded overflow-hidden">
                                <div
                                    className="h-full bg-[#de7921] transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-[#56c5d3] w-12 text-right">
                                {percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Highlights */}
            <div className="mt-6 pt-4 border-t border-[#3d4f5f]">
                <h4 className="text-sm font-bold text-[#e3e6e6] mb-3">Review highlights</h4>
                <div className="flex flex-wrap gap-2">
                    {['Great quality', 'Value for money', 'Fast delivery', 'As described', 'Good packaging'].map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-[#232323] border border-[#3d4f5f] rounded-full text-xs text-[#e3e6e6] hover:border-[#febd69] cursor-pointer transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
