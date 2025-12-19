<template>
  <div style="display: grid; height: 100vh; width: 100%">
    <h2>{{ $t('wip.workInProgress') }} <font-awesome-icon :icon="['fa', 'screwdriver-wrench']" /></h2>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "WIPComponent"
})
</script>

<style scoped>

h2 {
  align-self: center;
  justify-self: center;
}

</style>