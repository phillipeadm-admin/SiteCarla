import prisma from "@/lib/prisma";
import { markNotificationAsRead } from "../actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import MarkReadButton from "./MarkReadButton";
import WhatsAppButton from "./WhatsAppButton";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import DeleteNotificationButton from "./DeleteNotificationButton";

export const revalidate = 0;

export default async function AdminNotifications() {
    const notifications = await prisma.availabilityNotification.findMany({
        include: { 
            product: true,
            batch: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div>
            <RealtimeRefresh />
            <header className="mb-10">
                <h1 className="font-serif text-4xl font-black text-[#3B2B23]">Notificações de Aviso</h1>
                <p className="text-[#8B6E5B] font-medium uppercase text-xs tracking-widest mt-2">Clientes aguardando disponibilidade de produtos</p>
            </header>

            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#EBE6DF]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#FAF5EF] border-b border-[#EBE6DF]">
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest">Produto</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest">Cliente</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest text-center">Data</th>
                            <th className="p-6 text-[#8B6E5B] text-[10px] font-bold uppercase tracking-widest text-right">Status / Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE6DF]">
                        {notifications.map((notif) => (
                            <tr key={notif.id} className={`hover:bg-gray-50 transition-colors ${!notif.notified ? 'bg-orange-50/10' : ''}`}>
                                <td className="p-6">
                                    <span className="font-bold text-[#3B2B23]">{notif.product.name}</span>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#3B2B23] text-sm">{notif.customerName}</span>
                                        <span className="text-xs text-[#8B6E5B]">{notif.customerPhone}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="text-xs text-[#8B6E5B]">
                                        {format(new Date(notif.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center justify-end gap-3">
                                            {notif.notified ? (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full">Atendido</span>
                                                    {notif.batch && (
                                                        <span className="text-[9px] text-[#8B6E5B] font-medium">
                                                            Para: {format(new Date(notif.batch.availableDate), "dd/MM", { locale: ptBR })}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded-full animate-pulse">Aguardando</span>
                                                    <MarkReadButton id={notif.id} isRead={notif.notified} />
                                                </div>
                                            )}
                                            <WhatsAppButton 
                                                id={notif.id}
                                                customerPhone={notif.customerPhone}
                                                customerName={notif.customerName}
                                                productName={notif.product.name}
                                                batchDate={notif.batch?.availableDate}
                                            />
                                            <DeleteNotificationButton 
                                                id={notif.id}
                                                customerName={notif.customerName}
                                                productName={notif.product.name}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {notifications.length === 0 && (
                    <div className="p-20 text-center italic text-[#8B6E5B]">Nenhum pedido de aviso no momento.</div>
                )}
            </div>
        </div>
    );
}
