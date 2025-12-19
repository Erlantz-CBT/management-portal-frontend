import { createApp } from 'vue';
import { createPinia } from "pinia";
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";
import App from './App.vue';
import KeycloakService from "@/services/AuthenticationService";
import i18n from "@/i18n/i18n";
import routerInit from "@/router";
import axios from 'axios';
import VueAxios from 'vue-axios';
import moment from 'moment';


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
    faScrewdriverWrench,
    faCircleXmark,
    faXmark,
    faNetworkWired,
    faList,
    faCircleNodes,
    faBolt,
    faPlugCircleBolt,
    faScaleBalanced,
    faSeedling,
    faLeaf,
    faRotate,
    faChevronUp,
    faChevronDown,
    faMagnifyingGlass,
    faChevronLeft,
    faChevronRight,
    faUser,
    faCloudArrowUp,
    faUpload,
    faPlay,
    faPause,
    faArrowUp,
    faSpinner,
    faArrowDown,
    faEquals,
    faArrowUpRightFromSquare,
    faUserGroup,
    faWrench,
    faMicrochip,
    faMemory,
    faHardDrive,
    faTriangleExclamation,
    faCircleUser,
    faIdCard,
    faEnvelope,
    faUsers,
    faPaperclip,
    faAt,
    faLink,
    faCopy,
    faStop,
    faGear, faLock, faLockOpen, faExclamation, faCircleExclamation, faMoon, faSun
} from '@fortawesome/free-solid-svg-icons'

import { faCircle as regularCircle } from '@fortawesome/free-regular-svg-icons'
import AuthenticationService from "@/services/AuthenticationService";

library.add(faArrowRight,
    faArrowLeft,
    faArrowRightFromBracket,
    faArrowUp,
    faArrowDown,
    faEquals,
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
    faCircleNodes,
    faBolt,
    faPlugCircleBolt,
    faScaleBalanced,
    faSeedling,
    faLeaf,
    regularCircle,
    faChevronUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faMagnifyingGlass,
    faCloudArrowUp,
    faUpload,
    faUser,
    faUserGroup,
    faPlay,
    faPause,
    faBolt,
    faArrowUpRightFromSquare,
    faSpinner,
    faWrench,
    faMicrochip,
    faMemory,
    faHardDrive,
    faTriangleExclamation,
    faIdCard,
    faCircleUser,
    faEnvelope,
    faUsers,
    faPaperclip,
    faAt,
    faLink,
    faCopy,
    faStop,
    faGear,
    faLock,
    faLockOpen,
    faCircleExclamation,
    faMoon,
    faSun,
    faRotate)


const pinia = createPinia();

const clickOutside = {
    beforeMount: (el: any, binding: any) => {
        el.clickOutsideEvent = (event: any) => {
            // here I check that click was outside the el and his children
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el: any) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};



const renderApp = () => {
    createApp(App)
        .component('font-awesome-icon', FontAwesomeIcon)
        .use(i18n)
        .use(pinia)
        .use(routerInit.initialization)
        .use(VueAxios, axios)
        .use(VNetworkGraph)
        .provide('$moment', moment) // provide moment globally trought the inject method
        .provide('$user', AuthenticationService.User())
        .directive('click-outside', clickOutside)
        .mount('#app')
}


KeycloakService.CallLogin(renderApp)
KeycloakService.RefreshToken()
