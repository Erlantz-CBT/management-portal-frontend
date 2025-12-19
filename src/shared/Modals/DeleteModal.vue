<template>
  <h3>
    Delete service
  </h3>
  <p style="height: 150px">
    Are you sure to delete Service <b>{{data}}</b>?
  </p>
  <div style="display: flex; justify-content: space-between">
    <button @click="$emit('back')" class="cancel">Back</button>
    <button @click="$emit('confirm', data)" class="confirm">Confirm</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DeleteModal",
  props: ['data']
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


</style>