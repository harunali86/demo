'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    bucket?: string;
    folder?: string;
}

export default function ImageUpload({
    images,
    onImagesChange,
    maxImages = 5,
    bucket = 'product-images',
    folder = 'uploads'
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (images.length >= maxImages) {
            toast.warning(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);
        const newImages: string[] = [...images];

        try {
            for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
                const file = files[i];

                // Validate file
                if (!file.type.startsWith('image/')) {
                    toast.error('Please upload only images');
                    continue;
                }

                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error('Image size should be less than 5MB');
                    continue;
                }

                // Generate unique filename
                const fileExt = file.name.split('.').pop();
                const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    console.error('Upload error:', error);
                    // Fallback: Convert to base64 data URL for preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (reader.result) {
                            newImages.push(reader.result as string);
                            onImagesChange([...newImages]);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(data.path);

                    newImages.push(publicUrl);
                }
            }

            onImagesChange(newImages);
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= images.length) return;
        const newImages = [...images];
        const [removed] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, removed);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }
                    ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader className="w-10 h-10 text-primary animate-spin" />
                        <p>Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-medium">Drag & drop images here</p>
                        <p className="text-sm text-gray-400">or click to browse</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB ({images.length}/{maxImages})</p>
                    </div>
                )}
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${index === 0 ? 'border-primary' : 'border-white/10'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Primary badge */}
                            {index === 0 && (
                                <div className="absolute top-1 left-1 px-2 py-0.5 bg-primary text-black text-xs font-bold rounded-full">
                                    Primary
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index > 0 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); moveImage(index, 0); }}
                                        className="p-2 bg-primary rounded-lg text-black text-xs font-bold"
                                        title="Set as primary"
                                    >
                                        Primary
                                    </button>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    className="p-2 bg-red-500 rounded-lg"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
