'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
    GA_TRACKING_ID: string;
}

export default function GoogleAnalytics({ GA_TRACKING_ID }: GoogleAnalyticsProps) {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}

// Analytics helper functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: url,
        });
    }
};

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'INR',
            items: items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
        });
    }
};

export const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'add_to_cart', {
            currency: 'INR',
            value: item.price * item.quantity,
            items: [{
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
            }],
        });
    }
};

export const trackViewItem = (item: { id: string; name: string; price: number; category?: string }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'view_item', {
            currency: 'INR',
            value: item.price,
            items: [{
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                item_category: item.category,
            }],
        });
    }
};

export const trackSearch = (searchTerm: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'search', {
            search_term: searchTerm,
        });
    }
};
