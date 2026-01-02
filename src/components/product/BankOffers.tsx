'use client';

import { Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
    price: number;
}

const BANK_OFFERS = [
    { bank: 'HDFC Bank', discount: '10% Instant Discount', code: 'HDFC10', minAmount: 5000 },
    { bank: 'ICICI Bank', discount: '5% Cashback', code: 'ICICI5', minAmount: 3000 },
    { bank: 'SBI', discount: '10% Instant Discount', code: null, minAmount: 10000 },
    { bank: 'Axis Bank', discount: '15% off up to ₹1500', code: 'AXIS15', minAmount: 5000 },
    { bank: 'Amazon Pay', discount: 'Flat ₹50 Back', code: null, minAmount: 500 },
];

export default function BankOffers({ price }: Props) {
    const [expanded, setExpanded] = useState(false);

    const applicableOffers = BANK_OFFERS.filter(offer => price >= offer.minAmount);
    const displayOffers = expanded ? applicableOffers : applicableOffers.slice(0, 3);

    if (applicableOffers.length === 0) return null;

    return (
        <div className="space-y-2">
            {displayOffers.map((offer, index) => (
                <div key={index} className="flex items-start gap-2">
                    <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800">
                        <span className="font-medium">Bank Offer</span> {offer.discount} on {offer.bank} Credit Card
                        {offer.code && <span className="text-gray-500 text-xs ml-1">(Code: {offer.code})</span>}
                        <span className="text-blue-600 text-xs ml-2 cursor-pointer font-medium">T&C</span>
                    </p>
                </div>
            ))}

            {applicableOffers.length > 3 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1 mt-2 ml-6"
                >
                    {expanded ? (
                        <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>{applicableOffers.length - 3} more offers <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            )}
        </div>
    );
}
