<template>
  <div class="container" style="overflow-y: hidden; width: calc(100vw - 200px);">
    <div style="display: flex ;justify-content: space-between; padding: 15px 0px 55px 0">
      <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{ $t('settings.settings')}}</h2>
    </div>
    <div>
      <h4 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" :style="{'border-bottom': settingsStore.colorScheme === 'dark' ? 'solid 1.5px white' : 'solid 2px #E6EAF6'}" style="text-align: left">{{ $t('settings.generalSettings')}}</h4>
      <div class="settings">
        <div>
          <div class="setting">
            <b>{{ $t('settings.darkMode')}}</b>
            <input id="dark_mode"
                   class="setting-switch"
                   type="checkbox"
                   :value="dark_mode === 'dark'"
                   :checked="dark_mode === 'dark'"
            @change="(e) => switchDarkMode(e)">
          </div>
          <div class="setting">
            <b>{{ $t('settings.language')}}</b>
            <select
                name="language"
                v-model="$i18n.locale"
                @change="(e) => switchLanguage(e.target.value)"
                class="stepper-input"
                :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                id="language">
              <option
                  :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                  value="en">English</option>
              <option
                  :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                  value="es">Espanol</option>
              <option
                  :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                  value="fr">Francais</option>
              <option
                  :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                  value="it">Italiano</option>
            </select>
          </div>
          <div class="setting">
            <b>{{ $t('settings.fontSize')}}</b>
            <div style="width: 260px; display: grid; justify-content: end">
              <div class="font-labels">
                <span style="font-size: 12px">A</span>
                <span style="font-size: 24px">A</span>
                <span style="font-size: 36px">A</span>
              </div>
              <input
                  id="fontSize"
                  class="stepper-input"
                  step="2"
                  min="14"
                  max="18"
                  :value="settingsStore.fontSize"
                  @change="(e) => switchFontSize(e)"
                  type="range">
            </div>

          </div>
          <div class="setting">
            <b>{{ $t('settings.pushNotification')}}</b>
            <input id="push"
                   class="setting-switch"
                   :checked="notifications"
                   :disabled="notifications"
                   @change="switchNotification"
                   type="checkbox"></div>
        </div>
        <div class="policy">
          <b>Disclaimer</b>
          <textarea
              :style="{'color': settingsStore.colorScheme === 'dark' ? '#E6EAF6' : '#000000'}"
              v-model="settingsStore.policy"
              spellcheck="false"
              name="policy"
              id="policy"
              cols="30"
              readonly
              rows="10">
          </textarea>
        </div>
      </div>
<!--      <h4-->
<!--          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"-->
<!--          :style="{'border-bottom': settingsStore.colorScheme === 'dark' ? 'solid 1.5px white' : 'solid 2px black'}" style="text-align: left; margin-top: 20px">{{ $t('settings.systemSettings')}}</h4>-->
<!--      <div class="settings">-->
<!--        <div>-->
<!--          <div class="setting">-->
<!--            <b>{{ $t('settings.metrics')}}</b>-->
<!--            <input id="metrics"-->
<!--                   class="setting-switch"-->
<!--                   type="checkbox">-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {useSettings} from "@/stores/settings";
export default {
  name: "SettingsComponent",
  setup: () => {
    const settingsStore = useSettings()
    const dark_mode = ref(settingsStore.colorScheme)
    const notifications = ref(Notification.permission === "granted")
    return {
      dark_mode,
      settingsStore,
      notifications
    }
  },
  methods: {
    switchDarkMode(event) {
      const colorScheme = event.target.checked ? "dark" : "light"
      // Set the property on the localStorage and update the store
      localStorage.setItem("colorScheme", colorScheme)
      this.settingsStore.colorScheme = colorScheme
    },
    switchLanguage(language) {
      console.log(language)
      localStorage.setItem('i18n', language)
    },
    switchNotification() {
      // Check if the browser support notifications
      if (!("Notification" in window)) {
        return alert("Your browser does not support notification")
      }
      if (Notification.permission !== "granted") {
        Notification.requestPermission()
        .then((perm) => {
          this.settingsStore.notification = true
          this.notifications = true
        })
      }
    },
    switchFontSize(size) {
      this.settingsStore.fontSize = size.target.value
      localStorage.setItem('fontSize', size.target.value)
    }
  }
}
</script>

<style scoped>

h2, h4 {
  color: #004AAD;
  height: 30px;
}

.settings {
  display: grid;
  grid-auto-columns: max-content;
  grid-template-columns: 50% 50%;
  grid-column-gap: 20px;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
  height: 100px;
}

.setting-switch {
  position: relative;
  background: #8E9DCC;
  width: 45px;
  height: 30px;
  -webkit-appearance: initial;
  border-radius: 25px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  font-size: 14px;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #ddd;
}

.setting, .policy {
  border: solid 2px #E6EAF6;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0 10px 0;
}

.policy {
  display: grid;
  grid-auto-rows: 28px auto;
  text-align: left;
  width: 97%;
}

.policy > textarea {
  resize: none;
  border: none;
  background-color: transparent;
  font-style: italic;
}

.policy > textarea:focus-visible {
  outline: none;
}

.setting-switch:checked {
  background-color: #004AAD;
}

.setting-switch:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.setting-switch:after {
  position: absolute;
  top: 15%;
  display: grid;
  align-content: center;
  justify-content: center;
  line-height: 30px;
  width: 51%;
  height: 70%;
  background: #fff;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  color: black;
  border: #888 1px solid;
  border-radius: 50px;
}

.setting-switch:after {
  left: 7%;
  content: "";
}

.setting-switch:checked:after {
  left: 39%;
  content: "";
}

.font-labels {
  display: flex;
  flex-direction: row;
  gap: 84px;
  align-items: baseline;
  line-height: 10px;
  margin-top: 20px;
  margin-left: 2px;
}

.stepper-input {
  height: 40px;
  border-radius: 10px;
  color: #979797;
  border: 1px solid #979797;
  width: 200px;
  text-align: center;
  outline: none;
}

.stepper-input[type=range] {
  width: 200px;
}

</style>