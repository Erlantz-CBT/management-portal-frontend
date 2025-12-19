import * as VueRouter from 'vue-router'
import HomeComponent from "@/components/HomeComponent.vue";
import DomainsComponent from "@/components/DomainsComponent.vue";
import NotificationsComponent from "@/components/NotificationsComponent.vue";
import DeploymentsComponent from "@/components/DeploymentsComponent.vue";
import ContinuumComponent from "@/components/ContinuumComponent.vue";
import NewDeploymentComponent from "@/components/NewDeploymentComponent.vue";
import DomainDetail from "@/components/DomainDetail.vue";
import BenchmarkingToolComponent from "@/components/BenchmarkingToolComponent.vue";
import DeploymentDetailComponent from "@/components/DeploymentDetailComponent.vue";
import KeycloakService from "@/services/AuthenticationService";

const routes = [
    {
        path: '/:catchAll(.*)',
        redirect: '/',
        meta: {
            label: false,
            authorized: [
                'IoT service deployer',
                'Domain administrator'
            ]
        }
    },
    {
        path: '/',
        component: HomeComponent,
        meta: {
            label: 'Home',
            authorized: [
                'IoT service deployer',
                'Domain administrator'
            ]
        }
    },
    {
        path: '/domains',
        name: 'domains' ,
        component: DomainsComponent,
        meta: {
            label: 'Domains',
            authorized: [
                'Domain administrator'
            ]
        },
        children: [
            {
                path: ':id',
                component: DomainDetail,
                props: true
            }
        ]
    },
    {   path: '/deployments',
        name: 'deployments',
        component: DeploymentsComponent,
        meta: {
            label: 'Deployments',
            authorized: [
                'IoT service deployer',
                'Domain administrator'
            ]
        },
        children: [
            {
                path: 'new',
                name: 'new-deployment',
                component: NewDeploymentComponent
            },
            {
                path: ':id',
                component: DeploymentDetailComponent,
                props: true
            }
        ]
        },
    {
        path: '/continuum',
        name: 'continuum' ,
        component: ContinuumComponent,
        meta: {
            label: 'Continuum',
            authorized: [
                'Domain administrator'
            ]
        }
    },
    {
        path: '/notifications',
        name: 'notifications' ,
        component: NotificationsComponent,
        meta: {
            label: 'Notifications',
            authorized: [
                'IoT service deployer',
                'Domain administrator'
            ]
        }
    },
    {
        path: '/benchmark',
        name: 'benchmark',
        component: BenchmarkingToolComponent,
        meta: {
            label: 'Benchmarking',
            authorized: [
                'Domain administrator'
            ]
        }
    }
]

const routerInit = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

// Prevent user to access on non authorized routes
routerInit.beforeEach((to, from) => {
    const user = KeycloakService.User()
    const authorized: any = to.meta.authorized
    return user?.realm_access?.roles?.some(r => authorized.includes(r))
})

const router = {
    initialization: routerInit,
    routes: routes
}

export default router

