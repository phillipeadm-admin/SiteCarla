'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import NotifyMeModal from './NotifyMeModal';

interface Product {
    id: string; // ID do Produto
    batchId: string; // ID da Fornada
    name: string;
    description: string;
    availability: string;
    imageUrl: string;
    price: number;
    availableQuantity?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const [isAdding, setIsAdding] = useState(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = async () => {
        setIsAdding(true);
        await addItem({
            id: product.batchId,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl,
            maxQuantity: product.availableQuantity || 0,
        });
        setIsAdding(false);
    };

    const isOutOfStock = !product.batchId || (product.availableQuantity || 0) <= 0;

    return (
        <div className="bg-[#FAF8F5] p-10 flex flex-col items-center group border border-[#EBE5DB] h-full">
            <div className="relative w-full aspect-square mb-8 overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain transform group-hover:scale-105 transition-transform duration-700 p-2"
                    sizes="(max-width: 768px) 300px, 400px"
                    quality={80}
                />
            </div>

            <div className="text-center w-full flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-serif text-[28px] text-[#1E1A17] mb-2 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-[#5C5552] text-[13px] leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2 px-4">
                        {product.description}
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-medium text-[#1E1A17] text-sm">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-[#8B6E5B]'}`}>
                            {product.availability}
                        </span>
                    </div>

                    {isOutOfStock ? (
                        <button
                            onClick={() => setIsNotifyModalOpen(true)}
                            className="bg-white border-2 border-[#1E1A17] text-[#1E1A17] text-[11px] font-black px-10 py-4 tracking-[0.2em] uppercase hover:bg-[#1E1A17] hover:text-white transition-all w-fit"
                        >
                            AVISE-ME
                        </button>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={isAdding}
                            className="bg-[#D6C1AE] text-[#1E1A17] text-[11px] font-black px-10 py-4 tracking-[0.2em] uppercase hover:bg-[#BFA995] transition-all w-fit disabled:opacity-50"
                        >
                            {isAdding ? 'RESERVANDO...' : 'ADICIONAR'}
                        </button>
                    )}
                </div>
            </div>

            <NotifyMeModal 
                productId={product.id}
                productName={product.name}
                isOpen={isNotifyModalOpen}
                onClose={() => setIsNotifyModalOpen(false)}
            />
        </div>
    );
}
