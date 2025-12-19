<template>
  <div style="display: grid; align-self: start">
    <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{ $t('users.newUser') }}</h3>
    <div class="new-user">
      <input
          v-model="newUser.userName.value"
          @input="(e) => newUser.userName.valid = newUser.userName.value.length > 0"
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
          @input="(e) => newUser.firstName.valid = newUser.firstName.value.length > 0"
          placeholder="First name"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          type="text"
          class="stepper-input"
      >
      <input
          v-model="newUser.lastName.value"
          @input="(e) => newUser.lastName.valid = newUser.lastName.value.length > 0"
          placeholder="Last name"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          type="text"
          class="stepper-input"
      >
      <div class="input-wrapper">
        <input
            v-model="newUser.userPassword.value"
            placeholder="Password"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            type="password"
            autocomplete="new-password"
            @input="(e) => newUser.userPassword.valid = e.target.validity.valid"
            @focusout="(e) => newUser.userPassword.valid = e.target.validity.valid"
            pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{12,}$"
            title="Enter a password 12 character long with at least: 1 uppercase, 1 digit, 1 special character"
            class="stepper-input"/>
        <span
            v-if="!newUser.userPassword.valid && newUser.userPassword.value"
            class="invalid-help-text">
          Invalid password (12 character long, 1 uppercase, 1 digit, 1 special character)
        </span>
      </div>
      <div class="input-wrapper">
        <input
            v-model="confirmPassword.value"
            placeholder="Confirm password"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            type="password"
            autocomplete="off"
            @input="(e) => checkConfirmPassword(e.target)"
            @focusout="(e) => checkConfirmPassword(e.target)"
            class="stepper-input"/>
        <span
            v-if="!confirmPassword.valid && confirmPassword.value"
            class="invalid-help-text">
          The two passwords must match
        </span>
      </div>
      <select
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="stepper-input"
          @change="switchGroup"
          v-model="newUser.group.value"
          id="role">
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="null">Select an organization</option>
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="undefined">+ Create a new organization</option>
        <option
            v-for="group in groups.groups"
            :key="group"
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="group.cn">{{group.cn}}</option>
      </select>
      <select
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="stepper-input"
          @change="(e) => newUser.role.valid = newUser.role.value !== null"
          v-model="newUser.role.value"
          id="role">
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="null">Select a role</option>
        <option
            v-for="role in ROLES"
            :key="role"
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="role">{{role}}</option>
      </select>
      <div class="input-wrapper">
        <input
            v-if="newUser.group.value === undefined"
            @input="(e) => checkNewGroupValidity(e.target)"
            v-model="newGroup.value"
            placeholder="New organization name"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            type="text"
            class="stepper-input"
        >
        <span
            v-if="!newGroup.valid && newGroup.value"
            class="invalid-help-text">
          Organization already exist
        </span>
      </div>
    </div>
    <a
        style="margin-top: 30px; justify-self: center"
        class="stepper-btn"
        :class="disableCreateUser() ? 'disabled' : null"
        @click="createUser()"
    ><font-awesome-icon class="icon" v-if="userCreation" :icon="'spinner'" /> {{$t(label)}}</a>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, reactive, ref} from "vue";
