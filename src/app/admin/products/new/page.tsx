'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Save, Image as ImageIcon, Plus, X, Trash2,
    Package, Tag, DollarSign, Layers, Info, Settings, Star
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Variant {
    name: string;
    options: string[];
}

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newVariant, setNewVariant] = useState({ name: '', options: '' });

    const [form, setForm] = useState({
        // Basic Info
        name: '',
        slug: '',
        description: '',
        short_description: '',

        // Category & Type
        category_id: '',
        brand: '',
        tags: [] as string[],

        // Pricing
        base_price: 0,
        compare_price: 0,
        cost_price: 0,

        // Inventory
        sku: '',
        barcode: '',
        stock: 10,
        low_stock_threshold: 5,
        track_inventory: true,

        // Images
        images: [] as string[],

        // Variants (Color, Size, etc.)
        variants: [] as Variant[],

        // Status
        is_active: true,
        is_featured: false,
        is_new: true,

        // SEO
        meta_title: '',
        meta_description: '',

        // Additional
        weight: '',
        dimensions: '',
        warranty: '',
        return_policy: '7 days return',

        // Ratings (default)
        rating: 4.5,
        reviews_count: 0
    });

    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await supabase.from('categories').select('id, name, slug');
            if (data) setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const generateSKU = () => {
        return `SKU-${Date.now().toString(36).toUpperCase()}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || form.base_price <= 0) {
            alert('Please fill product name and price!');
            return;
        }

        setSaving(true);

        try {
            const productData = {
                name: form.name,
                slug: form.slug || generateSlug(form.name),
                description: form.description,
                category_id: form.category_id || null,
                base_price: form.base_price,
                compare_price: form.compare_price || null,
                is_active: form.is_active,
                is_featured: form.is_featured,
                images: form.images.map((url, i) => ({ url, position: i })),
                metadata: {
                    short_description: form.short_description,
                    brand: form.brand,
                    tags: form.tags,
                    sku: form.sku || generateSKU(),
                    barcode: form.barcode,
                    stock: form.stock,
                    low_stock_threshold: form.low_stock_threshold,
                    track_inventory: form.track_inventory,
                    variants: form.variants,
                    is_new: form.is_new,
                    weight: form.weight,
                    dimensions: form.dimensions,
                    warranty: form.warranty,
                    return_policy: form.return_policy,
                    cost_price: form.cost_price,
                    rating: form.rating,
                    reviews_count: form.reviews_count
                },
                seo: {
                    meta_title: form.meta_title || form.name,
                    meta_description: form.meta_description || form.short_description
                }
            };

            const { data, error } = await supabase
                .from('products')
                // @ts-ignore
                .insert(productData)
                .select()
                .single();

            if (error) throw error;

            alert('✅ Product created successfully! It will now appear on your store.');
            router.push('/admin/products');
        } catch (error: any) {
            console.error('Error creating product:', error);
            alert('Failed to create product: ' + error.message);
        } finally {
            setSaving(false);
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

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm({ ...form, tags: [...form.tags, newTag.trim()] });
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    };

    const addVariant = () => {
        if (newVariant.name.trim() && newVariant.options.trim()) {
            const variant: Variant = {
                name: newVariant.name.trim(),
                options: newVariant.options.split(',').map(o => o.trim()).filter(Boolean)
            };
            setForm({ ...form, variants: [...form.variants, variant] });
            setNewVariant({ name: '', options: '' });
        }
    };

    const removeVariant = (index: number) => {
        setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: Info },
        { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
        { id: 'images', label: 'Images', icon: ImageIcon },
        { id: 'variants', label: 'Variants', icon: Layers },
        { id: 'seo', label: 'SEO & More', icon: Settings },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add New Product</h1>
                        <p className="text-sm text-gray-400">Fill all details to add product to your store</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving || !form.name || form.base_price <= 0}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${activeTab === tab.id
                            ? 'bg-primary text-black'
                            : 'bg-white/5 hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({
                                        ...form,
                                        name: e.target.value,
                                        slug: generateSlug(e.target.value)
                                    })}
                                    placeholder="iPhone 15 Pro Max 256GB"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">URL Slug</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="iphone-15-pro-max-256gb"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brand</label>
                                <input
                                    type="text"
                                    value={form.brand}
                                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                    placeholder="Apple, Samsung, Nike..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tags</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add tag..."
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <button type="button" onClick={addTag} className="px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                {form.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    value={form.short_description}
                                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                                    placeholder="Brief product summary..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Full Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={5}
                                    placeholder="Detailed product description with features, specifications, etc..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Status Toggles */}
                        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded bg-white/10"
                                />
                                <div>
                                    <span className="font-medium">Active</span>
                                    <p className="text-xs text-gray-500">Visible on store</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                    className="w-5 h-5 rounded bg-white/10"
                                />
                                <div>
                                    <span className="font-medium">Featured</span>
                                    <p className="text-xs text-gray-500">Show on homepage</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_new}
                                    onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                                    className="w-5 h-5 rounded bg-white/10"
                                />
                                <div>
                                    <span className="font-medium">New Arrival</span>
                                    <p className="text-xs text-gray-500">Show "NEW" badge</p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {/* Pricing & Stock Tab */}
                {activeTab === 'pricing' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Selling Price (₹) *</label>
                                <input
                                    type="number"
                                    value={form.base_price}
                                    onChange={(e) => setForm({ ...form, base_price: parseInt(e.target.value) || 0 })}
                                    placeholder="149999"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none text-lg font-bold"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Compare/MRP Price (₹)</label>
                                <input
                                    type="number"
                                    value={form.compare_price}
                                    onChange={(e) => setForm({ ...form, compare_price: parseInt(e.target.value) || 0 })}
                                    placeholder="Original price (strikethrough)"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Cost Price (₹)</label>
                                <input
                                    type="number"
                                    value={form.cost_price}
                                    onChange={(e) => setForm({ ...form, cost_price: parseInt(e.target.value) || 0 })}
                                    placeholder="Your buying cost"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        {form.compare_price > form.base_price && form.base_price > 0 && (
                            <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <Star className="w-6 h-6 text-green-400" />
                                <div>
                                    <p className="text-green-400 font-bold">
                                        {Math.round(((form.compare_price - form.base_price) / form.compare_price) * 100)}% OFF
                                    </p>
                                    <p className="text-sm text-gray-400">Customer saves ₹{(form.compare_price - form.base_price).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="font-medium mb-4">Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">SKU</label>
                                    <input
                                        type="text"
                                        value={form.sku}
                                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                        placeholder="Auto-generated"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Barcode</label>
                                    <input
                                        type="text"
                                        value={form.barcode}
                                        onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Low Stock Alert</label>
                                    <input
                                        type="number"
                                        value={form.low_stock_threshold}
                                        onChange={(e) => setForm({ ...form, low_stock_threshold: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Product Images
                        </h2>

                        <p className="text-sm text-gray-400">First image will be the main product image. Drag to reorder.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {form.images.map((img, i) => (
                                <div key={i} className="relative aspect-square bg-white/10 rounded-xl overflow-hidden group">
                                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {i === 0 && (
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-black text-xs rounded-full font-bold">
                                            MAIN
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div className="aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center p-4">
                                <ImageIcon className="w-10 h-10 text-gray-600 mb-2" />
                                <p className="text-sm text-gray-500">Add image URL below</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="px-6 py-3 bg-primary text-black rounded-xl font-medium hover:bg-primary/90 transition"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-blue-400 text-sm">💡 Use high-quality images (1000x1000px recommended). You can use images from Unsplash, your hosting, or any public URL.</p>
                        </div>
                    </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Layers className="w-5 h-5 text-primary" />
                            Product Variants
                        </h2>

                        <p className="text-sm text-gray-400">Add options like Color, Size, Storage, etc.</p>

                        {form.variants.length > 0 && (
                            <div className="space-y-3">
                                {form.variants.map((variant, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                        <div className="flex-1">
                                            <p className="font-medium">{variant.name}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {variant.options.map((opt, j) => (
                                                    <span key={j} className="px-3 py-1 bg-white/10 rounded-full text-sm">{opt}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(i)}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Variant Name</label>
                                <input
                                    type="text"
                                    value={newVariant.name}
                                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                    placeholder="Color, Size, Storage..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">Options (comma separated)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newVariant.options}
                                        onChange={(e) => setNewVariant({ ...newVariant, options: e.target.value })}
                                        placeholder="Red, Blue, Green or S, M, L, XL"
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="px-6 py-3 bg-primary text-black rounded-xl font-medium hover:bg-primary/90 transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO & More Tab */}
                {activeTab === 'seo' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            SEO & Additional Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={form.meta_title}
                                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                    placeholder="Leave empty to use product name"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Weight</label>
                                <input
                                    type="text"
                                    value={form.weight}
                                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                    placeholder="500g, 1.2kg..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400 mb-1">SEO Description</label>
                                <textarea
                                    value={form.meta_description}
                                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                    rows={2}
                                    placeholder="Description for search engines..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Dimensions</label>
                                <input
                                    type="text"
                                    value={form.dimensions}
                                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                                    placeholder="10x5x2 cm"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Warranty</label>
                                <input
                                    type="text"
                                    value={form.warranty}
                                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                                    placeholder="1 year, 6 months..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Return Policy</label>
                                <input
                                    type="text"
                                    value={form.return_policy}
                                    onChange={(e) => setForm({ ...form, return_policy: e.target.value })}
                                    placeholder="7 days return"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Default Rating (1-5)</label>
                                <input
                                    type="number"
                                    value={form.rating}
                                    onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 4.5 })}
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving || !form.name || form.base_price <= 0}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-black rounded-xl font-bold text-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                        <Save className="w-6 h-6" />
                        {saving ? 'Creating Product...' : 'Create Product'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-8 py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
