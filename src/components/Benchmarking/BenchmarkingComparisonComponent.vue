<template>
  <div style="grid-template-rows: 158px 293px" class="container">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Benchmarks comparison</h2>
      <router-link :to="'/benchmark'" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> Benchmarking <span></span></router-link>
    </div>
    <div class="benchmark-filters">
      <div style="display: flex; gap: 10px">
        <select
            class="search-select"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-model="selectedBenchmarkType"
            @change="getIEBenchmarks()"
            name="benchmark_type"
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
            @change="fetchIE(selectedDomain)"
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
            v-if="IE.fetching">
          <VueSpinner color="#004AAD"></VueSpinner>
        </div>
        <select
            class="search-select"
            :key="selectedIE"
            :style="{
              'opacity': (selectedDomain && !IE.fetching) ? 1 : 0.7,
              'pointer-events': (selectedDomain && !IE.fetching) ? 'auto' : 'none'
            }"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            @change="getIEBenchmarks()"
            v-if="!IE.fetching"
            v-model="selectedIE" name="ie" id="ie">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">Select a IE</option>
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
            v-if="selectedBenchmarks?.benchmarks.length > 0"
            class="search-select"
            v-model="selectedBenchmark"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            :style="{
              'opacity': (selectedIE) ? 1 : 0.7,
              'pointer-events': (selectedDomain) ? 'auto' : 'none'
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
              :value="benchmark">{{moment(benchmark.createdAt).format("DD-MM-YYYY HH:mm")}} - {{benchmark.data.cpuName || benchmark?.data?.info?.version}}</option>
        </select>
      </div>
      <span class="error" v-if="!selectedIE">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">Select an infrastructure element</h3>
      </span>
      <span class="error" v-if="selectedIE && (!selectedBenchmarks.fetching && selectedBenchmarks.benchmarks.length === 0)">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">No benchmark founded<a class="request-benchmark" @click="requestBenchmark" :class="benchmarkRequest ? 'disabled' : null"><font-awesome-icon :class="benchmarkRequest ? 'rotate':null" :icon="benchmarkRequest ? 'spinner' : 'bolt'" /> Run a benchmark</a></h3>
      </span>
      <VerticalDataTable v-if="benchmark?.rows" :data="benchmark"/>
    </div>
    <div class="benchmark-filters">
      <div style="display: flex; gap: 10px">
        <select
            class="search-select"
            v-model="selectedDomainCompare"
            :style="{
              'opacity': (selectedIE && selectedBenchmark) ? 1 : 0.7,
              'pointer-events': (selectedIE && selectedBenchmark) ? 'auto' : 'none'
            }"
            v-on:change="fetchCompareIE(selectedDomainCompare)"
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
          <option
              v-if="selectedBenchmarkType === 'cpu'"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="'external'">From Geekbench</option>
        </select>
        <div
            class="loader-placeholer"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-if="compareIE.fetching">
          <VueSpinner color="#004AAD"></VueSpinner>
        </div>
        <select
            class="search-select"
            v-if="selectedDomainCompare !== 'external' && !compareIE.fetching"
            :key="selectedIECompare"
            :style="{
              'opacity': selectedDomainCompare ? 1 : 0.7,
              'pointer-events': selectedDomainCompare ? 'auto' : 'none'
            }"
            @change="getIEBenchmarksCompare()"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-model="selectedIECompare" name="ie" id="ie">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">Select a IE</option>
          <option
              v-for="b in compareIE.IE"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :key="b.id"
              :value="b.id">{{b.id.split(":InfrastructureElement:")[1]}}</option>
        </select>
        <select
            v-if="selectedBenchmarksCompare?.benchmarks.length > 0"
            class="search-select"
            v-model="selectedBenchmarkCompare"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            :style="{
              'opacity': (selectedIECompare || selectedDomainCompare === 'external') ? 1 : 0.7,
              'pointer-events': (selectedDomainCompare) ? 'auto' : 'none'
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
              v-for="benchmark in selectedBenchmarksCompare.benchmarks"
              v-show="benchmark?.id !== selectedBenchmark?.id"
              :key="benchmark"
              :value="benchmark">{{moment(benchmark.createdAt).format("DD-MM-YYYY HH:mm")}} - {{benchmark.data.cpuName || benchmark?.data?.info?.version}}</option>
        </select>
        <a
            v-show="selectedDomainCompare === 'external'"
            @click="benchmarkFromGeekbench"
            class="request-benchmark"><font-awesome-icon icon="bolt" />Run a benchmark from Geekbench</a>
      </div>
      <span class="error" v-if="!selectedIECompare && selectedDomainCompare !== 'external'">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">Select an infrastructure element</h3>
      </span>
      <span class="error" v-if="selectedIECompare && (!selectedBenchmarksCompare.fetching && selectedBenchmarksCompare.benchmarks.length === 0)">
        <h3 style="display: flex; justify-self: center; gap: 10px; align-items: self-end">
          No benchmark founded <a class="request-benchmark" @click="requestCompareBenchmark" :class="benchmarkCompareRequest ? 'disabled' : null"><font-awesome-icon :icon="benchmarkCompareRequest ? 'spinner' : 'bolt'" /> Run a benchmark</a></h3>
      </span>
      <VerticalDataTable v-if="benchmarkCompare?.rows && selectedBenchmarkCompare" :data="benchmarkCompare"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref, toRef} from "vue";
