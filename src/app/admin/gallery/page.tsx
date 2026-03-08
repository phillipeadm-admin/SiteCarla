import prisma from "@/lib/prisma";
import Image from "next/image";
import GalleryForm from "./GalleryForm";
import DeleteGalleryImage from "./DeleteGalleryImage";

export const revalidate = 0;

export default async function AdminGallery() {
    const images = await prisma.gallery.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Galeria de Fotos</h1>
                    <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Adicione fotos dos seus produtos para a vitrine</p>
                </div>
                <GalleryForm />
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-[32px] overflow-hidden group border border-[#EBE6DF] bg-white">
                        <Image src={img.imageUrl} alt="Galeria" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <DeleteGalleryImage id={img.id} />
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="p-20 text-center italic text-[#8B6E5B] bg-white rounded-[32px] border border-[#EBE6DF]">Nenhuma foto na galeria.</div>
            )}
        </div>
    );
}
