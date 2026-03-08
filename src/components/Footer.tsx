'use client';

import { Instagram, MapPin, Phone, Clock, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-transparent text-[#1E1A17] pt-20 pb-10 px-6 md:px-20 border-t border-[#E8E0D5] relative z-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                {/* Logo e Descrição */}
                <div className="md:col-span-1 flex flex-col items-center md:items-start">
                    <h2 className="font-serif text-[24px] font-medium tracking-tight text-[#1E1A17] mb-4">Romagnolle</h2>
                    <p className="text-[#5C5552] text-[13px] leading-relaxed mb-6 italic max-w-[200px]">
                        "O tempo é o nosso ingrediente secreto."
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/romagnolle_forno?igsh=" target="_blank" rel="noopener noreferrer" className="text-[#1E1A17] hover:text-[#A89078] transition-colors">
                            <Instagram className="w-6 h-6" strokeWidth={1} />
                        </a>
                    </div>
                </div>

                {/* Navegação Rápida */}
                <div>
                    <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-[#A89078] mb-6">Menu</h3>
                    <ul className="space-y-3 text-[12px] font-bold uppercase tracking-wider">
                        <li>
                            <Link href="/#top" className="hover:text-[#A89078] transition-colors">Início</Link>
                        </li>
                        <li>
                            <Link href="/nossos-paes" className="hover:text-[#A89078] transition-colors">Nossos Produtos</Link>
                        </li>
                        <li>
                            <Link href="/sourdough" className="hover:text-[#A89078] transition-colors">Sourdough</Link>
                        </li>
                        <li>
                            <Link href="#assinatura" className="hover:text-[#A89078] transition-colors">Fornadas</Link>
                        </li>
                    </ul>
                </div>

                {/* Contato & Informações */}
                <div className="md:col-span-2 flex flex-col items-center md:items-end w-full">
                    <h3 className="font-bold uppercase text-[10px] tracking-[0.2em] text-[#A89078] mb-6">Informações</h3>
                    <ul className="space-y-4 text-[12px] font-bold uppercase tracking-wider text-center md:text-right">
                        <li className="flex items-center justify-center md:justify-end gap-3 text-[#5C5552]">
                            <MapPin className="w-4 h-4" />
                            <span>Brasília, DF</span>
                        </li>
                        <li className="flex items-center justify-center md:justify-end gap-3 text-[#5C5552]">
                            <Phone className="w-4 h-4" />
                            <span>(61) 99119-5151</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Créditos Finais */}
            <div className="max-w-7xl mx-auto pt-10 border-t border-[#E8E0D5] flex flex-col md:flex-row justify-center items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#A89078] text-center">
                <p>© 2026 ROMAGNOLLE - FORNO & CONFETTERIA. TODOS OS DIREITOS RESERVADOS.</p>
            </div>
        </footer>
    );
}
