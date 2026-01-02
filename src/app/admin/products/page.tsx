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
import { mockProducts } from '@/data/fallback-data';

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
            // 1. Fetch Products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;

            if (!productsData || productsData.length === 0) {
                setProducts([]);
                return;
            }

            // 2. Fetch Images for these products
            let imagesData: any[] = [];
            try {
                // @ts-ignore
                const productIds = (productsData as any[]).map(p => p.id);
                if (productIds.length > 0) {
                    const { data, error } = await supabase
                        .from('product_images')
                        .select('product_id, url')
                        .in('product_id', productIds);

                    if (error) throw error;
                    imagesData = data || [];
                }
            } catch (imageError) {
                console.warn('Error fetching product images:', imageError);
            }

            // 3. Merge Data
            // @ts-ignore
            const productsWithImages = (productsData || []).map((product: any) => {
                // @ts-ignore
                const productImages = (imagesData as any[]).filter(img => img.product_id === product.id);
                return {
                    ...product,
                    images: productImages
                };
            });

            setProducts(productsWithImages);
        } catch (error) {
            console.warn('Suppressing error fetching products (Demo Mode active):', error);
            // @ts-ignore
            setProducts(mockProducts);
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
                <Loader2 className="w-12 h-12 text-[#2874f0] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} products in database</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#2874f0] text-white rounded-md font-medium hover:bg-blue-600 transition shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold mb-2 text-gray-900">No Products Yet</h2>
                    <p className="text-gray-500 mb-6">Start adding products to your store</p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874f0] text-white rounded-md font-medium hover:bg-blue-600 transition shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-500 text-sm focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:border-blue-500 outline-none text-gray-900 text-sm cursor-pointer"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat?.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:border-blue-500 outline-none text-gray-900 text-sm cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-sm">
                            <span className="font-medium text-blue-800 text-sm">{selectedProducts.length} selected</span>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-sm text-xs font-medium hover:bg-red-700 transition"
                            >
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setSelectedProducts([])}
                                className="px-3 py-1.5 bg-white border border-gray-300 rounded-sm text-xs font-medium hover:bg-gray-50 transition text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 w-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                            onChange={selectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="p-4 font-medium">Product</th>
                                    <th className="p-4 font-medium">Category</th>
                                    <th className="p-4 font-medium">Price</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => toggleSelect(product.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-sm bg-gray-100 overflow-hidden border border-gray-200 p-1">
                                                    {product.images?.[0]?.url ? (
                                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {product.id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize text-gray-600 font-medium">
                                                {product.category_id?.replace('_', ' ') || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900">₹{product.base_price?.toLocaleString()}</p>
                                            {product.compare_price && (
                                                <p className="text-xs text-gray-400 line-through">₹{product.compare_price.toLocaleString()}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleProductStatus(product.id, product.is_active)}
                                                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${product.is_active
                                                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                    }`}
                                            >
                                                {product.is_active ? (
                                                    <><CheckCircle className="w-3 h-3" /> Active</>
                                                ) : (
                                                    <><XCircle className="w-3 h-3" /> Inactive</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/product/${product.slug}`}
                                                    className="p-1.5 hover:bg-gray-200 rounded transition text-gray-500 hover:text-gray-900"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-1.5 hover:bg-gray-200 rounded transition text-gray-500 hover:text-gray-900"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deleting === product.id}
                                                    className="p-1.5 hover:bg-red-50 text-red-500 rounded transition disabled:opacity-50 hover:text-red-700"
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
