'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, Eye, MoreVertical, Filter,
    Package, CheckCircle, XCircle, Image as ImageIcon, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_price: number | null;
    category_id: string;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    images: { url: string }[] | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, images:product_images(url)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            // toast.error('Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleting(id);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success('Product deleted');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setDeleting(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedProducts.length} products?`)) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .in('id', selectedProducts);

            if (error) throw error;
            setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
            toast.success('Products deleted');
        } catch (error) {
            console.error('Error bulk deleting:', error);
            toast.error('Failed to delete products');
        }
    };

    const toggleProductStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                // @ts-ignore
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
            toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category_id === filterCategory;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && product.is_active) ||
            (filterStatus === 'inactive' && !product.is_active);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const categories = [...new Set(products.map(p => p.category_id).filter(Boolean))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <p className="text-gray-400">{products.length} products in database</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-white">No Products Yet</h2>
                    <p className="text-gray-400 mb-6">Start adding products to your store</p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl focus:border-orange-500 outline-none text-white placeholder:text-gray-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl focus:border-orange-500 outline-none text-white cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat?.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-[#12121a] border border-[#2a2a38] rounded-xl focus:border-orange-500 outline-none text-white cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                        <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                            <span className="font-medium text-white">{selectedProducts.length} selected</span>
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                            >
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedProducts([])}
                                className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-[#12121a] border border-[#2a2a38] rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2a2a38] bg-[#1a1a24]">
                                    <th className="p-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                            onChange={selectAll}
                                            className="w-4 h-4 rounded border-gray-600 bg-[#12121a] text-orange-500 focus:ring-orange-500"
                                        />
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Product</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Category</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Price</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Status</th>
                                    <th className="p-4 text-left font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2a2a38]">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#1a1a24] transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleSelect(product.id)}
                                                className="w-4 h-4 rounded border-gray-600 bg-[#12121a] text-orange-500 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#1a1a24] overflow-hidden border border-[#2a2a38]">
                                                    {product.images?.[0]?.url ? (
                                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white group-hover:text-orange-500 transition-colors">{product.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {product.id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-[#1a1a24] rounded text-sm capitalize text-gray-400 border border-[#2a2a38]">
                                                {product.category_id?.replace('_', ' ') || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-white">₹{product.base_price?.toLocaleString()}</p>
                                            {product.compare_price && (
                                                <p className="text-xs text-gray-500 line-through">₹{product.compare_price.toLocaleString()}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleProductStatus(product.id, product.is_active)}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${product.is_active
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                                    }`}
                                            >
                                                {product.is_active ? (
                                                    <><CheckCircle className="w-3 h-3" /> Active</>
                                                ) : (
                                                    <><XCircle className="w-3 h-3" /> Inactive</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    className="p-2 hover:bg-[#2a2a38] rounded-lg transition text-gray-400 hover:text-white"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-2 hover:bg-[#2a2a38] rounded-lg transition text-gray-400 hover:text-white"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deleting === product.id}
                                                    className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
