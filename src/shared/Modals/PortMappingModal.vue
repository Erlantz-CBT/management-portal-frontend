<template>
  <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">
    IE {{data.index}} Network ports
  </h3>
  <div class="requirements">
    <div class="requirement" v-for="(port, index) in portMappings" :key="port">
      <select
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          style="width: 80px"
          v-model="port.protocol"
          name="protocol"
          class="stepper-input"
          id="protocol">
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
            }"
            value="TCP">TCP</option>
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
            }"
            value="UDP">UDP</option>
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
            }"
            value="SCTP">SCTP</option>
      </select>
      <input
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="stepper-input"
          v-model="port.portNumber"
          type="number"
          placeholder="Port">
      <a class="remove" @click="removePort(index)">
        <font-awesome-icon icon="trash"></font-awesome-icon>
      </a>
    </div>
    <button class="stepper-btn"  @click="addPortMapping()">New network port</button>
  </div>
  <div style="display: flex; justify-content: space-between; width: 100%">
    <button @click="$emit('back')" class="confirm">Back</button>
    <button @click="$emit('confirm', {data: portMappings, index: data.index, field: 'networkPorts'})" class="cancel">Save</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {useSettings} from "@/stores/settings";

interface Port {
  portNumber: number | null,
  protocol: string | null
}

export default defineComponent({
  name: "PortMappingModal",
  props: ['data'],
  setup: (props) => {
    const settingsStore = useSettings()
    const iePorts = props.data.service?.fields.find((f: { fieldName: string; }) => f.fieldName === "networkPorts")?.field
    const portMappings = reactive([...iePorts] as Port[])
    return {
      portMappings,
      settingsStore
    }
  },
  methods: {
    addPortMapping() {
      this.portMappings.push({
        portNumber: null,
        protocol: 'TCP'
      } as Port)
    },
    removePort(index: number) {
      this.portMappings.splice(index, 1)
    }
  }
})
</script>

<style scoped>


.confirm , .cancel {
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  /*margin-top: 10px;*/
  cursor: pointer;
  font-weight: bold;
}

.confirm {
  background: #D9DBF1;
  color: #004AAD;
}

.cancel {
  background: #004AAD;
  color: #FFFFFF;
}

.remove {
  display: grid;
  align-items: center;
}

.stepper-input {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-btn {
  background: #004AAD;
  color: #FFFFFF;
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 298px;
  margin-top: 10px;
}

.stepper-btn:disabled,
.stepper-service-type:disabled + label.toggle {
  background: #8E9DCC;
  cursor: not-allowed;
}

.requirement {
  display: flex;
  gap: 15px;
}

.requirements {
  overflow: auto;
  height: calc(100% - 60px);
  padding: 10px;
}

</style>