<template>
  <div style="display: grid; align-self: start; padding: 20px; width: calc(-217px + 100vw);">
    <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px;">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{ $t('users.newUser') }}</h2>
      <router-link to="/users" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> {{$t('sidebar.users')}} <span></span></router-link>
    </div>
    <div style="display: grid; justify-content: center;width: calc(-245px + 100vw); padding: 24px 0 24px 0">
      <div class="new-user">
        <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="padding-top: 10px">
          {{ $t('users.userData') }}
        </p>
        <div style="display: grid; height: 90%; justify-items: center; grid-template-columns: auto auto">
          <input
              v-model="newUser.userName.value"
              @input="(e) => newUser.userName.valid = e.target.value.length > 0"
              placeholder="Username"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="text"
              class="stepper-input"
          >
          <input
              v-model="newUser.email.value"
              placeholder="E-mail"
              @input="(e) => newUser.email.valid = e.target.validity.valid"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="email"
              autocomplete="new-text"
              class="stepper-input"
          >
          <input
              v-model="newUser.firstName.value"
              @input="(e) => newUser.firstName.valid = e.target.value.length > 0"
              placeholder="First name"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="text"
              class="stepper-input"
          >
          <input
              v-model="newUser.lastName.value"
              @input="(e) => newUser.lastName.valid = e.target.value.length > 0"
              placeholder="Last name"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="text"
              class="stepper-input"
          >
          <input
              v-model="newUser.userPassword.value"
              placeholder="Password"
              @input="(e) => newUser.userPassword.valid = e.target.validity.valid"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="password"
              autocomplete="new-password"
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,}$"
              title="Enter a password 12 character long with at least a capital letter and a special character"
              class="stepper-input"
          >
          <select
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              class="stepper-input"
              @change="(e) => newUser.role.valid = e.target.value !== null"
              v-model="newUser.role.value"
              id="role">
            <option
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                :value="null">Select a role</option>
            <option
                v-for="role in ROLES"
                :key="role"
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                :value="role">{{role}}</option>
          </select>
          <select
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              class="stepper-input"
              @change="(e) => newUser.group.valid = e.target.value !== null"
              v-model="newUser.group.value"
              id="role">
            <option
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                :value="null">Select an organization</option>
            <option
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                :value="undefined">Create a new organization</option>
            <option
                v-for="group in groups.groups"
                :key="group"
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                :value="group">{{group.cn}}</option>
          </select>
          <input
              v-if="newUser.group.value === undefined"
              @input="(e) => checkNewGroupValidity(e.target)"
              v-model="newGroup"
              placeholder="New organization name"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              type="text"
              class="stepper-input"
          >
        </div>
        <button :disabled="Object.keys(newUser).find(k => newUser[k].valid === false)" style="margin-top: 20px; margin-bottom: 20px; justify-self: center" class="stepper-btn">{{$t('users.confirm')}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, reactive, ref} from "vue";
import {useSettings} from "@/stores/settings";
import {useUsersStore} from "@/stores/users";
import ROLES from "@/constants/roles";

export default defineComponent({
  name: "NewUserComponent",
  setup: () => {
    const settingsStore = useSettings()
    const userStore = useUsersStore()
    const newUser = ref({
      role: {
        value: null,
        valid: false
      },
      userName: {
        value: null,
        valid: false
      },
      firstName: {
        value: null,
        valid: false
      },
      lastName: {
        value: null,
        valid: false
      },
      email: {
        value: null,
        valid: false
      },
      userPassword: {
        value: null,
        valid: false
      },
      group: {
        value: null,
        valid: false
      }
    })
    const roles: any[] = []
    const groups = reactive({groups: []})
    const fetchGroups = async() => {
      groups.groups = await userStore.getGroups()
        .then(res => res)
        .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchGroups()
    })
    const newGroup = ref(null)
    const emailValidation: any = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return {
      settingsStore,
      ROLES,
      groups,
      newUser,
      newGroup,
      emailValidation
    }
  },
  methods: {
    checkNewGroupValidity(target: any) {
      // Check if there is some other organization with this cn
      const checkForCnGroups = this.groups.groups.some((g: any) => g.cn === this.newGroup)
      target.setCustomValidity("")
      if (checkForCnGroups) {
        target.setCustomValidity("Invalid field")
      }
    }
  }
})
</script>

<style scoped>

.new-user {
  width: 637px;
  min-height: 333px;
  border-radius: 10px;
  border: solid 1.5px #E6EAF6;
  padding: 7px;
  align-self: start;

}

.stepper-input {
  height: 40px;
  width: 275px;
  margin-top: 20px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-input[type=email]:invalid,
.stepper-input[type=password]:invalid,
.stepper-input[type=text]:invalid{
  border: 1px solid #b72121
}

.stepper-btn {
  width: 320px;
  background: #004AAD;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 10px;
  height: 40px;
}

.stepper-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>