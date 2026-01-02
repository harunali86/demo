'use client';

import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

interface Props {
    price: number;
}

export default function EMIOptions({ price }: Props) {
    const [expanded, setExpanded] = useState(false);

    if (price < 3000) return null;

    // Calculate EMI options
    const emiOptions = [
        { months: 3, interest: 0, label: 'No Cost EMI' },
        { months: 6, interest: 0, label: 'No Cost EMI' },
        { months: 9, interest: 13, label: 'Standard EMI' },
        { months: 12, interest: 14, label: 'Standard EMI' },
        { months: 18, interest: 15, label: 'Standard EMI' },
        { months: 24, interest: 16, label: 'Standard EMI' },
    ];

    const calculateEMI = (months: number, interestRate: number) => {
        if (interestRate === 0) {
            return Math.ceil(price / months);
        }
        const monthlyRate = interestRate / 12 / 100;
        const emi = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        return Math.ceil(emi);
    };

    const lowestEMI = calculateEMI(24, 16);
    const displayOptions = expanded ? emiOptions : emiOptions.slice(0, 3);

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3d4f5f]">
            <h3 className="text-sm font-bold text-[#e3e6e6] mb-1 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#febd69]" />
                EMI Options
            </h3>
            <p className="text-xs text-[#999] mb-3">
                EMI starting from ₹{lowestEMI.toLocaleString()}/month
            </p>

            <div className="space-y-2">
                {displayOptions.map((option) => {
                    const emi = calculateEMI(option.months, option.interest);
                    const totalAmount = emi * option.months;
                    const interestAmount = totalAmount - price;

                    return (
                        <div
                            key={option.months}
                            className="flex items-center justify-between p-2 bg-[#232323] rounded hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                        >
                            <div>
                                <span className="text-sm text-[#e3e6e6] font-medium">
                                    {option.months} months
                                </span>
                                {option.interest === 0 && (
                                    <span className="ml-2 text-xs bg-[#3d9c4a]/20 text-[#3d9c4a] px-2 py-0.5 rounded">
                                        No Cost
                                    </span>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-sm text-[#e3e6e6] font-bold">
                                    ₹{emi.toLocaleString()}/mo
                                </span>
                                {option.interest > 0 && (
                                    <p className="text-[10px] text-[#999]">
                                        Interest: ₹{interestAmount.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {emiOptions.length > 3 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 text-sm text-[#56c5d3] hover:text-[#febd69] flex items-center gap-1"
                >
                    {expanded ? (
                        <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>View all EMI options <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            )}

            <p className="mt-3 text-[10px] text-[#999] flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                EMI available on select bank credit cards. Check eligibility at checkout.
            </p>
        </div>
    );
}
