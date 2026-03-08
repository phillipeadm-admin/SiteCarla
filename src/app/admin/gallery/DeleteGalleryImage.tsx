'use client';

import { useState } from 'react';
import { deleteGalleryImage } from '../actions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteGalleryImage({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm('Você tem certeza que deseja excluir esta foto da galeria?')) return;

        setIsDeleting(true);
        const result = await deleteGalleryImage(id);
        setIsDeleting(false);

        if (result.success) {
            window.location.reload();
        } else {
            alert('Erro ao excluir foto.');
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl opacity-0 group-hover:opacity-100 disabled:opacity-50"
        >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>
    );
}
