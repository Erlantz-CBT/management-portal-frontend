<template>
  <div :class="{'blur': modalStore.show}" v-show="modalStore.show" class="backdrop">
  </div>
  <div v-show="modalStore.show" :style="modalStore?.styles" class="aeros-modal">
    <div class="modal-content" v-if="modalStore.template === 'delete'">
      <DeleteModal
          @back="hideModal"
          @confirm="(data) => confirmDelete(data)"
          :data="modalStore.data.id"
      />
    </div>
    <div class="modal-content" v-if="modalStore.template === 'requirements'">
      <RequirementsModal
          @back="hideModal"
          @confirm="(result) => confirmData(result)"
          :data="modalStore.data"
      />
    </div>
    <div class="modal-content" v-if="modalStore.template === 'portMapping'">
      <PortMappingModal
          @back="hideModal"
          @confirm="(portMapping) => confirmData(portMapping)"
          :data="modalStore.data"
      />
    </div>
    <div class="modal-content" v-if="modalStore.template === 'ReadOnly'">
      <ReadOnlyDataModal
          :data="modalStore.data"
      />
    </div>
    <i class="close" @click="hideModal"><font-awesome-icon :icon="['fas', 'xmark']"/></i>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {useModalStore} from "@/stores/modal";
import {useToastsStore} from "@/stores/toasts";
import {useEventBus} from "@/stores/eventbus";
import DeleteModal from "@/shared/Modals/DeleteModal.vue";
import RequirementsModal from "@/shared/Modals/RequirementsModal.vue"
import PortMappingModal from "@/shared/Modals/PortMappingModal.vue";
import ReadOnlyDataModal from "@/shared/Modals/ReadOnlyDataModal.vue";
import axios from 'axios';

export default defineComponent({
  name: "ModalComponent",
  components: {
    ReadOnlyDataModal,
    DeleteModal,
    RequirementsModal,
    PortMappingModal
  },
  props: [
      'hasBackDrop',
      'customStyle'
  ],
  setup: () => {
    const modalStore = useModalStore()
    const toastsStore = useToastsStore()
    const eventBus = useEventBus()
    return {
      modalStore,
      toastsStore,
      eventBus
    }
  },
  methods: {
    hideModal() {
      this.modalStore.hideModal(null)
      this.modalStore.$reset()
    },
    // confirmDelete(data: any) {
    //   this.toastsStore.appendToast({label: `Service ${data.toString()} deleted`, success: true ,data: {}, autoRemove: false})
    //   this.modalStore.hideModal(data)
    //   this.modalStore.$reset()
    // },
    confirmDelete(data: any) {
      axios.delete(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${data.toString()}`)
          .then(() => {
            this.toastsStore.appendToast({label: `Service ${data.toString()} deleted`, success: true ,data: {}, autoRemove: false})
            })
          .catch(err => console.error(err))
          .finally(()=>{
            this.modalStore.hideModal(data)
            this.modalStore.$reset()
          })
    },
    confirmData(result: any) {
      this.eventBus.emit('modal-confirm', result)
      this.modalStore.hideModal(null)
      this.modalStore.$reset()
    }
  }
})
</script>

<style scoped>

.aeros-modal {
  width: 534px;
  height: 268px;
  border-radius: 10px;
  background: #FFFFFF;
  border: 2px solid #E6EAF6;
  position: absolute;
  top: 25vh;
  display: grid;
  justify-self: center;
}

.modal-content {
  min-height: 100%;
  padding: 20px;
  /*display: grid;*/
  /*align-items: center;*/
  /*justify-content: center;*/
}

.backdrop {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(151, 151, 151, 0.4);
  backdrop-filter: blur(2px) opacity(0);
  transition: 1s backdrop-filter linear;
  -webkit-transition: 1s -webkit-backdrop-filter linear;
  -moz-transition: 1s -moz-backdrop-filter linear;
  -ms-transition: 1s -ms-backdrop-filter linear;
  -o-transition: 1s -o-backdrop-filter linear;
}

.blur {
  backdrop-filter: blur(2px) opacity(1);
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 25px;
  cursor: pointer;
}

</style>