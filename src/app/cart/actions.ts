'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reserveStock(batchId: string, quantity: number) {
    try {
        const batch = await prisma.batch.update({
            where: { id: batchId },
            data: {
                soldQuantity: {
                    increment: quantity
                }
            }
        });
        revalidatePath('/');
        revalidatePath('/nossos-paes');
        return { success: true, remaining: batch.totalCapacity - batch.soldQuantity };
    } catch (error) {
        console.error("Reserve Error:", error);
        return { success: false };
    }
}

export async function releaseStock(batchId: string, quantity: number) {
    try {
        await prisma.batch.update({
            where: { id: batchId },
            data: {
                soldQuantity: {
                    decrement: quantity
                }
            }
        });
        revalidatePath('/');
        revalidatePath('/nossos-paes');
        return { success: true };
    } catch (error) {
        console.error("Release Error:", error);
        return { success: false };
    }
}

export async function releaseAllStock(items: { id: string; quantity: number }[]) {
    try {
        for (const item of items) {
            await prisma.batch.update({
                where: { id: item.id },
                data: {
                    soldQuantity: {
                        decrement: item.quantity
                    }
                }
            });
        }
        revalidatePath('/');
        revalidatePath('/nossos-paes');
        return { success: true };
    } catch (error) {
        console.error("Release All Error:", error);
        return { success: false };
    }
}
