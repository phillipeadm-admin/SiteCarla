import prisma from "@/lib/prisma";
import { Package, Clock, Flame } from "lucide-react";
import BatchForm from "./BatchForm";
import EditBatchForm from "./EditBatchForm";

export const revalidate = 0;

export default async function AdminBatches() {
    const batches = await prisma.batch.findMany({
        include: { product: true },
        orderBy: { availableDate: 'asc' }
    });

    const products = await prisma.product.findMany({
        select: { id: true, name: true }
    });

    return (
        <div>
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Agenda de Fornadas</h1>
                    <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Planeje sua produção e defina o estoque diário</p>
                </div>
                <BatchForm products={products} />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch) => (
                    <div key={batch.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#EBE6DF] relative overflow-hidden group">
                        {batch.isImmediateSale && (
                            <div className="absolute top-0 right-0 bg-[#E66A46] text-white p-2 rounded-bl-2xl">
                                <Flame className="w-4 h-4 fill-current" />
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-[#FAF5EF] p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6 text-[#3B2B23]" />
                            </div>
                            <div>
                                <h3 className="font-black text-[#3B2B23] uppercase text-sm">{batch.product.name}</h3>
                                <p className="text-[10px] text-[#8B6E5B] font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(batch.availableDate).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#FAF5EF] rounded-2xl p-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-[#8B6E5B] uppercase tracking-wider">Ocupação do Forno</span>
                                    <span className="text-xs font-black text-[#3B2B23]">{Math.round((batch.soldQuantity / batch.totalCapacity) * 100)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#EBE6DF] rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${(batch.soldQuantity / batch.totalCapacity) * 100}%` }}
                                        className={`h-full rounded-full ${batch.isImmediateSale ? 'bg-[#E66A46]' : 'bg-[#3B2B23]'}`}
                                    />
                                </div>
                                <p className="text-[10px] text-center text-[#8B6E5B] mt-2 font-medium">
                                    {batch.soldQuantity} de {batch.totalCapacity} pães reservados
                                </p>
                            </div>

                            <EditBatchForm batch={batch} />
                        </div>
                    </div>
                ))}
            </div>

            {batches.length === 0 && (
                <div className="bg-white rounded-[32px] p-20 text-center italic text-[#8B6E5B] border-2 border-dashed border-[#EBE6DF]">
                    Nenhuma fornada agendada. Comece criando uma para liberar as vendas no site!
                </div>
            )}
        </div>
    );
}
