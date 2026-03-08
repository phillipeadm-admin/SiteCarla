import Image from "next/image";

interface GalleryImage {
    id: string;
    imageUrl: string;
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
    if (images.length === 0) return null;

    return (
        <section className="w-full mt-32 mb-40 px-6 md:px-12">
            <div className="flex flex-col items-center text-center mb-20">
                <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.4em] mb-4">Galeria de Inspiração</span>
                <h2 className="font-serif text-4xl md:text-6xl text-[#1E1A17] tracking-tight">Nossos Produtos</h2>
                <div className="w-16 h-[1px] bg-[#D6C1AE] mt-6 opacity-60"></div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {images.map((image, index) => (
                    <div 
                        key={image.id} 
                        className={`group relative overflow-hidden bg-white aspect-square rounded-[24px] md:rounded-[32px] transition-all duration-700 hover:shadow-[0_20px_40px_rgba(59,43,35,0.1)] hover:-translate-y-2 ${
                            index % 2 !== 0 ? 'md:translate-y-6' : ''
                        }`}
                    >
                        <div className="absolute inset-0 border border-[#EBE5DB] rounded-[24px] md:rounded-[32px] z-10 pointer-events-none group-hover:border-[#3B2B23]/10 transition-colors"></div>
                        <Image
                            src={image.imageUrl}
                            alt="Momento Romagnolle"
                            fill
                            className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                            sizes="(max-width: 768px) 33vw, 16vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2B23]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                ))}
            </div>
            
            <div className="mt-24 flex justify-center">
                <p className="text-[10px] font-bold text-[#8B6E5B] uppercase tracking-[0.5em] opacity-40">Artesanal • Natural • Feito com Tempo</p>
            </div>
        </section>
    );
}
