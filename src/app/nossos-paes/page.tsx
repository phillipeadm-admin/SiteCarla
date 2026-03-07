import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingCart from "@/components/FloatingCart";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache de 60 segundos para melhorar performance

export default async function NossosPaesPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="min-h-screen w-full bg-[#F5F2EC] flex flex-col font-sans relative">
            <Navbar />

            {/* Decorative Wheat SVG (Left) */}
            <div className="absolute top-32 left-0 w-[200px] h-[400px] pointer-events-none opacity-40 hidden xl:block">
                <svg viewBox="0 0 200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 0 600 Q 50 400 150 100" stroke="#1E1A17" strokeWidth="1" fill="none" />
                    <path d="M 120 180 Q 150 120 160 80 Q 130 90 120 180" stroke="#1E1A17" strokeWidth="1" fill="none" />
                    <path d="M 110 220 Q 140 160 150 120 Q 120 130 110 220" stroke="#1E1A17" strokeWidth="1" fill="none" />
                </svg>
            </div>

            <div className="flex-1 pt-40 pb-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <h1 className="font-serif text-[45px] md:text-[64px] lg:text-[80px] font-medium text-[#1E1A17] leading-[1] mb-6">
                        Nossos Pães
                    </h1>
                    <p className="text-[#5C5552] text-[13px] md:text-[15px] tracking-wide leading-relaxed font-medium px-4 uppercase">
                        O tempo é o nosso ingrediente secreto. Resgatamos a essência da panificação tradicional.
                    </p>
                </div>

                <div className="space-y-40">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-1/2 relative aspect-square md:aspect-[4/3] overflow-visible">
                                {product.imageUrl ? (
                                    <>
                                        <div className="absolute inset-0 bg-[#F0EAE1] -z-10 rounded-full scale-90 blur-2xl opacity-50"></div>
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            quality={85}
                                            priority={index === 0}
                                            loading={index === 0 ? undefined : "lazy"}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-[#F0EAE1] flex items-center justify-center rounded-[32px]">
                                        <span className="text-[#A89078] font-serif italic text-lg opacity-60">Sem fotografia</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
                                <h2 className="font-serif text-[36px] md:text-[48px] font-medium text-[#1E1A17] mb-6 leading-tight">
                                    {product.name}
                                </h2>

                                <div className="bg-transparent border border-[#E8E0D5] p-8 md:p-10 text-[#5C5552] text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap mb-8">
                                    {product.description || "Detalhes adicionais não informados."}
                                </div>

                                <div className="flex flex-col lg:flex-row items-center gap-8">
                                    <span className="text-[20px] font-medium text-[#1E1A17]">
                                        R$ {product.price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <a
                                        href="/#assinatura"
                                        className="bg-[#D6C1AE] text-[#1E1A17] px-10 py-4 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#c9af96] transition-colors"
                                    >
                                        VER FORNADA
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div className="text-center py-20 px-6">
                            <span className="text-[#8B6E5B]/80 font-serif italic text-2xl">
                                O cardápio está sendo preparado pelo nosso padeiro.
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <FloatingWhatsApp />
            <FloatingCart />
        </main>
    );
}
