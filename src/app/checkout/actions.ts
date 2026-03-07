'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    deliveryType: string;
    totalAmount: number;
    items: { batchId: string; quantity: number; pricePaid: number }[];
}) {
    try {
        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                deliveryType: data.deliveryType,
                totalAmount: data.totalAmount,
                status: "PAID", // Simulando que o pagamento foi aprovado
                items: {
                    create: data.items.map(item => ({
                        batchId: item.batchId,
                        quantity: item.quantity,
                        pricePaid: item.pricePaid
                    }))
                }
            }
        });

        // NOTA: Não precisamos mais incrementar soldQuantity aqui, pois
        // agora os itens são reservados em tempo real ao serem adicionados ao carrinho.
        // O estoque já foi "bloqueado" na Batch no momento do add ao carrinho.

        revalidatePath('/admin');
        revalidatePath('/admin/orders');
        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return { success: false, error: "Falha ao processar pedido" };
    }
}
