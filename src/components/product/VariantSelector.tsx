'use client';

import { useState } from 'react';

interface Variant {
    type: 'color' | 'size' | 'storage';
    options: {
        value: string;
        label: string;
        available: boolean;
        priceModifier?: number;
        colorCode?: string;
    }[];
}

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariants: Record<string, string>;
    onSelect: (type: string, value: string) => void;
    basePrice: number;
}

export default function VariantSelector({ variants, selectedVariants, onSelect, basePrice }: VariantSelectorProps) {
    const getTotalPriceModifier = () => {
        let modifier = 0;
        variants.forEach(variant => {
            const selected = variant.options.find(o => o.value === selectedVariants[variant.type]);
            if (selected?.priceModifier) {
                modifier += selected.priceModifier;
            }
        });
        return modifier;
    };

    return (
        <div className="space-y-4">
            {variants.map((variant) => (
                <div key={variant.type}>
                    <h4 className="text-sm font-medium text-[#e3e6e6] mb-2 capitalize">
                        {variant.type}: <span className="text-[#febd69]">{selectedVariants[variant.type] || 'Select'}</span>
                    </h4>

                    <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => {
                            const isSelected = selectedVariants[variant.type] === option.value;
                            const isAvailable = option.available;

                            if (variant.type === 'color') {
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => isAvailable && onSelect(variant.type, option.value)}
                                        disabled={!isAvailable}
                                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${isSelected
                                                ? 'border-[#febd69] ring-2 ring-[#febd69]/30'
                                                : isAvailable
                                                    ? 'border-[#3d4f5f] hover:border-[#999]'
                                                    : 'border-[#3d4f5f] opacity-40 cursor-not-allowed'
                                            }`}
                                        title={option.label}
                                    >
                                        <span
                                            className="absolute inset-1 rounded-full"
                                            style={{ backgroundColor: option.colorCode || '#666' }}
                                        />
                                        {!isAvailable && (
                                            <span className="absolute inset-0 flex items-center justify-center">
                                                <span className="w-full h-0.5 bg-[#cc0c39] rotate-45 absolute" />
                                            </span>
                                        )}
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => isAvailable && onSelect(variant.type, option.value)}
                                    disabled={!isAvailable}
                                    className={`px-4 py-2 text-sm border rounded transition-all ${isSelected
                                            ? 'bg-[#febd69]/10 border-[#febd69] text-[#febd69]'
                                            : isAvailable
                                                ? 'bg-[#232323] border-[#3d4f5f] text-[#e3e6e6] hover:border-[#999]'
                                                : 'bg-[#1a1a1a] border-[#3d4f5f] text-[#666] line-through cursor-not-allowed'
                                        }`}
                                >
                                    {option.label}
                                    {option.priceModifier && option.priceModifier > 0 && (
                                        <span className="text-xs text-[#999] ml-1">+₹{option.priceModifier.toLocaleString()}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {getTotalPriceModifier() !== 0 && (
                <p className="text-sm text-[#999]">
                    Price with selected options: <span className="text-[#e3e6e6] font-bold">₹{(basePrice + getTotalPriceModifier()).toLocaleString()}</span>
                </p>
            )}
        </div>
    );
}

// Demo variants generator
export function generateDemoVariants(category: string, productId: string): Variant[] {
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

    const colorVariants: Variant = {
        type: 'color',
        options: [
            { value: 'black', label: 'Black', available: true, colorCode: '#1a1a1a' },
            { value: 'white', label: 'White', available: true, colorCode: '#f0f0f0' },
            { value: 'blue', label: 'Blue', available: hash % 2 === 0, colorCode: '#1e3a5f' },
            { value: 'red', label: 'Red', available: hash % 3 === 0, colorCode: '#8b0000' },
        ]
    };

    const sizeVariants: Variant = {
        type: 'size',
        options: [
            { value: 'xs', label: 'XS', available: hash % 4 !== 0 },
            { value: 's', label: 'S', available: true },
            { value: 'm', label: 'M', available: true },
            { value: 'l', label: 'L', available: true },
            { value: 'xl', label: 'XL', available: hash % 3 !== 0 },
            { value: 'xxl', label: 'XXL', available: hash % 2 === 0 },
        ]
    };

    const storageVariants: Variant = {
        type: 'storage',
        options: [
            { value: '128gb', label: '128 GB', available: true, priceModifier: 0 },
            { value: '256gb', label: '256 GB', available: true, priceModifier: 10000 },
            { value: '512gb', label: '512 GB', available: hash % 2 === 0, priceModifier: 20000 },
            { value: '1tb', label: '1 TB', available: hash % 3 === 0, priceModifier: 40000 },
        ]
    };

    switch (category) {
        case 'premium_tech':
            return [colorVariants, storageVariants];
        case 'fashion':
        case 'sneakers':
            return [colorVariants, sizeVariants];
        case 'audio':
            return [colorVariants];
        default:
            return [colorVariants];
    }
}
