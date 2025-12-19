<template>
  <h3>
    {{ data.header }}
  </h3>
  <div class="items">
    <ul class="item-list">
      <li v-for="item in data.data" :key="item"><p>{{item}}</p></li>
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

h3 {
  max-width: 90%;
  justify-self: center;
}


.item-list {
  list-style: none;
  text-align: left;
  padding-left: 0;
}

</style>