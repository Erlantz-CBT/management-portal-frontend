# aeriOS Management Portal
Frontend of the aeriOS Management Portal developed using Vue.js

aeriOS Meta-OS users land to the welcome page after performing the logging process interacting with Oauth2.0 protocol of Keycloak Identity Manager (IdM). This introductory page consists of a central descriptive part and the side navigation menu. When it comes to the navigation menu, the user can choose from several options, the current list follows below:
* Home (__~/components/HomeComponent.vue__): by clicking this item the user will be redirect to the home page of the Portal.
* Domains (__~/components/DomainsComponent.vue__): clicking on the Domains option will direct the user to the section related to his/her domains within the aeriOS continuum.  In this section the user can go into the details of a selected domain such as the list of the IE that build the domain, along with their metrics collected in real-time.
* Deployments (__~/components/DeploymentsComponent.vue__): by clicking on the Deployments option the user will be redirected to the wizard that list the deployed services and allows to request a service orchestration in the aeriOS continuum.
* Continuum (__~/components/ContinuumComponent.vue__): in this page, users will be able to see, in a simple and intuitive way, their own relative Infrastructure Elements that comprise their domains: the aeriOS continuum indeed.
* Benchmarking (__~/components/Benchmarking/__): this section is dedicated to the benchmarking of the different Infrastructure Elements that the user has in his/her continuum. The user will be able to select the IE to be benchmarked and the type of benchmark to be performed.
* Notifications (__~/components/NotificationsComponent.vue__): this section has been created to inform users that some events have been triggered (the list of events and the development will be performed in the next phase).
* Users (__~/components/UsersComponent.vue__): this section is dedicated to the management of the users that have access to the aeriOS Management Portal. Here, users with admin role will be able to add/remove users and assign roles.
* Settings (__~/components/SettingsComponent.vue__): this section is dedicated to the management of the settings of the aeriOS Management Portal.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Keycloak configuration

The included [keycloak.json](public/keycloak.json) file has been configured to be used in development mode, because the *dashboard* Keycloak Client has a configured redirect URL of *http://localhost:8081*. For production, please use the proper configuration according to your continuum.
