import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';
import { reserveStock, releaseStock, releaseAllStock } from '@/app/cart/actions';

export interface CartItem {
    id: string; // ID da Fornada (Batch)
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    isHot?: boolean;
    maxQuantity: number;
}

interface CartStore {
    items: CartItem[];
    expiresAt: number | null;
    addItem: (item: CartItem) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    decreaseItem: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    finishOrder: () => void;
    checkExpiration: () => Promise<void>;
    total: () => number;
}

const RESERVATION_TIME = 10 * 60 * 1000; // 10 minutos

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            expiresAt: null,
            addItem: async (newItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === newItem.id);

                // Verificar limite local (maxQuantity vem do banco no momento do clique)
                const currentQuantity = existingItem ? existingItem.quantity : 0;
                if (currentQuantity >= newItem.maxQuantity) {
                    useToastStore.getState().showToast({
                        message: `Atenção: Este item acabou de esgotar ou atingiu o limite de estoque.`,
                        type: 'warning',
                        duration: 4000
                    });
                    return;
                }

                // Reservar no Banco de Dados
                const res = await reserveStock(newItem.id, 1);
                if (!res.success) {
                    useToastStore.getState().showToast({
                        message: `Erro ao reservar produto. Tente novamente.`,
                        type: 'error'
                    });
                    return;
                }

                // Atualizar Estado Local
                const newExpiresAt = get().expiresAt || (Date.now() + RESERVATION_TIME);

                if (existingItem) {
                    set({
                        expiresAt: newExpiresAt,
                        items: currentItems.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        expiresAt: newExpiresAt,
                        items: [...currentItems, { ...newItem, quantity: 1 }]
                    });
                }
            },
            decreaseItem: async (id) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === id);

                if (!existingItem) return;

                // Liberar no Banco
                await releaseStock(id, 1);

                if (existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                        )
                    });
                } else {
                    const remainingItems = currentItems.filter((item) => item.id !== id);
                    set({
                        items: remainingItems,
                        expiresAt: remainingItems.length === 0 ? null : get().expiresAt
                    });
                }
            },
            removeItem: async (id) => {
                const item = get().items.find(i => i.id === id);
                if (item) {
                    await releaseStock(id, item.quantity);
                }
                const remainingItems = get().items.filter((item) => item.id !== id);
                set({
                    items: remainingItems,
                    expiresAt: remainingItems.length === 0 ? null : get().expiresAt
                });
            },
            clearCart: async () => {
                const items = get().items;
                if (items.length > 0) {
                    await releaseAllStock(items.map(i => ({ id: i.id, quantity: i.quantity })));
                }
                set({ items: [], expiresAt: null });
            },
            finishOrder: () => set({ items: [], expiresAt: null }),
            checkExpiration: async () => {
                const { expiresAt, items } = get();
                if (expiresAt && Date.now() > expiresAt) {
                    if (items.length > 0) {
                        await releaseAllStock(items.map(i => ({ id: i.id, quantity: i.quantity })));
                        useToastStore.getState().showToast({
                            message: "Sua reserva de 10 minutos expirou e os itens voltaram para o estoque.",
                            type: "warning",
                            duration: 6000
                        });
                    }
                    set({ items: [], expiresAt: null });
                }
            },
            total: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);
