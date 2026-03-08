import prisma from "@/lib/prisma";
import { Package, Clock, Calendar, Hash } from "lucide-react";
import BatchForm from "./BatchForm";
import EditBatchForm from "./EditBatchForm";

export const revalidate = 0;

export default async function AdminBatches() {
    const products = await prisma.product.findMany({
        include: {
            batches: {
                orderBy: { availableDate: 'asc' }
            }
        },
        orderBy: { name: 'asc' }
    });

    const activeProducts = products.filter(p => p.batches.length > 0);

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="font-serif text-5xl font-black text-[#3B2B23] tracking-tight">Estoque & Fornadas</h1>
                    <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-[0.2em] mt-3">Gerencie a produção e a disponibilidade dos seus pães</p>
                </div>
                <BatchForm products={products.map(p => ({ id: p.id, name: p.name }))} />
            </header>

            <div className="space-y-12">
                {activeProducts.map((product) => {
                    const totalAvailable = product.batches.reduce((acc, b) => acc + (b.totalCapacity - b.soldQuantity), 0);
                    
                    return (
                        <div key={product.id} className="bg-white rounded-[40px] shadow-sm border border-[#EBE6DF] overflow-hidden">
                            <div className="p-8 md:p-10 flex flex-col xl:flex-row justify-between items-start gap-10">
                                {/* Info do Produto */}
                                <div className="flex items-center gap-6 min-w-[280px]">
                                    <div className="w-20 h-20 bg-[#FAF5EF] rounded-3xl flex items-center justify-center border border-[#EBE6DF]">
                                        <Package className="w-10 h-10 text-[#3B2B23]" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] uppercase tracking-tight leading-tight">{product.name}</h2>
                                        <p className="text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                            <Hash className="w-3 h-3 text-[#E66A46]" /> {product.batches.length} Fornadas Ativas
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-8 w-full xl:w-auto items-start xl:items-center">
                                    {/* Total em Estoque */}
                                    <div className="bg-[#3B2B23] px-10 py-6 rounded-3xl shadow-xl text-center min-w-[200px]">
                                        <span className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-1">Total em Estoque</span>
                                        <span className="text-5xl font-black text-white">{totalAvailable}</span>
                                        <span className="text-xs font-bold text-white/40 ml-2">unid.</span>
                                    </div>

                                    {/* Lista de Fornadas (Caixinhas Pequenas ao lado) */}
                                    <div className="flex-1 w-full max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        <div className="text-[10px] font-bold text-[#8B6E5B] uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-[#E66A46] rounded-full" /> Detalhes das Fornadas
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {product.batches.map((batch) => (
                                                <div key={batch.id} className="bg-[#FAF5EF]/60 hover:bg-[#FAF5EF] transition-all rounded-2xl p-4 border border-[#EBE6DF] flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white p-2 rounded-lg border border-[#EBE6DF]">
                                                            <Calendar className="w-4 h-4 text-[#E66A46]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-[#3B2B23] uppercase">
                                                                {new Date(batch.availableDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                            </p>
                                                            <p className="text-[10px] text-[#8B6E5B] font-bold flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {new Date(batch.availableDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8">
                                                        <div className="text-right">
                                                            <span className="block text-[8px] font-bold text-[#8B6E5B] uppercase tracking-wider">Disponível</span>
                                                            <span className="text-sm font-black text-[#3B2B23]">{batch.totalCapacity - batch.soldQuantity}</span>
                                                        </div>
                                                        {batch.observation && (
                                                            <div className="h-8 w-[1px] bg-[#EBE6DF] hidden md:block" />
                                                        )}
                                                        {batch.observation && (
                                                            <p className="text-[10px] text-[#8B6E5B] italic max-w-[120px] line-clamp-1 hidden md:block" title={batch.observation}>
                                                                "{batch.observation}"
                                                            </p>
                                                        )}
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <EditBatchForm batch={{ ...batch, product: { name: product.name } }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {activeProducts.length === 0 && (
                <div className="bg-white rounded-[40px] p-32 text-center border-2 border-dashed border-[#EBE6DF]">
                    <Package className="w-16 h-16 text-[#EBE6DF] mx-auto mb-6" />
                    <p className="italic text-[#8B6E5B] font-serif text-xl">Nenhuma fornada agendada no momento.</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B6E5B] mt-4">Clique no botão "Nova Fornada" para começar</p>
                </div>
            )}
        </div>
    );
}
