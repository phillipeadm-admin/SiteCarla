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
                            <div className="bg-[#FAF5EF] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#EBE6DF]">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#EBE6DF]">
                                        <Package className="w-10 h-10 text-[#3B2B23]" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-3xl font-black text-[#3B2B23] uppercase tracking-tight">{product.name}</h2>
                                        <p className="text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                            <Hash className="w-3 h-3 text-[#E66A46]" /> {product.batches.length} {product.batches.length === 1 ? 'Fornada Ativa' : 'Fornadas Ativas'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="bg-white px-8 py-5 rounded-3xl border border-[#EBE6DF] shadow-sm text-center min-w-[180px]">
                                    <span className="block text-[10px] font-bold text-[#8B6E5B] uppercase tracking-[0.2em] mb-1">Total em Estoque</span>
                                    <span className="text-4xl font-black text-[#3B2B23]">{totalAvailable}</span>
                                    <span className="text-xs font-bold text-[#8B6E5B] ml-2">unid.</span>
                                </div>
                            </div>

                            <div className="p-4 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {product.batches.map((batch) => (
                                        <div key={batch.id} className="bg-[#FAF5EF]/50 hover:bg-[#FAF5EF] transition-all rounded-3xl p-6 border border-[#EBE6DF] group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-[#EBE6DF]">
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
                                                <div className="text-right">
                                                    <span className="block text-[9px] font-bold text-[#8B6E5B] uppercase tracking-wider">Disponível</span>
                                                    <span className="text-lg font-black text-[#3B2B23]">{batch.totalCapacity - batch.soldQuantity}</span>
                                                </div>
                                            </div>

                                            {batch.observation && (
                                                <p className="text-[11px] text-[#8B6E5B] italic bg-white/60 p-3 rounded-xl mb-4 border border-[#EBE6DF]/50">
                                                    "{batch.observation}"
                                                </p>
                                            )}

                                            <div className="h-1.5 w-full bg-[#EBE6DF] rounded-full overflow-hidden mb-4">
                                                <div 
                                                    style={{ width: `${(batch.soldQuantity / batch.totalCapacity) * 100}%` }}
                                                    className="h-full bg-[#3B2B23] rounded-full"
                                                />
                                            </div>

                                            <EditBatchForm batch={{ ...batch, product: { name: product.name } }} />
                                        </div>
                                    ))}
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