import {useSettings} from "@/stores/settings";
import {useUsersStore} from "@/stores/users";
import ROLES from "@/constants/roles";
import CUSTOM_EVENTS from "@/constants/events";

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
    const label: any = ref('users.confirm')
    const userCreation = ref(false)
    const groups = reactive({groups: []})
    const fetchGroups = async() => {
      groups.groups = await userStore.getGroups()
          .then(res => res)
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchGroups()
    })
    const newGroup = ref({
      value: null,
      valid: false
    })
    const confirmPassword = ref({
      value: null,
      valid: false
    })
    const emailValidation: any = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordValidation: any = "";
    return {
      settingsStore,
      ROLES,
      groups,
      newUser,
      newGroup,
      emailValidation,
      userStore,
      passwordValidation,
      confirmPassword,
      label,
      userCreation
    }
  },
  methods: {
    checkNewGroupValidity(target: any) {
      // Check if there is some other organization with this cn
      const checkForCnGroups = this.groups.groups.some((g: any) => g.cn === this.newGroup.value)
      this.newUser.group.valid = !checkForCnGroups && (this.newGroup.value !== null && this.newGroup.value !== "")
      target.setCustomValidity("")
      this.newGroup.valid = !checkForCnGroups
      if (checkForCnGroups) {
        target.setCustomValidity("Invalid")
      }
    },
    checkConfirmPassword(target: any) {
      target.setCustomValidity("")
      this.confirmPassword.valid = this.confirmPassword.value === this.newUser.userPassword.value
      if (this.confirmPassword.value !== this.newUser.userPassword.value) {
        target.setCustomValidity("Invalid password")
      }
    },
    switchGroup() {
      if(this.newUser.group === undefined) {
        this.newGroup.value = null
        this.newGroup.valid = false
      }
      this.newUser.group.valid = this.newUser.group.value !== null && this.newUser.group.value !== undefined
    },
    disableCreateUser() {
      return (Object.keys(this.newUser).find((k: any) => this.newUser[k as keyof object]['valid'] === false) || !this.confirmPassword.valid) || this.userCreation
    },
    createUser() {
      // If a new group has to be created, before
      // a user could be mapped, call the create group service
      const newUserGid: any = +this.userStore.users.sort((a, b) => +b.gidnumber - +a.gidnumber)[0]['gidnumber'] + 1
      const newUserUid: any = +this.userStore.users.sort((a, b) => +b.uidnumber - +a.uidnumber)[0]['uidnumber'] + 1
      const newGroupGid: any = +this.groups.groups.sort((a: any, b: any) => +b.gidnumber - +a.gidnumber)[0]['gidnumber'] + 1
      const user: any = {
        uid: this.newUser.userName.value,
        cn: this.newUser.userName.value,
        sn: this.newUser.role.value,
        mail: this.newUser.email.value,
        userPassword: this.newUser.userPassword.value,
        uidnumber: newUserUid,
        gidnumber: newUserGid,
        givenName: `${this.newUser.firstName.value} ${this.newUser.lastName.value}`,
        homeDirectory: `/home/users/${this.newUser.userName.value}`
      }
      this.userCreation = true
      if (this.newGroup.value) {
        // Create a new Organization
        this.userStore.newGroup({cn: this.newGroup.value, gidnumber: newGroupGid.toString()})
          .then(() => {
            this.userStore.createUser(user)
                .then(() => {
                  // Then we proceed to consume mapping operations
                  Promise.allSettled([
                    this.userStore.updateRole(user.uid, user.sn),
                    this.userStore.updateGroup(user.uid, this.newGroup.value)
                  ])
                    .then(() => {
                      this.$emit(CUSTOM_EVENTS.newUser.confirm)
                    })
                    .catch(err => console.error(err))
                })
                .catch(err => console.error(err))
          })
      } else {
        this.label = 'Creating user'
        // Before all the mapping operation, the user must be create
        this.userStore.createUser(user)
            .then(() => {
              // Then we proceed to consume mapping operations
              Promise.allSettled([
                this.userStore.updateRole(user.uid, user.sn),
                this.userStore.updateGroup(user.uid, this.newUser.group.value)
              ])
                .then(() => {
                  this.$emit(CUSTOM_EVENTS.newUser.confirm)
                })
                .catch(err => console.error(err))

            })
            .catch(err => console.error(err))
      }

    }
  }
})
</script>

<style scoped>

.new-user {
  display: grid;
  height: 100%;
  justify-items: center;
  grid-template-columns: auto auto;
  grid-gap: 15px;
  margin-top: 20px;

}

.stepper-input {
  height: 40px;
  width: 275px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
  transition: all 150ms ease-in-out;
}

.input-wrapper {
  display: inline-grid;
  grid-auto-rows: max-content;
}

.invalid-help-text {
  font-size: 12px;
  color: #D22C2CFC;
  text-align: left;
  max-width: 260px;
  padding-left: 5px;
}

.stepper-input[type=email]:invalid,
.stepper-input[type=password]:invalid,
.stepper-input[type=text]:invalid{
  border: 1px solid #D22C2CFC
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
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.stepper-btn.disabled {
  opacity: 0.7;
  pointer-events: none;
  cursor: not-allowed;
}

@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotate {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}

.stepper-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>