import {defineStore} from "pinia";

/**
 * Modal store
 */
export const useModalStore = defineStore('modal', {
    state: () => {
        return {
            show: false,
            result: null,
            template: null,
            styles: null,
            data: null
        }
    },
    getters: {
        isShow: (state) => {
            return state.show
        },
        getResult(): any {
            return this.result
        }
    },
    actions: {
        showModal(data: any) {
            this.show = true;
            this.template = data?.template
            this.data = data?.data
            this.styles = data?.styles
        },
        hideModal(result: any) {
            this.show = false;
            this.result = result;
        }
    }
})