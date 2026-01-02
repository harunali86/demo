'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Plus, MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import AddressForm from './AddressForm';

interface Address {
    id: string;
    name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
}

export default function AddressList() {
    const { user } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .order('is_default', { ascending: false });

            if (error) throw error;
            setAddresses(data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setAddresses(addresses.filter(a => a.id !== id));
            toast.success('Address deleted');
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            // Optimistic update
            setAddresses(addresses.map(a => ({
                ...a,
                is_default: a.id === id
            })));

            // First unset all
            await supabase
                .from('addresses')
                // @ts-ignore
                .update({ is_default: false } as any)
                .eq('user_id', user!.id);

            // Set specific as default
            await supabase
                .from('addresses')
                // @ts-ignore
                .update({ is_default: true } as any)
                .eq('id', id);

            toast.success('Default address updated');
            fetchAddresses(); // Refresh to be sure
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('Failed to update default address');
            fetchAddresses(); // Revert on error
        }
    };

    if (loading) return <div className="text-gray-400 text-center py-8">Loading addresses...</div>;

    if (showForm || editingAddress) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <AddressForm
                    address={editingAddress}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                        fetchAddresses();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Saved Addresses</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No addresses saved yet</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`p-4 rounded-xl border ${addr.is_default ? 'bg-primary/5 border-primary/30' : 'bg-zinc-900 border-zinc-800'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold">{addr.name}</p>
                                        {addr.is_default && (
                                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-primary" />
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400 space-y-0.5">
                                        <p>{addr.address_line1}</p>
                                        {addr.address_line2 && <p>{addr.address_line2}</p>}
                                        <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
                                        <p>{addr.country}</p>
                                        <p className="pt-1 text-gray-500">Phone: {addr.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="p-2 text-gray-400 hover:text-primary transition"
                                            title="Set as Default"
                                        >
                                            <Star className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingAddress(addr)}
                                        className="p-2 text-gray-400 hover:text-white transition"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
