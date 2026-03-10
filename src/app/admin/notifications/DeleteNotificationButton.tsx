'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteNotification } from '../actions';
import ElegantConfirmModal from '@/components/ElegantConfirmModal';

interface DeleteNotificationButtonProps {
    id: string;
    customerName: string;
    productName: string;
}

export default function DeleteNotificationButton({ id, customerName, productName }: DeleteNotificationButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteNotification(id);
        setIsDeleting(false);
        setShowModal(false);

        if (!result.success) {
            alert(result.error);
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
                className="text-[#8B6E5B] p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Excluir Notificação"
            >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>

            <ElegantConfirmModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="Excluir Aviso?"
                description={`Você tem certeza que deseja excluir o aviso de "${customerName}" para o produto "${productName}"?`}
                confirmText="Sim, Excluir"
                cancelText="Manter Aviso"
            />
        </>
    );
}