import {useSettings} from "@/stores/settings";
import {useBenchmarkingStore} from "@/stores/benchmarking";
import VerticalDataTable from "@/shared/VerticalDataTable/VerticalDataTable.vue";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import {useModalStore} from "@/stores/modal";
import {useToastsStore} from "@/stores/toasts";
import moment from "moment";
import {VueSpinner} from "vue3-spinners";

export default defineComponent({
  name: "BenchmarkingComparisonComponent",
  props: ['selectedBenchmarkToCompare'],
  components: {VerticalDataTable, VueSpinner},
  setup: (props) => {
    const settingsStore = useSettings()
    const benchmarkingStore = useBenchmarkingStore()
    const domainStore = useDomainStore()
    const loaderStore = useLoaderStore()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const domains = reactive({domains: []})
    const IE = reactive({IE: [], fetching: false})
    const compareIE = reactive({IE: [], fetching: false})
    const selectedBenchmarkType = ref('cpu')
    const selectedDomain = ref(null)
    const benchmarkRequest = ref(false)
    const benchmarkCompareRequest = ref(false)
    const selectedIE = ref(null)
    const selectedBenchmarks = reactive({
      benchmarks: [],
      fetching: false
    })
    const selectedBenchmark: any = ref(null)
    const selectedBenchmarksCompare = reactive({
      benchmarks: [],
      fetching: false
    })
    const selectedDomainCompare = ref(null)
    const selectedIECompare = ref(null)
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
    const selectedBenchmarkCompare: any = ref(null)
    /**
     * Fetch the domains list
     */
    const fetchDomains = async () => {
      domains.domains = await domainStore.fetchDomains()
          .then(res => res.data)
          .catch(err => console.error(err))
    }
    /**+
     * Fetch the selected IEs for the selected Domain
     * @param domain Selected domain
     */
    const fetchIE = async(domain: any) => {
      selectedIE.value = null
      selectedBenchmark.value = null
      IE.fetching = true
      // If there is no domain selected, empty the IE/benchmarks array
      if (!domain) {
        IE.IE = []
        IE.fetching = false
        selectedBenchmarks.benchmarks = []
        selectedDomainCompare.value = null
        selectedIECompare.value = null
        selectedBenchmarkCompare.value = null
        selectedBenchmarksCompare.benchmarks = []
        return null
      }
      loaderStore.hasLoader = false
      const domainID = domain.id.split(":Domain:")[1]
      IE.IE = await domainStore.fetchIE(domainID)
          .then(res => {
            loaderStore.$reset()
            IE.fetching = false
            return res.data
          })
          .catch(err => console.error(err))

    }
    /**
     * Fetch the IEs to compare for the selected domain
     * @param domain
     */
    const fetchCompareIE = async(domain: any) => {
      selectedIECompare.value = null
      selectedBenchmarkCompare.value = null
      // If there is no domain selected, clear the IE/benchmarks array
      if (!domain) {
        compareIE.IE = []
        compareIE.fetching = false
        selectedBenchmarksCompare.benchmarks = []
        return null
      }
      loaderStore.hasLoader = false
      if (domain === 'external') {
        selectedBenchmarksCompare.fetching = true
        return benchmarkingStore.getBenchmarksFromGeekbench(selectedBenchmarkType.value)
            .then(res => {
              loaderStore.$reset()
              res.map((r: any) => r.data = r.data.value)
              selectedBenchmarksCompare.benchmarks = res.sort((a: any, b: any) => moment.utc(b.createdAt).diff(moment.utc(a.createdAt)))
              selectedBenchmarksCompare.fetching = false
            })
            .catch(err => console.error(err))
      }

      compareIE.fetching = true

      const domainID = domain.id.split(":Domain:")[1]
      compareIE.IE = await domainStore.fetchIE(domainID)
          .then(res => {
            loaderStore.$reset()
            compareIE.fetching = false
            return res.data
          })
          .catch(err => console.error(err))
    }
    /**
     * Get the benchmark list for the selected IE
     */
    const getIEBenchmarks = async() => {
      loaderStore.hasLoader = false
      selectedBenchmarks.fetching = true
      selectedBenchmark.value = null
      selectedBenchmarkCompare.value = null
      selectedBenchmarksCompare.benchmarks = []
      selectedDomainCompare.value = null
      selectedIECompare.value = null
      await benchmarkingStore.getBenchmarkList(selectedIE?.value, selectedBenchmarkType.value)
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
    /**
     * Get the benchmark list to be compared for the selected IE
     */
    const getIEBenchmarksCompare = async() => {
      loaderStore.hasLoader = false
      selectedBenchmarksCompare.fetching = true
      selectedBenchmarkCompare.value = null
      await benchmarkingStore.getBenchmarkList(selectedIECompare?.value, selectedBenchmarkType.value)
          .then((res: any) => {
            loaderStore.$reset()
            selectedBenchmarksCompare.benchmarks = res.sort((a: any, b: any) => moment.utc(b.createdAt).diff(moment.utc(a.createdAt)))
            selectedBenchmarksCompare.fetching = false
          })
          .catch(err => {
            selectedBenchmarksCompare.fetching = false
            console.error(err)
          })
    }
    onMounted(async() => {
      await fetchDomains()
    })

    const benchmark = computed(() => {
      if (selectedBenchmark.value?.data.singleCoreResults && selectedBenchmarkType.value === 'cpu') {
        return {
          tableConfig: {
            datatable: {
              style: {
                'overflow': 'auto'
              }
            }
          },
          compare: {
            benchmark: selectedBenchmarkCompare,
            type: selectedBenchmarkType
          },
          columns: [
            {
              label: 'Single-core'
            },
            {
              label: 'Multi-core'
            }
          ],
          rows: (() => {
            if (selectedBenchmark.value) {
              return [
                (() => Object.keys(selectedBenchmark.value.data.singleCoreResults))()
                    .map(v => {
                      return {value: benchmarkLabels[v as keyof object]}
                    }),
                (() => {
                  return Object.keys(selectedBenchmark.value.data.singleCoreResults)
                      .map((d: any) => {
                            return {
                              value: selectedBenchmark.value.data.singleCoreResults[d as keyof object]
                            }
                          }
                      )
                })(),
                (() => {
                  return Object.keys(selectedBenchmark.value.data.multiCoreResults)
                      .map((d: any) => {
                            return {
                              value: selectedBenchmark.value.data.multiCoreResults[d as keyof object]
                            }
                          }
                      )
                })()
              ]
            }
          })()
        }
      }
      if (selectedBenchmark.value?.data.tests && selectedBenchmarkType.value === 'network') {
        return {
          tableConfig: {
            datatable: {
              style: {
                'overflow': 'unset'
              }
            }
          },
          compare: {
            benchmark: selectedBenchmarkCompare,
            type: selectedBenchmarkType
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
    const benchmarkCompare = computed(() => {
      if (selectedBenchmarkCompare.value?.data.singleCoreResults &&
          selectedBenchmarkType.value === 'cpu') {
        return {
          tableConfig: {
            datatable: {
              style: {
                'overflow': 'auto'
              }
            }
          },
          columns: [
            {
              label: 'Single-core'
            },
            {
              label: 'Multi-core'
            }
          ],
          rows: (() => {
            if (selectedBenchmarkCompare.value) {
              return [
                (() => Object.keys(selectedBenchmarkCompare.value.data.singleCoreResults))()
                    .map(v => {
                      return {value: benchmarkLabels[v as keyof object]}
                    }),
                (() => {
                  return Object.keys(selectedBenchmarkCompare.value.data.singleCoreResults)
                      .map((d: any) => {
                            return {
                              value: selectedBenchmarkCompare.value.data.singleCoreResults[d as keyof object]
                            }
                          }
                      )
                })(),
                (() => {
                  return Object.keys(selectedBenchmarkCompare.value.data.multiCoreResults)
                      .map((d: any) => {
                            return {
                              value: selectedBenchmarkCompare.value.data.multiCoreResults[d as keyof object]
                            }
                          }
                      )
                })(),
              ]
            }
          })()
        }
      }
      if (selectedBenchmarkCompare.value?.data.tests &&
          selectedBenchmarkType.value === 'network') {
        return {
          tableConfig: {
            datatable: {
              style: {
                'overflow': 'unset'
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
            (() => Object.keys(selectedBenchmarkCompare.value.data?.tests[0]))()
                .filter(key => key !== 'conectionType')
                .map(v => {
                  return {value: benchmarkLabels[v as keyof object]}
                }),
            (() => {
              return Object.keys(selectedBenchmarkCompare.value.data?.tests[0])
                  .filter(key => key !== 'conectionType')
                  .map((d: any) => {
                        return {
                          value: selectedBenchmarkCompare.value.data?.tests[0][d as keyof object]
                        }
                      }
                  )
            })(),
            (() => {
              return Object.keys(selectedBenchmarkCompare.value.data?.tests[0])
                  .filter(key => key !== 'conectionType')
                  .map((d: any) => {
                        return {
                          value: selectedBenchmarkCompare.value.data?.tests[1][d as keyof object] || "---"
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

    return {
      settingsStore,
      benchmarkingStore,
      modalStore,
      loaderStore,
      toastStore,
      selectedIE,
      selectedDomain,
      selectedDomainCompare,
      selectedIECompare,
      benchmark,
      benchmarkCompare,
      domains,
      IE,
      fetchIE,
      fetchCompareIE,
      compareIE,
      selectedBenchmarks,
      selectedBenchmark,
      selectedBenchmarksCompare,
      selectedBenchmarkCompare,
      getIEBenchmarks,
      getIEBenchmarksCompare,
      moment,
      benchmarkRequest,
      benchmarkCompareRequest,
      selectedBenchmarkType
    }
  },
  methods: {
    _resetComparison(event: any) {
      if(!event.target.value) {
        this.selectedDomainCompare = null
        this.selectedIECompare = null
      }
    },
    requestBenchmark() {
      this.loaderStore.hasLoader = false
      this.benchmarkRequest = true
      return this.benchmarkingStore.runBenchmark(this.selectedIE, 'cpu')
          .then((res: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: "Benchmark requested",
              success: true ,
              data: {},
              autoRemove: false
            })
            this.benchmarkRequest = false
          })
          .catch((err: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: `Looks like something went wrong. Please try later`,
              success: false,
              data: {},
              autoRemove: false
            })
            this.benchmarkRequest = false
            console.error(err)
          })
    },
    requestCompareBenchmark() {
      this.loaderStore.hasLoader = false
      this.benchmarkCompareRequest = true
      return this.benchmarkingStore.runBenchmark(this.selectedIECompare, 'cpu')
          .then((res: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: "Benchmark requested",
              success: true ,
              data: {},
              autoRemove: false
            })
            this.benchmarkCompareRequest = false
          })
          .catch((err: any) => {
            this.loaderStore.$reset()
            this.toastStore.appendToast({
              label: `Looks like something went wrong. Please try later`,
              success: false,
              data: {},
              autoRemove: false
            })
            this.benchmarkCompareRequest = false
            console.error(err)
          })
    },
    benchmarkFromGeekbench() {
      return this.modalStore.showModal({
        template: "GeekbenchBenchmark",
        data: {
          onConfirm: (url: string) => {
            this.loaderStore.hasLoader = false
            this.modalStore.hideModal(null)
            this.modalStore.$reset()
            this.benchmarkingStore.runBenchmarkFromGeekbench(url)
                .then((res) => {
                  this.loaderStore.$reset()
                  this.toastStore.appendToast(
                      {
                        label: 'External Benchmark requested',
                        success: true,
                        data: {},
                        autoRemove: false
                      }
                  )
                })
                .catch((error) => {
                  console.error(error)
                  this.toastStore.appendToast(
                      {
                        label: error.message,
                        success: false,
                        data: {},
                        autoRemove: false
                      }
                  )
                })
          }
        }
      })
    }
  }
})
</script>

<style scoped>

.benchmark-filters{
  display: flex;
  justify-content: left;
  flex-direction: column;
  gap: 15px;
}

.search-select {
  display: flex;
  gap: 5px;
  width: auto;
  color: #004AAD;
  align-items: center;
  outline: none;
  padding: 5px;
  height: 46px;
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
  -webkit-animation: rotating 1.5s linear infinite;
  -moz-animation: rotating 1.5s linear infinite;
  -ms-animation: rotating 1.5s linear infinite;
  -o-animation: rotating 1.5s linear infinite;
  animation: rotating 1.5s linear infinite;
}

option.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

</style>