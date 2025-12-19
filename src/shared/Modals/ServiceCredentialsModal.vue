<template>
  <div style="display: grid; align-self: start; height: calc(100% - 35px); grid-auto-rows: max-content auto;">
    <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Component {{service.service.index}} - Private image credentials</h3>
    <div class="service-credentials">
      <input
          v-model="credentialFields.userName.value"
          @input="(e) => credentialFields.userName.valid = credentialFields.userName.value.length > 0"
          placeholder="Username"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          type="text"
          class="stepper-input"
      >
      <div class="input-wrapper">
        <input
            v-model="credentialFields.userPassword.value"
            placeholder="Password"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            type="password"
            autocomplete="new-password"
            @input="(e) => credentialFields.userPassword.valid = credentialFields.userPassword.value.length > 0"
            @focusout="(e) => credentialFields.userPassword.valid = credentialFields.userPassword.value.length > 0"
            title="Enter a password 12 character long with at least: 1 uppercase, 1 digit, 1 special character"
            class="stepper-input"/>
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 100%">
    <button @click="$emit('back')" class="confirm">Back</button>
    <button
        :disabled="!credentialFields.userName.valid || !credentialFields.userPassword.valid"
        @click="$emit('confirm', {data: {userName: credentialFields.userName.value, userPassword: credentialFields.userPassword.value}, index: service.index, field: 'privateImage'})"
        class="cancel">Save</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {useSettings} from "@/stores/settings";
import { useToastsStore } from "@/stores/toasts";

export default defineComponent({
  name: "ServiceCredentialsModal",
  props: ['service'],
  setup: (props) => {
    const settingsStore = useSettings()
    const toastStore = useToastsStore()
    const selectedService = ref(JSON.parse(JSON.stringify(props.service)))
    const credentials = props.service?.service.service.fields.find((f: { fieldName: string; }) => f.fieldName === "privateImage")?.field
    const credentialFields = reactive({
      userName: {
        value: credentials?.userName || null,
        valid: !!credentials?.userName
      },
      userPassword: {
        value: credentials?.userPassword || null,
        valid: !!credentials?.userPassword
      }
    })
    const confirmPassword = ref({
      value: null,
      valid: false
    })

    return {
      settingsStore,
      toastStore,
      confirmPassword,
      selectedService,
      credentialFields
    }
  }
})
</script>

<style scoped>

.confirm , .cancel {
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  /*margin-top: 10px;*/
  cursor: pointer;
  font-weight: bold;
}

.confirm {
  background: #D9DBF1;
  color: #004AAD;
}

.cancel:disabled {
  background: #8E9DCC;
  cursor: not-allowed;
}

.cancel {
  background: #004AAD;
  color: #FFFFFF;
}

.remove {
  display: grid;
  align-items: center;
}

.stepper-input {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-btn {
  background: #004AAD;
  color: #FFFFFF;
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 298px;
  margin-top: 10px;
}

.stepper-btn:disabled,
.stepper-service-type:disabled + label.toggle {
  background: #8E9DCC;
  cursor: not-allowed;
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

.service-credentials {
  overflow: auto;
  height: calc(100% - 60px);
  padding: 10px;
}

</style>