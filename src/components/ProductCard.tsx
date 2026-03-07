'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

interface Product {
    id: string; // ID do Produto
    batchId: string; // ID da Fornada
    name: string;
    description: string;
    availability: string;
    imageUrl: string;
    price: number;
    isHot?: boolean;
    availableQuantity?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const [isAdding, setIsAdding] = useState(false);
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
            isHot: product.isHot
        });
        setIsAdding(false);
    };

    return (
        <div className="bg-[#FAF8F5] p-10 flex flex-col items-center group border border-[#EBE5DB]">
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

            <div className="text-center w-full">
                <h3 className="font-serif text-[28px] text-[#1E1A17] mb-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-[#5C5552] text-[13px] leading-relaxed mb-8 h-10 overflow-hidden line-clamp-2 px-4">
                    {product.description}
                </p>

                <div className="flex flex-col items-center gap-6">
                    <span className="font-medium text-[#1E1A17] text-sm">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>

                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="bg-[#D6C1AE] text-[#1E1A17] text-[12px] font-bold px-12 py-4 tracking-[0.2em] uppercase hover:bg-[#BFA995] transition-colors w-fit disabled:opacity-50"
                    >
                        {isAdding ? 'RESERVANDO...' : 'ADICIONAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
