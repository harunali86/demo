'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock,
    MapPin, Phone, Mail, User, CreditCard, FileText, MessageSquare,
    ChevronDown, Printer, Download, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
    id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    order_number: string;
    status: string;
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    shipping_address: {
        name: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    items: OrderItem[];
    notes: string[];
    timeline: { status: string; date: string; note?: string }[];
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-500' },
    { value: 'shipped', label: 'Shipped', color: 'bg-cyan-500' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-indigo-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-500' },
];

// Mock order data
const generateMockOrder = (id: string): Order => ({
    id,
    order_number: `HS-2024-${id.slice(-4).toUpperCase()}`,
    status: 'processing',
    total: 149999,
    subtotal: 145000,
    shipping: 0,
    tax: 4999,
    discount: 0,
    payment_method: 'UPI',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    customer: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210'
    },
    shipping_address: {
        name: 'Rahul Sharma',
        address: '42, Maple Street, Sector 15',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 98765 43210'
    },
    items: [
        { id: '1', product_name: 'iPhone 15 Pro Max', product_image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200', quantity: 1, price: 149999 }
    ],
    notes: ['Customer requested gift wrapping', 'Priority delivery requested'],
    timeline: [
        { status: 'Order Placed', date: new Date(Date.now() - 86400000).toISOString() },
        { status: 'Payment Confirmed', date: new Date(Date.now() - 82800000).toISOString(), note: 'UPI Payment received' },
        { status: 'Processing', date: new Date(Date.now() - 43200000).toISOString(), note: 'Order is being prepared' },
    ]
});

import { OrderWithDetails } from '@/types/extended';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            // 1. Fetch Basic Order Info
            // We avoid deep joins here to prevent RLS/Relation failures
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (orderError) throw orderError;
            if (!orderData) throw new Error('Order not found');

            // 2. Fetch Order Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', id);

            if (itemsError) console.error('Error fetching items:', itemsError);

            // 3. Fetch Product Details for Items (to get names/images)
            let itemsWithProducts = itemsData || [];
            if (itemsWithProducts.length > 0) {
                const productIds = itemsWithProducts.map((i: any) => i.product_id);
                const { data: productsData } = await supabase
                    .from('products')
                    .select('id, name, images:product_images(url)')
                    // Note: We keep a small join here (product->images) as it's standard, 
                    // but if this fails we can fallback. 
                    // For safety in this "fix mode", let's use a simpler fetch if possible, 
                    // but 'images:product_images(url)' is what we replaced in products page.
                    // Let's stick to simple select and manual merge for MAXIMUM SAFETY.
                    .select('id, name')
                    .in('id', productIds);

                const { data: imagesData } = await supabase
                    .from('product_images')
                    .select('product_id, url')
                    .in('product_id', productIds);

                itemsWithProducts = itemsWithProducts.map((item: any) => {
                    const product = productsData?.find((p: any) => p.id === item.product_id);
                    const image = imagesData?.find((img: any) => img.product_id === item.product_id);
                    return {
                        ...item,
                        product: {
                            name: product?.name || 'Unknown Product',
                            images: image ? [{ url: image.url }] : []
                        }
                    };
                });
            }

            // 4. Fetch Customer Profile
            let customerData = null;
            if (orderData.user_id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, email, phone')
                    .eq('id', orderData.user_id)
                    .single();
                customerData = profile;
            }

            // 5. Fetch Tracking
            const { data: trackingData } = await supabase
                .from('order_tracking')
                .select('*')
                .eq('order_id', id);

            // Construct Final Object
            const fullOrder = {
                ...orderData,
                items: itemsWithProducts,
                customer: customerData,
                timeline: trackingData || []
            };

            // Transform to UI Model
            // @ts-ignore
            const data = fullOrder as OrderWithDetails;

            const transformedOrder: Order = {
                id: data.id,
                order_number: data.order_number || `HS-${data.id.slice(-4)}`,
                status: data.status,
                total: data.total,
                subtotal: data.subtotal,
                shipping: data.shipping,
                tax: data.tax,
                discount: data.discount || 0,
                payment_method: data.payment_provider || 'Unknown',
                payment_status: data.payment_status,
                created_at: data.created_at,
                updated_at: data.updated_at,
                customer: {
                    name: data.customer ? `${data.customer.first_name} ${data.customer.last_name}` : 'Unknown Customer',
                    email: data.customer?.email || 'N/A',
                    phone: data.customer?.phone || 'N/A'
                },
                shipping_address: {
                    name: (data.shipping_address as any)?.name || '',
                    address: (data.shipping_address as any)?.address_line1 || '',
                    city: (data.shipping_address as any)?.city || '',
                    state: (data.shipping_address as any)?.state || '',
                    pincode: (data.shipping_address as any)?.postal_code || '',
                    phone: (data.shipping_address as any)?.phone || ''
                },
                items: data.items.map((item) => ({
                    id: item.id,
                    product_name: item.product?.name || 'Unknown Product',
                    product_image: item.product?.images?.[0] || 'https://via.placeholder.com/200',
                    quantity: item.quantity,
                    price: item.unit_price
                })),
                notes: data.notes ? (data.notes as string).split('\n') : [],
                timeline: data.timeline.map((t) => ({
                    status: t.status,
                    date: t.created_at,
                    note: t.message || undefined
                })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            };

            setOrder(transformedOrder);
        } catch (error) {
            console.error('Error fetching order:', error);
            // Fallback to mock data for demo only if completely failed, or just show error
            // setOrder(generateMockOrder(id)); 
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);

        try {
            await supabase
                .from('orders')
                // @ts-ignore
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', order.id);

            // Add to tracking
            await supabase.from('order_tracking')
                // @ts-ignore
                .insert({
                    order_id: order.id,
                    status: newStatus,
                    message: `Status updated to ${newStatus}`
                });

            fetchOrder(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdating(false);
            setShowStatusDropdown(false);
        }
    };

    const addNote = async () => {
        if (!newNote.trim() || !order) return;

        // In a real app, you might have a dedicated notes table or array column.
        // For now, we update the single 'notes' column string.
        const updatedNotes = order.notes.concat(newNote.trim()).join('\n');

        try {
            await supabase
                .from('orders')
                // @ts-ignore
                .update({ notes: updatedNotes })
                .eq('id', order.id);

            setOrder({
                ...order,
                notes: [...order.notes, newNote.trim()]
            });
            setNewNote('');
        } catch (e) {
            console.error("Failed to add note", e);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-500';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled':
            case 'refunded': return <XCircle className="w-5 h-5" />;
            case 'shipped':
            case 'out_for_delivery': return <Truck className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <Link href="/admin/orders" className="text-primary hover:underline">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
                        <p className="text-sm text-gray-400">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-black">INVOICE</h1>
                        <p className="text-gray-600">Order #{order.order_number}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-lg">Harun Store</h2>
                        <p className="text-sm text-gray-600">123 Commerce St, Tech City</p>
                        <p className="text-sm text-gray-600">support@harunstore.com</p>
                    </div>
                </div>
            </div>

            {/* Status Banner (Hide on print) */}
            <div className={`print:hidden ${getStatusColor(order.status)} rounded-2xl p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3 text-white">
                    {getStatusIcon(order.status)}
                    <div>
                        <p className="font-bold text-lg capitalize">{order.status.replace('_', ' ')}</p>
                        <p className="text-sm opacity-80">Last updated: {new Date(order.updated_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        disabled={updating}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"
                    >
                        {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Update Status'}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showStatusDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl py-2 z-10">
                            {STATUS_OPTIONS.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => updateStatus(status.value)}
                                    className={`w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 ${order.status === status.value ? 'text-primary' : ''
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:border-gray-200 print:bg-white print:text-black">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary print:text-black" />
                            Order Items ({order.items.length})
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl print:bg-gray-50 print:border print:border-gray-100">
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.product_name}</h3>
                                        <p className="text-sm text-gray-400 print:text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t border-white/10 print:border-gray-200 space-y-2">
                            <div className="flex justify-between text-gray-400 print:text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 print:text-gray-600">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 print:text-gray-600">
                                <span>Tax</span>
                                <span>₹{order.tax.toLocaleString()}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-400 print:text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10 print:border-black print:text-black">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline (Hide on print) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:hidden">
                        <h2 className="text-lg font-bold mb-4">Order Timeline</h2>

                        <div className="space-y-4">
                            {order.timeline.map((event, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-green-500'}`} />
                                        {i < order.timeline.length - 1 && <div className="w-0.5 h-full bg-white/20 my-1" />}
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <p className="font-medium capitalize">{event.status.replace('_', ' ')}</p>
                                        {event.note && <p className="text-sm text-gray-400">{event.note}</p>}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(event.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes (Hide on print) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:hidden">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Internal Notes
                        </h2>

                        <div className="space-y-3 mb-4">
                            {order.notes.map((note, i) => (
                                <div key={i} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
                                    {note}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                            />
                            <button
                                onClick={addNote}
                                className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Payment */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:border-gray-200 print:bg-white print:text-black">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary print:text-black" />
                            Customer
                        </h2>

                        <div className="space-y-3">
                            <p className="font-medium text-lg">{order.customer.name}</p>
                            <div className="flex items-center gap-2 text-gray-400 print:text-gray-600">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${order.customer.email}`} className="hover:text-primary">
                                    {order.customer.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 print:text-gray-600">
                                <Phone className="w-4 h-4" />
                                <a href={`tel:${order.customer.phone}`} className="hover:text-primary">
                                    {order.customer.phone}
                                </a>
                            </div>
                        </div>

                        <Link
                            href={`/admin/customers/${order.customer.email}`}
                            className="block mt-4 text-center py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition print:hidden"
                        >
                            View Customer Profile
                        </Link>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:border-gray-200 print:bg-white print:text-black">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary print:text-black" />
                            Shipping Address
                        </h2>

                        <div className="text-gray-300 print:text-gray-600 space-y-1">
                            <p className="font-medium">{order.shipping_address.name}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                            <p>PIN: {order.shipping_address.pincode}</p>
                            <p className="pt-2">{order.shipping_address.phone}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:border-gray-200 print:bg-white print:text-black">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary print:text-black" />
                            Payment
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400 print:text-gray-600">Method</span>
                                <span className="font-medium">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 print:text-gray-600">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400 print:text-green-600 print:bg-green-100' :
                                    order.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 print:text-gray-600">Amount</span>
                                <span className="font-bold">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {order.payment_status === 'paid' && (
                            <button className="w-full mt-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition print:hidden">
                                Process Refund
                            </button>
                        )}
                    </div>

                    {/* Quick Actions (Hide on print) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 print:hidden">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Actions
                        </h2>

                        <div className="space-y-2">
                            <button
                                onClick={() => updateStatus('shipped')}
                                className="w-full py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition"
                            >
                                Mark as Shipped
                            </button>
                            <button
                                onClick={() => updateStatus('delivered')}
                                className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition"
                            >
                                Mark as Delivered
                            </button>
                            <button
                                onClick={() => updateStatus('cancelled')}
                                className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
