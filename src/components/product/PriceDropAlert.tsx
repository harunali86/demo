'use client';

import { useState } from 'react';
import { Bell, BellRing, X, Check } from 'lucide-react';
import { usePriceAlertStore } from '@/store/priceAlert';
import { toast } from 'sonner';

interface Props {
    productId: string;
    productName: string;
    productImage: string;
    currentPrice: number;
}

export default function PriceDropAlert({ productId, productName, productImage, currentPrice }: Props) {
    const { addAlert, removeAlert, hasAlert, getAlert } = usePriceAlertStore();
    const [showInput, setShowInput] = useState(false);
    const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9)); // 10% less by default

    const existingAlert = getAlert(productId);
    const isAlertSet = hasAlert(productId);

    const handleSetAlert = () => {
        if (targetPrice >= currentPrice) {
            toast.error('Target price must be less than current price');
            return;
        }

        if (isAlertSet && existingAlert) {
            removeAlert(existingAlert.id);
        }

        addAlert({
            productId,
            productName,
            productImage,
            currentPrice,
            targetPrice,
        });

        toast.success(`We'll notify you when price drops below ₹${targetPrice.toLocaleString()}`);
        setShowInput(false);
    };

    const handleRemoveAlert = () => {
        if (existingAlert) {
            removeAlert(existingAlert.id);
            toast.success('Price alert removed');
        }
    };

    if (isAlertSet && !showInput) {
        return (
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#3d4f5f]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-[#febd69]" />
                        <span className="text-sm text-[#e3e6e6]">
                            Alert set for ₹{existingAlert?.targetPrice.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowInput(true)}
                            className="text-xs text-[#56c5d3] hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleRemoveAlert}
                            className="text-xs text-[#cc0c39] hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#3d4f5f]">
            {showInput ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#e3e6e6]">Set Price Alert</h4>
                        <button onClick={() => setShowInput(false)} className="text-[#999] hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[#999]">Notify me when price drops below</span>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]">₹</span>
                            <input
                                type="number"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(Number(e.target.value))}
                                className="w-full pl-7 pr-3 py-2 bg-[#232323] border border-[#3d4f5f] rounded text-[#e3e6e6] focus:border-[#febd69] focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSetAlert}
                            className="px-4 py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] text-[#0f1111] font-medium rounded hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] flex items-center gap-1"
                        >
                            <Check className="w-4 h-4" />
                            Set Alert
                        </button>
                    </div>

                    <p className="text-xs text-[#999]">
                        Current price: ₹{currentPrice.toLocaleString()}
                    </p>
                </div>
            ) : (
                <button
                    onClick={() => setShowInput(true)}
                    className="flex items-center gap-2 text-sm text-[#56c5d3] hover:text-[#febd69] transition-colors"
                >
                    <Bell className="w-4 h-4" />
                    Set Price Drop Alert
                </button>
            )}
        </div>
    );
}
