'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingWhatsApp() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <div className="bg-[#FAF8F5]/90 backdrop-blur-md rounded-full px-4 py-2 shadow-sm text-[12px] font-bold text-[#1E1A17] tracking-widest uppercase hidden md:flex items-center gap-2 border border-[#EBE5DB]">
                Atendimento
            </div>
            <Link href="https://wa.me/5561991195151" target="_blank" className="bg-[#D6C1AE] text-[#1E1A17] p-4 rounded-full shadow-lg hover:bg-[#BFA995] transition-all hover:scale-110 active:scale-95 relative border-2 border-[#FAF8F5]">
                <MessageCircle className="w-6 h-6 fill-current" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#FAF8F5]"></span>
            </Link>
        </div>
    );
}
