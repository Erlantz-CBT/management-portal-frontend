import {defineStore} from "pinia";

/**
 * Toasts store
 */

interface Toast {
    label: string;
    success: boolean;
    data?: any;
    autoRemove: boolean
}

export const useToastsStore = defineStore('toasts', {
    state: () => {
        return {
            toasts: [] as Toast[]
        }
    },
    actions: {
        appendToast(toast: Toast) {
            this.toasts.push(toast)
        },
        removeToast(index: number) {
            this.toasts.splice(index, 1)
        }
    }
})