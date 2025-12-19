<template>
  <div class="unauthorized-page" :class="settingsStore?.colorScheme || 'light'">
    <div class="card" :class="settingsStore?.colorScheme || 'light'">
      <img src="@/assets/aeros_logo.png" class="logo" alt="logo">
      <p class="message">{{ $t("general.accessDenied") }}</p>
      <p class="description">{{ $t("general.contactAdmin") }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {useSettings} from "@/stores/settings";

export default defineComponent({
  name: "UnauthorizedComponent",
  setup: () => {
    const settingsStore = useSettings()
    return {
      settingsStore
    }
  }
})

</script>

<style scoped>
.unauthorized-page {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  left: 0;
}

.card {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  user-select: none;
}

.status-code {
  font-size: 4rem;
  color: #dc3545;
  margin: 0;
}

.logo {
  justify-self: center;
}

.message {
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
}

.description {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.back-button {
  padding: 0.5rem 1rem;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0b5ed7;
}
</style>
