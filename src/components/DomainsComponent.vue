<template>
  <div v-show="$route.name === 'domains'" style="display: grid; align-self: start; width: calc(100vw - 200px); padding: 20px;">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Domains list</h2>
      <a href=""></a>
    </div>
    <div class="domains">
      <DataTable :data="table.tableData"></DataTable>
    </div>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import DataTable from "@/shared/DataTable/DataTable.vue";
import {useDomainStore} from "@/stores/domain";
import {onBeforeRouteUpdate} from "vue-router";

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
    DataTable
  },
  setup: () => {
    const store = useDomainStore()
    const table = reactive({
      tableData: {
        tableConfig: {
          style: {
            columnWidth: ['10%', '13%', '20%', '10%', '10%', '1%', '15%']
          }
        },
        sortKey: '',
        columns: [
          {label: 'Id', value: 'id', style: {'width': '10%'}},
          {label: 'Description', value: 'description', style: {'width': '13%'}},
          {label: 'Public Url', value: 'publicUrl', style: {'width': '20%'}},
          {label: 'Owner', value: 'owner', style: {'width': '10%'}},
          {label: 'Entrypoint', value: 'actions', hasActions: true, style: {'width':'10%' }},
          {label: 'Status', value: 'status', style: {'width': '1%'}},
          {label: '', value: 'routerLink', routerLink: true, style: {'width': '15%'}}
        ],
        rows: null
      }
    })
    onMounted(async () => {
      table.tableData.rows = await store.fetchDomains()
          .then((res) => {
            if (res.data.length > 0) {
              res.data[0].visible = true;
            }
            res.data.map((d: any) => {
              const owners = d.owner.map((owner: string) => owner.split(":Organization:")[1])
              d.owner = owners.join()
              d.id = d.id.split(":Domain:")[1]
              d.status = d.domainStatus.split(":DomainStatus:")[1]
              d.actions = d.entrypoint? [{icon: 'check'}] : [{icon: 'xmark'}]
            })
            store.domains = res.data
            return res.data
          })
          .catch(err => console.error(err))
    })
    return {
      table
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