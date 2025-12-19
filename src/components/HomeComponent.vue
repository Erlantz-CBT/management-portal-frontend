<template>
  <div class="panel">
    <h3 style="color: #004AAD">Welcome to the aerOS Management Portal</h3>
    <p style="padding: 0 1.3em">
      This is the Management Portal, the single entrypoint to manage the aerOS Meta-OS
    </p>
    <img class="panel-image" src="@/assets/home_panel.png" alt="home_panel" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "HomeComponent"
})
</script>

<style scoped>
.panel {
  width: 768px;
  height: 510px;
  top: 140px;
  left: 343px;
  padding: 15px;
  border-radius: 10px;
  border: 1.5px solid #E6EAF6;
  display: grid;
  align-self: center;
  justify-self: center;

}

.panel-image {
  justify-self: center;
}

</style>