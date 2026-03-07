import prisma from "@/lib/prisma";
import Image from "next/image";
import ProductForm from "./ProductForm";
import EditProductForm from "./EditProductForm";

export const revalidate = 0;

export default async function AdminProducts() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Gestão de Produtos</h1>
                    <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Cadastre e edite seus tipos de pães</p>
                </div>
                <ProductForm />
            </header>

            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#EBE6DF]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FAF5EF] border-b border-[#EBE6DF]">
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest">Produto</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest">Descrição</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest text-center">Preço</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE6DF]">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image src={product.imageUrl || "/placeholder-bread.jpg"} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <span className="font-bold text-[#3B2B23]">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-xs text-[#5C4D44] line-clamp-1 max-w-xs">{product.description || 'Sem descrição'}</p>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="font-black text-[#3B2B23]">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditProductForm product={product} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-20 text-center italic text-[#8B6E5B]">Nenhum pão cadastrado no catálogo.</div>
                )}
            </div>
        </div>
    );
}
