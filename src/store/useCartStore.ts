import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';
import { syncCartItem } from '@/app/actions/cartSync';

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
    sessionId: string | null;
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
            sessionId: null,
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

                // Garantir Session ID
                let sid = get().sessionId;
                if (!sid) {
                    sid = Math.random().toString(36).substring(2, 15);
                    set({ sessionId: sid });
                }

                // Atualizar Estado Local
                const newExpiresAt = get().expiresAt || (Date.now() + RESERVATION_TIME);

                if (existingItem) {
                    const newQuantity = existingItem.quantity + 1;
                    set({
                        expiresAt: newExpiresAt,
                        items: currentItems.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: newQuantity }
                                : item
                        ),
                    });
                    // Sincronizar com DB
                    await syncCartItem(newItem.id, newQuantity, sid);
                } else {
                    set({
                        expiresAt: newExpiresAt,
                        items: [...currentItems, { ...newItem, quantity: 1 }]
                    });
                    // Sincronizar com DB
                    await syncCartItem(newItem.id, 1, sid);
                }

                useToastStore.getState().showToast({
                    message: `${newItem.name} adicionado ao carrinho!`,
                    type: 'success'
                });
            },
            decreaseItem: async (id) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === id);
                const sid = get().sessionId;

                if (!existingItem || !sid) return;

                if (existingItem.quantity > 1) {
                    const newQuantity = existingItem.quantity - 1;
                    set({
                        items: currentItems.map((item) =>
                            item.id === id ? { ...item, quantity: newQuantity } : item
                        )
                    });
                    await syncCartItem(id, newQuantity, sid);
                } else {
                    const remainingItems = currentItems.filter((item) => item.id !== id);
                    set({
                        items: remainingItems,
                        expiresAt: remainingItems.length === 0 ? null : get().expiresAt
                    });
                    await syncCartItem(id, 0, sid);
                }
            },
            removeItem: async (id) => {
                const sid = get().sessionId;
                const remainingItems = get().items.filter((item) => item.id !== id);
                set({
                    items: remainingItems,
                    expiresAt: remainingItems.length === 0 ? null : get().expiresAt
                });
                if (sid) await syncCartItem(id, 0, sid);
            },
            clearCart: async () => {
                const sid = get().sessionId;
                const items = get().items;
                set({ items: [], expiresAt: null });
                if (sid) {
                    for (const item of items) {
                        await syncCartItem(item.id, 0, sid);
                    }
                }
            },
            finishOrder: () => set({ items: [], expiresAt: null }),
            checkExpiration: async () => {
                const { expiresAt, items, sessionId } = get();
                if (expiresAt && Date.now() > expiresAt) {
                    if (items.length > 0) {
                        useToastStore.getState().showToast({
                            message: "Sua sessão de compra expirou. Os itens foram removidos do carrinho.",
                            type: "warning",
                            duration: 6000
                        });
                        if (sessionId) {
                            for (const item of items) {
                                await syncCartItem(item.id, 0, sessionId);
                            }
                        }
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
