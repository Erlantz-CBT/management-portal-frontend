<template>
  <div class="modal-container">
    <h3>Edit user: {{selectedUser.user.givenName}}</h3>
    <div class="input-container">
      <b>Role:</b> <select
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="stepper-input"
          v-model="selectedUser.user.role"
          id="role">
        <option
            v-for="role in roles"
            :key="role"
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :value="role">{{role}}</option>
      </select>
      <b>Organization:</b> <select
        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        class="stepper-input"
        v-model="selectedUser.user.group"
        id="role">
      <option
          v-for="group in groups.groups"
          :key="group"
          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
          :value="group.cn">{{group.cn}}</option>
    </select>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: end">
      <button @click="$emit('back')" class="cancel">Back</button>
      <button @click="$emit('confirm', selectedUser)" class="confirm">Confirm</button>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, reactive, ref} from "vue";
import ROLES from "@/constants/roles";
import {useSettings} from "@/stores/settings";
import {useUsersStore} from "@/stores/users";
import {useLoaderStore} from "@/stores/loader";

export default defineComponent({
  name: "UserEditModal",
  props: ['user'],
  setup: (props) => {
    const settingsStore = useSettings()
    const userStore = useUsersStore()
    const loaderStore = useLoaderStore()
    const groups = reactive({groups: []})
    const selectedUser = ref(JSON.parse(JSON.stringify(props.user)))
    const roles = Object.keys(ROLES)
        .map((r: any) => ROLES[r as keyof object])

    const fetchGroups = async() => {
      loaderStore.hasLoader = false
      groups.groups = await userStore.getGroups()
          .then(res => {
            loaderStore.$reset()
            return res
          })
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchGroups()
    })
    return {
      settingsStore,
      selectedUser,
      roles,
      groups
    }
  }
})
</script>

<style scoped>

.modal-container {
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 20px;
  height: 100%;
}

.input-container {
  display: grid;
  grid-template-columns: 120px auto;
  row-gap: 15px;
  justify-items: start;
  align-items: center;
}

.stepper-input {
  height: 40px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-input[type=email]:invalid {
  border: 1px solid #b72121
}

.confirm , .cancel {
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  cursor: pointer;
  font-weight: bold;
}

.cancel {
  background: #D9DBF1;
  color: #004AAD;
}

.confirm {
  background: #004AAD;
  color: #FFFFFF;
}

input:disabled {
  opacity: 0.7;
}

</style>