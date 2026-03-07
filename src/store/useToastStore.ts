import { create } from 'zustand';

interface ToastOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastStore {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    showToast: (options: ToastOptions) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    isVisible: false,
    message: '',
    type: 'info',
    showToast: ({ message, type = 'info', duration = 3000 }) => {
        set({ isVisible: true, message, type });
        setTimeout(() => {
            set({ isVisible: false });
        }, duration);
    },
    hideToast: () => set({ isVisible: false }),
}));
