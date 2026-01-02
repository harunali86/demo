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
    }, [pincode]);

    return (
        <div>
            {/* Pincode Input */}
            <div className="flex gap-2 mb-3 items-center">
                <MapPin className="w-4 h-4 text-primary" />
                <div className="relative">
                    <input
                        type="text"
                        value={inputPincode}
                        onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter Delivery Pincode"
                        className="py-1 border-b-2 border-primary text-sm text-gray-900 placeholder-gray-400 focus:outline-none w-40 font-medium"
                        onKeyPress={(e) => e.key === 'Enter' && checkPincode()}
                    />
                </div>
                <button
                    onClick={checkPincode}
                    disabled={inputPincode.length !== 6 || checking}
                    className="text-sm font-medium text-primary hover:text-blue-700 disabled:opacity-50"
                >
                    {checking ? 'Checking...' : 'Check'}
                </button>
            </div>

            {/* Result */}
            {result && (
                <div className="space-y-2 pl-6">
                    {result.available ? (
                        <div className="text-sm text-gray-800">
                            <span className="font-medium">Delivery by {result.date}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            {isFreeDelivery ? (
                                <span className="text-green-600 font-medium">Free</span>
                            ) : (
                                <span className="text-gray-800">₹40</span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                            <X className="w-4 h-4" />
                            <span>Not available</span>
                        </div>
                    )}
                    <div className="text-xs text-gray-500">
                        Cash on Delivery available
                    </div>
                </div>
            )}
        </div>
    );
}
