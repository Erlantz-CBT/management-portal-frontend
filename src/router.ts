import * as VueRouter from 'vue-router'
import KeycloakService from "@/services/AuthenticationService";
import ROLES from "@/constants/roles";
// import { logEventAndStore } from "./firebase"
// import FIREBASE_EVENTS from "@/constants/firebase_events"

// Routes lazy loading
const Home = () => import("@/components/HomeComponent.vue")
const Domains = () => import("@/components/DomainsComponent.vue")
const Notifications = () => import("@/components/NotificationsComponent.vue")
const Deployments = () => import("@/components/DeploymentsComponent.vue")
const Continuum = () => import("@/components/ContinuumComponent.vue")
const NewDeployment = () => import("@/components/NewDeploymentComponent.vue")
const Domain = () => import("@/components/DomainDetail.vue")
const Deployment = () => import("@/components/DeploymentDetailComponent.vue")
const Settings = () => import("@/components/SettingsComponent.vue")
const Users = () => import("@/components/UsersComponent.vue")
const Benchmarking = () => import("@/components/Benchmarking/BenchmarkingToolComponent.vue")
const BenchmarkingComparison = () => import("@/components/Benchmarking/BenchmarkingComparisonComponent.vue")
// const NewUser = () => import("@/components/NewUserComponent.vue")
// const User = () => import("@/components/UserDetailComponent.vue")
// const DataCatalog = () => import("@/components/DataCatalogComponent.vue")
const Unauthorized = () => import("@/components/UnauthorizedComponent.vue")

// The label determines the presence of the route in the sidebar
// Use only the keys from i18n/i18n.ts.sidebar

const allRoles = Object.keys(ROLES).map((k: unknown) => ROLES[k as keyof typeof ROLES])

const routes = Object.freeze([
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: Unauthorized,
        meta: {
            label: false,
            authorized: []
        }
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
        meta: {
            label: false,
            authorized: allRoles
        }
    },
    {
        path: '/',
        component: Home,
        meta: {
            label: 'sidebar.home',
            authorized: allRoles
        }
    },
    {
        path: '/domains',
        query: false,
        name: 'domains',
        component: Domains,
        meta: {
            label: 'sidebar.domains',
            authorized: [
                ROLES.continuumAdministrator,
                ROLES.dataProductOwner,
                ROLES.verticalDeployer
            ]
        },
        children: [
            {
                path: 'domain/:id',
                name: 'domain',
                component: Domain,
                props: true
            }
        ]
    },
    {   path: '/deployments',
        name: 'deployments',
        component: Deployments,
        meta: {
            label: 'sidebar.deployments',
            authorized: [
                ROLES.continuumAdministrator,
                ROLES.dataConsumer,
                ROLES.aerosUser,
                ROLES.verticalDeployer
            ]
        },
        children: [
            {
                path: 'new',
                name: 'new-deployment',
                component: NewDeployment
            },
            {
                path: 'deployment/:id',
                component: Deployment,
                props: true
            }
        ]
    },
    {
        path: '/continuum',
        name: 'continuum' ,
        component: Continuum,
        meta: {
            label: 'Continuum',
            authorized: [
                ROLES.continuumAdministrator,
                ROLES.dataProductOwner,
                ROLES.verticalDeployer
            ]
        }
    },
    {
        path: '/benchmark',
        name: 'benchmark',
        component: Benchmarking,
        meta: {
            label: 'Benchmarking',
            authorized: [
                ROLES.continuumAdministrator
            ]
        },
        children: [
            {
                path: 'compare',
                name: 'compare',
                props: {selectedBenchmark: true},
                component: BenchmarkingComparison
            }
        ]
    },
    {
        path: '/notifications',
        name: 'notifications' ,
        component: Notifications,
        meta: {
            label: 'sidebar.notifications',
            authorized: allRoles
        }
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
        meta: {
            label: 'sidebar.users',
            authorized: [
                ROLES.continuumAdministrator
            ]
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            label: false,
            authorized: allRoles
        }
    }

])

const routerInit = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})


// Prevent user to access on nonauthorized routes
routerInit.beforeEach((to, from) => {
    const user = KeycloakService.User()
    const authorizations = user!.realm_access!.roles
    const authorized: any = to.meta.authorized
    const publicRoute = authorized.length === 0 // Public routes that do not require authentication
    if (publicRoute && !authorizations.length) {
        return true
    }
    const auth: boolean | undefined = authorizations?.some(r => authorized.includes(r))
    if (to.path === '/unauthorized' && authorizations.length > 0) {
        // If a user is already authorized, redirect to the homepage
        return { path: "/" }
    }
    if (!auth && !publicRoute && authorizations.length > 0) {
        // If a user is not authorized, redirect on the homepage
        return { path: "/" }
    }
    // const event = {
    //     eventName: FIREBASE_EVENTS.pageView
    // }
    // // New deployment form count as "deploy_start" event
    // if (to.path === '/deployments/new') {
    //     event.eventName = FIREBASE_EVENTS.deployStart
    // }
    // logEventAndStore(event).then(() => null)
    // if (auth && !publicRoute && authorizations.length > 0) {
    //     return true
    // } else {
    //     return {path: "/unauthorized"}
    // }

})

const router = {
    initialization: routerInit,
    routes: routes
}

export default router

