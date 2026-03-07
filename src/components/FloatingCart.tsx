'use client';

import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import FloatingCartBadge from './FloatingCartBadge';
import CartTimer from './CartTimer';
import { useCartStore } from '@/store/useCartStore';

export default function FloatingCart() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Mostra o carrinho flutuante após rolar um pouco (50px)
            setIsScrolled(currentScrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (itemCount === 0) return null;

    return (
        <div className={`fixed bottom-[92px] right-6 z-50 transition-all duration-500 transform ${isScrolled ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none'} flex flex-col items-end gap-3`}>
            <CartTimer />
            <Link
                href="/checkout"
                className="bg-[#D6C1AE] text-[#1E1A17] p-4 rounded-full shadow-2xl hover:bg-[#BFA995] hover:scale-110 active:scale-95 transition-all relative block border-2 border-[#FAF8F5]"
            >
                <ShoppingCart className="w-6 h-6" />
                <FloatingCartBadge />
            </Link>
        </div>
    );
}
