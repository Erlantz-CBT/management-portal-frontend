<template>
  <div v-show="$route.name === 'benchmark'" style="grid-template-rows: 100px max-content auto" class="container">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Benchmarking</h2>
      <router-link :to="'benchmark/compare'" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="arrow-right" /> Compare <span></span></router-link>
    </div>
    <div class="benchmark-filters">
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px">
        <select
            class="search-select"
            @change="getIEBenchmarks()"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            name="benchmark_type"
            v-model="benchmarkType"
            id="benchmark_type">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              value="cpu">CPU</option>
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              value="network">Network</option>
        </select>
        <select
            class="search-select"
            v-model="selectedDomain"
            v-on:change="fetchIE(selectedDomain)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            name="domain" id="domain">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">Select a domain</option>
          <option
              v-for="domain in domains.domains"
              :key="domain.id"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="domain">{{ domain.description }}</option>
        </select>
        <div
            class="loader-placeholer"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-if="ieFetching">
          <VueSpinner color="#004AAD"></VueSpinner>
        </div>
        <select
            class="search-select"
            :key="selectedDomain"
            v-if="!ieFetching"
            :style="{
              'opacity': (selectedDomain && !ieFetching) ? 1 : 0.7,
              'pointer-events': (selectedDomain && !ieFetching) ? 'auto' : 'none'
            }"
            @change="getIEBenchmarks()"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-model="selectedIE" name="ie" id="ie">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">
            Select a IE
          </option>
          <option
              v-for="b in IE.IE"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :key="b.id"
              :value="b.id">{{b.id.split(":InfrastructureElement:")[1]}}</option>
        </select>
        <select
            v-if="selectedBenchmarks?.benchmarks.length > 0 && selectedIE"
            class="search-select"
            v-model="selectedBenchmark"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            :style="{
              'opacity': (selectedIE && !ieFetching) ? 1 : 0.7,
              'pointer-events': (selectedDomain && !ieFetching) ? 'auto' : 'none'
            }"
            name="benchmark"
            id="benchmark">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">Select a benchmark</option>
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              v-for="benchmark in selectedBenchmarks.benchmarks"
              :key="benchmark"
              :value="benchmark">{{moment(benchmark?.createdAt).format("DD-MM-YYYY HH:mm")}} - {{benchmark?.data?.cpuName || benchmark?.data?.info?.version}}</option>
        </select>
        <a
            v-show="selectedIE && selectedBenchmarks.benchmarks.length > 0"
            @click="requestBenchmark"
            class="request-benchmark"
            :class="benchmarkRequest ? 'disabled' : null"
        >
          <font-awesome-icon class="icon" :class="benchmarkRequest ? 'rotate':null" :icon="benchmarkRequest ? 'spinner' : 'bolt'" />Run a benchmark
        </a>
        <a :href="selectedBenchmark?.data.url" target="_blank"  class="request-benchmark" v-show="selectedBenchmark && selectedIE && benchmarkType === 'cpu'"><font-awesome-icon icon="arrow-up-right-from-square" />View more on Geekbench</a>
      </div>
      <span class="error" v-if="!selectedIE">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">Select an infrastructure element</h3>
      </span>
      <span class="error" v-if="selectedIE && (!selectedBenchmarks.fetching && selectedBenchmarks.benchmarks.length === 0)">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">No benchmark founded<a @click="requestBenchmark" :class="benchmarkRequest ? 'disabled' : null"  class="request-benchmark"><font-awesome-icon :class="benchmarkRequest ? 'rotate':null" :icon="benchmarkRequest ? 'spinner' : 'bolt'" /> Run a benchmark</a></h3>
      </span>
<!--      <VerticalDataTable v-if="selectedBenchmark" :data="selectedBenchmark.data.value"/>-->
    </div>
    <div v-if="selectedBenchmark && selectedIE" class="benchmark">
      <div :class="benchmarkType" class="benchmark-bar">
        <Bar v-if="benchmarkType === 'cpu' && !selectedBenchmarks.fetching" :data="data" :options="options"></Bar>
        <VerticalDataTable v-if="benchmarkType === 'network' && !selectedBenchmarks.fetching" :data="data"/>
      </div>
    </div>
  </div>
  <router-view
      :selected-benchmark-to-compare="selectedBenchmark"
      :key="$route.fullPath"
  >
  </router-view>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {useBenchmarkingStore} from "@/stores/benchmarking";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {useSettings} from "@/stores/settings";
