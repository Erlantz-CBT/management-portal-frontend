<template>
  <div v-if="!loaderStore.loading" style="height: 100%" class="container">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 0 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{$t('domains.domainDetail')}}</h2>
      <router-link to="/domains" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> {{$t('sidebar.domains')}} <span></span></router-link>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <DataTable v-if="domainIE.rows" :data="domainIE"></DataTable>
    </div>
    <div>
      <h3 style="text-align: left; margin-top: 25px" :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{$t('domains.infrastructureElements')}}:</h3>
      <DataTable style="margin-top: 25px" v-if="infrastructureElements.rows" :data="infrastructureElements"></DataTable>
    </div>
    <ErrorComponent style="justify-self: center" v-if="hasError" @reload="async () => await fetchDomains()" />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import {useToastsStore} from "@/stores/toasts";
import DataTable from "@/shared/DataTable/DataTable.vue";
import ErrorComponent from "@/shared/ErrorComponent.vue";
import {useSettings} from "@/stores/settings";
import {useRouter} from "vue-router";
import {useModalStore} from "@/stores/modal";

export default defineComponent({
  name: "DomainDetail",
  components: {DataTable, ErrorComponent},
  props: ['id'],
  setup: (props) => {
    const domainStore = useDomainStore()
    const loaderStore = useLoaderStore()
    const toastStore = useToastsStore()
    const modalStore = useModalStore()
    const settingsStore = useSettings()
    const hasError = ref(false)
    const domainIE = reactive({
      sortKey: '',
      columns: [
        {label: 'Id', value: 'id', style: {'width': '14.2%'}},
        {label: 'domains.description', value: 'description', style: {'width': '14.2%'}},
        {label: 'domains.publicUrl', value: 'publicUrl', style: {'width': '23.2%'}},
        {label: 'domains.owner', value: 'owner', style: {'width': '14.2%'}},
        {label: 'domains.entrypoint', value: 'entrypoint', hasActions: true, style: {'width': '10.2%'}},
        {label: 'domains.status', value: 'status', style: {'width': '9.2%'}}
      ],
      rows: null as any
    })

    const infrastructureElements = reactive( {
      sortKey: '',
      columns: [
        {
          label: 'Hostname',
          value: 'hostname',
          style: {'width': '15.5%'}
        },
        {
          label: 'Container Technology',
          value: 'containerTechnology',
          style: {'width': '10.5%'}
        },
        {
          label: 'CPU arch',
          value: 'cpuArchitecture',
          style: {'width': '6.5%'}
        },
        {
          label: 'CPU cores',
          value: 'cpuCores',
          style: {'width': '7.5%'}
        },
        {
          label: 'RAM capacity (MB)',
          value: 'ramCapacity',
          style: {'width': '12.5%'}
        },
        {
          label: 'Trust score',
          value: 'trustScore',
          style: {'width': '8.5%'}
        },
        {
          label: 'domains.status',
          value: 'infrastructureElementStatus',
          style: {'width': '8.5%'}
        },
        {
          label: '',
          value: 'actions',
          hasActions: true,
          style: {'width': '6.5%'}
        }
      ],
      rows: null as any
    })
    const domainId: string = props.id.split("&").length > 0 ? props.id.split("&")[0] : props.id
    const fetchDomains = async () => {
      domainIE.rows = await domainStore.fetchDomain(domainId)
          .then((res) => {
            if (res.data.length > 0) {
              res.data[0].visible = true;
            }
            const owners = res.data.owner.map((owner: string) => owner.split(":Organization:")[1])
            res.data.owner = owners.join()
            res.data.id = res.data.id.split(":Domain:")[1]
            res.data.status = res.data.domainStatus.split(":DomainStatus:")[1]
            res.data.entrypoint = res.data.entrypoint?  [{icon: 'check'}] : [{icon: 'xmark'}]
            res.data.actions = [{icon: 'pencil'}]
            hasError.value = false
            return [res.data]
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

      infrastructureElements.rows = await domainStore.fetchIE(domainId)
          .then((res) => {
            res.data.map((d: any) => {
              // Request Anomaly Detection Params for each IE

              (async() => await domainStore.fetchSelfIE(d.id, 'DISK_USAGE')
                  .then(res => d.diskAnomalyParams = res)
                  .catch(err => {
                    console.error(err)
                    return null
                  })
              )();
              (async() => await domainStore.fetchSelfIE(d.id, 'CPU_USAGE')
                  .then(res => d.cpuAnomalyParams = res)
                  .catch(err => {
                      console.error(err)
                    return null
                  })
              )();
              (async() => await domainStore.fetchSelfIE(d.id, 'RAM_USAGE')
                  .then(res => d.ramAnomalyParams = res)
                  .catch(err => {
                    console.error(err)
                    return null
                  })
              )();
              d.cpuArchitecture = d.cpuArchitecture.split(":CpuArchitecture:")[1]
              d.infrastructureElementStatus = d.infrastructureElementStatus.split(":InfrastructureElementStatus:")[1]
              d.actions = [
                {
                  icon: 'microchip',
                  title: 'CPU anomaly detection parameters',
                  onClick: () => {
                    if (d.cpuAnomalyParams) {
                      modalStore.showModal({
                        template: "UpdateIECapabilities",
                        styles: {
                          'min-width': '685px',
                          'height': 'auto'
                        },
                        data: {
                          IE: d,
                          anomaly: 'cpuAnomalyParams',
                          type: 'CPU',
                          onConfirm: (data: any) => {
                            Object.keys(data.IE.cpuAnomalyParams).forEach((k: any) => data.IE.cpuAnomalyParams[k] = +data.IE.cpuAnomalyParams[k])
                            const body = {
                              toleranceThresholdAnomaly: data.IE.cpuAnomalyParams.toleranceThresholdAnomaly,
                              toleranceThresholdNormal: data.IE.cpuAnomalyParams.toleranceThresholdNormal,
                              windowAnomaly: data.IE.cpuAnomalyParams.windowAnomaly,
                              windowNormal: data.IE.cpuAnomalyParams.windowNormal
                            }
                            modalStore.hideModal(data)
                            modalStore.$reset()
                            loaderStore.hasLoader = false
                            domainStore.updateSelfIE(d.id, body, 'CPU_USAGE')
                                .then((res) => {
                                  d.cpuAnomalyParams = {...body}
                                  toastStore.appendToast(
                                      {
                                        label: `IE: ${d.hostname} CPU anomaly detection parameters updated`,
                                        success: true,
                                        data: {},
                                        autoRemove: false
                                      })
                                })
                                .catch(err => console.error(err))
                            loaderStore.$reset()
                          },
                          header: "Update Capabilites",
                          subtitle: d.id
                        }})
                    } else {
                      toastStore.appendToast(
                          {
                            label: `IE: ${d.hostname} CPU USAGE is not available`,
                            success: false,
                            data: {},
                            autoRemove: false
                          })
                      return null
                    }

                  }
                },
                {
                  icon: 'memory',
                  title: 'RAM anomaly detection parameters',
                  onClick: () => {
                    if (d.ramAnomalyParams) {
                      modalStore.showModal({
                        template: "UpdateIECapabilities",
                        styles: {
                          'min-width': '685px',
                          'height': 'auto'
                        },
                        data: {
                          IE: d,
                          anomaly: 'ramAnomalyParams',
                          type: 'RAM',
                          onConfirm: (data: any) => {
                            Object.keys(data.IE.ramAnomalyParams).forEach((k: any) => data.IE.ramAnomalyParams[k] = +data.IE.ramAnomalyParams[k])
                            const body = {
                              toleranceThresholdAnomaly: data.IE.ramAnomalyParams.toleranceThresholdAnomaly,
                              toleranceThresholdNormal: data.IE.ramAnomalyParams.toleranceThresholdNormal,
                              windowAnomaly: data.IE.ramAnomalyParams.windowAnomaly,
                              windowNormal: data.IE.ramAnomalyParams.windowNormal
                            }
                            modalStore.hideModal(data)
                            modalStore.$reset()
                            loaderStore.hasLoader = false
                            domainStore.updateSelfIE(d.id, body, 'RAM_USAGE')
                                .then((res) => {
                                  d.ramAnomalyParams = {...body}
                                  toastStore.appendToast(
                                      {
                                        label: `IE: ${d.hostname} RAM anomaly detection parameters updated`,
                                        success: true,
                                        data: {},
                                        autoRemove: false
                                      })
                                })
                                .catch(err => console.error(err))
                            loaderStore.$reset()
                          },
                          header: "Update Capabilites",
                          subtitle: d.id
                        }})
                    } else {
                      toastStore.appendToast(
                          {
                            label: `IE: ${d.hostname} RAM USAGE is not available`,
                            success: false,
                            data: {},
                            autoRemove: false
                          })
                      return null
                    }

                  }
                },
                {
                  icon: 'hard-drive',
                  title: 'Disk anomaly detection parameters',
                  onClick: () => {
                    if (d.diskAnomalyParams) {
                      modalStore.showModal({
                        template: "UpdateIECapabilities",
                        styles: {
                          'min-width': '685px',
                          'height': 'auto'
                        },
                        data: {
                          IE: d,
                          anomaly: 'diskAnomalyParams',
                          type: 'Disk',
                          onConfirm: (data: any) => {
                            Object.keys(data.IE.diskAnomalyParams).forEach((k: any) => data.IE.diskAnomalyParams[k] = +data.IE.diskAnomalyParams[k])
                            const body = {
                              toleranceThresholdAnomaly: data.IE.diskAnomalyParams.toleranceThresholdAnomaly,
                              toleranceThresholdNormal: data.IE.diskAnomalyParams.toleranceThresholdNormal,
                              windowAnomaly: data.IE.diskAnomalyParams.windowAnomaly,
                              windowNormal: data.IE.diskAnomalyParams.windowNormal
                            }
                            modalStore.hideModal(data)
                            modalStore.$reset()
                            loaderStore.hasLoader = false
                            domainStore.updateSelfIE(d.id, body, 'DISK_USAGE')
                                .then((res) => {
                                  d.diskAnomalyParams = {...body}
                                  toastStore.appendToast(
                                      {
                                        label: `IE: ${d.hostname} Disk anomaly detection parameters updated`,
                                        success: true,
                                        data: {},
                                        autoRemove: false
                                      })
                                })
                                .catch(err => console.error(err))
                            loaderStore.$reset()
                          },
                          header: "Update Capabilites",
                          subtitle: d.id
                        }})
                    } else {
                      toastStore.appendToast(
                          {
                            label: `IE: ${d.hostname} DISK USAGE is not available`,
                            success: false,
                            data: {},
                            autoRemove: false
                          })
                      return null
                    }

                  }
                }
              ]
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
      await fetchDomains()
    })
    return {
      domainIE,
      infrastructureElements,
      loaderStore,
      hasError,
      settingsStore,
      fetchDomains
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