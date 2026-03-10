'use client';

import { useState } from 'react';
import { Plus, X, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import { createBatch } from '../actions';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
}

export default function BatchForm({ products }: { products: Product[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastCreatedProduct, setLastCreatedProduct] = useState('');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await createBatch(formData);
        setIsSubmitting(false);
        if (result.success) {
            const productName = products.find(p => p.id === formData.get('productId'))?.name || 'produto';
            setLastCreatedProduct(productName);
            setIsOpen(false);
            setShowSuccessModal(true);
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

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Quantidade Total desta Fornada</label>
                                <input name="totalCapacity" type="number" required placeholder="0" className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Observação (Opcional)</label>
                                <textarea 
                                    name="observation" 
                                    placeholder="Ex: Fornada especial de fermentação natural..." 
                                    className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] min-h-[100px] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#E66A46] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#D1744A] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'CRIANDO...' : 'CRIAR FORNADA'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Sucesso com Alta Visibilidade */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-[#3B2B23]/60 backdrop-blur-md z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 md:p-12 w-full max-w-lg shadow-2xl relative text-center animate-in zoom-in slide-in-from-bottom-4 duration-500">
                        <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        
                        <h2 className="font-serif text-4xl font-black text-[#3B2B23] mb-4">Fornada Criada!</h2>
                        
                        <div className="bg-[#FAF5EF] rounded-3xl p-6 mb-8 border border-[#EBE6DF]">
                            <div className="flex items-center justify-center gap-3 text-[#E66A46] mb-3">
                                <Bell className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ação Necessária</span>
                            </div>
                            <p className="text-[#3B2B23] font-bold text-lg leading-tight">
                                Avise seu cliente no menu notificações do <span className="text-[#E66A46]">{lastCreatedProduct}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link 
                                href="/admin/notifications"
                                onClick={() => setShowSuccessModal(false)}
                                className="bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#5C4D44] transition-all flex items-center justify-center gap-3"
                            >
                                Ver Notificações <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="bg-[#FAF5EF] text-[#8B6E5B] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-[#EBE6DF] hover:bg-[#EBE6DF] transition-all"
                            >
                                Agora Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