import {Bar} from "vue-chartjs";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import {useToastsStore} from "@/stores/toasts";
import moment from "moment";
import {VueSpinner} from "vue3-spinners";
import VerticalDataTable from "@/shared/VerticalDataTable/VerticalDataTable.vue";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  name: "BenchmarkingToolComponent",
  components: {
    Bar,
    VueSpinner,
    VerticalDataTable
  },
  setup: () => {
    const settingsStore = useSettings()
    const benchmarkingStore = useBenchmarkingStore()
    const domainStore = useDomainStore()
    const loaderStore = useLoaderStore()
    const toastStore = useToastsStore()
    const domains = reactive({domains: []})
    const IE = reactive({IE: [], fetching: false})
    const benchmarkType = ref('cpu')
    const selectedDomain = ref(null)
    const selectedIE = ref(null)
    const selectedBenchmarks = reactive({
      benchmarks: [],
      fetching: false
    })
    const selectedBenchmark: any = ref(null)
    const ieFetching = ref(false)
    const benchmarkRequest = ref(false)
    const fetchDomains = async () => {
      domains.domains = await domainStore.fetchDomains()
          .then(res => res.data)
          .catch(err => console.error(err))
    }
    const fetchIE = async(domain: any) => {
      selectedIE.value = null
      ieFetching.value = true
      // If there is no domain selected, empty the IE array
      if (!domain) {
        IE.IE = []
        ieFetching.value = false
        return null
      }
      loaderStore.hasLoader = false
      const domainID = domain.id.split(":Domain:")[1]
      IE.IE = await domainStore.fetchIE(domainID)
        .then(res => {
          loaderStore.$reset()
          ieFetching.value = false
          return res.data
        })
        .catch(err => {
          ieFetching.value = false
          console.error(err)
        })

    }
    const getIEBenchmarks = async() => {
      loaderStore.hasLoader = false
      selectedBenchmarks.fetching = true
      selectedBenchmark.value = null
      await benchmarkingStore.getBenchmarkList(selectedIE?.value, benchmarkType.value)
        .then((res: any) => {
          loaderStore.$reset()
          selectedBenchmarks.benchmarks = res.sort((a: any, b: any) => moment.utc(b.createdAt).diff(moment.utc(a.createdAt)))
          selectedBenchmarks.fetching = false
        })
        .catch(err => {
          selectedBenchmarks.fetching = false
          console.error(err)
        })
    }
    onMounted(async() => {
      await fetchDomains()
    })
    const benchmarkLabels = Object.freeze({
      fileCompression: "File Compression",
      navigation: "Navigation",
      html5Browser: "HTML5 Browser",
      pdfRenderer: "PDF Renderer",
      photoLibrary: "Photo Library",
      clang: "Clang",
      textProcessing: "Text Processing",
      assetCompression: "Asset Compression",
      objectDetection: "Object Detection",
      backgroundBlur: "Background Blur",
      horizonDetection: "Horizon Detection",
      objectRemover: "Object Remover",
      hdr: "HDR",
      photoFilter: "Photo Filter",
      rayTracer: "Ray Tracer",
      structureFromMotion: "Structure from Motion",
      mediaBps: "Media Bps",
      mediaDuration: "Media Duration",
      mediaPmtu: "Media PMTU",
      mediaRtt: "Media RTT",
      mediaRttVar: "Media RTT var"
    })
    const data = computed(() => {
      if(selectedBenchmark.value.data.singleCoreResults && benchmarkType.value === 'cpu') {
        return {
          labels: Object.keys(selectedBenchmark.value!.data.singleCoreResults).map((k: any) => benchmarkLabels[k as keyof object]),
          datasets: [
            {
              label: 'Single-core',
              backgroundColor: '#04387E',
              borderColor: "#E6EAF6",
              data: Object.keys(selectedBenchmark.value!.data.singleCoreResults)
                  .map((k: any) => {
                    return selectedBenchmark.value!.data.singleCoreResults[k as keyof object]
                  })
            },
            {
              label: 'Multi-core',
              backgroundColor: '#8E9DCC',
              borderColor: "#E6EAF6",
              data: Object.keys(selectedBenchmark.value!.data.multiCoreResults)
                  .map((k: any) => {
                    return selectedBenchmark.value!.data.multiCoreResults[k as keyof object]
                  })
            }
          ]
        }
      }
      if (selectedBenchmark.value.data.tests && benchmarkType.value === 'network') {
        return {
          tableConfig: {
            container: {
              style: {
                'border': 'none',
                'padding': 0
              }
            },
            datatable: {
              style: {
                'overflow': 'hidden'
              }
            }
          },
          columns: [
            {
              label: 'TCP'
            },
            {
              label: 'UDP'
            }
          ],
          rows: [
            (() => Object.keys(selectedBenchmark.value.data?.tests[0]))()
                .filter(key => key !== 'conectionType')
                .map(v => {
                  return {value: benchmarkLabels[v as keyof object]}
                }),
            (() => {
              return Object.keys(selectedBenchmark.value.data?.tests[0])
                  .filter(key => key !== 'conectionType')
                  .map((d: any) => {
                        return {
                          value: selectedBenchmark.value.data?.tests[0][d as keyof object]
                        }
                      }
                  )
            })(),
            (() => {
              return Object.keys(selectedBenchmark.value.data?.tests[0])
                  .filter(key => key !== 'conectionType')
                  .map((d: any) => {
                        return {
                          value: selectedBenchmark.value.data?.tests[1][d as keyof object] || "---"
                        }
                      }
                  )
            })(),
          ]
        }
      }
      return {
        datasets: [
          {
            backgroundColor: '#8E9DCC',
            data: []
          }
        ]
      }
    })
    const options = {
      scales: {
        y: {
          grid: {
            color: 'rgb(118, 118, 118)'
          }
        },
        x: {
          grid: {
            display: false,
          }
        }
      },
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false
    }
    return {
      settingsStore,
      benchmarkingStore,
      selectedIE,
      selectedDomain,
      data,
      fetchIE,
      getIEBenchmarks,
      selectedBenchmarks,
      selectedBenchmark,
      domains,
      IE,
      options,
      toastStore,
      ieFetching,
      loaderStore,
      moment,
      benchmarkRequest,
      benchmarkType
    }
  },
  methods: {
    requestBenchmark() {
      this.loaderStore.hasLoader = false
      this.benchmarkRequest = true
      return this.benchmarkingStore.runBenchmark(this.selectedIE, this.benchmarkType)
          .then((res: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: "Benchmark requested",
              success: true,
              autoRemove: false
            })
            this.benchmarkRequest = false
          })
          .catch((err: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: `Looks like something went wrong. Please try later`,
              success: false,
              autoRemove: false
            })
            this.benchmarkRequest = false
            console.error(err)
          })
    }
  }
})
</script>

