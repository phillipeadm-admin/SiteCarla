'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });

export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    deliveryType: string;
    address?: string;
    zipCode?: string;
    totalAmount: number;
    items: { batchId: string; quantity: number; pricePaid: number }[];
}) {
    try {
        // 1. Verificar disponibilidade real de estoque antes de qualquer coisa
        for (const item of data.items) {
            const batch = await prisma.batch.findUnique({
                where: { id: item.batchId }
            });

            if (!batch) {
                return { success: false, error: "Uma das fornadas selecionadas não existe mais." };
            }

            const available = batch.totalCapacity - batch.soldQuantity;
            if (item.quantity > available) {
                return { 
                    success: false, 
                    error: `Estoque insuficiente para uma das fornadas. Temos apenas ${available} unidades.` 
                };
            }
        }

        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                deliveryType: data.deliveryType,
                address: data.address,
                zipCode: data.zipCode,
                totalAmount: data.totalAmount,
                status: "PENDING", 
                items: {
                    create: data.items.map(item => ({
                        batchId: item.batchId,
                        quantity: item.quantity,
                        pricePaid: item.pricePaid
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        batch: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });

        // Criar preferência no Mercado Pago
        const preference = new Preference(client);
        const mpItems = order.items.map(item => ({
            id: item.batchId,
            title: item.batch.product.name,
            unit_price: item.pricePaid,
            quantity: item.quantity,
            currency_id: 'BRL',
        }));

        const result = await preference.create({
            body: {
                items: mpItems,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}`,
                    failure: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/failure`,
                    pending: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout/pending`,
                },
                auto_return: 'approved',
                external_reference: order.id,
            }
        });

        revalidatePath('/admin/orders');
        return { success: true, paymentUrl: result.init_point };
    } catch (error) {
        console.error("Erro ao criar pedido ou preferência:", error);
        return { success: false, error: "Falha ao processar pagamento" };
    }
}

export async function confirmOrderPayment(orderId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // Verificar status novamente dentro da transação
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: { include: { batch: true } } }
            });

            if (!currentOrder || currentOrder.status === "PAID") return;

            // 1. Atualizar status do pedido
            await tx.order.update({
                where: { id: orderId },
                data: { status: "PAID" }
            });

            // 2. Dar baixa no estoque das fornadas específicas do pedido
            for (const item of currentOrder.items) {
                const batch = await tx.batch.findUnique({
                    where: { id: item.batchId }
                });

                if (!batch) {
                    console.error(`Batch ${item.batchId} não encontrado ao confirmar pagamento.`);
                    continue;
                }

                const availableSpace = batch.totalCapacity - batch.soldQuantity;
                const quantityToDeduct = Math.min(item.quantity, Math.max(0, availableSpace));

                if (quantityToDeduct > 0) {
                    await tx.batch.update({
                        where: { id: batch.id },
                        data: {
                            soldQuantity: { increment: quantityToDeduct }
                        }
                    });
                }
                
                if (item.quantity > quantityToDeduct) {
                    console.warn(`Estoque insuficiente na fornada ${batch.id} para o pedido ${orderId}. Pedido pedia ${item.quantity}, foi possível abater apenas ${quantityToDeduct}.`);
                }
            }
        });

        revalidatePath('/admin/orders');
        revalidatePath('/admin/batches');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        return { success: false };
    }
}

