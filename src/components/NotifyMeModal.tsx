'use client';

import { useState } from 'react';
import { X, Loader2, Bell, CheckCircle } from 'lucide-react';
import { createNotification } from '@/app/admin/actions';

interface NotifyMeModalProps {
    productId: string;
    productName: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function NotifyMeModal({ productId, productName, isOpen, onClose }: NotifyMeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await createNotification(productId, name, phone);
        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
        } else {
            alert(result.error);
        }
    }

    const handleClose = () => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#3B2B23]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-md shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 hover:bg-[#FAF5EF] rounded-full transition-all"
                >
                    <X className="w-6 h-6 text-[#8B6E5B]" />
                </button>

                {isSuccess ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-4">Tudo Certo!</h2>
                        <p className="text-[#8B6E5B] text-sm font-medium leading-relaxed mb-10 uppercase tracking-widest whitespace-pre-wrap">
                            Avisaremos você assim que o {productName} estiver disponível.
                        </p>
                        <button
                            onClick={handleClose}
                            className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#5C4D44] transition-all"
                        >
                            Ok, Entendi
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#FAF5EF] rounded-full flex items-center justify-center mb-6">
                                <Bell className="w-8 h-8 text-[#3B2B23]" />
                            </div>
                            <h2 className="font-serif text-3xl font-black text-[#1E1A17] mb-2">Avise-me</h2>
                            <p className="text-[#8B6E5B] text-sm mb-8 leading-relaxed">
                                Deixe seu contato e enviaremos um WhatsApp assim que tivermos uma nova fornada de <span className="font-bold text-[#3B2B23]">{productName}</span>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">Seu Nome</label>
                                <input 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                    placeholder="Como podemos te chamar?" 
                                    className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" 
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block tracking-widest">WhatsApp</label>
                                <input 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required 
                                    placeholder="(00) 00000-0000" 
                                    className="w-full bg-[#FAF5EF] border-0 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23]" 
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all disabled:opacity-50 flex items-center justify-center gap-4 mt-4"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ME AVISE'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
