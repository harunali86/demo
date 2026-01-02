'use client';

import { Check, Package, Truck, MapPin, Home, Clock } from 'lucide-react';

interface OrderStep {
    id: string;
    title: string;
    description: string;
    date?: string;
    time?: string;
    completed: boolean;
    current: boolean;
}

interface OrderTrackingTimelineProps {
    orderNumber: string;
    steps: OrderStep[];
    estimatedDelivery: string;
}

const DEMO_STEPS: OrderStep[] = [
    {
        id: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        date: 'Jan 1, 2026',
        time: '10:30 AM',
        completed: true,
        current: false,
    },
    {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Seller has confirmed your order',
        date: 'Jan 1, 2026',
        time: '11:45 AM',
        completed: true,
        current: false,
    },
    {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your order has been shipped',
        date: 'Jan 2, 2026',
        time: '3:20 PM',
        completed: true,
        current: false,
    },
    {
        id: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        date: 'Jan 3, 2026',
        time: '9:00 AM',
        completed: false,
        current: true,
    },
    {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order will be delivered soon',
        completed: false,
        current: false,
    },
];

const STEP_ICONS = {
    ordered: Package,
    confirmed: Check,
    shipped: Truck,
    out_for_delivery: MapPin,
    delivered: Home,
};

export default function OrderTrackingTimeline({
    orderNumber,
    steps = DEMO_STEPS,
    estimatedDelivery = 'Today, by 8:00 PM'
}: OrderTrackingTimelineProps) {

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#3d4f5f]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[#e3e6e6]">Track Order</h3>
                    <p className="text-sm text-[#999]">Order #{orderNumber}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[#999]">Estimated Delivery</p>
                    <p className="text-sm font-bold text-[#3d9c4a]">{estimatedDelivery}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {steps.map((step, index) => {
                    const Icon = STEP_ICONS[step.id as keyof typeof STEP_ICONS] || Package;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                            {/* Icon & Line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.completed
                                        ? 'bg-[#3d9c4a] border-[#3d9c4a] text-white'
                                        : step.current
                                            ? 'bg-[#febd69] border-[#febd69] text-[#0f1111] animate-pulse'
                                            : 'bg-[#232323] border-[#3d4f5f] text-[#666]'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                {!isLast && (
                                    <div className={`w-0.5 flex-1 my-2 ${step.completed ? 'bg-[#3d9c4a]' : 'bg-[#3d4f5f]'
                                        }`} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className={`font-medium ${step.completed || step.current
                                                ? 'text-[#e3e6e6]'
                                                : 'text-[#666]'
                                            }`}>
                                            {step.title}
                                            {step.current && (
                                                <span className="ml-2 text-xs bg-[#febd69]/20 text-[#febd69] px-2 py-0.5 rounded">
                                                    In Progress
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-[#999]">{step.description}</p>
                                    </div>
                                    {(step.date || step.time) && (
                                        <div className="text-right text-xs text-[#999]">
                                            {step.date && <p>{step.date}</p>}
                                            {step.time && <p className="flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{step.time}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Current Location */}
            <div className="mt-4 pt-4 border-t border-[#3d4f5f]">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#febd69]" />
                    <span className="text-[#999]">Current location:</span>
                    <span className="text-[#e3e6e6]">Local Delivery Hub, Mumbai</span>
                </div>
            </div>
        </div>
    );
}

// Generate demo tracking for any order
export function generateDemoTracking(orderDate: Date, status: string): OrderStep[] {
    const steps = [...DEMO_STEPS];

    switch (status) {
        case 'pending':
            steps.forEach((s, i) => {
                s.completed = i === 0;
                s.current = i === 0;
            });
            break;
        case 'processing':
            steps.forEach((s, i) => {
                s.completed = i <= 1;
                s.current = i === 1;
            });
            break;
        case 'shipped':
            steps.forEach((s, i) => {
                s.completed = i <= 2;
                s.current = i === 2;
            });
            break;
        case 'out_for_delivery':
            steps.forEach((s, i) => {
                s.completed = i <= 3;
                s.current = i === 3;
            });
            break;
        case 'delivered':
            steps.forEach((s, i) => {
                s.completed = true;
                s.current = i === 4;
            });
            break;
    }

    return steps;
}
