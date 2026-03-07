import prisma from "@/lib/prisma";
import { ClipboardList, Package, TrendingUp, Users } from "lucide-react";

export const revalidate = 0; // Mostrar dados em tempo real

export default async function AdminDashboard() {
    const ordersCount = await prisma.order.count();
    const activeBatchesCount = await prisma.batch.count({
        where: {
            availableDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });
    const productsCount = await prisma.product.count();

    // Próximos pedidos
    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div>
            <header className="mb-10">
                <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Dashboard de Produção</h1>
                <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Visão geral do sistema Romagnolle</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#EBE6DF]">
                    <div className="bg-[#FAF5EF] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <ClipboardList className="w-6 h-6 text-[#3B2B23]" />
                    </div>
                    <p className="text-[#8B6E5B] text-xs font-bold uppercase tracking-wider mb-1">Total Pedidos</p>
                    <h3 className="text-3xl font-black text-[#3B2B23]">{ordersCount}</h3>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#EBE6DF]">
                    <div className="bg-[#FAF5EF] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Package className="w-6 h-6 text-[#E66A46]" />
                    </div>
                    <p className="text-[#8B6E5B] text-xs font-bold uppercase tracking-wider mb-1">Fornadas Ativas</p>
                    <h3 className="text-3xl font-black text-[#3B2B23]">{activeBatchesCount}</h3>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#EBE6DF]">
                    <div className="bg-[#FAF5EF] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-[#8B6E5B] text-xs font-bold uppercase tracking-wider mb-1">Vendas Hoje</p>
                    <h3 className="text-3xl font-black text-[#3B2B23]">0</h3>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#EBE6DF]">
                    <div className="bg-[#FAF5EF] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-[#8B6E5B] text-xs font-bold uppercase tracking-wider mb-1">Produtos Cadastrados</p>
                    <h3 className="text-3xl font-black text-[#3B2B23]">{productsCount}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Próximas Entregas/Retiradas */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#EBE6DF]">
                    <h2 className="font-serif text-2xl font-bold text-[#3B2B23] mb-6">Últimos Pedidos</h2>
                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-[#FAF5EF] rounded-2xl border border-[#EBE6DF]/50">
                                    <div>
                                        <h4 className="font-bold text-[#3B2B23] text-sm">{order.customerName}</h4>
                                        <p className="text-[10px] text-[#8B6E5B] uppercase font-bold">{order.deliveryType}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#8B6E5B] py-10 italic">Nenhum pedido encontrado no sistema.</p>
                    )}
                </div>

                {/* Status da Produção */}
                <div className="bg-[#3B2B23] rounded-[32px] p-8 shadow-sm text-white">
                    <h2 className="font-serif text-2xl font-bold mb-6">Capacidade do Forno</h2>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">Acompanhe a ocupação das suas próximas fornadas para saber o quanto ainda pode produzir.</p>

                    <div className="space-y-8">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold uppercase py-1 px-2 rounded-full text-white bg-[#E66A46] tracking-widest">Fornada Quinta-Feira</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black inline-block">20%</span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/10">
                                <div style={{ width: "20%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E66A46] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
