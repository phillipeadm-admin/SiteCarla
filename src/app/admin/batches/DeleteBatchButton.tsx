'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteBatch } from '../actions';
import ElegantConfirmModal from '@/components/ElegantConfirmModal';

export default function DeleteBatchButton({ id, dateStr }: { id: string; dateStr: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteBatch(id);
        setIsDeleting(false);

        if (!result.success) {
            setErrorMsg(result.error || "Erro ao excluir fornada. Verifique se existem pedidos vinculados.");
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }

    return (
        <>
            <button
                onClick={() => {
                    setErrorMsg('');
                    setShowModal(true);
                }}
                disabled={isDeleting}
                className="w-10 h-10 bg-white text-red-500 rounded-2xl flex items-center justify-center border border-[#EBE6DF] hover:bg-red-50 transition-all shadow-sm flex-shrink-0 disabled:opacity-50"
                title="Excluir Fornada"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>

            {errorMsg ? (
                <ElegantConfirmModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {}}
                    title="Atenção"
                    description={errorMsg}
                    confirmText="Ok, Entendi"
                    isAlert={true}
                    isDestructive={false}
                />
            ) : (
                <ElegantConfirmModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleDelete}
                    title="Excluir Fornada?"
                    description={`Tem certeza que deseja remover a fornada do dia ${dateStr}? Esta ação é irreversível.`}
                    confirmText="Sim, Excluir"
                    cancelText="Cancelar"
                    isDestructive={true}
                />
            )}
        </>
    );
}
