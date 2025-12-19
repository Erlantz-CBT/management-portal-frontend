<template>
  <h3>
    {{ data.header }}
  </h3>
  <div class="items">
    <ul class="item-list">
      <li v-for="item in data.data" :key="item">{{item}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ReadOnlyDataModal",
  props: ['data']
})
</script>

<style scoped>

h2, h3, p {
  color: #004AAD;
}

.item-list {
  list-style: none;
  text-align: left;
  padding-left: 0;
}

</style>