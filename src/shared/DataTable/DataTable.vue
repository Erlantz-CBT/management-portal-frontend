<template>
  <div :style="rowsData?.tableConfig?.container?.style" :class="rowsData?.tableConfig?.sized ? 'sized' : null" class="datatable-container">
    <div :style="rowsData?.tableConfig?.datatable?.style" :class="rowsData?.tableConfig?.sized ? 'sized' : null" class="datatable">
      <table aria-hidden="true" class="sorted-table">
        <thead>
        <tr>
          <th
              style="position: sticky; top: 0; z-index: 100"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              v-for="column in rowsData.columns"
              :style="column?.style"
              :key="column">
            {{$t(column.label)}}
            <a style="cursor: pointer; margin-left: 10px" v-if="column?.sortable"
               @click="() => _sortColumn(column)"
               :key="column">
              <font-awesome-icon :icon="['fa', sortDirection === 'ASCENDING' ? 'chevron-down' : 'chevron-up']" />
            </a>
          </th>
        </tr>
        </thead>
        <tbody>
        <TransitionGroup :name="data.tableConfig?.animated ? 'row' : null">
          <tr @mouseover="showAction(row)" v-for="(row, index) in rowsData.rows" :key="row">
            <td class="table-row" :style="{'color': settingsStore.colorScheme === 'dark' ? '#E6EAF6' : '#004AAD'}" v-for="col in data.columns" :key="col">
            <span style="white-space: pre-line" v-if="!col.hasActions && col.value !== 'routerLink' && !col?.chip">
              {{ col?.format ? col.format({row, col, value: row[col.value]}) : row[col.value] }}
            </span>
              <span v-if="col.hasActions" :key="col" style="display: flex; justify-content: space-between; color: #9697AA">
                <a
                    @click="(action?.onClick && !action?.disabled) ? action.onClick() : null"
                    v-for="action in row[col.value]"
                    :key="action?.icon"
                >
                  <font-awesome-icon
                      :title="action?.title"
                      :class="action?.disabled ? 'disabled' : null"
                      :style="{'cursor': action?.onClick ? 'pointer' : null}"
                      :icon="action?.icon" />
                </a>
            </span>
              <a
                  :style="col.chip.style(row)"
                  @click="col.chip?.onClick(row)"
                  class="table-chip"
                  :class="col.chip?.onClick ? null : 'disabled'"
                  v-if="col?.chip">
                {{ row[col.value] }}
              </a>
              <span v-if="col.value === 'routerLink'" style="display: grid; justify-content: end">
            <router-link class="table-action" :style="{'visibility': row.visible ? 'visible': 'hidden'}" :key="index" :to="row?.routerLink">
              <span></span>{{ $t('domains.view') }} <font-awesome-icon icon="arrow-right" />
            </router-link>
          </span>
            </td>
          </tr>
        </TransitionGroup>
        </tbody>
      </table>
    </div>
    <div class="pagination" v-if="data.tableConfig?.pagination">
      <p>Items per page: {{ data.tableConfig.pagination.items }}</p>
      <p>
        Page {{pagination.page}}-{{pagination.pages}} of {{pagination.pages}}
      </p>
      <div
          v-if="data.rows.length > rowsData.rows.length"
          style="display: flex; gap: 20px">
        <a
            :class="pagination.page > 1 ? null : 'disabled'"
            style="cursor: pointer"
            @click="_movePage(-1)">
          <font-awesome-icon :icon="['fa', 'chevron-left']" />
        </a>
        <a
            :class="pagination.page < pagination.pages ? null : 'disabled'"
            style="cursor: pointer"
            @click="_movePage(1)">
          <font-awesome-icon :icon="['fa', 'chevron-right']" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent ,reactive, ref, watch} from "vue";
import { useModalStore } from "@/stores/modal";
import {useSettings} from "@/stores/settings";
import {Column} from "@/shared/DataTable/interfaces/Column";

/**
 * Custom datatable component
 */
