'use server';

import prisma from "@/lib/prisma";

export async function reserveStock(batchId: string, quantity: number) {
    try {
        const batch = await prisma.batch.findUnique({
            where: { id: batchId }
        });
        if (!batch) return { success: false };
        return { success: true, remaining: batch.totalCapacity - batch.soldQuantity };
    } catch (error) {
        console.error("Reserve Error:", error);
        return { success: false };
    }
}

export async function releaseStock(batchId: string, quantity: number) {
    // Com a nova lógica de estoque apenas no pagamento, não precisamos liberar nada no banco.
    // Mantemos a função para compatibilidade com o frontend.
    return { success: true };
}

export async function releaseAllStock(items: { id: string; quantity: number }[]) {
    // Mesma lógica: não há reserva no banco para liberar.
    return { success: true };
}
