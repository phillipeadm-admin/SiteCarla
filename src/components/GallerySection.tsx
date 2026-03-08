import Image from "next/image";

interface GalleryImage {
    id: string;
    imageUrl: string;
}

export default function GallerySection({ images }: { images: GalleryImage[] }) {
    if (images.length === 0) return null;

    return (
        <section className="w-full mt-24 mb-32 px-4 md:px-10">
            <div className="flex flex-col items-center text-center mb-16">
                <span className="text-[#8B6E5B] font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Inspiração Diária</span>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1E1A17] mb-2 tracking-tight">Nossos Produtos</h2>
                <div className="w-12 h-[2px] bg-[#D6C1AE] mt-4"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {images.map((image, index) => (
                    <div 
                        key={image.id} 
                        className={`group relative overflow-hidden bg-[#EBE5DB] aspect-[4/5] ${
                            index % 2 !== 0 ? 'md:mt-10' : ''
                        }`}
                    >
                        <Image
                            src={image.imageUrl}
                            alt="Foto do produto"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-[#3B2B23]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                            <div className="w-10 h-10 border border-white/40 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500">
                                <span className="sr-only">Ver mais</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
