import prisma from "@/lib/prisma";
import Image from "next/image";
import ProductForm from "./ProductForm";
import EditProductForm from "./EditProductForm";

import DeleteProductButton from "./DeleteProductButton";

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
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#EBE6DF]">
                                            <Image src={product.imageUrl || "/placeholder-bread.jpg"} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <span className="font-bold text-[#3B2B23]">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-xs text-[#5C4D44] line-clamp-1 max-w-xs">{product.description || 'Sem descrição'}</p>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center text-[10px] gap-4">
                                            <span className="text-[#8B6E5B] font-bold uppercase">P</span>
                                            <span className="font-black text-[#3B2B23]">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        {product.priceM && (
                                            <div className="flex justify-between items-center text-[10px] gap-4">
                                                <span className="text-[#8B6E5B] font-bold uppercase">M</span>
                                                <span className="font-black text-[#3B2B23]">R$ {product.priceM.toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        )}
                                        {product.priceG && (
                                            <div className="flex justify-between items-center text-[10px] gap-4">
                                                <span className="text-[#8B6E5B] font-bold uppercase">G</span>
                                                <span className="font-black text-[#3B2B23]">R$ {product.priceG.toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <EditProductForm product={product} />
                                        <DeleteProductButton id={product.id} name={product.name} />
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
