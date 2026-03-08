'use client';

import { useState } from 'react';
import { Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { updateBatch, deleteBatch } from '../actions';

interface Batch {
    id: string;
    availableDate: Date;
    totalCapacity: number;
    productId: string;
    product: {
        name: string;
    },
    isImmediateSale: boolean;
}

export default function EditBatchForm({ batch }: { batch: Batch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleUpdate(formData: FormData) {
        setIsSubmitting(true);
        const result = await updateBatch(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsOpen(false);
        } else {
            alert(result.error);
        }
    }

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja cancelar (excluir) esta fornada? Isso não pode ser desfeito.')) return;

        setIsDeleting(true);
        const result = await deleteBatch(batch.id);
        if (!result.success) {
            alert(result.error);
            setIsDeleting(false);
        }
    }

    // Convertendo a data para o formato datetime-local
    const formattedDate = new Date(batch.availableDate);
    formattedDate.setMinutes(formattedDate.getMinutes() - formattedDate.getTimezoneOffset());
    const dateString = formattedDate.toISOString().slice(0, 16);

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={() => setIsOpen(true)}
                className="flex-1 bg-[#FAF5EF] text-[#3B2B23] py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-[#EBE6DF] transition-all flex justify-center items-center gap-2"
            >
                <Pencil className="w-3 h-3" /> Editar
            </button>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-red-100 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Cancelar
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-[#3B2B23]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 text-left">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-[#FAF5EF] rounded-full transition-all"
                        >
                            <X className="w-6 h-6 text-[#8B6E5B]" />
                        </button>

                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-8">Editar Fornada</h2>

                        <form action={handleUpdate} className="space-y-6">
                            <input type="hidden" name="id" value={batch.id} />

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Produto (Somente Leitura)</label>
                                <input type="text" value={batch.product.name} disabled className="w-full bg-[#EBE6DF] border-0 rounded-2xl px-6 py-4 text-sm text-[#8B6E5B] cursor-not-allowed" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Data e Hora da Disponibilidade</label>
                                <input name="availableDate" type="datetime-local" defaultValue={dateString} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Total de Pães</label>
                                    <input name="totalCapacity" type="number" defaultValue={batch.totalCapacity} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#FAF5EF] p-4 rounded-2xl cursor-pointer hover:bg-[#F3EBE1] transition-colors">
                                <input 
                                    type="checkbox" 
                                    name="isImmediateSale" 
                                    id={`edit-isImmediateSale-${batch.id}`}
                                    defaultChecked={batch.isImmediateSale}
                                    className="w-5 h-5 accent-[#E66A46] cursor-pointer"
                                />
                                <label htmlFor={`edit-isImmediateSale-${batch.id}`} className="text-sm font-bold text-[#3B2B23] cursor-pointer">
                                    Venda Imediata (Queima de Estoque)
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SALVAR ALTERAÇÕES'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
