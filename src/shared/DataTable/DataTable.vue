<template>
  <table v-if="data.rows" aria-hidden="true" class="datatable sorted-table">
    <thead>
    <tr>
      <th v-for="column in data.columns" :style="column?.style" :key="column">
        {{column.label}}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr @mouseover="showAction(row)" class="table-row" v-for="(row, index) in data.rows" :key="row">
      <td v-for="col in data.columns" :key="col">
          <span v-if="!col.hasActions && col.value !== 'routerLink'">
            {{ row[col.value] }}
          </span>
        <span v-if="col.hasActions" style="display: flex; justify-content: space-between; color: #9697AA">
            <font-awesome-icon :style="{'cursor': action?.onClick ? 'pointer' : null}" v-for="action in row[col.value]" @click="action?.onClick ? action.onClick() : null" :key="action" :icon="action?.icon" />
        </span>
<!--        <span v-if="col.value !== 'actions' && col.hasActions" style="display: flex; justify-content: space-between; color: #9697AA">-->
<!--          <font-awesome-icon :icon="row[col.value][0]?.icon" />-->
<!--        </span>-->
        <span v-if="col.value === 'routerLink'" style="display: grid; justify-content: end">
            <router-link class="table-action" :style="{'visibility': row.visible ? 'visible': 'hidden'}" :key="index" :to="`/domains/${row?.id}`">
              <span></span>View <font-awesome-icon icon="arrow-right" />
            </router-link>
          </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts">

import {defineComponent, watch} from "vue";
import { useModalStore } from "@/stores/modal";
import {useRouter} from "vue-router";

/**
 * Custom datatable component
 */
export default defineComponent({
  name: "DataTable",
  props: ['data'],
  setup() {
    const modalStore = useModalStore()
    const router = useRouter()
    return {
      modalStore,
      router
    }
  },
  methods: {
    /**
     * Show the action for the selected row
     * @param row {any} Selected row
     */
    showAction: function (row: any) {
      this.data.rows.map((d: { visible: boolean; }) => d.visible = false)
      row.visible = true;
    }
  }
})

</script>

<style scoped>

table {
  border-spacing: 0;
}

.datatable {
  width: 100%;
  /*height: 294px;*/
  border-radius: 10px;
  border: solid 1.5px #E6EAF6;
  text-align: start;
  padding: 10px;
  table-layout: fixed;

}

thead tr th {
  border-bottom: solid 1px black;
  border-collapse: collapse;
  padding: 7px;
}

table > th, table > thead{
  text-align: left;
}

.table-action {
  visibility: visible;
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 91px;
  padding: 3px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  font-family: Poppins,sans-serif;
  font-weight: bold;
  justify-self: end;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
}

tbody > tr > td {
  border-bottom: solid 1px #979797;
  color: #004AAD;
  padding: 7px;
}

</style>