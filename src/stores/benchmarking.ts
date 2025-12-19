import {defineStore} from 'pinia'
import axios from "axios";

export const useBenchmarkingStore = defineStore('benchmarking', {
    state: () => ({
        selectedDomain: null,
        selectedIE: null,
        benchmarks: []
    }),
    actions: {
        getBenchmarkList(ieId: string | null, benchmarkType: string) {
            return axios
                .get(`/portal-backend/benchmarking/list/${ieId}?benchmarkType=${benchmarkType}`)
                .then(res => res.data)
                .catch(err => err)
        },
        getSelectedBenchmark() {
            return {
                selectedIE: this.$state.selectedIE,
                selectedDomain: this.$state.selectedDomain
            }
        },
        runBenchmark(ieId: any, benchmarkType: string) {
            return axios
                .post(`/portal-backend/benchmarking/${benchmarkType}/${ieId}`)
        },
        runBenchmarkFromGeekbench(url: string) {
            return axios
                .post(`/portal-backend/benchmarking/cpu/fromGeekbenchUrl`, {
                    url: url
                })
                .then(res => res.data)
                .catch(err => {
                    console.error(err)
                    return err
                })
        },
        getBenchmarksFromGeekbench(benchmarkType: string){
            return axios
                .get(`/portal-backend/benchmarking/list/otherDevices?benchmarkType=cpu`)
                .then(res => res.data)
                .catch(err => err)
        }
    }
})