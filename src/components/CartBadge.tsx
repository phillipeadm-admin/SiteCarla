'use client';

import { useCartStore } from '@/store/useCartStore';

export default function CartBadge() {
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    if (itemCount === 0) return null;

    return (
        <span className="absolute -top-1 -right-1 bg-[#D1744A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FAF5EF] animate-in zoom-in">
            {itemCount}
        </span>
    );
}
