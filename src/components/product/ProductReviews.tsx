'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

interface Review {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    title: string;
    comment: string;
    images: string[];
    helpful_count: number;
    created_at: string;
    user_name?: string;
}

interface ReviewsProps {
    productId: string;
    productName?: string;
}

export default function ProductReviews({ productId, productName }: ReviewsProps) {
    const { isAuthenticated, user } = useAuthStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    const [form, setForm] = useState({
        rating: 5,
        title: '',
        comment: '',
        images: [] as string[]
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                const reviewsData = data as unknown as Review[];
                setReviews(reviewsData);
                const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
                setAverageRating(Math.round(avg * 10) / 10);
            } else {
                setReviews([]);
            }
        } catch (error: any) {
            // Suppress "table not found" error to avoid console noise for user
            if (error?.code === 'PGRST205' || error?.message?.includes('reviews')) {
                console.warn('Reviews table missing, showing empty state.');
                setReviews([]);
                return;
            }
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            alert('Please login to write a review');
            return;
        }

        setSubmitting(true);
        try {
            const reviewData = {
                user_id: user.id,
                product_id: productId,
                rating: form.rating,
                title: form.title,
                comment: form.comment,
                images: form.images,
                user_name: user.name || 'Anonymous',
            };

            // @ts-ignore
            const { error } = await supabase.from('reviews').insert(reviewData);

            if (error) throw error;

            alert('Review submitted successfully!');
            setForm({ rating: 5, title: '', comment: '', images: [] });
            setShowForm(false);
            fetchReviews();
        } catch (error: any) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const markHelpful = async (reviewId: string) => {
        try {
            const review = reviews.find(r => r.id === reviewId);
            if (!review) return;

            await supabase
                .from('reviews')
                // @ts-ignore
                .update({ helpful_count: (review.helpful_count || 0) + 1 })
                .eq('id', reviewId);

            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r
            ));
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onChange?.(star)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition`}
                        disabled={!interactive}
                    >
                        <Star
                            className={`w-5 h-5 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => Math.round(r.rating) === rating).length,
        percentage: reviews.length > 0
            ? (reviews.filter(r => Math.round(r.rating) === rating).length / reviews.length) * 100
            : 0
    }));

    return (
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Overview */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-black/10 dark:border-white/10">
                {/* Average Rating */}
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{averageRating || '0.0'}</div>
                    {renderStars(averageRating)}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Based on {reviews.length} reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
                        </div>
                    ))}
                </div>

                {/* Write Review Button */}
                <div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-primary text-white dark:text-black font-bold rounded-xl hover:bg-primary/90 transition"
                    >
                        Write a Review
                    </button>
                </div>
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-black/5 dark:bg-white/5 rounded-xl space-y-4">
                    <h3 className="font-bold text-lg">Write Your Review</h3>

                    {!isAuthenticated && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                            Please login to write a review
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Your Rating</label>
                        {renderStars(form.rating, true, (r) => setForm({ ...form, rating: r }))}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Review Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Summarize your experience"
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Your Review</label>
                        <textarea
                            value={form.comment}
                            onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            rows={4}
                            placeholder="Tell others about your experience with this product..."
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary outline-none resize-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                            required
                        />
                    </div>
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Add Photos</label>
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition ${submitting || uploading || form.images.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}>
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm">{uploading ? 'Uploading...' : 'Upload'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={async (e) => {
                                        if (!e.target.files?.length) return;
                                        const files = Array.from(e.target.files);

                                        setUploading(true);
                                        try {
                                            // Upload logic
                                            for (const file of files) {
                                                if (form.images.length >= 3) break;

                                                // Validate size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert(`File ${file.name} is too large (max 5MB)`);
                                                    continue;
                                                }

                                                try {
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                                                    const { data, error } = await supabase.storage
                                                        .from('review-images')
                                                        .upload(fileName, file);

                                                    if (error) throw error;

                                                    // Get public URL
                                                    const { data: { publicUrl } } = supabase.storage
                                                        .from('review-images')
                                                        .getPublicUrl(fileName);

                                                    setForm(prev => ({
                                                        ...prev,
                                                        images: [...prev.images, publicUrl]
                                                    }));
                                                } catch (err) {
                                                    console.error('Upload failed:', err);
                                                    alert('Failed to upload image');
                                                }
                                            }
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                />
                            </label>
                            <span className="text-xs text-gray-500">Max 3 images, 5MB each</span>
                        </div>

                        {/* Image Previews */}
                        {form.images.length > 0 && (
                            <div className="flex gap-3 mt-4">
                                {form.images.map((url, i) => (
                                    <div key={i} className="relative w-20 h-20 group">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover rounded-lg border border-white/10" />
                                        <button
                                            type="button"
                                            onClick={() => setForm(prev => ({
                                                ...prev,
                                                images: prev.images.filter((_, idx) => idx !== i)
                                            }))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting || !isAuthenticated}
                            className="px-6 py-2 bg-primary text-white dark:text-black font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2 bg-black/10 dark:bg-white/10 rounded-lg hover:bg-black/20 dark:hover:bg-white/20 transition text-gray-700 dark:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                    <h3 className="font-bold mb-1 text-gray-900 dark:text-white">No Reviews Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to review this product!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-black/10 dark:border-white/5 pb-6 last:border-0">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center text-white font-bold">
                                    {review.user_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900 dark:text-white">{review.user_name || 'Anonymous'}</span>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {review.title && (
                                        <h4 className="font-semibold mb-1 text-gray-900 dark:text-white">{review.title}</h4>
                                    )}
                                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>

                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {review.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`Review ${i + 1}`}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => markHelpful(review.id)}
                                        className="flex items-center gap-1 mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Helpful ({review.helpful_count || 0})
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
