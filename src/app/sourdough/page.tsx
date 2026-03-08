import { Info, Zap, Heart, Thermometer, Box, Droplets, Flame, Ban, Scissors, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const benefits = [
    { title: "Digestão", description: "Facilita o processo digestivo através da quebra do glúten.", icon: Zap },
    { title: "Saúde Intestinal", description: "Atua como prebiótico, nutrindo as bactérias boas do intestino.", icon: Heart },
    { title: "Nutrientes", description: "Proporciona mais nutrientes e minerais ao organismo.", icon: Info },
    { title: "Antioxidantes", description: "Contém maior quantidade de compostos antioxidantes.", icon: Zap },
    { title: "Açúcar no Sangue", description: "Auxilia no controle dos níveis glicêmicos.", icon: Thermometer },
];

export default function SourdoughPage() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] md:p-10 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header / Back Link */}
                <div className="mb-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-[#8B6E5B] hover:text-[#3B2B23] transition-all font-bold uppercase text-[10px] tracking-widest">
                        <ChevronLeft className="w-4 h-4" /> Voltar ao Início
                    </Link>
                    <div className="h-[1px] flex-1 bg-[#EBE5DB] ml-8 opacity-50"></div>
                </div>

                <div className="bg-white rounded-[60px] shadow-sm border border-[#EBE5DB] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Side: Benefits (Classic Paper Style) */}
                        <div className="p-8 md:p-20 bg-[#FAF8F5]/50 border-r border-[#EBE5DB]">
                            <div className="space-y-12">
                                <div>
                                    <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Manifesto de Qualidade</span>
                                    <h1 className="font-serif text-6xl md:text-8xl text-[#1E1A17] tracking-tight leading-[0.9] mb-8">
                                        O Segredo do <span className="italic">Sourdough</span>
                                    </h1>
                                    <p className="text-[#5C4D44] text-sm md:text-base font-medium leading-relaxed max-w-md">
                                        Alguns benefícios ao se consumir pães e produtos preparados com a levedura natural são a alma da nossa produção.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {benefits.map((b, i) => (
                                        <div key={i} className="flex gap-6 items-start translate-x-0 hover:translate-x-2 transition-transform duration-300">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-[#EBE5DB] flex items-center justify-center text-[#3B2B23] shadow-sm">
                                                <b.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-[#1E1A17] uppercase text-[12px] tracking-widest mb-1">{b.title}</h4>
                                                <p className="text-[#8B6E5B] text-sm leading-relaxed">{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="pt-6 border-t border-[#EBE5DB] text-[11px] text-[#8B6E5B] italic max-w-xs uppercase tracking-widest leading-relaxed">
                                        Além disso, a fermentação também ajuda a melhorar o sabor e a textura do pão integral, promovendo o consumo de fibras.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Care & Reheating (Modern Aesthetic) */}
                        <div className="p-8 md:p-20 flex flex-col gap-12">
                            {/* Freezing Card */}
                            <div className="group">
                                <h3 className="font-serif text-3xl text-[#1E1A17] mb-6">Pão sempre fresco? Sim!</h3>
                                <div className="bg-[#FAF8F5] p-8 rounded-[40px] border border-[#EBE5DB] flex flex-col md:flex-row gap-8 items-center transition-all group-hover:shadow-md">
                                    <div className="relative w-48 h-48 bg-white rounded-3xl overflow-hidden border border-[#EBE5DB]">
                                        <Image src="/sourdough_freezing.png" alt="Freezing bread" fill className="object-contain p-4 mix-blend-multiply opacity-80" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm text-[#5C4D44] leading-relaxed">
                                            Congele suas fatias ou o pão inteiro por até <b>3 (três) meses</b>. Basta vedar o pão em um saco ou embalagem plástica. Descongele em temperatura ambiente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Card */}
                            <div className="space-y-8">
                                <h3 className="font-serif text-3xl text-[#1E1A17]">Como armazenar</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="relative aspect-square bg-[#FAF8F5] rounded-3xl border border-[#EBE5DB] overflow-hidden">
                                            <Image src="/sourdough_cutting.png" alt="Cutting bread" fill className="object-contain p-4 mix-blend-multiply opacity-80" />
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-[#3B2B23] text-white flex items-center justify-center text-xs font-black">1</span>
                                            <p className="text-[11px] text-[#5C4D44] uppercase font-bold tracking-widest pt-1 leading-snug">Corte ao meio; vire para baixo a parte cortada e fatie.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end gap-6 h-full">
                                        <div className="p-6 bg-[#FAF5EF] rounded-[32px] border border-[#EBE6DF]">
                                            <div className="flex gap-4 mb-4">
                                               <Box className="w-5 h-5 text-[#8B6E5B]" />
                                               <span className="text-[10px] font-black uppercase tracking-widest text-[#8B6E5B]">Vedação Total</span>
                                            </div>
                                            <p className="text-xs text-[#5C4D44] leading-relaxed">
                                                Armazene em um saco plástico para alimentos ou em uma vasilha bem vedada e guarde na geladeira.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reheating Section */}
                            <div className="bg-[#3B2B23] p-12 rounded-[50px] text-white relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                                <h3 className="font-serif text-4xl text-white mb-8 leading-tight">Quer a sensação de <br />pão saindo do forno?</h3>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-10 items-center">
                                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center p-2">
                                            <Image src="/sourdough_spray.png" alt="Spray" width={60} height={60} className="object-contain opacity-70" />
                                        </div>
                                        <p className="text-xs text-white/70 uppercase tracking-[0.2em] leading-relaxed">
                                            <span className="text-[#D6C1AE] font-black block mb-2 underline">PASSO 01</span>
                                            Borrife ou respingue umas gotinhas de água filtrada nas fatias.
                                        </p>
                                    </div>

                                    <div className="flex gap-10 items-center">
                                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center p-2">
                                            <Image src="/sourdough_heating.png" alt="Heating" width={60} height={60} className="object-contain opacity-70" />
                                        </div>
                                        <p className="text-xs text-white/70 uppercase tracking-[0.2em] leading-relaxed">
                                            <span className="text-[#D6C1AE] font-black block mb-2 underline">PASSO 02</span>
                                            Aqueça no forno, airfryer, torredeira ou frigideira bem quente.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-6">
                                    <Ban className="w-10 h-10 text-red-400" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-black uppercase tracking-widest text-[#D6C1AE]">Esqueça o microondas!</p>
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Ele não é um bom amigo do pão artesanal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer className="mt-20 flex flex-col items-center text-center pb-20">
                    <div className="w-[1px] h-20 bg-[#D6C1AE] mb-8"></div>
                    <p className="font-serif text-2xl text-[#1E1A17] italic">O resultado é um pão quentinho que você vai continuar amando!</p>
                </footer>
            </div>
        </main>
    );
}
