<template>
  <div class="sidebar-container">
    <img src="@/assets/aeros_logo.png" class="sidebar-logo" alt="logo">
    <ul class="links">
      <li class="link" v-for="route in routes" :key="route">
        <router-link
            v-if="route.meta.label"
            :style="{'color': settingsStore.colorScheme === 'dark' ? '#E6EAF6' : '#004AAD'}"
            class="router-link"
            active-class="active"
            :to="route.path">
          {{ $t(route.meta.label) }}
          <span
              class="badge"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#000000' : '#FFFFFF',
                'border': settingsStore.colorScheme === 'dark' ? '2px solid rgba(0, 0, 0, 0.8)' : '2px solid transparent'
              }"
              v-if="route.name === 'notifications' && notificationsStore.getUnread > 0">
            {{`${notificationsStore.getUnread}+`}}
          </span>
        </router-link>
      </li>
    </ul>
    <ul class="user">
      <li :style="{fontSize: `${12 + (user?.preferred_username.length - 23)}px`}" class="username">
        {{user?.preferred_username}}
      </li>
      <li>
        <router-link
            :style="{'color': settingsStore.colorScheme === 'dark' ? '#E6EAF6' : '#004AAD'}"
            class="router-link"
            active-class="active"
            to="/settings">
          {{ $t('settings.settings') }}
        </router-link>
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
import {defineComponent, ref} from "vue";
import router from "@/router";
import { useSettings } from "@/stores/settings";
import {useNotificationStore} from "@/stores/notifications";
export default defineComponent({
  name: "SideBar",
  props: ['user', 'logout'],
  setup: (props) => {

    /**
     * Check if a role is present inside the authorized roles for a route
     * @param routeAuthorized
     * @param userRoles
     */
    const settingsStore = useSettings()
    const notificationsStore = useNotificationStore()
    const notifications = ref(notificationsStore.getUnread)
    router.initialization.afterEach((r, b) => {
      if(r.path === '/notifications') {
        notificationsStore.unread = 0
        document.title = 'aerios-management-portal'
      }
    })
    const findRole = (routeAuthorized: string[], userRoles: string[]) => {
      return userRoles?.some(r => routeAuthorized.includes(r))
    }
    return {
      settingsStore,
      notifications,
      notificationsStore,
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
  grid-auto-rows: 150px auto 190px;
}

.user, .links {
  list-style: none;
  text-align: start;
  padding-inline-start: 30px;
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

.router-link:hover {
  font-weight: bold;
  transition: font-weight 150ms ease;
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
  font-weight: bold;
  font-size: 14px;
}

.sidebar-logo {
  margin-top: 34px;
  justify-self: center;
  width: 80%;
}

.badge {
  background-color: #e1002d;
  color: #000000;
  font-size: 12px;
  border-radius: 22px;
  min-width: 8px;
  max-width: 18px;
  padding: 0 7px;
  line-height: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.8);
}
</style>