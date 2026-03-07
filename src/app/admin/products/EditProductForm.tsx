'use client';

import { useState } from 'react';
import { Edit2, X, Trash2, Loader2 } from 'lucide-react';
import { updateProduct, deleteProduct } from '../actions';
import ImageUpload from './ImageUpload';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
}

export default function EditProductForm({ product }: { product: Product }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageUrl, setImageUrl] = useState(product.imageUrl || '');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        // O ImageUpload já injeta o imageUrl no form via hidden input
        const result = await updateProduct(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsOpen(false);
        } else {
            alert(result.error);
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir? Isso removerá o pão do catálogo.')) return;
        setIsDeleting(true);
        const result = await deleteProduct(product.id);
        setIsDeleting(false);
        if (result.success) {
            setIsOpen(false);
        } else {
            alert(result.error);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[#8B6E5B] hover:text-[#3B2B23] hover:bg-[#FAF5EF] rounded-lg transition-all"
            >
                <Edit2 className="w-4 h-4" />
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

                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-8">Editar Produto</h2>

                        <form action={handleSubmit} className="space-y-6">
                            <input type="hidden" name="id" value={product.id} />

                            <ImageUpload defaultValue={product.imageUrl || ''} onUpload={setImageUrl} />

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Nome do Pão</label>
                                <input name="name" defaultValue={product.name} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Descrição Curta</label>
                                <textarea name="description" defaultValue={product.description || ''} className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] h-24 resize-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Preço (R$)</label>
                                    <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isDeleting}
                                    className="flex-1 bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SALVAR ALTERAÇÕES'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting || isDeleting}
                                    className="bg-red-50 text-red-600 px-6 py-5 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center border border-red-100"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
