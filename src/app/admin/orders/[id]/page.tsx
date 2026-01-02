'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock,
    MapPin, Phone, Mail, User, CreditCard, FileText, MessageSquare,
    ChevronDown, Printer, Download, RefreshCw, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];

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
            let itemsWithProducts: any[] = itemsData || [];
            if (itemsWithProducts.length > 0) {
                const productIds = itemsWithProducts.map((i: any) => i.product_id);
                // Safe fetch without deep join
                const { data: productsData } = await supabase
                    .from('products')
                    .select('id, name')
                    .in('id', productIds);

                const { data: imagesData } = await supabase
                    .from('product_images')
                    .select('product_id, url')
                    .in('product_id', productIds);

                itemsWithProducts = itemsWithProducts.map((item: any) => {
                    const product = (productsData as any[])?.find((p: any) => p.id === item.product_id);
                    const image = (imagesData as any[])?.find((img: any) => img.product_id === item.product_id);
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
            // @ts-ignore
            if ((orderData as any).user_id) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, email, phone')
                    // @ts-ignore
                    .eq('id', (orderData as any).user_id)
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
                // @ts-ignore
                ...(orderData as any),
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
            toast.error('Could not load order details');
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

            toast.success(`Order status updated to ${newStatus}`);
            fetchOrder(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
            setShowStatusDropdown(false);
        }
    };

    const addNote = async () => {
        if (!newNote.trim() || !order) return;

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
            toast.success('Note added');
        } catch (e) {
            console.error("Failed to add note", e);
            toast.error('Failed to add note');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getStatusColor = (status: string) => {
        return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
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
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Order Not Found</h2>
                <Link href="/admin/orders" className="text-blue-600 hover:underline">Back to Orders</Link>
            </div>
        );
    }

    // Determine status color for banner
    const currentStatusOption = STATUS_OPTIONS.find(s => s.value === order.status);
    // Use a solid color for the banner background based on status
    const bannerBgClass = order.status === 'delivered' ? 'bg-green-600' :
        order.status === 'cancelled' ? 'bg-red-600' :
            order.status === 'shipped' ? 'bg-cyan-600' :
                'bg-[#2874f0]'; // Default blue

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 shadow-sm">
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
            <div className={`print:hidden ${bannerBgClass} rounded-xl p-6 flex items-center justify-between shadow-md text-white`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                        {getStatusIcon(order.status)}
                    </div>
                    <div>
                        <p className="font-bold text-xl capitalize">{order.status.replace('_', ' ')}</p>
                        <p className="text-sm opacity-90">Last updated: {new Date(order.updated_at).toLocaleString()}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        disabled={updating}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-white font-medium backdrop-blur-sm"
                    >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {showStatusDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10 overflow-hidden">
                            {STATUS_OPTIONS.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => updateStatus(status.value)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${order.status === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                        }`}
                                >
                                    <span className={`w-2.5 h-2.5 rounded-full ${status.color.split(' ')[0].replace('100', '500')}`} />
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
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <Package className="w-5 h-5 text-blue-600 print:text-black" />
                            Order Items ({order.items.length})
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 print:bg-white print:border-gray-200">
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-lg text-gray-900">₹{item.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>₹{order.tax.toLocaleString()}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200 text-gray-900">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline (Hide on print) */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:hidden">
                        <h2 className="text-lg font-bold mb-6 text-gray-900">Order Timeline</h2>

                        <div className="space-y-6">
                            {order.timeline.map((event, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3.5 h-3.5 rounded-full ring-4 ring-white ${i === 0 ? 'bg-[#2874f0]' : 'bg-gray-200'}`} />
                                        {i < order.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-100 my-1" />}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <p className="font-medium capitalize text-gray-900">{event.status.replace('_', ' ')}</p>
                                        {event.note && <p className="text-sm text-gray-500 mt-0.5">{event.note}</p>}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(event.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes (Hide on print) */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:hidden">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Internal Notes
                        </h2>

                        <div className="space-y-3 mb-6">
                            {order.notes.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No notes added.</p>
                            ) : (
                                order.notes.map((note, i) => (
                                    <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                                        {note}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                            />
                            <button
                                onClick={addNote}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition text-sm"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Payment */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <User className="w-5 h-5 text-blue-600 print:text-black" />
                            Customer
                        </h2>

                        <div className="space-y-3">
                            <p className="font-medium text-lg text-gray-900">{order.customer.name}</p>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <a href={`mailto:${order.customer.email}`} className="hover:text-blue-600 transition-colors">
                                    {order.customer.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <a href={`tel:${order.customer.phone}`} className="hover:text-blue-600 transition-colors">
                                    {order.customer.phone}
                                </a>
                            </div>
                        </div>

                        <Link
                            href={`/admin/customers/${order.customer.email}`}
                            className="block mt-6 text-center py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-gray-700 print:hidden"
                        >
                            View Customer Profile
                        </Link>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <MapPin className="w-5 h-5 text-blue-600 print:text-black" />
                            Shipping Address
                        </h2>

                        <div className="text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                            <p>PIN: {order.shipping_address.pincode}</p>
                            <p className="pt-2 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> {order.shipping_address.phone}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:border-none print:shadow-none print:p-0">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <CreditCard className="w-5 h-5 text-blue-600 print:text-black" />
                            Payment
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium text-gray-900">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold text-gray-900">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {order.payment_status === 'paid' && (
                            <button className="w-full mt-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 hover:text-gray-900 transition print:hidden">
                                Process Refund
                            </button>
                        )}
                    </div>

                    {/* Quick Actions (Hide on print) */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:hidden">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Quick Actions
                        </h2>

                        <div className="space-y-2">
                            <button
                                onClick={() => updateStatus('shipped')}
                                className="w-full py-2.5 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium hover:bg-cyan-100 transition"
                            >
                                Mark as Shipped
                            </button>
                            <button
                                onClick={() => updateStatus('delivered')}
                                className="w-full py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                            >
                                Mark as Delivered
                            </button>
                            <button
                                onClick={() => updateStatus('cancelled')}
                                className="w-full py-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition"
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
