'use client';

import { useState } from 'react';
import { X, Info, Zap, Heart, Thermometer, Box, Droplets, Flame, Ban, Scissors } from 'lucide-react';
import Image from 'next/image';

const benefits = [
    { title: "Digestão", description: "Facilita o processo digestivo através da quebra do glúten.", icon: Zap },
    { title: "Saúde Intestinal", description: "Atua como prebiótico, nutrindo as bactérias boas do intestino.", icon: Heart },
    { title: "Nutrientes", description: "Proporciona mais nutrientes e minerais ao organismo.", icon: Info },
    { title: "Antioxidantes", description: "Contém maior quantidade de compostos antioxidantes.", icon: Zap },
    { title: "Açúcar no Sangue", description: "Auxilia no controle dos níveis glicêmicos.", icon: Thermometer },
];

export default function SourdoughGuide() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-[#3B2B23] text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#5C4D44] transition-all flex items-center gap-2 border border-[#3B2B23]"
            >
                <Info className="w-3.5 h-3.5" /> Sourdough
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#3B2B23]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in">
            <div className="bg-[#FAF8F5] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[48px] shadow-2xl relative p-8 md:p-16 border border-[#EBE5DB]">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 p-3 bg-white rounded-full border border-[#EBE5DB] hover:bg-[#FAF8F5] transition-all text-[#3B2B23] shadow-sm z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side: Benefits */}
                    <div className="space-y-12">
                        <div>
                            <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Guia Romagnolle</span>
                            <h2 className="font-serif text-5xl md:text-6xl text-[#1E1A17] tracking-tight leading-tight">Os Segredos do <br /><span className="italic">Sourdough</span></h2>
                            <p className="text-[#5C4D44] mt-6 text-sm font-medium leading-relaxed max-w-md">
                                A fermentação natural lenta não apenas eleva o sabor, mas transforma o pão em um superalimento vivo e nutritivo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {benefits.map((b, i) => (
                                <div key={i} className="flex gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#EBE5DB] flex items-center justify-center text-[#3B2B23] group-hover:bg-[#3B2B23] group-hover:text-white transition-all shadow-sm flex-shrink-0">
                                        <b.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#1E1A17] uppercase text-[11px] tracking-widest mb-1">{b.title}</h4>
                                        <p className="text-[#8B6E5B] text-xs leading-relaxed">{b.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Care & Storage */}
                    <div className="space-y-10">
                        {/* Freezing Section */}
                        <div className="bg-white p-8 rounded-[40px] border border-[#EBE5DB] shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="relative w-40 h-40 flex-shrink-0 bg-[#FAF8F5] rounded-3xl overflow-hidden border border-[#EBE5DB]">
                                    <Image src="/sourdough_freezing.png" alt="Freezing" fill className="object-contain p-4 mix-blend-multiply opacity-80" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-serif text-2xl text-[#1E1A17]">Pão sempre fresco?</h3>
                                    <p className="text-xs text-[#5C4D44] leading-relaxed">
                                        Congele suas fatias ou o pão inteiro por até <b>3 meses</b>. Basta vedar bem em saco plástico. Para consumir, descongele em temperatura ambiente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Storing Section */}
                        <div className="bg-[#FAF5EF]/50 p-8 rounded-[40px] border border-[#EBE5DB]">
                            <h3 className="font-serif text-2xl text-[#1E1A17] mb-6">Como armazenar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="relative w-full aspect-square bg-white rounded-3xl overflow-hidden border border-[#EBE5DB]">
                                        <Image src="/sourdough_cutting.png" alt="Cutting" fill className="object-contain p-4 mix-blend-multiply opacity-80" />
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="w-6 h-6 rounded-full bg-[#3B2B23] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                                        <p className="text-[11px] text-[#5C4D44] uppercase font-bold leading-tight pt-1">Corte ao meio e vire a parte cortada para baixo.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end gap-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE5DB] flex items-center justify-center text-[#8B6E5B]">
                                            <Box className="w-5 h-5" />
                                        </div>
                                        <p className="text-[11px] text-[#5C4D44] leading-relaxed">
                                            <b>Vasilha vedada:</b> Guarde na geladeira para manter a umidade.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE6DF] flex items-center justify-center text-[#8B6E5B]">
                                            <Scissors className="w-5 h-5" />
                                        </div>
                                        <p className="text-[11px] text-[#5C4D44] leading-relaxed text-balance">
                                            <b>Saco plástico:</b> Ideal para fatias prontas para consumo imediato.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Heating Section */}
                        <div className="bg-[#3B2B23] p-10 rounded-[40px] text-white space-y-8">
                            <div>
                                <h3 className="font-serif text-3xl text-white mb-2 tracking-tight">Efeito "Saído do Forno"</h3>
                                <p className="text-white/60 text-xs italic tracking-wide">Recupere a crocância e o miolo elástico em minutos.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="relative w-full aspect-video bg-white/10 rounded-2xl overflow-hidden">
                                        <Image src="/sourdough_spray.png" alt="Spray" fill className="object-contain p-4 opacity-70" />
                                    </div>
                                    <p className="text-[10px] text-white/80 uppercase tracking-widest leading-relaxed">
                                        <span className="text-[#D6C1AE] font-black mr-2">Step 01:</span>
                                        Borrife umas gotinhas de água nas fatias.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative w-full aspect-video bg-white/10 rounded-2xl overflow-hidden">
                                        <Image src="/sourdough_heating.png" alt="Heating" fill className="object-contain p-4 opacity-70" />
                                    </div>
                                    <p className="text-[10px] text-white/80 uppercase tracking-widest leading-relaxed">
                                        <span className="text-[#D6C1AE] font-black mr-2">Step 02:</span>
                                        Aqueça no forno ou airfryer até ficar crocante.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                                <Ban className="w-6 h-6 text-red-400" />
                                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Esqueça o microondas! Ele não é um bom amigo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

