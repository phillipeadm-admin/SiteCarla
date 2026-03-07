'use client';

import { ShoppingCart, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartBadge from './CartBadge';
import CartTimer from './CartTimer';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const { items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show background when scrolled
            setIsScrolled(currentScrollY > 20);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 py-6 md:py-8 ${isScrolled ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'} ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-end relative gap-8">

                {/* Menu Links - Now on the right */}
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/#top" className="text-[10px] md:text-[12px] font-bold text-[#1E1A17] hover:text-[#A89078] transition-colors tracking-[0.15em] uppercase">Início</Link>
                    <Link href="/nossos-paes" className="text-[10px] md:text-[12px] font-bold text-[#1E1A17] hover:text-[#A89078] transition-colors tracking-[0.15em] uppercase">Nossos Pães</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    <a href="https://www.instagram.com/romagnolle_forno?igsh=" target="_blank" rel="noopener noreferrer" className="text-[#1E1A17] hover:text-[#A89078] transition-colors">
                        <Instagram className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </a>
                    <div className="flex items-center gap-3">
                        <Link href="/checkout" className="text-[#1E1A17] hover:text-[#A89078] transition-colors relative flex items-center">
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#D6C1AE] text-[#1E1A17] text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <CartTimer />
                    </div>
                </div>
            </div>
        </nav>
    );
}
