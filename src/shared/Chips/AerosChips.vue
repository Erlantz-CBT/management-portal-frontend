<template>
  <div class="chip-container">
    <div class="chip-select-container">
      <select
          v-if="chips.length < opts.length - 1"
          name="chipSelect"
          v-model="currentInput"
          @change="saveChip"
          aria-placeholder="Select a component"
          id="chipSelect">
        <option value="" disabled selected>Select a {{ type }}</option>
        <option
            style="text-transform: capitalize"
            v-for="(component, i) in opts"
            :disabled="component.id === componentId || chips.some(e => e.component.id === component.id)"
            :key="component"
            :value="{component: component, index: i + 1}">
          {{ type }} {{ i + 1 }} / {{component.fields.find(f => f.fieldName === 'name').field}}
        </option>
      </select>
    </div>
    <!-- Component selection visible only if not all options are selected -->
    <div class="chip" v-for="(chip, i) of chips" :key="chip.label">
      <span style="text-transform: capitalize">{{ type }} {{chip.index}} / {{chip.component.fields.find(f => f.fieldName === 'name').field}}</span>
      <i @click="deleteChip(i, chip)"><font-awesome-icon style="font-size: 16px; display: flex" icon="xmark" /></i>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {useEventBus} from "@/stores/eventbus";

export default defineComponent({
  // TODO: chips add/remove works well, need to tie to a new specific field (connections?)
  name: "AerosChips",
  props: {
    set: {
      type: Boolean,
      default: true
    },
    opts: {
      type: Array,
      default: () => {return []}
    },
    connections: {
      type: Array,
      default: () => {return []}
    },
    componentIndex: {
      type: Number
    },
    componentId: {
      type: Number
    },
    type: {
      type: String
    }
  },
  data() {
    const eventBus = useEventBus();
    eventBus.on("component-added", (result: any) => {
      const index = result.remoteIndex
      this.addComponentFromRemote(result, index)
    })
    eventBus.on("component-removed", (result: any) => {
      this.removeComponentFromRemote(result)
    })
    return {
      chips:[...this.connections] as any[],
      currentInput: '' as string,
      eventBus
    }
  },
  methods: {
    saveChip() {
      ((this.set && this.chips.indexOf(this.currentInput) === -1) || !this.set) && this.chips.push(this.currentInput);
      this.eventBus.emit("component-added", {component: this.currentInput, remoteIndex: this.componentIndex})
      this.currentInput = '';
      this.$emit('value-change', this.chips)
    },
    deleteChip(index: any, component: any) {
      this.eventBus.emit("component-removed", {component: component, fromElement: this.componentId})
      this.chips.splice(index, 1);
    },
    addComponentFromRemote(addedElement: any, remoteIndex: any) {
      if (addedElement.component?.component?.id === this.componentId) {
        const options: any = this.opts
        const findElement = options[remoteIndex]
        this.chips.push({component: findElement, index: remoteIndex + 1})
        this.$emit('value-change', this.chips)
      }

    },
    removeComponentFromRemote(removedElement: any) {
      const removedId = removedElement.component.component.id
      const fromElement = removedElement.fromElement
      // If a component has a connection with the removed element, remove the component from the other connections
      if (removedId === this.componentId) {
        this.chips = this.chips.filter((c) => c.component.id !== fromElement)
      }
      this.$emit('value-change', this.chips)
    }
  },
})
</script>

<style scoped>

.chip-container {
  position: relative;
  height: 170px;
  padding: 3px;
  overflow-y: auto;
  margin-top: 10px;
  border-radius: 10px;
  border: solid 1.5px #E6EAF6;
  outline: none;
  display: flex;
  /*flex-direction: column;*/
  flex-wrap: wrap;
  align-content: start;
}
.chip-container .chip {
  border-radius: 10px;
  background: #004AAD;
  color: #FFFFFF;
  height: 35px;
  padding: 15px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-left: 3px;
}
.chip-container .chip i {
  cursor: pointer;
  opacity: 0.56;
  margin-left: 8px;
}
.chip-container input {
  flex: 1 1 auto;
  width: 30px;
  border: none;
  outline: none;
  padding: 4px;
  background: transparent;
  z-index: 2;
}

.chip-container .chip-select-container .chip {
  display: flex;
  justify-self: left;
  margin-bottom: 3px;
}

.chip-container select {
  /*width: 298px;*/
  /*height: 40px;*/
  /*margin-top: 10px;*/
  flex: 1 1 auto;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

</style>