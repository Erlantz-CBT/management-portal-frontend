import {defineStore} from "pinia";

interface Settings {
    colorScheme: string; // "dark" or "light"
    fontSize: string;
    language: string;
    policy: string;
    notification: any;
}

/**
 * Settings store
 */
export const useSettings = defineStore('useSettings', {
    state: () => {
        return {
            colorScheme: localStorage.getItem("colorScheme"),
            fontSize: localStorage.getItem('fontSize') || "16",
            language:  localStorage.getItem('i18n') || 'en',
            policy: "Any use of the information provided by the system which is not within the boundaries to which it was designed to, it is\n" +
                "considered an incidental finding and no single piece of data can be used for any other means.",
            notification: Notification.permission
        } as Settings
    }
})