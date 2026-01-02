'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AvatarUploadProps {
    url: string | null;
    onUpload: (url: string) => void;
    size?: number;
}

export default function AvatarUpload({ url, onUpload, size = 150 }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            onUpload(data.publicUrl);
            toast.success('Avatar uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group mx-auto" style={{ width: size, height: size }}>
            <div
                className="rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center w-full h-full relative"
            >
                {url ? (
                    <img
                        src={url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User className="w-1/2 h-1/2 text-gray-300" />
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}
            </div>

            <button
                className="absolute bottom-0 right-0 p-2 bg-white text-gray-600 border border-gray-200 rounded-full shadow-md hover:text-primary transition-transform active:scale-95"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload new avatar"
            >
                <Camera className="w-4 h-4" />
            </button>

            <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                ref={fileInputRef}
            />
        </div>
    );
}
