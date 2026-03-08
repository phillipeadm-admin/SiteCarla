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
                <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.4em]">Galeria de Inspiração</span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {images.map((image, index) => (
                    <div 
                        key={image.id} 
                        className={`group relative overflow-hidden bg-white aspect-square rounded-[60px] md:rounded-[80px_20px_80px_20px] transition-all duration-700 hover:shadow-[0_40px_80px_rgba(59,43,35,0.15)] hover:-translate-y-4 hover:rotate-1 ${
                            index % 2 !== 0 ? 'md:translate-y-8' : ''
                        }`}
                    >
                        <div className="absolute inset-0 border border-[#EBE5DB] rounded-[60px] md:rounded-[80px_20px_80px_20px] z-10 pointer-events-none group-hover:border-[#3B2B23]/20 transition-colors"></div>
                        <Image
                            src={image.imageUrl}
                            alt="Momento Romagnolle"
                            fill
                            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-125 group-hover:rotate-1"
                            sizes="(max-width: 768px) 33vw, 16vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2B23]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                ))}
            </div>
            
            <div className="mt-24 flex justify-center">
                <p className="text-[10px] font-bold text-[#8B6E5B] uppercase tracking-[0.5em] opacity-40">Artesanal • Natural • Feito com Tempo</p>
            </div>
        </section>
    );
}
