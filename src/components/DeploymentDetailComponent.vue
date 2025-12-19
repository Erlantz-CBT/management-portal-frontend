<template>
  <div>
    <div v-if="!loaderStore.loading" class="container">
      <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
        <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{$t('deployments.serviceDetail')}}</h2>
        <router-link to="/deployments" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> {{$t('sidebar.deployments')}} <span></span></router-link>
      </div>
      <div v-if="deployment.detail && !hasError" style="display: flex; justify-content: space-between;">
        <DataTable v-if="deployment.detail.rows" :data="deployment.detail"></DataTable>
      </div>
      <div v-if="deployment.components && !hasError">
        <h3 style="margin-top: 25px; text-align: left" :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{$t('deployments.serviceComponents')}}:</h3>
        <DataTable style="margin-top: 25px" v-if="deployment.components?.rows?.length > 0" :data="deployment.components"></DataTable>
      </div>
      <ErrorComponent style="justify-self: center" v-if="hasError" @reload="async () => await fetchDeployment()" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {useDeploymentsStore} from "@/stores/deployment";
import {useLoaderStore} from "@/stores/loader";
import {useModalStore} from "@/stores/modal";
import DataTable from "@/shared/DataTable/DataTable.vue";
import ErrorComponent from "@/shared/ErrorComponent.vue";
import {useToastsStore} from "@/stores/toasts";
import {useSettings} from "@/stores/settings";
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: "DeploymentDetailComponent",
  components: {DataTable, ErrorComponent},
  props: ['id'],
  setup: (props) => {
    const deploymentsStore = useDeploymentsStore()
    const loaderStore = useLoaderStore()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const settingsStore = useSettings()
    const { t } = useI18n()
    const hasError = ref(false)
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
          {label: 'deployments.name', value: 'name'},
          {label: 'deployments.description', value: 'description'}
        ],
        rows: null as any
      },
      components: {
        tableConfig: {
          style: {
            columnWidth: ['15%', '15%', '15%', '10%', '10%', '15%', '20%'],
          }
        },
        sortKey: '',
        columns: [
          {label: 'ID', value: 'id', style: {width: '20%'}},
          {label: 'IE', value: 'infrastructureElement', style: {width: '20%'}},
          {label: 'domains.status', value: 'serviceComponentStatus', style: {width: '10%'}},
          {label: 'deployments.containerImage', value: 'containerImage', style: {width: '15%'}},
          {label: 'CLI args', value: 'cliArgs', hasActions: true, style: {width: '10%'}},
          {label: 'ENV variables', value: 'envVars', hasActions: true, style: {width: '10%'}},
          {
            label: 'Network Ports',
            value: 'networkPorts',
            style: {width: '15%'},
            format: ({value}: any) => value.map((port: any) => `${port?.portNumber}/${port?.portProtocol} ${port?.exposed ?
                t('deployments.exposed') :
                t('deployments.notExposed')} ${port?.externalPortNumber ? '/' : ''}  ${port?.externalPortNumber || ''}`).join('\n')
          }
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
            hasError.value = false
            return [res.data]
          })
          .catch(err => {
            hasError.value = true
            toastStore.appendToast(
                {
                  label: `Looks like something went wrong: ${err?.message}`,
                  success: false,
                  data: {},
                  autoRemove: false
                })
            return []
          })


      deployment.components.rows = await deploymentsStore.getDeploymentDetail(deploymentId)
          .then((res) => {
            res.data.map((d: any) => {
              d.id = d.id?.split(`:Component:`)[1]
              if (d.infrastructureElement) d.infrastructureElement = d.infrastructureElement.split(":InfrastructureElement:")[1]
              else d.infrastructureElement = 'None'
              
              d.serviceComponentStatus = d.serviceComponentStatus?.split(":ServiceComponentStatus:")[1]
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
            hasError.value = false
            return res.data
          })
          .catch(err => {
            hasError.value = true
            console.error(err)
            toastStore.appendToast(
                {
                  label: `Service components for ${deploymentId} are not available`,
                  success: false,
                  data: {},
                  autoRemove: false
                })
            return []
          })
    }
    onMounted(async () => {
      await fetchDeployment()
    })
    return {
      deployment,
      loaderStore,
      modalStore,
      hasError,
      settingsStore,
      fetchDeployment
    }
  }
})
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.back {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 161px;
  height: 30px;
  padding: 3px;
  font-family: Poppins, sans-serif;
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

.back:hover {
  opacity: 0.7;
}

h2 {
  color: #004AAD;
}

</style>