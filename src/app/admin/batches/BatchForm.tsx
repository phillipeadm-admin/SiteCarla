'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createBatch } from '../actions';

interface Product {
    id: string;
    name: string;
}

export default function BatchForm({ products }: { products: Product[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await createBatch(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsOpen(false);
        } else {
            alert(result.error);
        }
    }

    const getLocalFormattedDate = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#E66A46] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-[#D1744A] transition-all shadow-sm"
            >
                <Plus className="w-5 h-5" /> Nova Fornada
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

                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-8">Agendar Fornada</h2>

                        <form action={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Selecionar Pão</label>
                                <select name="productId" required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] appearance-none">
                                    <option value="">Selecione um produto...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Data e Hora da Disponibilidade</label>
                                <input name="availableDate" type="datetime-local" defaultValue={getLocalFormattedDate()} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Quantidade Total (Fornada)</label>
                                    <input name="totalCapacity" type="number" required placeholder="0" className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <label className="flex items-center gap-3 cursor-pointer bg-[#FAF5EF] p-4 rounded-2xl border-2 border-transparent hover:border-[#EBE6DF] transition-all">
                                        <input name="isImmediateSale" type="checkbox" className="w-5 h-5 accent-[#E66A46]" />
                                        <span className="text-xs font-bold text-[#3B2B23] uppercase">Pronta Entrega Agora</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#E66A46] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#D1744A] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'AGENDANDO...' : 'CRIAR FORNADA'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
