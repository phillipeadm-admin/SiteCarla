'use client';

import { useState } from 'react';
import { markNotificationAsRead } from '../actions';
import { Check, Loader2 } from 'lucide-react';

export default function MarkReadButton({ id, isRead }: { id: string, isRead: boolean }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleMarkRead() {
        if (isRead) return;

        setIsSubmitting(true);
        const result = await markNotificationAsRead(id);
        setIsSubmitting(false);

        if (result.success) {
            window.location.reload();
        } else {
            alert('Erro ao marcar notificação como visualizada.');
        }
    }

    return (
        <button
            onClick={handleMarkRead}
            disabled={isRead || isSubmitting}
            className={`p-3 rounded-full transition-all flex items-center gap-2 ${
                isRead 
                ? 'bg-[#FAF5EF] text-[#8B6E5B] border border-[#EBE6DF]' 
                : 'bg-[#3B2B23] text-white hover:bg-[#5C4D44] shadow-lg'
            }`}
        >
            {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    <Check className="w-5 h-5" />
                    {!isRead && <span className="text-[10px] font-bold uppercase tracking-widest pr-2">Concluir Notificação</span>}
                </>
            )}
        </button>
    );
}
