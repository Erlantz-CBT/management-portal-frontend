<template>
  <div :key="$route.name" v-show="$route.name === 'domains'" class="container">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{ $t('domains.domainsList') }}</h2>
    </div>
    <div class="domains" v-if="!hasError && table.tableData.rows">
      <DataTable :data="table.tableData" />
    </div>
    <ErrorComponent v-if="hasError" @reload="async () => await fetchDomains()" />
  </div>
  <router-view :key="$route.fullPath" />
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import DataTable from "@/shared/DataTable/DataTable.vue";
import ErrorComponent from "@/shared/ErrorComponent.vue";
import {useDomainStore} from "@/stores/domain";
import { useToastsStore } from "@/stores/toasts";
import {useSettings} from "@/stores/settings";

interface Domain {
  name: string,
  id: string,
  description: string,
  owner: Array<string>,
  entrypoint: boolean,
  location: string,
  status: string,
  publicURL: string,
  visible?: boolean;
  routerLink?: string;
  actions?: Array<string>
}

export default defineComponent({
  name: "DomainsComponent",
  components: {
    DataTable,
    ErrorComponent
  },
  setup: () => {
    const store = useDomainStore()
    const toastStore = useToastsStore()
    const settingsStore = useSettings()
    const hasError = ref(false)
    const table = reactive({
      tableData: {
        tableConfig: {
          sized: true,
          pagination: {
            items: 15
          }
        },
        sortKey: '',
        columns: [
          {label: 'Id', value: 'id', style: {'width': '10%'}},
          {label: 'domains.description', value: 'description', style: {'width': '20%'}},
          {label: 'domains.publicUrl', value: 'publicUrl', style: {'width': '30%'}},
          {label: 'domains.owner', value: 'owner', style: {'width': '10%'}},
          {label: 'domains.entrypoint', value: 'actions', hasActions: true, style: {'width':'10%' }},
          {label: 'domains.status', value: 'status', style: {'width': '15%'}},
          {label: '', value: 'routerLink', routerLink: true, style: {'width': '5%'}}
        ],
        rows: null
      }
    })
    const fetchDomains = async() => {
      table.tableData.rows = await store.fetchDomains()
          .then((res) => {
            if (res.data.length > 0) {
              res.data[0].visible = true;
            }
            res.data.map((d: any) => {
              const owners = d.owner.map((owner: string) => owner.split(":Organization:")[1])
              d.owner = owners.join()
              d.id = d.id.split(":Domain:")[1]
              d.routerLink = `/domains/domain/${d.id}`
              d.status = d.domainStatus.split(":DomainStatus:")[1]
              d.actions = d.entrypoint? [{icon: 'check'}] : [{icon: 'xmark'}]
            })
            store.domains = res.data
            hasError.value = false
            return res.data
          })
          .catch(err => {
            hasError.value = true;
            toastStore.appendToast(
                {
                  label: `Looks like something went wrong: ${err?.message}`,
                  success: false,
                  data: {},
                  autoRemove: false
                })
          })
    }
    onMounted(async () => {
      await fetchDomains()
    })
    return {
      table,
      hasError,
      settingsStore,
      fetchDomains
    }
  }
});
</script>

<style scoped>

h2 {
  color: #004AAD;
}

.domains {
  justify-self: center;
  align-self: start;
}

</style>