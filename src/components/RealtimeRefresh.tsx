'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RealtimeRefresh() {
    const router = useRouter();

    useEffect(() => {
        // Polling de 2 segundos para refletir mudanças "instantaneamente"
        // Este é um fallback robusto que não exige configuração extra de WebSockets/Supabase Realtime
        const interval = setInterval(() => {
            router.refresh();
        }, 15000);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
