'use client';

import { AlertTriangle, Check, Truck } from 'lucide-react';

interface Props {
    productId: string;
}

export default function StockIndicator({ productId }: Props) {
    // Generate consistent stock based on product ID
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const stockLevel = hash % 100;

    let stockStatus: 'high' | 'medium' | 'low' | 'critical';
    let stockText: string;
    let stockColor: string;

    if (stockLevel > 70) {
        stockStatus = 'high';
        stockText = 'In Stock';
        stockColor = '#3d9c4a';
    } else if (stockLevel > 30) {
        stockStatus = 'medium';
        stockText = 'In Stock';
        stockColor = '#3d9c4a';
    } else if (stockLevel > 10) {
        stockStatus = 'low';
        stockText = `Only ${stockLevel} left in stock - order soon`;
        stockColor = '#c45500';
    } else {
        stockStatus = 'critical';
        stockText = `Only ${stockLevel + 1} left in stock - order soon`;
        stockColor = '#cc0c39';
    }

    return (
        <div className="space-y-2">
            {/* Stock Status */}
            <div className="flex items-center gap-2">
                {stockStatus === 'critical' || stockStatus === 'low' ? (
                    <AlertTriangle className="w-4 h-4" style={{ color: stockColor }} />
                ) : (
                    <Check className="w-4 h-4" style={{ color: stockColor }} />
                )}
                <span className="text-sm font-medium" style={{ color: stockColor }}>
                    {stockText}
                </span>
            </div>

            {/* Urgency bar for low stock */}
            {(stockStatus === 'low' || stockStatus === 'critical') && (
                <div className="relative h-2 bg-[#232323] rounded-full overflow-hidden">
                    <div
                        className="absolute h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${stockLevel}%`,
                            backgroundColor: stockColor
                        }}
                    />
                </div>
            )}

            {/* Delivery info */}
            <div className="flex items-center gap-2 text-sm text-[#999]">
                <Truck className="w-4 h-4" />
                <span>Ships from and sold by <span className="text-[#56c5d3]">Harun Store</span></span>
            </div>
        </div>
    );
}
