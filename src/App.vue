<!--<template>-->
<!--  <div v-show="$route.name !== 'login'">-->
<!--    <div class="sidebar">-->
<!--      <SideBar @logout="logout" :user="user"></SideBar>-->
<!--    </div>-->
<!--    <div class="view">-->
<!--      <router-view>-->
<!--      </router-view>-->
<!--    </div>-->
<!--    <ModalComponent></ModalComponent>-->
<!--  </div>-->
<!--  <div v-show="$route.name === 'login'" class="login">-->
<!--    <router-view>-->
<!--    </router-view>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div class="sidebar">
    <SideBar @logout="logout" :user="user"></SideBar>
  </div>
  <div class="view" v-show="!loaderStore.loading">
    <router-view>
    </router-view>
  </div>
  <div class="view" v-show="loaderStore.loading">
    <VueSpinner size="40" color="#004AAD"></VueSpinner>
  </div>
  <ModalComponent />
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
import {onBeforeRouteUpdate} from "vue-router";

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
    // const domainStore = useDomainStore()
    onBeforeRouteUpdate((to, from) => {
      console.log(to)
      console.log(from)
    })
    onBeforeMount(() => {
      // domainStore.fetchDomains()
      loaderStore.register()
    })
    return {
      modalStore,
      loaderStore
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

@import url('https://fonts.googleapis.com/css?family=Poppins');
body {
  margin: 0;
}

/* Firefox (uncomment to work in Firefox, although other properties will not work!)  */
/** {
  scrollbar-width: thin;
  scrollbar-color: #004AAD #FFF4F4;
}*/

/* Chrome, Edge and Safari */
/**::-webkit-scrollbar {*/
/*  height: 10px;*/
/*  width: 10px;*/
/*}*/
/**::-webkit-scrollbar-track {*/
/*  border-radius: 10px;*/
/*  background-color: transparent;*/
/*}*/

/**::-webkit-scrollbar-track:hover {*/
/*  background-color: transparent;*/
/*}*/

/**::-webkit-scrollbar-track:active {*/
/*  background-color: transparent;*/
/*}*/

/**::-webkit-scrollbar-thumb {*/
/*  border-radius: 10px;*/
/*  background-color: #004AAD;*/
/*}*/

/**::-webkit-scrollbar-thumb:hover {*/
/*  background-color: #004AAD;*/
/*}*/

/**::-webkit-scrollbar-thumb:active {*/
/*  background-color: #004AAD;*/
/*}*/

#app {
  font-family: Poppins;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: grid;
  grid-template-areas: "sidebar view";
  grid-template-columns: 200px auto;
  grid-auto-rows: max-content;
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
  height: 100vh;
  box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
  -webkit-box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
  -moz-box-shadow: 1px 0px 4px 0px rgba(84,82,82,0.37);
}

.view {
  grid-area: view;
  display: inline-grid;
  justify-content: center;
  align-items: center;
  max-height: 100vh;
  overflow: auto;
}
</style>
