<template>
  <h3>
    {{ header }}
  </h3>
  <div class="detail">
    <ul class="details-list">
      <li v-for="item in data" :key="item">
        <b>
          <font-awesome-icon :icon="item?.icon"/>
          {{item.label}}:
        </b>
        <span :style="settingsStore.colorScheme === 'light' ? {'color': '#000000'} : null">{{item.value}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">


import {defineComponent, PropType} from "vue";
import {useSettings} from "@/stores/settings";

interface Detail {
  label: string,
  value: string | number,
  icon?: string
}

export default defineComponent({
  name: "DetailsModal",
  props: {
    header: String as PropType<string>,
    data: Array as PropType<Array<Detail>>
  },
  setup: () => {
    const settingsStore = useSettings()
    return {settingsStore}
  }
})
</script>

<style scoped>

.details-list {
  list-style: none;
  padding-left: 0;
  text-align: left;
}

.details-list > li {
  padding-bottom: 15px;
}

</style>