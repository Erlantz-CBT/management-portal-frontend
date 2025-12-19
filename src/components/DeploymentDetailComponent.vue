<template>
  <div v-if="!loaderStore.loading" style="display: grid; align-self: start; width: calc(100vw - 200px);padding: 20px;">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Service detail</h2>
      <router-link to="/deployments" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> Deployments <span></span></router-link>
    </div>
    <div v-if="deployment.detail" style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <DataTable :data="deployment.detail"></DataTable>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Service components:</h2>
    </div>
    <div v-if="deployment.components" style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <DataTable :data="deployment.components"></DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import {useDeploymentsStore} from "@/stores/deployment";
import {useLoaderStore} from "@/stores/loader";
import {useModalStore} from "@/stores/modal";
import DataTable from "@/shared/DataTable/DataTable.vue";

export default defineComponent({
  name: "DeploymentDetailComponent",
  components: {DataTable},
  props: ['id'],
  setup: (props) => {
    const deploymentsStore = useDeploymentsStore()
    const loaderStore = useLoaderStore()
    const modalStore = useModalStore()
    const deployment = reactive({
      detail: {
        tableConfig: {
          style: {
            columnWidth: ['20%', '25%', '55%']
          }
        },
        sortKey: '',
        columns: [
          {label: 'ID', value: 'id'},
          {label: 'Name', value: 'name'},
          {label: 'Description', value: 'description'}
        ],
        rows: null as any
      },
      components: {
        tableConfig: {
          style: {
            columnWidth: ['15%', '15%', '15%', '25%', '15%', '15%']
          }
        },
        sortKey: '',
        columns: [
          {label: 'ID', value: 'id'},
          {label: 'IE', value: 'infrastructureElement'},
          {label: 'Status', value: 'serviceComponentStatus'},
          {label: 'Container image', value: 'containerImage'},
          // {label: 'SLA', value: 'sla', hasActions: true},
          {label: 'CLI args', value: 'cliArgs', hasActions: true},
          {label: 'ENV variables', value: 'envVars', hasActions: true},
          // {label: 'Network Ports', value: 'networkPorts'}
        ],
        rows: null as any
      }
    })
    const createAction = (field: any, header: string, id: string) => {
      const mapField = field
          .map((c: { key: any; value: any; }) => `${c.key}=${c.value}`)
      field = [{
        icon: 'list',
        onClick: () => {
          modalStore.showModal({
            template: 'ReadOnly',
            styles: {
              width: 'auto',
              'min-width': '550px'
            },
            data: {
              header: `Component ${id} ${header}`,
              data: mapField
            }
          })
        }
      }]

      return field
    }
    const deploymentId: string = props.id.split("&").length > 0 ? props.id.split("&")[0] : props.id
    const fetchDeployment = async () => {

      deployment.detail.rows = await deploymentsStore.fetchDeployment(deploymentId)
          .then((res) => {
            if (res.data.length > 0) {
              res.data[0].visible = true;
            }
            res.data.id = res.data.id.split(":Service:")[1]
            return [res.data]
          })
          .catch(err => {
            console.error(err)
          })


      deployment.components.rows = await deploymentsStore.getDeploymentDetail(deploymentId)
          .then((res) => {
            console.log(res.data)
            res.data.map((d: any) => {
              d.id = d.id?.split(`:Component:`)[1]
              // d.infrastructureElement = d.infrastructureElement.split(":InfrastructureElement:")[1]
              if (d.infrastructureElement) d.infrastructureElement = d.infrastructureElement.split(":InfrastructureElement:")[1]
              else d.infrastructureElement = 'None'
              
              d.serviceComponentStatus = d.serviceComponentStatus?.split(":ServiceComponentStatus:")[1]
              // d.networkPorts = d.networkPorts.map((n: any) => n.split(":NetworkPort:")[1]).join(",")
              if (d.cliArgs) {
                d.cliArgs = createAction(d.cliArgs, 'CLI args', d.id)
              } else {
                d.cliArgs = [{
                  icon: 'xmark'
                }]
              }
              if (d.envVars) {
                d.envVars = createAction(d.envVars, 'Environment variables', d.id)
              } else {
                d.envVars = [{
                  icon: 'xmark'
                }]
              }
              if (d.sla) {
                d.sla = createAction(d.sla, 'SLA', d.id)
              } else {
                d.sla = [{
                  icon: 'xmark'
                }]
              }
            })
            return res.data
          })
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchDeployment()
    })
    return {
      deployment,
      loaderStore,
      modalStore
    }
  }
})
</script>

<style scoped>

.back {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 161px;
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
}

h2 {
  color: #004AAD;
}

</style>