export default defineComponent({
  name: "DataTable",
  props: ['data'],
  setup(props) {
    const modalStore = useModalStore()
    const settingsStore = useSettings()
    const sortDirection = ref("ASCENDING") // 'ASCENDING' or 'DESCENDING
    const rowsData = reactive({
      tableConfig: {...props.data.tableConfig},
      columns: {...props.data.columns},
      rows: [...props.data.rows]
    })
    // If a pagination is declared, apply on the data provided
    const pagination = ref({
      page: 1,
      pages: 1
    })
    if (props.data?.tableConfig?.pagination) {
      rowsData.rows = props.data.rows.slice(0, props.data.tableConfig.pagination.items)
      pagination.value = {
        page: 1,
        pages: Math.ceil(props.data.rows.length / props.data.tableConfig.pagination?.items)
      }
    }
    // Watch for rows change
    watch(
        () => props.data.rows,
        (data) => {
          if (props.data.tableConfig?.pagination) {
            if ([...data]
                .slice(((pagination.value.page - 1) * props.data.tableConfig?.pagination?.items), (props.data.tableConfig?.pagination?.items * pagination.value.page)).length === 0) {
              pagination.value.page--
            }
            pagination.value.pages = Math.ceil(data.length / props.data.tableConfig.pagination?.items)
            rowsData.rows = [...data]
                .slice(((pagination.value.page - 1) * props.data.tableConfig.pagination.items), (props.data.tableConfig.pagination.items * pagination.value.page))
          }

        }
    )
    return {
      modalStore,
      settingsStore,
      sortDirection,
      rowsData,
      pagination
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
    },
    /**
     * Sort column by a sortable function
     * @param column {Column} Columns to be sorted
     */
    _sortColumn(column: Column) {
      if (this.data.tableConfig?.pagination) {
        this.rowsData.rows = [
            ...column.sortable(this.data.rows, this.sortDirection)]
              .slice(0,
                  this.data.tableConfig.pagination.items
              )
      } else{
        this.rowsData.rows = [...column.sortable(this.data.rows, this.sortDirection)]
      }
      this.sortDirection = this.sortDirection === 'ASCENDING' ? 'DESCENDING' : 'ASCENDING'
    },
    /**
     * Move page by a provided delta
     * @param delta {number} +1/-1
     */
    _movePage(delta: number) {
      this.pagination.page += delta
      const toPage = this.pagination.page * this.data.tableConfig.pagination.items
      this.rowsData.rows = [
          ...this.data.rows
              .slice(
                  (this.data.tableConfig.pagination.items * (this.pagination.page - 1)),
                  toPage
              )
      ]
    }
  }
})

</script>

<style scoped>

.row-enter-active,
.row-leave-active {
  transition: all 150ms linear;
}
.row-enter-from,
.row-leave-to {
  opacity: 0;
}

.datatable-container {
  border: solid 2px #E6EAF6;
  border-radius: 10px;
  position: relative;
  padding: 0 10px 10px 5px;
}

table {
  border-spacing: 0;
}

.datatable {
  width: 100%;
  display: block;
  overflow: auto;
  text-align: start;
  position: relative;
}

.datatable-container.sized {
  height: calc(100vh - 211px);
}

.datatable.sized {
  height: calc(100% - 35px);
}

.datatable::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.datatable::-webkit-scrollbar-button {
  width: 30px;
}
.datatable::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.datatable::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
.datatable::-webkit-scrollbar-thumb:active {
  background: #000000;
}
.datatable::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  margin-top: 30px;
  border-radius: 50px;
}
.datatable::-webkit-scrollbar-track:hover {
  background: #666666;
}
.datatable::-webkit-scrollbar-track:active {
  background: #333333;
}
.datatable::-webkit-scrollbar-corner {
  background: transparent;
}

.datatable > table {
  table-layout: fixed;
  width: 100%;
}

.datatable-container > .pagination {
  position: absolute;
  display: flex;
  gap: 40px;
  bottom: 15px;
  left: 15px;
  font-size: 12px;
}

.pagination {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.table-chip.disabled {
  pointer-events: none;
}

thead tr th.dark {
  border-bottom: solid 1px #ffffff;
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

tbody > tr > * {
  border-bottom: solid 1px #979797;
  color: #004AAD;
  padding: 10px;
  opacity: 1;
}

tbody > tr:last-child > * {
  border-bottom: none;
}

.table-chip {
  width: 100%;
  display: block;
  border-radius: 10px;
  background-color: #D9DBF1;
  color: #0F0F0F;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  padding: 3px;
  text-transform: capitalize;
}


</style>