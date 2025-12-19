<template>
  <div style="display: grid; width: 100%; height: 100%">
    <div class="home-panel">
      <h3 style="color: #004AAD">{{ $t('home.welcome') }}</h3>
      <span style="padding: 0 1.3em">
      {{ $t('home.subtitle') }}
    </span>
      <div class="panel-image" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "HomeComponent"
})
</script>

<style scoped>
.home-panel {
  width: 768px;
  height: 510px;
  top: 140px;
  left: 343px;
  padding: 15px;
  border-radius: 10px;
  border: solid 2px #E6EAF6;
  display: grid;
  grid-template-rows: 70px 90px auto;
  align-self: center;
  justify-self: center;

}

.panel-image {
  justify-self: center;
  width: 100%;
  background-image: url("@/assets/home_panel.png");
  background-repeat: no-repeat;
  background-position: center;
}

</style>