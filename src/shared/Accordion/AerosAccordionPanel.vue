<template>
  <div class="panel" :class="pr?.panel?.expanded ? 'expanded' : null">
    <div class="panel-header">
      <h3>
        Name: <slot name="header"></slot>
      </h3>
<!--      <h4 style="margin-top: 10px">-->
<!--        <slot name="subtitle"></slot>-->
<!--      </h4>-->
      <h4 style="margin-top: 15px">
        <slot name="owner"></slot>
      </h4>
    </div>
    <div class="panel-content">
      <p style="margin-top: 15px">
        <slot name="content"></slot>
      </p>
      <div class="panel-additionaldata">
        <slot name="additionalData"></slot>
      </div>
    </div>
    <div class="panel-metadata">
      <slot name="metadata"></slot>
    </div>
    <div class="panel-expand">
      <a
        v-for="action in pr?.panel?.actions"
        :key="action"
        @click="action.onClick"
        class="expand-icon action"
        :class="action?.onClick ? null : 'disabled'"
      >
        <font-awesome-icon
            :icon="['fa', action?.icon]"
        />
      </a>
<!--      <a-->
<!--        class="expand-icon expand"-->
<!--        @click="expand()"-->
<!--        :style="{ 'transform' : pr?.panel?.expanded ? 'rotate(180deg)' : null}"-->
<!--      >-->
<!--        <font-awesome-icon-->
<!--            :icon="['fa', 'chevron-down']"-->
<!--        />-->
<!--      </a>-->
    </div>
<!--    <div-->
<!--        class="panel-hidden"-->
<!--        :class="pr?.panel?.expanded ? 'expanded' : null"-->
<!--        >-->
<!--      <slot name="hidden"></slot>-->
<!--    </div>-->
  </div>

</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from "vue";
import {Panel} from "@/shared/Accordion/interfaces/Panel";
import CUSTOM_EVENTS from "@/constants/events";

export default defineComponent({
  name: "AerosAccordionPanel",
  props: {
    panel: Object as PropType<Panel>,
    index: Number
  },
  setup: (props) => {
    const pr = reactive(props)
    return {
      pr
    }
  },
  methods: {
    expand() {
      return this.$emit(CUSTOM_EVENTS.accordion.expand, this.index)
    }
  }
})
</script>

<style scoped>

.panel {
  height: auto;
  /*overflow: clip;*/
  display: grid;
  interpolate-size: allow-keywords;
  border: solid 2px #F0F0F0;
  -webkit-transition: height 150ms ease;
  -moz-transition: height 150ms ease;
  -o-transition: height 150ms ease;
  transition: height 150ms ease;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 15px;
  grid-template-columns: 50% auto 50px;
  grid-template-rows: auto auto;
  grid-template-areas:
      "header metadata expand"
      "content metadata expand"
      "hidden hidden hidden";
}

.panel-hidden {
  grid-area: hidden;
  display: grid;
  margin-top: 20px;
}

.panel.expanded {
  height: auto;
}

.panel-header {
  grid-area: header;
}
.panel-content {
  grid-area: content;
}
.panel-header,
.panel-content {
  text-align: justify;
  padding-right: 15px;
}

.panel-header,
.panel-content,
.panel-metadata {
  border-right: solid 1px #D9DBF1;
}
.panel-metadata {
  grid-area: metadata;
}

.panel-additionaldata {
  border-top: solid 1px #D9DBF1;
  margin-top: 15px;
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: 15px;
  grid-template-areas:
      "header header"
      "text list"
      "download list"
      "copy list";
}

.panel-expand {
  display: grid;
  width: calc(100% + 15px);
  grid-template-columns: calc(100% - 43px);
  grid-template-rows: 50px;
  justify-content: center;
  justify-items: center;
  grid-area: expand;
}

.expand-icon {
  text-align: center;
  cursor: pointer;
  transition: all 0.5s ease;
  color: rgb(150, 151, 170);
}

.expand-icon.expand {
  align-self: end;
}

.expand-icon.action {
  align-self: start;
}

.action.disabled {
  pointer-events: none;
}



</style>