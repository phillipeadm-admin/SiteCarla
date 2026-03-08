'use client';

import { useState } from 'react';
import ImageUpload from '../products/ImageUpload';
import { createGalleryImage } from '../actions';
import { Loader2, Plus, X } from 'lucide-react';

export default function GalleryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!imageUrl) return;

        setIsSubmitting(true);
        const result = await createGalleryImage(imageUrl);
        setIsSubmitting(false);

        if (result.success) {
            setImageUrl('');
            setIsOpen(false);
            window.location.reload();
        } else {
            alert('Erro ao salvar imagem na galeria.');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#3B2B23] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-[#5C4D44] transition-all shadow-sm"
            >
                <Plus className="w-5 h-5" /> Nova Foto
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-[#3B2B23]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-[#FAF5EF] rounded-full transition-all"
                        >
                            <X className="w-6 h-6 text-[#8B6E5B]" />
                        </button>

                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-8">Adicionar na Vitrine</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest text-center">Selecionar Imagem</label>
                                <ImageUpload 
                                    onUpload={(url) => setImageUrl(url)} 
                                    defaultValue={imageUrl}
                                />
                                <p className="text-[11px] text-[#8B6E5B] text-center italic mt-2">
                                    A imagem será otimizada automaticamente para WebP antes do envio.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!imageUrl || isSubmitting}
                                className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all disabled:opacity-50 flex items-center justify-center gap-4 mt-6"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SALVAR NA GALERIA'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
