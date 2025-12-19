import {defineStore} from "pinia";
import axios from "axios";
import AuthenticationService from "@/services/AuthenticationService";

export const useLoaderStore = defineStore('loader', {
    state: () => {
        return {
            loading: false,
            hasLoader: true,
            requests: [] as string[]
        }
    },
    actions: {
        register() {
            axios.interceptors.request.use((request: any) => {
                // keycloak.js adapter keep the token in memory
                // there's no need to keep also in the store
                const token = AuthenticationService.Token()
                request.headers.Authorization = `Bearer ${token}`
                if (request) {
                    if (this.hasLoader) {
                        this.loading = true
                    }
                    this.requests.push(request.url)
                }
                return request
            }, (error) => {
                this.loading = false
                return Promise.reject(error)
            })
            axios.interceptors.response.use( (response: any) =>  {
                if (response) {
                    this.requests = this.requests.filter(r => !response.request.responseURL.includes(r))
                    // If there is any request pending, keep the loading status
                    if (this.hasLoader) {
                        this.loading = this.requests.length > 0
                    }
                }
                return response
            }, (error) => {
                this.requests = this.requests.filter(r => !error.request.responseURL.includes(r))
                this.loading = false
                return Promise.reject(error)
            } )
        }
    }
})