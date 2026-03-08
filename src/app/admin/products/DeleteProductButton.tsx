'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '../actions';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm(`Tem certeza que deseja excluir o produto "${name}"? Esta ação não pode ser desfeita.`)) return;

        setIsDeleting(true);
        const result = await deleteProduct(id);
        setIsDeleting(false);

        if (!result.success) {
            alert(result.error);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Excluir Produto"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
