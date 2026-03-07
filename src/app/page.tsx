// Build trigger: 2026-03-04 13:54 - Testing Deploy visibility
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import FloatingCart from "@/components/FloatingCart";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache de 60 segundos para melhorar performance

export default async function Home() {
  const productsFromDb = await prisma.product.findMany({
    include: {
      batches: {
        where: {
          availableDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        orderBy: {
          availableDate: 'asc'
        }
      }
    }
  });

  const products = productsFromDb.map(p => {
    const activeBatch = p.batches[0];
    let availability = "Sem previsão";
    let isHot = false;
    let batchId = "";

    if (activeBatch) {
      batchId = activeBatch.id;
      isHot = activeBatch.isImmediateSale;

      if (isHot) {
        availability = "Pronta Entrega Agora";
      } else {
        const date = new Date(activeBatch.availableDate);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const dayNum = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        const remaining = activeBatch.totalCapacity - activeBatch.soldQuantity;

        availability = `Disponível ${dayName}, ${dayNum} (${remaining} un. restantes)`;
      }
    }

    return {
      id: p.id,
      batchId,
      name: p.name,
      description: p.description || "",
      imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      price: p.price,
      availability,
      isHot,
      availableQuantity: activeBatch ? Math.max(0, activeBatch.totalCapacity - activeBatch.soldQuantity) : 0
    };
  });

  return (
    <main id="top" className="min-h-screen w-full relative bg-[#FAF8F5] overflow-x-hidden">
      <Navbar />

      {/* Hand-Sketched Wheat SVG (Left) - Angled towards title */}
      <div className="absolute top-10 left-[-80px] w-[450px] h-[800px] pointer-events-none opacity-60 xl:block hidden z-0 rotate-[15deg] origin-bottom-left transition-all duration-700">
        <svg viewBox="0 0 300 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main stem */}
          <path d="M 50 800 Q 80 600 120 200" stroke="#1E1A17" strokeWidth="1" fill="none" />
          <path d="M 40 800 Q 60 550 100 150" stroke="#1E1A17" strokeWidth="0.8" fill="none" />

          {/* Grains */}
          {[150, 220, 290, 360, 430, 500].map((y, i) => (
            <g key={`left-grain-${i}`} transform={`translate(${80 + i * 5}, ${y})`}>
              <path d="M 0 0 Q 30 -20 40 -60 Q 10 -40 0 0" stroke="#1E1A17" strokeWidth="0.8" fill="none" />
              <path d="M 0 0 Q -30 -20 -40 -60 Q -10 -40 0 0" stroke="#1E1A17" strokeWidth="0.8" fill="none" />
            </g>
          ))}

          {/* Secondary smaller wheat */}
          <path d="M 30 800 Q 100 700 180 500" stroke="#1E1A17" strokeWidth="0.8" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Hand-Sketched Wheat SVG (Right) - Angled towards title */}
      <div className="absolute top-10 right-[-80px] w-[450px] h-[800px] pointer-events-none opacity-60 xl:block hidden z-0 -rotate-[15deg] origin-bottom-right transition-all duration-700">
        <svg viewBox="0 0 300 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-x-[-1]">
          <path d="M 50 800 Q 80 600 120 200" stroke="#1E1A17" strokeWidth="1" fill="none" />
          <path d="M 40 800 Q 60 550 100 150" stroke="#1E1A17" strokeWidth="0.8" fill="none" />

          {[150, 220, 290, 360, 430, 500].map((y, i) => (
            <g key={`right-grain-${i}`} transform={`translate(${80 + i * 5}, ${y})`}>
              <path d="M 0 0 Q 30 -20 40 -60 Q 10 -40 0 0" stroke="#1E1A17" strokeWidth="0.8" fill="none" />
              <path d="M 0 0 Q -30 -20 -40 -60 Q -10 -40 0 0" stroke="#1E1A17" strokeWidth="0.8" fill="none" />
            </g>
          ))}

          {/* Floral addition like mockup */}
          <path d="M 60 400 Q 100 350 110 320" stroke="#1E1A17" strokeWidth="0.7" fill="none" />
          <circle cx="110" cy="320" r="4" stroke="#1E1A17" strokeWidth="0.7" />
        </svg>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center pt-32 md:pt-48 pb-10">

        {/* Title Group - Adjusted for mobile visibility */}
        <div className="flex flex-col items-center text-center mb-0 px-4 w-full overflow-visible">
          <h1 className="font-serif text-[55px] md:text-[100px] lg:text-[130px] text-[#1E1A17] font-light leading-[1] tracking-tight mb-4 uppercase whitespace-nowrap overflow-visible">
            ROMAGNOLLE
          </h1>
          <p className="text-[11px] md:text-[16px] text-[#1E1A17] tracking-[0.4em] uppercase font-medium">
            FORNO & CONFETTERIA
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full flex flex-col items-center mt-6">
          <div className="relative w-[340px] h-[240px] md:w-[650px] md:h-[450px] z-10">
            <Image
              src="/hero-paus-limpo.webp"
              alt="Pão Artesanal"
              fill
              className="object-contain mix-blend-multiply"
              priority
              quality={85}
              sizes="(max-width: 768px) 340px, 650px"
            />

            {/* Action Button - Overlaid on the bread bottom as in mockup */}
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 w-full flex justify-center">
              <a href="#assinatura" className="bg-[#D6C1AE]/90 backdrop-blur-sm text-[#1E1A17] text-[12px] md:text-[14px] font-bold px-12 md:px-24 py-4 md:py-5 tracking-[0.2em] uppercase hover:bg-[#BFA995] transition-colors border border-[#1E1A17]/10">
                CONHEÇA NOSSAS FORNADAS
              </a>
            </div>
          </div>

          {/* Horizontal line at the bottom of the hero section */}
          <div className="w-full h-[1px] bg-[#EBE5DB] mt-[-50px]"></div>
        </div>

        {/* Products Horizontal Scroll / Carousel */}
        <div id="assinatura" className="w-full relative z-20 mt-16 px-4 md:px-10">
          <div className="flex overflow-x-auto gap-8 md:gap-12 pb-16 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing">
            {products.filter(p => p.batchId).map(product => (
              <div key={product.id} className="min-w-[300px] md:min-w-[400px] snap-center transition-all duration-500 hover:scale-[1.02]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Custom Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-[-20px] pb-10">
            <div className="w-12 h-[2px] bg-[#1E1A17] opacity-20"></div>
          </div>
        </div>

      </div>

      <Footer />
      <FloatingWhatsApp />
      <FloatingCart />
    </main>
  );
}
