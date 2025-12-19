<template>
  <div class="sidebar-container">
    <img src="@/assets/aeros_logo.png" class="sidebar-logo" alt="logo">
    <ul class="links">
      <li class="link" v-for="route in routes" :key="route">
        <router-link v-if="route.meta.label" class="router-link" active-class="active" v-bind:to="route.path">{{ route.meta.label }}</router-link>
      </li>
    </ul>
    <ul class="user">
      <li class="username">
        {{user?.preferred_username}}
      </li>
      <li>
        <router-link class="router-link" to="/settings">Settings</router-link>
      </li>
      <li>
        <a class="logout" @click="$emit('logout')">
          Logout <font-awesome-icon icon="arrow-right-from-bracket"></font-awesome-icon>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  name: "SideBar",
  props: ['user', 'logout'],
  setup: (props) => {

    /**
     * Check if a role is present inside the authorized roles for a route
     * @param routeAuthorized
     * @param userRoles
     */
    const findRole = (routeAuthorized: string[], userRoles: string[]) => {
      return userRoles?.some(r => routeAuthorized.includes(r))
    }
    return {
      routes: router.routes
          .filter((route: any) =>
              findRole(route.meta.authorized, props?.user?.realm_access?.roles
              ))
    }
  }
});


</script>

<style scoped>

.sidebar-container {
  height: 100vh;
  display: grid;
  grid-auto-rows: 100px auto 190px;
}

.user, .links {
  list-style: none;
  text-align: start;
  padding-inline-start: 30px;
}

li, li > a {
  color: #004AAD
}

.link {
  padding: 0.2em;
}

.link, router-link, .logout {
  user-select: none;
}

.router-link {
  text-decoration: none;
}

.user > li {
  padding-top: 25px;
}

.logout {
  text-decoration: none;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}

.active {
  font-weight: bold;
}

.username {
  text-transform: capitalize;
  font-weight: bold;
  font-size: 14px;
}

.sidebar-logo {
  margin-top: 34px;
  justify-self: center;
}
</style>