<template>
  <span class="error">Something went wrong, try to <a class="reload" @click="$emit('reload')">Reload <font-awesome-icon :icon="['fa', 'rotate']" /></a> </span>
</template>

<script lang="ts">
import {defineComponent} from "vue";

/**
 * Simple network error handler component
 */
export default defineComponent({
  name: "ErrorComponent"
})
</script>

<style scoped>

.error {
  font-weight: bold;
  display: flex;
  align-items: center;
  height: calc(100vh - 305px);
}

.reload {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 115px;
  height: 30px;
  padding: 3px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-left: 5px;
  transition: opacity 0.2s ease-in-out;
}

</style>