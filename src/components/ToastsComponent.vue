<template>
  <div class="toast-container">
    <div class="toast" :ref="(el) => {registerRemove(el, index)}" :class="toast.success ? 'success' : 'fail'" style="margin-top: 10px" v-for="(toast, index) in toasts" :key="toast">
      {{toast.label}}
      <font-awesome-icon
          style="margin-left: 10px; cursor: pointer"
          aria-placeholder="Remove"
          :icon="['fas', 'xmark']"
          @click="(event) => manualRemove(index, event.target)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watchEffect} from "vue";
import {useToastsStore} from "@/stores/toasts";

export default defineComponent({
  name: "ToastsComponent",
  setup: () => {
    const toastsStore = useToastsStore()
    const toasts = reactive(toastsStore.toasts)
    return {
      toastsStore,
      toasts
    }
  },
  methods: {
    registerRemove(el: any, index: number) {
      if (el){
        setTimeout(() => {
          el.style.opacity = 1
        }, 100)
        setTimeout(() => {
          el.style.opacity = 0
          this.removeToast(index)
        }, 3000)
      }
    },
    removeToast(index: number) {
      setTimeout(() => {
        this.toastsStore.removeToast(index)
      }, 1000)
    },
    manualRemove(index: number, el: any) {
      el.parentNode.parentNode.style.opacity = 0;
      setTimeout(() => {
        this.toastsStore.removeToast(index)
      }, 500)
    }
  }
})
</script>

<style scoped>

.toast-container {
  position: absolute;
  width: 100vw;
  justify-content: center;
  top: 0;
  display: grid;
  align-content: end;
  padding-bottom: 10px;

}

.toast {
  margin-top: 10px;
  border-radius: 10px;
  padding: 10px;
  font-size: .8rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
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