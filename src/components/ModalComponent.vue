<template>
  <Transition name="fade" mode="in-out">
    <div
        @click="modalStore?.data?.onClose?.() ?? hideModal()"
        :key="'backdrop'"
        :class="{'blur': modalStore.show}"
        v-show="modalStore.show"
        class="backdrop">
    </div>
  </Transition>
  <TransitionGroup name="scale">
    <div
        :key="'modal'"
        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        v-show="modalStore.show"
        :style="modalStore?.styles"
        class="aeros-modal">
      <div
          class="modal-content" v-if="modalStore.template === 'delete'">
        <DeleteModal
            @back="hideModal"
            @confirm="(data) => confirm(data)"
            :data="modalStore.data"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          class="modal-content" v-if="modalStore.template === 'requirements'">
        <RequirementsModal
            @back="hideModal"
            @confirm="(result) => confirm(result)"
            :data="modalStore.data.service"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          class="modal-content" v-if="modalStore.template === 'portMapping'">
        <PortMappingModal
            @back="hideModal"
            @confirm="(portMapping) => confirm(portMapping)"
            :data="modalStore.data.service"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          class="modal-content" v-if="modalStore.template === 'ReadOnly'">
        <ReadOnlyDataModal
            :data="modalStore.data"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          class="modal-content" v-if="modalStore.template === 'Details'">
        <DetailsModal
            :header="modalStore.data?.header"
            :data="modalStore.data?.data"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          v-if="modalStore.template === 'NewDataProduct'"
          class="modal-content">
        <NewDataProductModal
            :data="modalStore?.data"
            @back="hideModal"
            @confirm="(newProduct) => confirm(newProduct)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          v-if="modalStore.template === 'GeekbenchBenchmark'"
          class="modal-content"
      >
        <NewBenchmarkFromGeekbench
            @back="hideModal"
            @confirm="(newProduct) => confirm(newProduct)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />

      </div>
      <div
          v-if="modalStore.template === 'UserEdit'"
          class="modal-content"
      >
        <UserEditModal
            @back="hideModal"
            :user="modalStore.data"
            @confirm="(editUser) => confirm(editUser)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />

      </div>
      <div
          v-if="modalStore.template === 'NewUser'"
          class="modal-content"
      >
        <NewUserModal
            @back="modalStore?.data?.onClose()"
            :user="modalStore.data"
            @confirm="(newUser) => confirm(newUser)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          v-if="modalStore.template === 'EditServiceCredentials'"
          class="modal-content"
      >
        <ServiceCredentialsModal
            @back="() => modalStore?.data?.onClose()"
            :service="modalStore.data"
            @confirm="(credentials) => confirm(credentials)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div
          v-if="modalStore.template === 'UpdateIECapabilities'"
          class="modal-content"
      >
        <UpdateIECatabilities
            @back="hideModal"
            :IE="modalStore.data"
            :anomaly="modalStore.data?.anomaly"
            :type="modalStore.data?.type"
            @confirm="(ieCapabilities) => confirm(ieCapabilities)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <div v-if="modalStore.template === 'IEPool'" class="modal-content">
        <IEPoolModal
            @back="hideModal"
            :service="modalStore.data"
            @confirm="(iePool) => confirm(iePool)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        />
      </div>
      <i class="close" @click="modalStore?.data?.onClose?.() ?? hideModal()"><font-awesome-icon :icon="['fas', 'xmark']"/></i>
    </div>
  </TransitionGroup>
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
import {useSettings} from "@/stores/settings";
import NewDataProductModal from "@/shared/Modals/NewDataProductModal.vue";
import NewBenchmarkFromGeekbench from "@/shared/Modals/NewBenchmarkFromGeekbench.vue";
import UserEditModal from "@/shared/Modals/UserEditModal.vue";
import NewUserModal from "@/shared/Modals/NewUserModal.vue";
import UpdateIECatabilities from "@/shared/Modals/UpdateIECapabilities.vue";
import DetailsModal from "@/shared/Modals/DetailsModal.vue";
import ServiceCredentialsModal from "@/shared/Modals/ServiceCredentialsModal.vue";
import IEPoolModal from "@/shared/Modals/IEPoolModal.vue";
import {useLoaderStore} from "@/stores/loader";

export default defineComponent({
  name: "ModalComponent",
  components: {
    DetailsModal,
    ReadOnlyDataModal,
    DeleteModal,
    RequirementsModal,
    PortMappingModal,
    NewDataProductModal,
    NewBenchmarkFromGeekbench,
    UserEditModal,
    NewUserModal,
    UpdateIECatabilities,
    ServiceCredentialsModal,
    IEPoolModal
  },
  props: [
      'hasBackDrop',
      'customStyle'
  ],
  setup: () => {
    const modalStore = useModalStore()
    const toastsStore = useToastsStore()
    const eventBus = useEventBus()
    const settingsStore = useSettings()
    const loaderStore = useLoaderStore()
    return {
      modalStore,
      toastsStore,
      settingsStore,
      loaderStore,
      eventBus
    }
  },
  methods: {
    hideModal() {
      this.loaderStore.$reset()
      this.modalStore.hideModal(null)
      this.modalStore.$reset()
    },
    confirm(data: any) {
      if (this.modalStore?.data?.onConfirm) {
        return this.modalStore?.data?.onConfirm(data)
      }
      return null
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
  z-index: 300;
  display: grid;
  justify-self: center;
}

.fade-enter-from,
.fade-leave-to {
  background-color: transparent;
}

.fade-leave-from,
.fade-enter-to {
  background-color: #00000052;
}

.fade-enter-active,
.fade-leave-active {
  transition: background-color 150ms ease;
}

.scale-enter-active,
.scale-leave-active {
  transform: scale(1);
  opacity: 1;
  transition: all 150ms ease-in-out;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.modal-content {
  min-height: 100%;
  padding: 20px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.dark > .modal-content > h2,
.dark > .modal-content > h3,
.dark > .modal-content > h4,
.dark > .modal-content > p {
  background-color: transparent;
  color: #E6EAF6 !important;
}

.backdrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  background-color: transparent;
  /*backdrop-filter: blur(1px) opacity(0);*/
  transition: 150ms background-color linear;
  /*-webkit-transition: 1s -webkit-backdrop-filter linear;*/
  /*-moz-transition: 1s -moz-backdrop-filter linear;*/
  /*-ms-transition: 1s -ms-backdrop-filter linear;*/
  /*-o-transition: 1s -o-backdrop-filter linear;*/
}

.blur {
  background-color: #00000052;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 25px;
  cursor: pointer;
}

.dark {
  background-color: #282828;
  color: #E6EAF6 !important;
}

.light {
  background-color:#ffffff;
}

</style>