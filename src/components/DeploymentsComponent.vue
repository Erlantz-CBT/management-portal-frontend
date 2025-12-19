<template>
  <div :key="$route.name" v-if="$route.name === 'deployments'" class="container">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{$t('deployments.deployedServices')}}</h2>
      <router-link v-if="user.realm_access.roles.includes(ROLES.continuumAdministrator) || user.realm_access.roles.includes(ROLES.verticalDeployer)" :to="!hasError ? '/deployments/new' : ''" :class="{'disabled': hasError}" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="circle-plus" /> {{$t('deployments.newServiceDeployment')}} <span></span></router-link>
    </div>
    <div class="deployments" v-if="!hasError && deployments.tableData.rows">
      <DataTable
          :data="deployments.tableData" />
      <ErrorComponent style="justify-self: center" v-if="hasError" @reload="async () => await fetchDeployments()" />
    </div>
  </div>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import {defineComponent, inject, onMounted, reactive, ref} from "vue";
import DataTable from "@/shared/DataTable/DataTable.vue";
import ErrorComponent from "@/shared/ErrorComponent.vue";
import {useDeploymentsStore} from "@/stores/deployment";
import {useModalStore} from "@/stores/modal";
import {useToastsStore} from "@/stores/toasts";
import {useSettings} from "@/stores/settings";
import {TableConfig} from "@/shared/DataTable/interfaces/TableConfig";
import ROLES from "@/constants/roles";
import {useNotificationStore} from "@/stores/notifications";
import {useRouter} from "vue-router";
import {useLoaderStore} from "@/stores/loader";

interface Deployment {
  _id: string;
  name: string;
  description: string;
  tbd: string;
  actions: Array<string>
}

export default defineComponent({
  name: "DeploymentsComponent",
  components: {DataTable, ErrorComponent},
  setup: () => {
    const deploymentsStore = useDeploymentsStore()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const settingsStore = useSettings()
    const notificationStore = useNotificationStore()
    const loaderStore = useLoaderStore()
    const hasError = ref(false)
    const user: any = inject('$user')
    const router = useRouter()
    const deployments = reactive({
      tableData: {
        tableConfig: {
          sized: true,
          pagination: {
            items: 15
          }
        } as TableConfig,
        sortKey: '',
        columns: [
          {
            label: 'ID',
            value: 'id',
            style: {'width': '10%'},
            format: ({value}: any) => value.split(":Service:")[1]
          },
          {label: 'deployments.name', value: 'name', style: {'width': '26%'}},
          {label: 'deployments.description', value: 'description', style: {'width': '41%'}},
          {label: '', value: 'actions', hasActions: true,style: {'width': '8%'}}],
        rows: null as unknown as Deployment[]
      }
    })

    /**
     * Fetch data from deployment service
     */
    const fetchDeployments = async () => {
      deployments.tableData.rows = await deploymentsStore.fetchDeployments()
          .then((res: any) => {
            res.data.map((d: any) => {
              d.actions = [
                {
                  icon: 'eye',
                  onClick: () => router.push(`/deployments/deployment/${d.id}`),
                },
                {
                  icon: d.actionType === 'DEPLOYED' ? 'stop' : 'play',
                  disabled: !d.actionType || d.actionType === '',
                  onClick: () => {
                    return modalStore.showModal({
                      template: "delete",
                      data: {
                        onConfirm: (data: any) => {
                          modalStore.hideModal(null)
                          modalStore.$reset()
                          if(d.actionType === 'DEPLOYED') {
                            return deploymentsStore.stopDeployment(d.id)
                                .then(() => {
                                  toastStore.appendToast({
                                    label: `Service ${d.id} stopping`,
                                    success: true ,
                                    data: {},
                                    autoRemove: false})
                                })
                                .catch(err => {
                                  modalStore.hideModal(null)
                                  modalStore.$reset()
                                  toastStore.appendToast({
                                    label: `Looks like something went wrong`,
                                    success: false,
                                    data: {},
                                    autoRemove: false})
                                  console.error(err)
                                })
                          }
                          return deploymentsStore.startDeployment(d.id)
                              .then(() => {
                                toastStore.appendToast({
                                  label: `Service ${d.id} starting`,
                                  success: true ,
                                  data: {},
                                  autoRemove: false})
                              })
                              .catch(err => {
                                modalStore.hideModal(null)
                                modalStore.$reset()
                                toastStore.appendToast({
                                  label: `Looks like something went wrong`,
                                  success: false,
                                  data: {},
                                  autoRemove: false})
                                console.error(err)
                              })
                        },
                        header: d.actionType === 'DEPLOYED' ? "Stop service" : "Start service",
                        actionDescription: d.actionType === 'DEPLOYED' ? "general.stopConfirm" : "general.startConfirm",
                        subtitle: d.id
                      }})
                  },
                }
              ]
              if (user.realm_access.roles.includes(ROLES.continuumAdministrator)) {
                d.actions.push({
                  icon: 'trash',
                  disabled: d.actionType === 'DEPLOYED',
                  onClick: () => {
                    return modalStore.showModal({
                      template: "delete",
                      data: {
                        onConfirm: (data: any) => {
                          modalStore.hideModal(null)
                          modalStore.$reset()
                          deploymentsStore.deleteDeployment(d.id)
                              .then(() => {
                                toastStore.appendToast({
                                  label: `Service ${d.id} deleted`,
                                  success: true ,
                                  data: {},
                                  autoRemove: false})
                              })
                              .catch(err => {
                                modalStore.hideModal(null)
                                modalStore.$reset()
                                toastStore.appendToast({
                                  label: `Looks like something went wrong`,
                                  success: false,
                                  data: {},
                                  autoRemove: false})
                                console.error(err)
                              })
                        },
                        header: "Delete service",
                        subtitle: d.id
                      }
                    })
                  },
                })
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
                  label: `Looks like something went wrong: ${err?.message}`,
                  success: false,
                  data: {},
                  autoRemove: false
                })
          })
    }
    onMounted(async () => {
      if (router.currentRoute.value.name === 'deployments') {
        await fetchDeployments()
      }
    })
    const updateActions = ['startDeployment', 'stopDeployment', 'deleteDeployment']
    deploymentsStore.$onAction(async({name, after}) => {
      if(updateActions.includes(name)) {
        after(async() => {
          await fetchDeployments()
        })
      }
    })
    // Listen for notifications
    // is a notification are added, related to a "Service component", update the deployments list
    notificationStore.$onAction( async({name, after}) => {
      if (name === 'addNotification') {
        loaderStore.hasLoader = false
        after(async ({notification}: any) => {
          // Could be better if we had some more
          // information about the service-notification relationship
          // Notification need some more information
          if (notification.category.split("-").includes("LLO") &&
          notification.description.split(" aeros-service").includes("Service component")){
            await fetchDeployments()
          }
          loaderStore.$reset()
        })
      }
    })
    return {
      deployments,
      hasError,
      settingsStore,
      fetchDeployments,
      ROLES,
      user
    }
  }
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>

<style scoped>

h2 {
  color: #004AAD;
}

.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.deployments {
  justify-self: center;
  align-self: start;
}

.new-deployment {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 240px;
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

.new-deployment:hover {
  opacity: 0.7;
}

</style>