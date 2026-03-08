'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ElegantConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export default function ElegantConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDestructive = true
}: ElegantConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#3B2B23]/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-[#FAF5EF] rounded-full transition-all"
                >
                    <X className="w-6 h-6 text-[#8B6E5B]" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-3xl ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-[#FAF5EF] text-[#D6C1AE]'} flex items-center justify-center mb-8 shadow-sm`}>
                        <AlertTriangle className="w-10 h-10" />
                    </div>

                    <h2 className="font-serif text-3xl font-black text-[#3B2B23] mb-4 leading-tight">{title}</h2>
                    <p className="text-[#8B6E5B] text-sm font-medium leading-relaxed mb-10 uppercase tracking-widest">
                        {description}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all ${
                                isDestructive 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-[#3B2B23] text-white hover:bg-[#5C4D44]'
                            }`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-[#8B6E5B] hover:bg-[#FAF5EF] transition-all"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
