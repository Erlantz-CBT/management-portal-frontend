<template>
  <div class="modal-container">
    <h3>{{selectedType}} anomaly detection parameters</h3>
    <p>IE: {{selectedIE.IE.hostname}}</p>
    <div class="input-container">
      <b>Threshold Anomaly: {{selectedIE.IE[selectedParam].toleranceThresholdAnomaly}}</b>
      <div style="position: relative; width: 100%">
        <input
            class="stepper-input"
            id="ie_anomaly"
            name="ie_elements"
            type="range"
            step="0.1"
            v-model="selectedIE.IE[selectedParam].toleranceThresholdAnomaly"
            min="0" max="1">
      </div>
      <b>Threshold Normal: {{selectedIE.IE[selectedParam].toleranceThresholdNormal}}</b><input
        class="stepper-input"
        id="ie_normal"
        name="ie_normal"
        type="range"
        step="0.1"
        v-model="selectedIE.IE[selectedParam].toleranceThresholdNormal"
        min="0" max="1">
      <b>Window Anomaly: {{selectedIE.IE[selectedParam].windowAnomaly}}</b><input
        class="stepper-input"
        id="ie_window_anomaly"
        name="ie_normal"
        type="range"
        step="1"
        v-model="selectedIE.IE[selectedParam].windowAnomaly"
        min="0" max="10">
      <b>Window Normal: {{selectedIE.IE[selectedParam].windowNormal}}</b><input
        class="stepper-input"
        id="ie_window_normal"
        name="ie_normal"
        type="range"
        step="1"
        v-model="selectedIE.IE[selectedParam].windowNormal"
        min="0" max="10">
    </div>
    <div style="display: flex; justify-content: space-between; align-items: end">
      <button @click="$emit('back')" class="cancel">Back</button>
      <button @click="$emit('confirm', selectedIE)" class="confirm">Confirm</button>
    </div>
  </div>
</template>

<script>
import {useSettings} from "../../stores/settings";
import {useLoaderStore} from "../../stores/loader";
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "UpdateIECapabilities",
  props: {
    IE: Object,
    anomaly: String,
    type: String
  },
  setup: (props) => {
    console.log(props)
    const settingsStore = useSettings()
    const loaderStore = useLoaderStore()
    const selectedIE = ref(JSON.parse(JSON.stringify(props.IE)))
    const selectedParam = ref(props.anomaly)
    const selectedType = ref(props.type)
    return {
      settingsStore,
      loaderStore,
      selectedIE,
      selectedParam,
      selectedType
    }
  }
})
</script>

<style scoped>
.modal-container {
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 20px;
  height: 100%;
}

.input-container {
  display: grid;
  grid-template-columns: 40% auto;
  row-gap: 15px;
  justify-items: start;
  align-items: center;
}

.stepper-input {
  height: 40px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-input[type=email]:invalid {
  border: 1px solid #b72121
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

input:disabled {
  opacity: 0.7;
}
</style>