<template>
  <div v-show="$route.name === 'deployments'" style="display: grid; align-self: start; width: calc(100vw - 200px);padding: 20px;">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Deployed services</h2>
      <router-link to="/deployments/new" class="new-deployment"><font-awesome-icon style="font-size: 16px" icon="circle-plus" /> New service deployment <span></span></router-link>
    </div>
    <div class="deployments">
      <DataTable :data="deployments.tableData"></DataTable>
    </div>
  </div>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import DataTable from "@/shared/DataTable/DataTable.vue";
import {useDeploymentsStore} from "@/stores/deployment";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {useModalStore} from "@/stores/modal";

interface Deployment {
  _id: string;
  name: string;
  description: string;
  tbd: string;
  actions: Array<string>
}

export default defineComponent({
  name: "DeploymentsComponent",
  components: {DataTable},
  setup: () => {
    const deploymentsStore = useDeploymentsStore()
    const modalStore = useModalStore()
    const router = useRouter()
    const deployments = reactive({
      tableData: {
        tableConfig: {
          style: {
            columnWidth: ['10%', '25%','45%', '10%']
          }
        },
        sortKey: '',
        columns: [
          {label: 'ID', value: 'id', style: {'width': '10%'}},
          {label: 'Name', value: 'name', style: {'width': '25%'}},
          {label: 'Description', value: 'description', style: {'width': '45%'}},
          {label: 'Actions', value: 'actions', hasActions: true,style: {'width': '10%'}}],
        rows: null as unknown as Deployment[]
      }
    })

    /**
     * Fetch data from deployment service
     */
    const fetchDeployments = async () => {
      deployments.tableData.rows = await deploymentsStore.fetchDeployments()
          .then((res) => {
            res.data.map((d: any) => {
              d.id = d.id.split(":Service:")[1]
              d.actions = [
                {
                  icon: 'eye',
                  onClick: () => {
                    router.push(`/deployments/${d.id}`)
                  },
                },
                {
                  icon: 'trash',
                  onClick: () => {
                    modalStore.showModal({template: "delete", data: d})
                  }
                }
              ]
            })
            return res.data
          })
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchDeployments()
    })
    onBeforeRouteUpdate(async (to, from) => {
      // Update data on return to deployments after service creation
      if (from.path === "/deployments/new") {
        await fetchDeployments()
      }
    })
    return {
      deployments
    }
  }
})
</script>

<style scoped>

h2 {
  color: #004AAD;
}

.new-deployment {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 240px;
  height: 30px;
  padding: 3px;
  font-family: Poppins;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s ease-in-out;
}

.new-deployment:hover {
  opacity: 0.7;
}

</style>