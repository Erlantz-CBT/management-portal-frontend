import {defineStore} from 'pinia'
import ASSETS from "@/constants/assets";
import {io} from 'socket.io-client';
import AuthenticationService from "@/services/AuthenticationService";
import axios from "axios";

/**
 * Notification store
 */

interface AerosNotification {
    id: string;
    type: string;
    category: string;
    alertSource: string;
    description: string;
    dateIssued: string;
    severity: string;
    actions?: any;
}

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        notifications: [] as AerosNotification[],
        unread: 0,
        socket: io("/", {
            path: `/${process.env.VUE_APP_NOTIFICATIONS_ENDPOINT}`,
            forceNew: true,
            query: {
                'token': `${AuthenticationService.Token()}`
            }
        })
    }),
    getters: {
        getNotifications(state) {
            return state.notifications
        },
        getUnread(state) {
            return state.unread
        }
    },
    actions: {
        fetchNotifications() {
          return axios
              .get(`/portal-backend/${process.env.VUE_APP_NOTIFICATIONS_ENDPOINT}`)
              .then((res) => {
                  this.$state.notifications = res.data
                  return {
                      notifications: res.data
                  }
              })
              .catch((err) => {
                  console.error(err)
                  return []
              })
        },
        addNotification(notification: AerosNotification) {
            return Promise
                .resolve(this.notifications.push(notification))
                .then(() => {
                    this.$state.unread++
                    if(this.$state.unread > 0) {
                        document.title = `(${this.$state.unread}) aerios-management-portal`
                    }
                })
                .then(() => {
                    // Show browser notification
                    new Notification('aeriOS Management Portal',
                        {
                            body: `[${notification.severity}] ${notification.description}`,
                            icon: ASSETS.favicon.base64
                        })
                })
                .then(() => {
                    return {
                     notifications: this.$state.notifications,
                     notification: notification
                    }
                })
        },
        removeNotification(id: string) {
            return axios
                .delete(`/portal-backend/${process.env.VUE_APP_NOTIFICATIONS_ENDPOINT}/${id}`)
                .then((res) => {
                    if(res.status === 200) {
                        this.notifications = this.notifications.filter(n => n.id !== id)
                    }
                })
                .then(() => this.$state.unread--)
                .then(() => {
                    return {
                     notifications: this.$state.notifications
                    }
                })
                .catch(err => console.error(err))

        },
        clearNotifications() {
            return axios
                .delete(`/portal-backend/${process.env.VUE_APP_NOTIFICATIONS_ENDPOINT}/clear`)
                .then((res) => {
                    if(res.status === 200) {
                        this.notifications = []
                    }
                })
                .then(() => this.$state.unread = 0)
                .then(() => {
                    return {notifications: this.$state.notifications}
                })
                .catch(err => console.error(err))
        }
    }
})