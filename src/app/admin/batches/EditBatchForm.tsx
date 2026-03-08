'use client';

import { useState } from 'react';
import { Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { updateBatch, deleteBatch } from '../actions';

interface Batch {
    id: string;
    availableDate: Date;
    totalCapacity: number;
    soldQuantity: number;
    productId: string;
    product: {
        name: string;
    },
    isImmediateSale: boolean;
    observation?: string | null;
}

export default function EditBatchForm({ batch }: { batch: Batch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addQuantity, setAddQuantity] = useState(0);

    async function handleUpdate(formData: FormData) {
        setIsSubmitting(true);
        
        // Calcular novo total
        const currentTotal = batch.totalCapacity;
        const added = parseInt(formData.get('addQuantity') as string) || 0;
        formData.set('totalCapacity', (currentTotal + added).toString());

        const result = await updateBatch(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsOpen(false);
            setAddQuantity(0);
        } else {
            alert(result.error);
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
                className="w-full bg-white text-[#3B2B23] py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-[#EBE6DF] hover:bg-[#FAF5EF] transition-all flex justify-center items-center gap-2 shadow-sm"
            >
                <Pencil className="w-3.5 h-3.5" /> Editar Fornada / Add Estoque
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
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Produto</label>
                                <div className="w-full bg-[#FAF5EF] border border-[#EBE6DF] rounded-2xl px-6 py-4 text-sm text-[#3B2B23] font-bold">
                                    {batch.product.name}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Data / Hora</label>
                                    <input name="availableDate" type="datetime-local" defaultValue={dateString} required className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Estoque Atual</label>
                                    <div className="w-full bg-[#FAF5EF] border border-[#EBE6DF] rounded-2xl px-6 py-4 text-sm text-[#3B2B23] font-bold">
                                        {batch.totalCapacity} unid.
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#3B2B23] p-6 rounded-[28px] text-white">
                                <label className="text-[10px] font-bold text-white/60 uppercase px-1 mb-3 block tracking-widest">Adicionar Quantidade</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        name="addQuantity" 
                                        type="number" 
                                        value={addQuantity}
                                        onChange={(e) => setAddQuantity(parseInt(e.target.value) || 0)}
                                        className="flex-1 bg-white/10 border-0 rounded-xl px-4 py-3 text-lg font-black text-white focus:ring-2 focus:ring-white/30" 
                                        placeholder="0"
                                    />
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold uppercase text-white/50 leading-none mb-1">Novo Total no Forno</p>
                                        <p className="text-2xl font-black text-white">{batch.totalCapacity + addQuantity}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Observação (Opcional)</label>
                                <textarea 
                                    name="observation" 
                                    defaultValue={batch.observation || ''}
                                    placeholder="Ex: Fornada especial..." 
                                    className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] min-h-[80px] resize-none"
                                />
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
