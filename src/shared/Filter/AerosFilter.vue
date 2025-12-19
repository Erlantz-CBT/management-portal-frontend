<template>
  <div class="filters">
    <div
        v-for="filter in fts"
        :key="filter"
        class="filter"
    >
      <div
          class="search-input"
          v-if="filter.type === 'input'"
      >
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        <input
            style="border: none; outline: none"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            :placeholder="$t(filter.label)"
            v-model="filter.value"
            @input="_filterValues(filter)"
            type="text"
        >
      </div>
      <select
          class="search-select"
          :aria-disabled="values.length === 0"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          v-if="filter.type === 'select'"
          v-model="filter.value"
          @change="_filterValues(filter)"
          :id="fselect">
        <option
            selected
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
            :value="null"
        >{{$t(filter.label)}}
        </option>
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
            v-for="option in filter?.options"
            :key="option"
            :value="option.value"
        >
          {{option.value}}
        </option>
      </select>
    </div>
    <a v-if="!emptyFilters" style="cursor: pointer" @click="_clearFilters()">
      <font-awesome-icon :icon="['fas', 'trash']" /> {{ $t("filter.clear") }}
    </a>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, reactive, ref, defineEmits, watch} from "vue";
import {useSettings} from "@/stores/settings";
import CUSTOM_EVENTS from "@/constants/events";
import {Filter} from "@/shared/Filter/interfaces/Filter";

/**
 * Dynamic multi-filter
 * A Pinia store can be passed, to listen to the store changes
 * Within a store, a list of actions has to be passed in order to update the values
 * If no customCondition is provided
 * the base condition will be: value === values[key]
 * The filter emits 3 events:
 * 'result': Needed for retrieve the result of the filter -> Array of values
 * (OP) 'filterChange': In case you need to listen to the change of a filter -> Filter change
 * (OP) 'isEmpty': Emitted when all the values in the filter are empty -> boolean
 */
export default defineComponent({
  name: "AerosFilter",
  props: {
    filters: Array as PropType<any>,
    values: Array as PropType<any>,
    store: Object as PropType<any>,
    actions: Array as PropType<any>
  },
  setup: (props, {emit}) => {
    const settingsStore = useSettings()
    const fts = reactive([...props.filters] as Filter[])
    // Clear filter values
    fts.forEach(f => f.value = null)
    const vls = reactive({
      values: [...props.values],
      originalValues: [...props.values]
    })
    // If a store is passed, update the local values of the filter
    props?.store?.$onAction(({name, after}: any) => {
      // Update the values only for the declared actions
      if (props.actions.find((a: string) => a === name)) {
        after((result: any) => {
          vls.values = [...result]
          vls.originalValues = [...result]
          // Once the value in the store is updated, emit the update result
          fts.forEach((f: Filter) => _filterValues(f))
        })
      }
    })

    const vlsList = computed(() => vls)
    const emptyFilters = ref(true)
    const results = ref(vls.values.length)
    const _filterValues = (filter: Filter) => {
      // On filter change, emit a filterChange event, in case is needed
      emit(CUSTOM_EVENTS.filter.change, filter)
      emptyFilters.value = fts.every(f => f.value == null || f.value == "")
      emit(CUSTOM_EVENTS.filter.isEmpty, emptyFilters.value)
      const checkIfAllEmpty = fts.every(f => !f?.value)
      // In case all the filter are empty, clear the values
      if(checkIfAllEmpty) {
        results.value = vlsList.value.values.length
        emit(CUSTOM_EVENTS.filter.result, vlsList.value.originalValues)
        emit(CUSTOM_EVENTS.filter.isEmpty, true)
        emptyFilters.value = true
      }
      //  Create an array of condition
      const conditions = fts?.map((f: any) => {
        if (f?.value) {
          let condition: any = (value: any) => {
            if (filter?.caseSensitive) {
              return f?.value == value[f.key]?.substring(0, f?.value?.length)
            }
            return f?.value?.toUpperCase() == value[f.key]?.substring(0, f?.value?.length).toUpperCase()
          }
          if (f?.customCondition) {
            condition = (value: any) => f.customCondition(value, f)
          }
          return condition
        } else {
          return null
        }
      }).filter(c => c !== null)
      //  Filter the values
      const checkConditions = [...vlsList.value.values]
          .filter(((v: any) => conditions?.every((condition: any) => condition(v))))
      // Emit the result
      results.value = checkConditions.length
      emit(CUSTOM_EVENTS.filter.result, checkConditions)
    }

    return {
      settingsStore,
      fts,
      vls,
      vlsList,
      results,
      emptyFilters,
      _filterValues
    }
  },
  methods: {
    _clearFilters() {
      this.fts.forEach(f => f.value = null)
      this.results = this.vlsList.values.length
      this.$emit(CUSTOM_EVENTS.filter.result, this.vlsList.originalValues)
      this.$emit(CUSTOM_EVENTS.filter.isEmpty, true)
      this.emptyFilters = true
    }
  }
})
</script>

<style scoped>

.filters {
  display: flex;
  gap: 20px;
  justify-items: left;
  align-items: center;
  width: 100%;
  flex-flow: row wrap;
}

.search-select,
.search-input {
  display: flex;
  gap: 5px;
  align-items: center;
  outline: none;
  padding: 5px;
  height: 38px;
}

.search-select {
  border-radius: 10px;
  border: 1px solid #979797;
}

.search-input {
  border-bottom: 1px solid #979797;
}

</style>