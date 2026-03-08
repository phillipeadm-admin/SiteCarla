'use client';

import { useState, useEffect } from 'react';
import { Loader2, Image as LucideImage } from 'lucide-react';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultValue?: string;
}

export default function ImageUpload({ onUpload, defaultValue }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(defaultValue || '');

    useEffect(() => {
        if (defaultValue) {
            setPreview(defaultValue);
        }
    }, [defaultValue]);

    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            reject(new Error('Canvas to Blob failed'));
                        }
                    }, 'image/webp', 0.8); // 80% de qualidade em WebP
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const originalFile = e.target.files?.[0];
        if (!originalFile) return;

        console.log('Iniciando upload do arquivo:', originalFile.name);
        setUploading(true);

        try {
            const compressedFile = await compressImage(originalFile);
            console.log('Imagem comprimida com sucesso (WebP)');

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
            console.log('Enviando para Cloudinary (Cloud:', cloudName, ')');
            
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Resposta Cloudinary:', data);

            if (data.secure_url) {
                setPreview(data.secure_url);
                onUpload(data.secure_url);
                console.log('Upload finalizado. URL:', data.secure_url);
            } else {
                console.error('Erro no Cloudinary:', data.error);
                alert('Erro ao subir imagem: ' + (data.error?.message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro no upload Cloudinary:', error);
            alert('Falha ao subir imagem. Verifique a conexão.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-[32px] bg-[#FAF5EF] border-2 border-dashed border-[#EBE6DF] flex flex-col items-center justify-center overflow-hidden group hover:border-[#3B2B23] transition-all">
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Trocar Foto</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-[#8B6E5B]">
                        <LucideImage className="w-10 h-10 mb-2 opacity-30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Selecionar Foto</span>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleUpload}
                    disabled={uploading}
                />

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-[#3B2B23] animate-spin" />
                            <span className="text-[10px] font-black text-[#3B2B23] uppercase animate-pulse">Enviando...</span>
                        </div>
                    </div>
                )}
            </div>

            <input type="hidden" name="imageUrl" value={preview} />
        </div>
    );
}
