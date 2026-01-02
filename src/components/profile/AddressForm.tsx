'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

interface Address {
    id?: string;
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

interface AddressFormProps {
    address?: Address | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Address>({
        name: address?.name || '',
        phone: address?.phone || '',
        address_line1: address?.address_line1 || '',
        address_line2: address?.address_line2 || '',
        city: address?.city || '',
        state: address?.state || '',
        postal_code: address?.postal_code || '',
        country: address?.country || 'India',
        is_default: address?.is_default || false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            if (formData.is_default) {
                // If setting as default, unset all others first
                await supabase
                    .from('addresses')
                    // @ts-ignore
                    .update({ is_default: false } as any)
                    .eq('user_id', user.id);
            }

            if (address?.id) {
                // Update existing
                const { error } = await supabase
                    .from('addresses')
                    // @ts-ignore
                    .update({ ...formData, updated_at: new Date().toISOString() } as any)
                    .eq('id', address.id);
                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('addresses')
                    // @ts-ignore
                    .insert({ ...formData, user_id: user.id } as any);
                if (error) throw error;
            }

            onSuccess();
            toast.success('Address saved successfully');
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Address Line 1</label>
                <input
                    type="text"
                    required
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Address Line 2 (Optional)</label>
                <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">City</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">State</label>
                    <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Postal Code</label>
                    <input
                        type="text"
                        required
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Country</label>
                    <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none text-gray-900 dark:text-white transition-colors"
                    />
                </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="checkbox"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition">Set as default address</span>
            </label>

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
