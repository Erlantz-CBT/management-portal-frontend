import {defineStore} from 'pinia'
import axios from 'axios'

/**
 * Domain store
 */
export const useDeploymentsStore = defineStore('deployments', {
    state: () => ({
        deployments: []
    }),
    getters: {
        getDomains (state) {
            return state.deployments
        }
    },
    actions: {
        fetchDeployment(deploymentId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}`)
        },
        fetchDeployments() {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services`)
        },
        deleteDeployment(deploymentId: string) {
            return axios
                .delete(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}`)
        },
        getDeploymentDetail(deploymentId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}/components`)
        },
        newDeployment(deployment: any){
            return axios
                .post(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/`, deployment)
        }
    }
})