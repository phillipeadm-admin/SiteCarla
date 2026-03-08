'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { createProduct } from '../actions';
import ImageUpload from './ImageUpload';

export default function ProductForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await createProduct(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsOpen(false);
            setImageUrl(''); // Limpar foto do preview após sucesso
        } else {
            alert(result.error);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#3B2B23] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-[#5C4D44] transition-all shadow-sm"
            >
                <Plus className="w-5 h-5" /> Novo Produto
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-[#3B2B23]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-[#FAF5EF] rounded-full transition-all"
                        >
                            <X className="w-6 h-6 text-[#8B6E5B]" />
                        </button>

                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-8">Novo Produto</h2>

                        <form action={handleSubmit} className="space-y-6">

                            <ImageUpload onUpload={setImageUrl} />

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Nome do Pão</label>
                                <input name="name" required placeholder="Ex: Sourdough de Azeitonas" className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Descrição Curta</label>
                                <textarea name="description" placeholder="Descreva o sabor e a textura..." className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] h-24 resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Preço (R$)</label>
                                    <input name="price" type="number" step="0.01" required placeholder="0,00" className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CADASTRAR PRODUTO'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
