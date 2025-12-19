import { createApp } from 'vue'
import { createPinia } from "pinia";
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
import KeycloakService from "@/services/AuthenticationService";
import routerInit from "@/router";
import axios from 'axios'
import VueAxios from 'vue-axios'
import mitt from "mitt";

// Import CSS reset
import "./assets/reset.css"

import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faArrowRightFromBracket,
    faArrowRight,
    faArrowLeft,
    faEye,
    faEdit,
    faTrash,
    faCirclePlus,
    faPencil,
    faCircle,
    faCheck,
    faChartLine,
    faScrewdriverWrench, faCircleXmark, faXmark, faNetworkWired, faList
} from '@fortawesome/free-solid-svg-icons'

import { faCircle as regularCircle } from '@fortawesome/free-regular-svg-icons'

library.add(faArrowRight,
    faArrowLeft,
    faArrowRightFromBracket,
    faEye,
    faEdit,
    faPencil,
    faTrash,
    faCirclePlus,
    faCircle,
    faCircleXmark,
    faXmark,
    faCheck,
    faChartLine,
    faNetworkWired,
    faScrewdriverWrench,
    faList,
    regularCircle)


const pinia = createPinia();
// const emitter = mitt();
//
// const app = createApp(App)
//         .component('font-awesome-icon', FontAwesomeIcon)
//         .use(routerInit.initialization)
//         .use(pinia)
//         .use(VueAxios, axios)
//         .use(VNetworkGraph)


// App.config.globalProperties.emitter = emitter;

const renderApp = () => {
    createApp(App)
        .component('font-awesome-icon', FontAwesomeIcon)
        .use(routerInit.initialization)
        .use(pinia)
        .use(VueAxios, axios)
        .use(VNetworkGraph)
        .mount('#app')
}

KeycloakService.CallLogin(renderApp)
