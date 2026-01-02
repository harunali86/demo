'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, FolderTree } from 'lucide-react';
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
            toast('Demo Mode: Using sample categories', { icon: '⚠️' });
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
                setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...categoryData, image_url: categoryData.image } : c));
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
            }

            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
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
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-gray-400">{categories.length} categories in database</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    name: e.target.value,
                                    slug: generateSlug(e.target.value)
                                })}
                                placeholder="Category Name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="category_slug"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Category description..."
                                rows={2}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded bg-white/10"
                                />
                                <span>Active</span>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Empty State */}
            {categories.length === 0 && !showForm ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <FolderTree className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No Categories Yet</h2>
                    <p className="text-gray-400 mb-6">Create categories to organize your products</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Category
                    </button>
                </div>
            ) : categories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`bg-white/5 border rounded-2xl overflow-hidden ${category.is_active ? 'border-white/10' : 'border-white/5 opacity-60'}`}
                        >
                            {category.image_url ? (
                                <div className="h-32 overflow-hidden">
                                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-32 bg-[#1a1a24] flex items-center justify-center">
                                    <FolderTree className="w-12 h-12 text-gray-700" />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{category.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{category.slug}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${category.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                {category.description && (
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{category.description}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="flex items-center justify-center gap-1 p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
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
