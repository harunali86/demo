'use client';

import { MapPin, Truck, Check, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocationStore } from '@/store/location';

interface Props {
    price: number;
}

const SERVICEABLE_PINCODES: Record<string, { city: string; days: number; express: boolean }> = {
    '411001': { city: 'Pune', days: 2, express: true },
    '411002': { city: 'Pune', days: 2, express: true },
    '400001': { city: 'Mumbai', days: 1, express: true },
    '400002': { city: 'Mumbai', days: 1, express: true },
    '110001': { city: 'Delhi', days: 2, express: true },
    '560001': { city: 'Bangalore', days: 2, express: true },
    '600001': { city: 'Chennai', days: 3, express: true },
    '700001': { city: 'Kolkata', days: 3, express: false },
    '380001': { city: 'Ahmedabad', days: 3, express: false },
    '500001': { city: 'Hyderabad', days: 2, express: true },
};

export default function PincodeDelivery({ price }: Props) {
    const { location, pincode, setPincode } = useLocationStore();
    const [inputPincode, setInputPincode] = useState(pincode || '');
    const [checking, setChecking] = useState(false);
    const [result, setResult] = useState<null | {
        available: boolean;
        city?: string;
        days?: number;
        express?: boolean;
        date?: string;
    }>(null);

    const isFreeDelivery = price >= 499;

    const checkPincode = async () => {
        if (inputPincode.length !== 6) return;

        setChecking(true);
        setResult(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const pincodeData = SERVICEABLE_PINCODES[inputPincode];

        if (pincodeData) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + pincodeData.days);

            setResult({
                available: true,
                city: pincodeData.city,
                days: pincodeData.days,
                express: pincodeData.express,
                date: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
            });
            setPincode(inputPincode);
        } else {
            // Default delivery for other pincodes
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5);

            setResult({
                available: true,
                days: 5,
                express: false,
                date: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
            });
            setPincode(inputPincode);
        }

        setChecking(false);
    };

    useEffect(() => {
        if (pincode && pincode.length === 6) {
            setInputPincode(pincode);
            checkPincode();
        }
    }, []);

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-sm font-bold text-[#e3e6e6] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#febd69]" />
                Delivery
            </h3>

            {/* Pincode Input */}
            <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputPincode}
                        onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter pincode"
                        className="w-full px-3 py-2 bg-[#232323] border border-[#3d4f5f] rounded text-sm text-[#e3e6e6] placeholder-[#666] focus:border-[#febd69] focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && checkPincode()}
                    />
                    {location && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#999]">
                            {result?.city || location.split(',')[0]}
                        </span>
                    )}
                </div>
                <button
                    onClick={checkPincode}
                    disabled={inputPincode.length !== 6 || checking}
                    className="px-4 py-2 bg-[#232323] border border-[#3d4f5f] rounded text-sm text-[#56c5d3] hover:text-[#febd69] hover:border-[#febd69] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="space-y-2">
                    {result.available ? (
                        <>
                            <div className="flex items-center gap-2 text-[#3d9c4a]">
                                <Check className="w-4 h-4" />
                                <span className="text-sm">Delivery available</span>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                                <Truck className="w-4 h-4 text-[#999] mt-0.5" />
                                <div>
                                    <p className="text-[#e3e6e6]">
                                        {isFreeDelivery ? (
                                            <span className="text-[#3d9c4a] font-medium">FREE Delivery </span>
                                        ) : (
                                            <span>Delivery ₹40 </span>
                                        )}
                                        by <span className="font-bold">{result.date}</span>
                                    </p>
                                    {result.express && (
                                        <p className="text-xs text-[#999]">
                                            Express delivery available. Order within 2 hrs.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-[#cc0c39]">
                            <X className="w-4 h-4" />
                            <span className="text-sm">Delivery not available for this pincode</span>
                        </div>
                    )}
                </div>
            )}

            {/* COD Info */}
            <div className="mt-3 pt-3 border-t border-[#3d4f5f] text-xs text-[#999]">
                Cash on Delivery available
            </div>
        </div>
    );
}
