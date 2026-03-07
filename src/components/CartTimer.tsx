'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Timer } from 'lucide-react';

export default function CartTimer() {
    const { expiresAt, items, checkExpiration } = useCartStore();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        // HACK DE AUTO-CURA: Se houver itens mas não houver tempo de expiração (carrinho antigo),
        // vamos gerar um tempo de expiração agora mesmo.
        if (items.length > 0 && !expiresAt) {
            useCartStore.setState({ expiresAt: Date.now() + (10 * 60 * 1000) });
            return;
        }

        if (!expiresAt || items.length === 0) {
            setTimeLeft(null);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiresAt - now;

            if (diff <= 0) {
                checkExpiration();
                setTimeLeft(null);
                clearInterval(interval);
            } else {
                const minutes = Math.floor(diff / 1000 / 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, items.length, checkExpiration]);

    if (!timeLeft) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#A89078] border border-[#1E1A17]/10 rounded-full shadow-sm animate-pulse">
            <Timer className="w-3.5 h-3.5 text-white" />
            <span className="text-[11px] font-black text-white tabular-nums tracking-wider">
                {timeLeft}
            </span>
        </div>
    );
}
