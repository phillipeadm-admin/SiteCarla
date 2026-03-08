import { Info, Zap, Heart, Thermometer, Box, Droplets, Flame, Ban, Scissors, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';

const benefits = [
    { title: "Digestão", description: "Facilita o processo digestivo através da quebra do glúten.", icon: Zap },
    { title: "Saúde Intestinal", description: "Atua como prebiótico, nutrindo as bactérias boas do intestino.", icon: Heart },
    { title: "Nutrientes", description: "Proporciona mais nutrientes e minerais ao organismo.", icon: Info },
    { title: "Antioxidantes", description: "Contém maior quantidade de compostos antioxidantes.", icon: Zap },
    { title: "Açúcar no Sangue", description: "Auxilia no controle dos níveis glicêmicos.", icon: Thermometer },
];

export default function SourdoughPage() {
    return (
        <main className="min-h-screen bg-[#F5F2EC] flex flex-col font-sans">
            <Navbar />
            
            <div className="flex-1 pt-32 md:pt-40 pb-24 px-4 md:px-10 max-w-7xl mx-auto w-full">
                {/* Intro Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Manifesto de Qualidade</span>
                    <h1 className="font-serif text-[45px] md:text-[64px] lg:text-[80px] font-medium text-[#1E1A17] leading-[1.1] mb-8">
                        O Segredo do <span className="italic">Sourdough</span>
                    </h1>
                    <div className="w-16 h-[1px] bg-[#D6C1AE] mx-auto opacity-60"></div>
                </div>

                <div className="bg-white rounded-[60px] shadow-sm border border-[#EBE5DB] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Side: Benefits (Classic Paper Style) */}
                        <div className="p-8 md:p-20 bg-[#FAF8F5]/50 border-r border-[#EBE5DB]">
                            <div className="space-y-12">
                                <div>
                                    <h2 className="font-serif text-3xl text-[#1E1A17] mb-6">Por que escolher fermentação natural?</h2>
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
                                    <div className="relative w-64 h-64 bg-white rounded-3xl overflow-hidden border border-[#EBE5DB] flex-shrink-0">
                                        <Image src="/sourdough_freezing.png" alt="Freezing bread" fill className="object-contain p-6 mix-blend-multiply opacity-90" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm text-[#5C4D44] leading-relaxed">
                                            Congele suas fatias ou o pão inteiro por até <b>3 (três) meses</b>. Basta vedar o pão em um saco ou embalagem plástica. Descongele em temperatura ambiente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Card */}
                            <div className="space-y-12">
                                <h3 className="font-serif text-3xl text-[#1E1A17]">Como armazenar</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Step 1 */}
                                    <div className="space-y-6 group">
                                        <div className="relative aspect-square bg-[#FAF8F5] rounded-[40px] border border-[#EBE5DB] overflow-hidden transition-all group-hover:shadow-md">
                                            <Image src="/sourdough_cutting.png" alt="Corte ao meio" fill className="object-contain p-6 mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-[#3B2B23] text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm">1</span>
                                            <p className="text-[11px] text-[#5C4D44] uppercase font-bold tracking-widest pt-1 leading-snug">Corte ao meio para começar o processo.</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="space-y-6 group md:translate-y-6">
                                        <div className="relative aspect-square bg-[#FAF8F5] rounded-[40px] border border-[#EBE5DB] overflow-hidden transition-all group-hover:shadow-md">
                                            <Image src="/sourdough_slicing.png" alt="Fatie" fill className="object-contain p-6 mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-[#3B2B23] text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm">2</span>
                                            <p className="text-[11px] text-[#5C4D44] uppercase font-bold tracking-widest pt-1 leading-snug">Vire para baixo a parte cortada e fatie com cuidado.</p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="space-y-6 group">
                                        <div className="relative aspect-square bg-[#FAF8F5] rounded-[40px] border border-[#EBE5DB] overflow-hidden transition-all group-hover:shadow-md">
                                            <Image src="/sourdough_storing.png" alt="Armazene" fill className="object-contain p-6 mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-[#3B2B23] text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm">3</span>
                                            <p className="text-[11px] text-[#5C4D44] uppercase font-bold tracking-widest pt-1 leading-snug">Armazene em um saco plástico ou vasilha bem vedada na geladeira.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Reheating Section */}
                            <div className="bg-white p-8 md:p-12 rounded-[50px] text-[#3B2B23] relative border border-[#EBE5DB] overflow-hidden group shadow-sm transition-all hover:shadow-md">
                                <h3 className="font-serif text-4xl text-[#1E1A17] mb-10 leading-tight">Quer a sensação de <br />pão saindo do forno?</h3>
                                
                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                                        <div className="w-32 h-32 bg-[#3B2B23] rounded-3xl flex items-center justify-center p-4">
                                            <Image src="/sourdough_spray.png" alt="Spray" width={100} height={100} className="object-contain" />
                                        </div>
                                        <p className="text-xs text-[#8B6E5B] uppercase tracking-[0.2em] leading-relaxed flex-1">
                                            <span className="text-[#3B2B23] font-black block mb-2 underline">PASSO 01</span>
                                            Borrife ou respingue umas gotinhas de água filtrada nas fatias.
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                                        <div className="w-32 h-32 bg-[#3B2B23] rounded-3xl flex items-center justify-center p-4">
                                            <Image src="/sourdough_heating.png" alt="Heating" width={100} height={100} className="object-contain" />
                                        </div>
                                        <p className="text-xs text-[#8B6E5B] uppercase tracking-[0.2em] leading-relaxed flex-1">
                                            <span className="text-[#3B2B23] font-black block mb-2 underline">PASSO 02</span>
                                            Aqueça no forno, airfryer, torredeira ou frigideira bem quente.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-[#EBE5DB] flex items-center gap-6">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                                        <Ban className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black uppercase tracking-widest text-red-600">Esqueça o microondas!</p>
                                        <p className="text-[10px] text-[#8B6E5B] uppercase tracking-widest leading-relaxed">Ele não é um bom amigo do pão artesanal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <FloatingWhatsApp />
            <FloatingCart />
        </main>
    );
}

