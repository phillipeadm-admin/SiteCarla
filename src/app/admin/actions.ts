'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const imageUrl = formData.get('imageUrl') as string;

    if (!name || isNaN(price)) {
        return { success: false, error: "Nome e preço são obrigatórios." };
    }

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl: imageUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao criar produto." };
    }
}

export async function updateProduct(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const imageUrl = formData.get('imageUrl') as string;

    if (!id || !name || isNaN(price)) {
        return { success: false, error: "ID, nome e preço são obrigatórios." };
    }

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                imageUrl: imageUrl || undefined,
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao atualizar produto." };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao excluir produto. Verifique se existem fornadas vinculadas." };
    }
}

export async function createBatch(formData: FormData) {
    const productId = formData.get('productId') as string;
    const availableDate = new Date(formData.get('availableDate') as string);
    const totalCapacity = parseInt(formData.get('totalCapacity') as string);
    const observation = formData.get('observation') as string;

    const isImmediateSale = formData.get('isImmediateSale') === 'on';

    if (!productId || isNaN(totalCapacity)) {
        return { success: false, error: "Produto e capacidade são obrigatórios." };
    }

    try {
        await prisma.batch.create({
            data: {
                productId,
                availableDate,
                totalCapacity,
                isImmediateSale,
                observation: observation || null,
            }
        });

        revalidatePath('/admin/batches');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao criar fornada." };
    }
}

export async function updateBatch(formData: FormData) {
    const id = formData.get('id') as string;
    const availableDate = new Date(formData.get('availableDate') as string);
    const totalCapacity = parseInt(formData.get('totalCapacity') as string);
    const observation = formData.get('observation') as string;

    const isImmediateSale = formData.get('isImmediateSale') === 'on';

    if (!id || isNaN(totalCapacity)) {
        return { success: false, error: "ID e capacidade são obrigatórios." };
    }

    try {
        await prisma.batch.update({
            where: { id },
            data: {
                availableDate,
                totalCapacity,
                isImmediateSale,
                observation: observation || null,
            }
        });

        revalidatePath('/admin/batches');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao atualizar fornada." };
    }
}

export async function deleteBatch(id: string) {
    try {
        await prisma.batch.delete({ where: { id } });
        revalidatePath('/admin/batches');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao cancelar fornada. Verifique relacionamentos (como pedidos)." };
    }
}

export async function createGalleryImage(imageUrl: string) {
    try {
        await prisma.gallery.create({
            data: { imageUrl }
        });
        revalidatePath('/admin/gallery');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao adicionar imagem à galeria." };
    }
}

export async function deleteGalleryImage(id: string) {
    try {
        await prisma.gallery.delete({ where: { id } });
        revalidatePath('/admin/gallery');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao excluir imagem." };
    }
}

export async function createNotification(productId: string, name: string, phone: string) {
    try {
        await prisma.availabilityNotification.create({
            data: {
                productId,
                customerName: name,
                customerPhone: phone
            }
        });
        revalidatePath('/admin/notifications');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao registrar aviso." };
    }
}

export async function markNotificationAsRead(id: string) {
    try {
        await prisma.availabilityNotification.update({
            where: { id },
            data: { notified: true }
        });
        revalidatePath('/admin/notifications');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Erro ao atualizar notificação." };
    }
}

export async function getPendingNotificationsCount() {
    try {
        const count = await prisma.availabilityNotification.count({
            where: { notified: false }
        });
        return count;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

