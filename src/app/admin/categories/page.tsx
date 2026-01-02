'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, FolderTree, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { mockCategories } from '@/data/fallback-data';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    product_count: number;
    is_active: boolean;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.warn('Suppressing error fetching categories (Demo Mode):', error);
            // Fallback to mock data
            // @ts-ignore
            setCategories(mockCategories);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const categoryData = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                description: formData.description,
                image: formData.image_url,
                is_active: formData.is_active
            };

            if (editingId) {
                const { error } = await supabase
                    .from('categories')
                    // @ts-ignore
                    .update(categoryData)
                    .eq('id', editingId);

                if (error) throw error;
                // @ts-ignore
                setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...categoryData, image_url: categoryData.image } : c));
                toast.success('Category updated');
            } else {
                const { data, error } = await supabase
                    .from('categories')
                    // @ts-ignore
                    .insert(categoryData)
                    .select()
                    .single();

                if (error) throw error;
                // @ts-ignore
                if (data) setCategories(prev => [...prev, { ...data, image_url: data.image }]);
                toast.success('Category created');
            }

            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image_url: category.image_url || '',
            is_active: category.is_active
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category?')) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCategories(prev => prev.filter(c => c.id !== id));
            toast.success('Category deleted');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true });
        setEditingId(null);
        setShowForm(false);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Organize your products into categories</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2874f0] text-white rounded-lg font-medium hover:bg-blue-600 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {/* Add/Edit Form Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: e.target.value,
                                            slug: generateSlug(e.target.value)
                                        })}
                                        placeholder="Category Name"
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="category_slug"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Category description..."
                                    rows={3}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <div className="flex gap-4">
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                    {formData.image_url && (
                                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Active Status</span>
                                </label>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#2874f0] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 text-sm shadow-sm"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
                    <FolderTree className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No categories found</p>
                    <p className="text-sm mt-1">{searchTerm ? 'Try adjusting your search' : 'Start by creating a new category'}</p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Create Category
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow group ${category.is_active ? 'border-gray-200' : 'border-gray-200 opacity-75 bg-gray-50'}`}
                        >
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {category.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{category.name}</h3>
                                <p className="text-xs text-gray-500 font-mono mb-3 truncate bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">/{category.slug}</p>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                                    {category.description || <span className="text-gray-400 italic">No description provided</span>}
                                </p>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded text-xs font-medium transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
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
