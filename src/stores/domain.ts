import {defineStore} from 'pinia'
import axios from 'axios'

/**
 * Domain store
 */
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
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains`, {timeout: 5000})
        },
        fetchDomain(domainId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains/urn:ngsi-ld:Domain:${domainId}`)
        },
        fetchIEList() {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/infrastructure-elements`)
        },
        fetchIE(domainId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DOMAINS_ENDPOINT}/domains/urn:ngsi-ld:Domain:${domainId}/infrastructure-elements`)

        }
    }
})