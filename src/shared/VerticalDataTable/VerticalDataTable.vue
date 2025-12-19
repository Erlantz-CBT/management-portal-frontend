<template>
  <div :style="rowsData?.tableConfig?.container?.style" :class="rowsData?.tableConfig?.sized ? 'sized' : null" class="datatable-container">
    <div :style="rowsData?.tableConfig?.datatable?.style" :class="rowsData?.tableConfig?.sized ? 'sized' : null" class="datatable">
      <table aria-hidden="true" class="sorted-table">
        <thead>
          <tr>
            <th
                style="position: sticky; top: 0; "
                :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            >
            </th>
            <th
                style="position: sticky; top: 0; text-align: left"
                :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                v-for="column in rowsData.columns"
                :key="column"
            >
              {{$t(column.label)}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(row, rowIndex) in rowsData.rows" :key="row">
              <ul>
                <li
                    v-for="(col, colIndex) in row"
                    :key="col"
                    :style="{'color': settingsStore.colorScheme === 'dark' ? '#E6EAF6' : '#004AAD'}"
                    :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                    class="table-row">
                  <div>
                    <font-awesome-icon
                        :style="{'color': _compare(rowIndex, colIndex, col.value)?.color}"
                        v-if="(rowIndex === 1 || rowIndex === 2) && compareIE.IE.length > 0"
                        style="font-size: 16px; justify-self: right"
                        :icon="_compare(rowIndex, colIndex, col.value)?.icon" />
                    {{col.value}}
                  </div>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script lang="ts">

import {computed, defineComponent, reactive, watch} from "vue";
import {useSettings} from "@/stores/settings";
import {useDomainStore} from "@/stores/domain";
import {useBenchmarkingStore} from "@/stores/benchmarking";

export default defineComponent({
  name: "VerticalDataTable",
  props: ['data'],
  setup(props) {
    const settingsStore = useSettings()
    const compareIE = reactive({IE: [] as any})
    const rowsData = computed(() => {
      return {
        tableConfig: {...props.data.tableConfig},
        columns: {...props.data.columns},
        rows: [...props.data?.rows || []]
      }
    })
    watch(
        () => props.data?.compare,
        (compare) => {
          // Reset the compare value if no benchmark has been selected to compare
          if(!compare) {
            compareIE.IE = []
          }
          if(compare?.benchmark?.value) {
            if(compare.type.value === 'cpu') {
              compareIE.IE = [
                (() => Object.keys(compare.benchmark.value.data.singleCoreResults))()
                    .map(v => {
                      return {value: v}
                    }),
                (() => {
                  return Object.keys(compare.benchmark.value.data.singleCoreResults)
                      .map((d: any) => {
                            return {
                              value: compare.benchmark.value.data.singleCoreResults[d as keyof object]
                            }
                          }
                      )
                })(),
                (() => {
                  return Object.keys(compare.benchmark.value.data.multiCoreResults)
                      .map((d: any) => {
                            return {
                              value: compare.benchmark.value.data.multiCoreResults[d as keyof object]
                            }
                          }
                      )
                })()
              ]
            }
            if(compare.type.value === 'network') {
              compareIE.IE = [(() => Object.keys(compare.benchmark.value.data?.tests[0]))()
                  .filter(key => key !== 'conectionType')
                  .map(v => {
                    return {value: v}
                  }),
                  (() => {
                    return Object.keys(compare.benchmark.value.data?.tests[0])
                        .filter(key => key !== 'conectionType')
                        .map((d: any) => {
                              return {
                                value: compare.benchmark.value.data?.tests[0][d as keyof object]
                              }
                            }
                        )
                  })(),
                  (() => {
                    return Object.keys(compare.benchmark.value.data?.tests[0])
                        .filter(key => key !== 'conectionType')
                        .map((d: any) => {
                              return {
                                value: compare.benchmark.value.data?.tests[1][d as keyof object] || "---"
                              }
                            }
                        )
                  })()]
            }
          }
        },
        {
          deep: true
        }
    )
    return {
      settingsStore,
      rowsData,
      compareIE
    }
  },
  methods: {
    _compare(index: number, rowIndex: number, col: number | string) {
      const match = this.compareIE.IE[index][rowIndex]
      let matchValue = match.value
      let colValue = col
      if (typeof match.value === 'string' && typeof col === 'string') {
        const [rep, colRep] = [
            match.value.match(/\d+(\.\d+)?/g),
            col.match(/\d+(\.\d+)?/g)
        ]
        if (rep) matchValue = +rep[0]
        if (colRep) colValue = +colRep[0]
      }
      if(col === '---') {
        return null
      }
      if(matchValue > colValue) {
        return {
          icon: 'arrow-down',
          color: '#F44336'
        }
      }
      if(matchValue === colValue) {
        return {
          icon: 'equals',
          color: '#1E88E5'
        }
      }
      return {
        icon: 'arrow-up',
        color: '#4CAF50'
      }
    }
  }
})
</script>

<style scoped>

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
  height: 100%;
  display: block;
  overflow: auto;
  text-align: start;
  max-height: 200px;
  position: relative;
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

thead tr th.dark {
  border-bottom: solid 1px #ffffff;
}

thead tr th {
  border-bottom: solid 1px black;
}

td {
  padding: 0;
  vertical-align: baseline;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

th,
li.table-row {
  padding: 5px 0 5px 0;
}

li.table-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

li.light.table-row {
  border-bottom: solid 1px black;
}

li.dark.table-row {
  border-bottom: solid 1px #ffffff;
}

li.table-row:last-child {
  border-bottom: none;
}

</style>