<template>
  <div class="modal-container">
    <h3>Run a benchmark from Geekbench</h3>
    <div>
      <input
          type="url"
          pattern="https://browser.geekbench.com/.*"
          class="search-input"
          @input="(e) => _invalidUrl(e)"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          placeholder="Type a valid Geekbench URL"
          v-model="geekbenchUrl"
      >
    </div>
    <div style="display: flex; justify-content: space-between; align-items: end">
      <button @click="$emit('back')" class="cancel">Back</button>
      <button :disabled="invalidUrl" @click="$emit('confirm', geekbenchUrl)" class="confirm">Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useSettings} from "@/stores/settings";

export default defineComponent({
  name: "NewBenchmarkFromGeekbench",
  setup: () => {
    const geekbenchUrl: any = ref(null)
    const invalidUrl = ref(true)
    const settingsStore = useSettings()
    return {
      geekbenchUrl,
      settingsStore,
      invalidUrl
    }
  },
  methods: {
    _invalidUrl(e: any) {
      this.invalidUrl = e.target.validity.patternMismatch || this.geekbenchUrl.length === 0
    }
  }

})
</script>

<style scoped>

.modal-container {
  display: grid;
  grid-template-rows: 33% 33% 33%;
  height: 100%;
}

.search-input {
  display: flex;
  gap: 5px;
  width: 100%;
  color: #004AAD;
  align-items: center;
  outline: none;
  height: 46px;
  border-radius: 10px;
  border: 1px solid #979797;
  padding: 10px;
}

.confirm , .cancel {
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  cursor: pointer;
  font-weight: bold;
}

.cancel {
  background: #D9DBF1;
  color: #004AAD;
}

.confirm {
  background: #004AAD;
  color: #FFFFFF;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


</style>