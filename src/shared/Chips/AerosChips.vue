<template>
  <div class="chip-container">
    <div class="chip" v-for="(chip, i) of chips" :key="chip.label">
      {{chip}}
      <i @click="deleteChip(i)"><font-awesome-icon style="font-size: 16px; display: flex" icon="xmark" /></i>
    </div>
    <input v-model="currentInput" @keypress.enter="saveChip" @keydown.delete="backspaceDelete">
    <span class="placeholder" v-if="chips.length == 0 && currentInput == ''">Requirements</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "AerosChips",
  props: {
    set: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chips:[] as string[],
      currentInput: '' as string
    }
  },
  methods: {
    saveChip() {
      ((this.set && this.chips.indexOf(this.currentInput) === -1) || !this.set) && this.chips.push(this.currentInput);
      this.currentInput = '';
    },
    deleteChip(index: any) {
      this.chips.splice(index, 1);
    },
    backspaceDelete(which: any) {
      which == 8 && this.currentInput === '' && this.chips.splice(this.chips.length - 1);
    }
  },
})
</script>

<style scoped>

.chip-container {
  position: relative;
  width: 298px;
  height: 170px;
  padding: 3px;
  overflow-y: auto;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  align-content: start;
}

.chip-container .placeholder {
  position: absolute;
  left: 7px;
  top: 7px;
  color: #757575;
  z-index: 1;
  font-size: 17px;
}
.chip-container .chip {
  border-radius: 10px;
  background: #004AAD;
  color: #FFFFFF;
  height: 30px;
  padding: 15px;
  font-family: Poppins;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin: 0 3px 3px 0;
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


</style>