import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

const POSTS = [
    {
        slug: 'best-smartphones-2024',
        title: '10 Best Smartphones to Buy in 2024',
        excerpt: 'Looking for a new phone? Here are our top picks across all price ranges.',
        date: '2024-12-28',
        author: 'Harun',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    },
    {
        slug: 'fashion-trends',
        title: 'Top Fashion Trends for the New Year',
        excerpt: 'Stay stylish with these trending fashion pieces everyone is talking about.',
        date: '2024-12-25',
        author: 'Harun',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'
    },
    {
        slug: 'home-decor-tips',
        title: 'Transform Your Home with These Decor Tips',
        excerpt: 'Simple changes that make a big difference in your living space.',
        date: '2024-12-20',
        author: 'Harun',
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400'
    },
];

export default function BlogPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Blog</h1>
                    <p className="text-gray-400">Tips, trends, and stories from Harun Store</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {POSTS.map((post) => (
                        <article key={post.slug} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition group">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>
                            <div className="p-5">
                                <span className="text-xs text-primary font-medium">{post.category}</span>
                                <h2 className="font-bold text-lg mt-1 mb-2 line-clamp-2">{post.title}</h2>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 group-hover:text-primary transition" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
