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
        await prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID" }
        });
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        return { success: false };
    }
}
