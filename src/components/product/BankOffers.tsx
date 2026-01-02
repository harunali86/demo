'use client';

import { CreditCard, Percent, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
    price: number;
}

const BANK_OFFERS = [
    { bank: 'HDFC Bank', discount: '10% Instant Discount', code: 'HDFC10', minAmount: 5000 },
    { bank: 'ICICI Bank', discount: '5% Cashback', code: 'ICICI5', minAmount: 3000 },
    { bank: 'SBI', discount: 'No Cost EMI on 3/6 months', code: null, minAmount: 10000 },
    { bank: 'Axis Bank', discount: '15% off up to ₹1500', code: 'AXIS15', minAmount: 5000 },
    { bank: 'Amazon Pay', discount: 'Flat ₹50 Back', code: null, minAmount: 500 },
];

export default function BankOffers({ price }: Props) {
    const [expanded, setExpanded] = useState(false);

    const applicableOffers = BANK_OFFERS.filter(offer => price >= offer.minAmount);
    const displayOffers = expanded ? applicableOffers : applicableOffers.slice(0, 2);

    if (applicableOffers.length === 0) return null;

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-sm font-bold text-[#e3e6e6] mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#3d9c4a]" />
                Bank Offers
            </h3>

            <div className="space-y-3">
                {displayOffers.map((offer, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#232323] rounded flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-[#febd69]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-[#e3e6e6]">
                                <span className="font-medium">{offer.bank}:</span> {offer.discount}
                            </p>
                            {offer.code && (
                                <p className="text-xs text-[#999]">
                                    Use code: <span className="text-[#56c5d3] font-mono">{offer.code}</span>
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {applicableOffers.length > 2 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-sm text-[#56c5d3] hover:text-[#febd69] flex items-center gap-1"
                >
                    {expanded ? (
                        <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>{applicableOffers.length - 2} more offers <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            )}
        </div>
    );
}
