import prisma from "@/lib/prisma";
import Image from "next/image";
import { Search, MapPin, Phone, Calendar, ChevronRight } from "lucide-react";
import DeleteOrderButton from "./DeleteOrderButton";
import RealtimeRefresh from "@/components/RealtimeRefresh";

export const revalidate = 0;

export default async function AdminOrders() {
    const orders = await prisma.order.findMany({
        include: { items: { include: { batch: { include: { product: true } } } } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <RealtimeRefresh />
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Lista de Pedidos</h1>
                    <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Acompanhe suas vendas e status de entrega</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6E5B]" />
                    <input
                        type="text"
                        placeholder="Buscar nome ou telefone..."
                        className="bg-white border border-[#EBE6DF] rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2B23] w-64 shadow-sm"
                    />
                </div>
            </header>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#EBE6DF] flex flex-col md:flex-row gap-6 relative group hover:shadow-md transition-all">

                        {/* Infos do Cliente */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#FAF5EF] text-[#3B2B23] p-2 rounded-xl text-[10px] font-black uppercase">#{order.id.slice(0, 5)}</span>
                                <h3 className="text-xl font-black text-[#3B2B23]">{order.customerName}</h3>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#8B6E5B] uppercase">
                                    <Phone className="w-3 h-3" /> {order.customerPhone}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#8B6E5B] uppercase">
                                    <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                {order.address && (
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`} 
                                        target="_blank"
                                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase hover:underline"
                                    >
                                        <MapPin className="w-3 h-3" /> {order.address.slice(0, 30)}...
                                    </a>
                                )}
                                <a 
                                    href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${order.customerName}, seu pedido da Romagnolle já foi enviado! 🍞✨`)}`}
                                    target="_blank"
                                    className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Itens do Pedido */}
                        <div className="flex-1 border-l border-[#EBE6DF] pl-6 h-full flex items-center">
                            <div className="flex -space-x-3 overflow-hidden">
                                {order.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#FAF5EF] overflow-hidden relative">
                                        <Image src={item.batch.product.imageUrl || ""} alt="Pão" fill className="object-cover" />
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-[#EBE6DF] flex items-center justify-center text-[10px] font-bold text-[#3B2B23]">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>
                            <p className="ml-4 text-xs font-bold text-[#3B2B23]">
                                {order.items.reduce((acc, i) => acc + i.quantity, 0)} Pães <br />
                                <span className="text-[#8B6E5B] font-medium uppercase text-[9px]">Total: R$ {order.totalAmount.toFixed(2).replace('.', ',')}</span>
                            </p>
                        </div>

                        {/* Status e Ações */}
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                {order.status === 'PAID' ? 'PAGO' : order.status === 'PREPARING' ? 'PRODUÇÃO' : 'PENDENTE'}
                            </div>
                            
                            <DeleteOrderButton id={order.id} customerName={order.customerName} />

                            <button className="bg-[#FAF5EF] p-3 rounded-full hover:bg-[#3B2B23] hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="p-20 text-center italic text-[#8B6E5B]">Nenhum pedido recebido ainda através do e-commerce.</div>
                )}
            </div>
        </div>
    );
}
