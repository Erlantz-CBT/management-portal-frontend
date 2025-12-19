import {defineStore} from 'pinia'
import axios from 'axios'

/**
 * Deployment store
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
                .then(res => {
                    console.log(res)
                    return res
                })
        },
        getDeploymentStatus(deploymentId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}/components`)
                .then((r: any) => {
                    return r.data
                        .map((e: any) => e.serviceComponentStatus)
                        .every((s: string) => s.split(":ServiceComponentStatus:")[1] === "Running")
                })
                .catch(err => console.error(err))
        },
        fetchDeployments() {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services`)
        },
        stopDeployment(deploymentId: string) {
            return axios
                .delete(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}`)
        },
        getDeploymentDetail(deploymentId: string) {
            return axios
                .get(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}/components`)
        },
        newDeployment(deployment: any){
            return axios
                .post(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/`,
                    deployment)
        },
        deleteDeployment(deploymentId: string) {
            return axios
                .delete(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}/clear`)
        },
        startDeployment(deploymentId: string) {
            return axios
                .post(`/portal-backend/${process.env.VUE_APP_DEPLOYMENTS_ENDPOINT}/services/${deploymentId}`, {})
        }
    }
})