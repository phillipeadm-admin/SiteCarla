'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncCartItem(batchId: string, quantity: number, sessionId: string) {
    if (!sessionId || !batchId) return { success: false };

    try {
        if (quantity <= 0) {
            await prisma.cartReservation.deleteMany({
                where: { batchId, sessionId }
            });
        } else {
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            await prisma.cartReservation.upsert({
                where: {
                    sessionId_batchId: {
                        sessionId,
                        batchId
                    }
                },
                update: {
                    quantity,
                    expiresAt,
                },
                create: {
                    batchId,
                    sessionId,
                    quantity,
                    expiresAt,
                }
            });
        }

        revalidatePath('/admin/batches');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Cart Sync Error:", error);
        return { success: false };
    }
}

export async function cleanupExpiredReservations() {
    try {
        await prisma.cartReservation.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        });
        revalidatePath('/admin/batches');
        revalidatePath('/');
    } catch (error) {
        console.error("Cleanup Error:", error);
    }
}
