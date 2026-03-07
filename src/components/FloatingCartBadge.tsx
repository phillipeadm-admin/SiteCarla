'use client';

import { useCartStore } from '@/store/useCartStore';

export default function FloatingCartBadge() {
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    if (itemCount === 0) return null;

    return (
        <span className="absolute -top-2 -right-2 bg-[#E66A46] text-white text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#FDFBF7] animate-in zoom-in">
            {itemCount}
        </span>
    );
}
