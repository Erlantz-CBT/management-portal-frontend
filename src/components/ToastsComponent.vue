<template>
  <div class="toast-container">
    <TransitionGroup>
      <div
          class="toast"
          :class="toast.success ? 'success' : 'fail'"
          style="margin-top: 10px"
          v-for="toast in toasts"
          :key="toast">
        {{toast.label}}
        <font-awesome-icon
            style="margin-left: 10px; cursor: pointer"
            aria-placeholder="Remove"
            :icon="['fas', 'xmark']"
            @click="manualRemove(toast)"
        />
      </div>
    </TransitionGroup>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useToastsStore} from "@/stores/toasts";

export default defineComponent({
  name: "ToastsComponent",
  setup: () => {
    const toastsStore = useToastsStore()
    const toasts = ref([])
    toastsStore.$onAction(({after}) => {
      after((result: any) => {
        // When a remove/add actions is performed, set the local ref
        toasts.value = result
      })
    })
    return {
      toastsStore,
      toasts
    }
  },
  methods: {
    manualRemove(toast: any) {
      this.toastsStore.removeToast(toast)
    }
  }
})
</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.toast-container {
  position: absolute;
  max-height: 100vh;
  justify-content: center;
  justify-self: center;
  top: 0;
  display: grid;
  align-content: end;
  padding-bottom: 10px;
  z-index: 200;

}

.toast {
  margin-top: 10px;
  border-radius: 10px;
  padding: 15px;
  font-size: .9rem;
  transition: opacity 0.2s ease-in-out;
  justify-content: space-between;
  align-items: center;
  display: flex;
}
.success {
  color: white;
  background: #004AAD;
}

.fail {
  color: white;
  background: crimson;
}

</style>