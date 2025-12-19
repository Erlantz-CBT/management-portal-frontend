<template>
  <h3>
    IE {{data.index}} CLI arguments/ENV variables
  </h3>
  <div class="requirements">
    <div class="requirement" v-for="(requirement, index) in requirements" :key="requirement">
      <select style="width: 65px" v-model="requirement.type" name="type" class="stepper-input" id="type">
        <option value="CLI">CLI</option>
        <option value="ENV">ENV</option>
      </select>
      <input class="stepper-input" v-model="requirement.key" type="text">
      <input class="stepper-input" v-model="requirement.value" type="text">
      <a class="remove" @click="removeRequirement(index)">
        <font-awesome-icon icon="trash"></font-awesome-icon>
      </a>
    </div>
    <button class="stepper-btn"  @click="addRequirement()">New CLI arg/ENV variable</button>
  </div>
  <div style="display: flex; justify-content: space-between; width: 100%">
    <button @click="$emit('back')" class="confirm">Back</button>
    <button @click="$emit('confirm', {data: requirements, index: data.index, field: 'arguments'})" class="cancel">Save</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";

interface Requirement {
  key: string | null;
  value: any;
  type: string | null;
}

export default defineComponent({
  name: "RequirementsModal",
  props: ['data'],
  data () {
    const ieRequirements = this.data.service?.fields.find((f: { fieldName: string; }) => f.fieldName == "arguments")?.field
    const requirements = reactive([...ieRequirements] as Requirement[])
    return {
      requirements
    }
  },
  methods: {
    addRequirement() {
      this.requirements.push({
        key: null,
        value: null,
        type: 'CLI'
      } as Requirement)
    },
    disableAdd(): boolean {
      if (this.requirements.length > 0) {
        return this.requirements.pop()?.key == null || this.requirements.pop()?.value == null
      } else {
        return false
      }
    },
    removeRequirement(index: number) {
      this.requirements.splice(index, 1)
    }
  }
})

</script>

<style scoped>

h2, h3, p {
  color: #004AAD;
}

.confirm , .cancel {
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  margin-top: 10px;
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
  width: 40%;
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

.requirements {
  overflow: auto;
  height: 260px;
}

.requirement {
  display: flex;
  justify-content: space-evenly;
}

</style>