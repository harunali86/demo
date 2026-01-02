'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Image as ImageIcon, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';

interface ProductForm {
    name: string;
    slug: string;
    description: string;
    category_id: string;
    base_price: number;
    compare_price: number;
    is_active: boolean;
    is_featured: boolean;
    images: string[];
    stock: number;
    sku: string;
}

const CATEGORIES = [
    { id: 'premium_tech', name: 'Premium Tech' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'watches', name: 'Watches' },
    { id: 'audio', name: 'Audio' },
    { id: 'sneakers', name: 'Sneakers' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'accessories', name: 'Accessories' },
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    const [form, setForm] = useState<ProductForm>({
        name: '',
        slug: '',
        description: '',
        category_id: 'premium_tech',
        base_price: 0,
        compare_price: 0,
        is_active: true,
        is_featured: false,
        images: [],
        stock: 0,
        sku: ''
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            // First try Supabase
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                const product = data as any;
                setForm({
                    name: product.name,
                    slug: product.slug,
                    description: product.description || '',
                    category_id: product.category_id || 'premium_tech',
                    base_price: product.base_price,
                    compare_price: product.compare_price || 0,
                    is_active: product.is_active,
                    is_featured: product.is_featured,
                    images: product.images?.map((i: any) => i.url) || [],
                    stock: product.metadata?.stock || 10,
                    sku: `SKU-${id.slice(-6).toUpperCase()}`
                });
            } else {
                // Fallback to local products
                const localProduct = PRODUCTS.find(p => p.id === id);
                if (localProduct) {
                    setForm({
                        name: localProduct.name,
                        slug: localProduct.name.toLowerCase().replace(/ /g, '-'),
                        description: 'Premium quality product with excellent features.',
                        category_id: localProduct.cat,
                        base_price: localProduct.price,
                        compare_price: localProduct.sale || 0,
                        is_active: true,
                        is_featured: true,
                        images: [localProduct.img],
                        stock: Math.floor(Math.random() * 50) + 10,
                        sku: `SKU-${id.slice(-6).toUpperCase()}`
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await supabase
                .from('products')
                // @ts-ignore
                .upsert({
                    id,
                    name: form.name,
                    slug: form.slug,
                    description: form.description,
                    category_id: form.category_id,
                    base_price: form.base_price,
                    compare_price: form.compare_price || null,
                    is_active: form.is_active,
                    is_featured: form.is_featured,
                    metadata: { stock: form.stock, sku: form.sku },
                    updated_at: new Date().toISOString()
                });

            router.push('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await supabase.from('products').delete().eq('id', id);
            router.push('/admin/products');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const addImage = () => {
        if (newImageUrl.trim()) {
            setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                        <p className="text-sm text-gray-400">ID: {id}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({
                                    ...form,
                                    name: e.target.value,
                                    slug: generateSlug(e.target.value)
                                })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">SKU</label>
                            <input
                                type="text"
                                value={form.sku}
                                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Pricing & Inventory</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                value={form.base_price}
                                onChange={(e) => setForm({ ...form, base_price: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Compare Price (₹)</label>
                            <input
                                type="number"
                                value={form.compare_price}
                                onChange={(e) => setForm({ ...form, compare_price: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                placeholder="Higher price to show discount"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    {form.compare_price > form.base_price && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-green-400 text-sm">
                                Discount: {Math.round(((form.compare_price - form.base_price) / form.compare_price) * 100)}% OFF
                            </p>
                        </div>
                    )}
                </div>

                {/* Images */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Images</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {form.images.map((img, i) => (
                            <div key={i} className="relative aspect-square bg-white/10 rounded-xl overflow-hidden group">
                                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {i === 0 && (
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-black text-xs rounded-full font-medium">
                                        Primary
                                    </span>
                                )}
                            </div>
                        ))}

                        <div className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Add Image</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Paste image URL..."
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-primary outline-none"
                        />
                        <button
                            type="button"
                            onClick={addImage}
                            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Status</h2>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-primary focus:ring-primary"
                            />
                            <span>Active (Visible on store)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_featured}
                                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-primary focus:ring-primary"
                            />
                            <span>Featured (Show in homepage)</span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
