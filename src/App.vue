<template>
  <div v-if="user?.realm_access?.roles.length > 0" :style="{'font-size': `${settingsStore.fontSize}px`}" class="sidebar" :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">
    <SideBar @logout="logout" :user="user"></SideBar>
  </div>
  <div
      :style="{'font-size': `${settingsStore.fontSize}px`}"
      class="view"
      :key="$route.path"
      :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
      v-show="!loaderStore.loading">
    <Transition name="fade" mode="out-in">
      <router-view :key="$route.fullPath"></router-view>
    </Transition>
  </div>
  <div
      :style="{'font-size': `${settingsStore.fontSize}px`}"
      :key="'spinner'"
      class="spinner" :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
      v-show="loaderStore.loading"
  >
    <VueSpinner size="40" color="#004AAD"></VueSpinner>
  </div>
  <ModalComponent :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" />
  <ToastsComponent />
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, watch} from 'vue';
import SideBar from "@/components/SideBar.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import ToastsComponent from "@/components/ToastsComponent.vue";
import AuthenticationService from "@/services/AuthenticationService";
import {useModalStore} from "@/stores/modal";
import {useLoaderStore} from "@/stores/loader";
import {VueSpinner} from "vue3-spinners";
import {useSettings} from "@/stores/settings";
import {useNotificationStore} from "@/stores/notifications";
import {useToastsStore} from "@/stores/toasts";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'App',
  components: {
    SideBar,
    ModalComponent,
    ToastsComponent,
    VueSpinner
  },
  setup: () => {
    const modalStore = useModalStore()
    const loaderStore = useLoaderStore()
    const settingsStore = useSettings()
    const toastsStore = useToastsStore()
    const router = useRouter()
    const notificationsStore = useNotificationStore()
    router.afterEach(() => {
      // Reset both loader and toasts store
      // in case some request remains pending
      loaderStore.$reset()
      toastsStore.$reset()
    })
    notificationsStore.socket.on('notification', (message) => {
      notificationsStore.addNotification(message)
    })
    onBeforeMount(() => {
      loaderStore.register()
    })
    return {
      modalStore,
      loaderStore,
      settingsStore
    }
  },
  data: function () {
    return {
      user: AuthenticationService.User()
    }
  },
  methods: {
    logout() {
      return AuthenticationService.CallLogout()
    }
  }
});
</script>

<style>

@import url('assets/reset.css');
@import url('https://fonts.googleapis.com/css?family=Poppins');
@import url('~vue-multiselect/dist/vue-multiselect.min.css');

body {
  margin: 0;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active{
  background-color: transparent !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}

::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

#app {
  font-family: Poppins, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #004AAD;
  display: grid;
  grid-template-areas: "sidebar view";
  grid-template-columns: 200px auto;
  grid-auto-rows: max-content;
}

.container {
  display: grid;
  grid-template-rows: 158px max-content 108px auto;
  min-width: 100%;
  height: 100vh;
  align-items: start;
  padding: 20px;
}

.header {
  display: grid;
  align-items: start;
  justify-content: space-between;
  padding: 15px 0 0 0;
  height: 100%;
  grid-auto-columns: 100%;
}

.btn-new {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  height: 30px;
  padding: 9px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 15px;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s ease-in-out;
}

.btn-new:hover {
  opacity: 0.7;
}

.login {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.sidebar {
  grid-area: sidebar;
  position: relative;
  height: 100vh;
  box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
  -webkit-box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
  -moz-box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
}

.spinner {
  display: grid;
  grid-area: view;
  width: calc(100vw - 200px);
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

#app, .sidebar, .view {
  transition: background-color 0.3s linear;
}

.dark {
  background-color: #0F0F0F;
  color: #E6EAF6 !important;
}

.aeros-modal.dark {
  border: none;
}

.view {
  grid-area: view;
  width: calc(100vw - 200px);
  max-height: 100vh;
  overflow: auto;
}

h2.dark,
h3.dark,
h4.dark {
  background-color: transparent;
  color: #E6EAF6 !important;
}

.light {
  background-color:#ffffff !important;
}

h2.light, h4.light {
  background-color: transparent;
}

input.dark,
select.dark,
option.dark,
textarea.dark {
  color: #ffffff;
  background-color: transparent;
}

.back {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 161px;
  height: 30px;
  padding: 3px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s ease-in-out;
}

.back:hover {
  opacity: 0.7;
}

</style>
