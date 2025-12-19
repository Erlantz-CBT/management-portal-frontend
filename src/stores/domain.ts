import {defineStore} from 'pinia'
import axios from 'axios'

/**
 * Domain store
 */

interface Anomaly {
    toleranceThresholdAnomaly: number;
    toleranceThresholdNormal: number;
    windowAnomaly: number;
    windowNormal: number;
}

export const useDomainStore = defineStore('domain', {
    state: () => ({
        domains: [],
        isFetching: true
    }),
    getters: {
        getDomains (state) {
            return state.domains
        },
        getIsFetching (state) {
            return state.isFetching
        }
    },
    actions: {
        fetchDomains() {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains`)
        },
        fetchDomain(domainId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains/urn:ngsi-ld:Domain:${domainId}`)
        },
        fetchIE(domainId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains/urn:ngsi-ld:Domain:${domainId}/infrastructure-elements`)
        },
        fetchSelfIE(ieID: string, type: string) {
            return axios
                .get(`/portal-backend/self/${ieID}/optimization/anomaly/parameters/${type}`)
                .then(res => res.data)
        },
        updateSelfIE(ieID: string, body: Anomaly, type: string) {
            return axios
                .put(`/portal-backend/self/${ieID}/optimization/anomaly/parameters/${type}`, body)
        }
    }
})