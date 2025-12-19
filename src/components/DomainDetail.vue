<template>
  <div v-if="!loaderStore.loading" style="display: grid; align-self: start; width: calc(100vw - 200px);padding: 20px;">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Domain detail</h2>
      <router-link to="/domains" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> Domains <span></span></router-link>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <DataTable :data="domainIE"></DataTable>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2>Infrastructure elements:</h2>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <DataTable :data="infrastructureElements"></DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive} from "vue";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import DataTable from "@/shared/DataTable/DataTable.vue";

export default defineComponent({
  name: "DomainDetail",
  components: {DataTable},
  props: ['id'],
  setup: (props) => {
    const domainStore = useDomainStore()
    const loaderStore = useLoaderStore()
    const domainIE = reactive({
      sortKey: '',
      columns: [
        {label: 'Id', value: 'id', style: {'width': '14,2%'}},
        {label: 'Description', value: 'description', style: {'width': '14,2%'}},
        {label: 'Public Url', value: 'publicUrl', style: {'width': '14,2%'}},
        {label: 'Owner', value: 'owner', style: {'width': '14,2%'}},
        {label: 'Entrypoint', value: 'entrypoint', hasActions: true, style: {'width': '14,2%'}},
        {label: 'Status', value: 'status', style: {'width': '14,2%'}},
        // {label: 'Actions', value: 'actions', hasActions: true, style: {'width': '14,2%'}}
      ],
      rows: null as any
    })
    const infrastructureElements = reactive( {
      sortKey: '',
      columns: [
        {label: 'ID', value: 'id', style: {'width': '12,5%'}},
        {label: 'LLO', value: 'lowLevelOrchestrator', style: {'width': '12,5%'}},
        {label: 'CPU arch', value: 'cpuArchitecture', style: {'width': '12,5%'}},
        {label: 'CPU cores', value: 'cpuCores', style: {'width': '12,5%'}},
        {label: 'RAM capacity (MB)', value: 'ramCapacity', style: {'width': '12,5%'}},
        {label: 'Real time', value: 'realTimeCapable', hasActions: true, style: {'width': '12,5%'}},
        {label: 'Status', value: 'infrastructureElementStatus', style: {'width': '12,5%'}},
        {label: 'Metrics', value: 'actions', hasActions: true, style: {'width': '12,5%'}}
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
            return [res.data]
          })
          .catch(err => console.error(err))

      infrastructureElements.rows = await domainStore.fetchIE(domainId)
          .then((res) => {
            res.data.map((d: any) => {
              d.id = d.id.split(":InfrastructureElement:")[1]
              d.lowLevelOrchestrator = d.lowLevelOrchestrator.split(":LowLevelOrchestrator:")[1]
              d.cpuArchitecture = d.cpuArchitecture.split(":CpuArchitecture:")[1]
              d.realTimeCapable = d.realTimeCapable ? [{icon: 'check', onClick: () => null}] : [{icon: 'xmark', onClick: () => null}]
              d.infrastructureElementStatus = d.infrastructureElementStatus.split(":InfrastructureElementStatus:")[1]
              d.actions = [
                {icon: 'chart-line', onClick: () => null}
              ]
            })
            return res.data
          })
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchDomains()
    })
    return {
      domainIE,
      infrastructureElements,
      loaderStore
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