<style scoped>

.benchmark {
  display: block;
  width: auto;
  min-width: 100%;
  justify-self: center;
  align-self: start;
  height: 100%;
}

.network.benchmark-bar {
  height: unset;
}

.benchmark-bar {
  border: solid 2px #E6EAF6;
  border-radius: 15px;
  padding: 10px;
  height: 100%;

}

.benchmark-filters{
  display: flex;
  justify-content: left;
  flex-direction: column;
  gap: 15px;
}

.select-wrapper {
  height: 50px;
  overflow-y: visible;
}

select {
  overflow-y:auto;
  width:50px;
}

option {
  overflow-y: scroll;
}

.search-select {
  display: flex;
  gap: 5px;
  width: auto;
  color: #004AAD;
  align-items: center;
  outline: none;
  padding: 5px;
  height: 38px;
  border-radius: 10px;
}

.loader-placeholer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 115px;
  opacity: 0.7;
  border: solid 1px #767676;
  border-radius: 10px;
  cursor: not-allowed;
}

.search-select.disabled,
.request-benchmark.disabled{
  opacity: 0.7;
  pointer-events: none;
  cursor: not-allowed;
}

.request-benchmark {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  height: 30px;
  padding: 9px;
  min-width: 190px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 15px;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s ease-in-out;
}

.request-benchmark:hover {
  opacity: 0.7;
}

@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotate {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}

.error {
  font-weight: bold;
  display: grid;
  align-items: center;
  height: calc(100vh - 305px);
}
</style>