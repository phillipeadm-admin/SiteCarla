'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteOrder } from '../actions';
import ElegantConfirmModal from '@/components/ElegantConfirmModal';

export default function DeleteOrderButton({ id, customerName }: { id: string; customerName: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteOrder(id);
        setIsDeleting(false);

        if (!result.success) {
            alert(result.error);
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
                className="bg-red-50 p-3 rounded-full hover:bg-red-500 hover:text-white text-red-500 transition-all disabled:opacity-50"
                title="Excluir Pedido"
            >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </button>

            <ElegantConfirmModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="Excluir Pedido?"
                description={`Você tem certeza que deseja excluir o pedido de "${customerName}"? Esta ação removerá o registro permanentemente.`}
                confirmText="Sim, Excluir"
                cancelText="Manter Pedido"
            />
        </>
    );
}
