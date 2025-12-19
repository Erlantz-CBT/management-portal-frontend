import {defineStore} from "pinia";

interface ModalData {
    onConfirm?: void | CallableFunction; // OP confirm callback
    onClose?: void | CallableFunction; // OP close callback
}

interface Modal {
    /**
     * Template of the modal
     * Currently support:
     * - delete (delete elements modal)
     * - requirements (requirements for new service component)
     * - portMapping (port mapping for new service component)
     * - ReadOnly (read-only multi purpose modal)
     * - NewDataProduct (Add a new data product for the data catalog)
     * - GeekbenchBenchmark (Request a new Geekbench Benchmark)
     * - UserEdit (edit a provided user)
     * - NewUser (create a new user)
     */
    template: any;
    data?: ModalData | any; // OP Additional data
    header?: string; // OP Header of the modal
    styles?: object; // OP Additional styles for the modal
}

/**
 * Modal store
 */
export const useModalStore = defineStore('modal', {
    state: () => {
        return {
            show: false,
            result: null,
            template: null,
            styles: {} || undefined,
            data: {} as ModalData || undefined
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
        showModal(data: Modal) {
            this.show = true;
            this.template = data.template
            this.data = data?.data
            this.styles = data?.styles
        },
        hideModal(result: any) {
            this.show = false;
            this.result = result;
        }
    }
})