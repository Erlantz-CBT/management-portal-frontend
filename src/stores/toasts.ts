import {defineStore} from "pinia";

/**
 * Toasts store
 */

interface Toast {
    label: string;
    success: boolean;
    data?: unknown; // Additional data if needed (not yet implemented)
    autoRemove: boolean;
    timeoutId?: any
}

export const useToastsStore = defineStore('toasts', {
    state: () => {
        return {
            toasts: [] as Toast[]
        }
    },
    actions: {
        appendToast(toast: Toast) {
            // Update the timeoutId for the toast
            toast.timeoutId = setTimeout(() => {
                this.removeToast(toast)
            }, 3500)
            this.toasts.push(toast)
            return this.$state.toasts
        },
        removeToast(toast: Toast) {
            // Clear also the timeout setted for the toast
            clearTimeout(toast.timeoutId)
            this.$state.toasts = this.toasts.filter(t => t.timeoutId !== toast.timeoutId)
            return this.$state.toasts
        }
    }
})