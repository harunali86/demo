'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Plus, MapPin, Edit2, Trash2, Star, MoreVertical } from 'lucide-react';
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
            <div className="bg-white border border-gray-200 rounded-[2px] p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
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
            <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-primary font-bold bg-white rounded-[2px] hover:bg-gray-50 transition text-sm uppercase w-full mb-6"
            >
                <Plus className="w-4 h-4" />
                Add A New Address
            </button>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-[2px]">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No addresses saved yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-[2px] p-4 bg-white hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-[2px]">WORK</span>
                                        <p className="font-bold text-gray-900">{addr.name}</p>
                                        <p className="font-bold text-gray-900">{addr.phone}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>{addr.address_line1}, {addr.address_line2 && <span>{addr.address_line2}, </span>}{addr.city}, {addr.state} - <span className="font-bold">{addr.postal_code}</span></p>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-[2px] hidden group-hover:block z-10 w-32 py-1">
                                        <button onClick={() => setEditingAddress(addr)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit</button>
                                        <button onClick={() => handleDelete(addr.id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
