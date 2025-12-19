<template>
  <div class="accordion">
    <AerosAccordionPanel
        v-for="(panel, index) in accordionRef.accordion?.panels"
        :index="index"
        :panel="panel"
        :ref="panelComponent"
        @expand="(e)=> collapse(e)"
        :key="panel.id">
      <template #header>
        {{panel.header}}
      </template>
      <template #owner>
        Owner:
        <span
            class="panel-chip owner"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            style="margin-left: 10px">
          <font-awesome-icon
              :icon="['fa', 'user']"
          />
          {{panel?.owner}}
        </span>
      </template>
      <template #subtitle>
        Type: {{panel?.subtitle.label}}
      </template>
      <template #content>
        {{panel.content}}
      </template>
      <template v-if="panel?.additionalData" #additionalData>
        <h4 class="header">Context Broker</h4>
        <div
            style="margin-top: 15px"
            v-for="data in panel?.additionalData"
            :class="data.type"
            :key="data">
          <p v-if="data.type === 'text'"><font-awesome-icon :icon="data.icon"/> <b>{{data.label}}:</b> {{data.value}}</p>
          <a
              class="btn-new"
              style="width: fit-content"
              v-if="data.type === 'download'"
              :href="data.value"
              target="_blank"
              download>{{data.label}} <font-awesome-icon icon="link"/></a>
          <a
              class="btn-new"
              style="width: fit-content"
              @click="async() => await copyToClipboard(data.value)"
              title="Copy URL"
              v-if="data.type === 'copy'"
              >{{data.label}} <font-awesome-icon icon="copy"/></a>
          <div v-if="data.type === 'list'">
            <b>{{data.label}}: </b>
            <ul style="padding-left: 17px">
              <li v-for="value in data.values" :key="value">{{value}}</li>
            </ul>
          </div>
        </div>
      </template>
      <template #metadata>
        <div class="panel-chips">
          <div v-for="chip in panel?.metadata" :key="chip">
            <p><b>{{$t(chip.label)}}:</b></p>
            <div class="panel-chips-container">
              <div class="panel-chip" :class="chip.style" v-for="c in chip.values" :key="c">
                <span v-if="chip.style === 'chip'">{{c}}</span>
                <a
                    :class="settingsStore.colorScheme"
                    v-if="chip.style === 'link'"
                    :href="c"
                    target="_blank">{{c}}</a>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #hidden>
        <div class="hidden-content" v-if="typeof panel.hidden === 'string'">
          <p style="margin-top: 15px">{{panel.hidden}}</p>
          <p style="margin-top: 15px">{{panel.content}}</p>
        </div>
        <div class="hidden-content" v-if="Array.isArray(panel.hidden)">
          <div style="margin-top: 15px" v-for="content in panel.hidden" :key="content">
            <span><b>{{content.key}}:</b> {{content.value}}</span>
          </div>
        </div>
      </template>
    </AerosAccordionPanel>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from "vue";
import AerosAccordionPanel from "@/shared/Accordion/AerosAccordionPanel.vue";
import {useSettings} from "@/stores/settings";
import {useModalStore} from "@/stores/modal";
import {Accordion} from "@/shared/Accordion/interfaces/Accordion";
import {useToastsStore} from "@/stores/toasts";

export default defineComponent({
  name: "AerosAccordion",
  components: {AerosAccordionPanel},
  props: {
    accordion: Object as PropType<Accordion>
  },
  setup: (props) => {
    const settingsStore = useSettings()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const accordionRef = reactive(props)
    return {
      modalStore,
      settingsStore,
      accordionRef,
      toastStore
    }
  },
  methods: {
    collapse(e: number) {
      this.accordionRef.accordion!.panels[e].expanded = !this.accordionRef.accordion!.panels[e].expanded;
      if (this.accordionRef.accordion?.autoCollapse) {
        this.accordionRef.accordion.panels.forEach((p, index) => {
          if(index !== e) {
            p.expanded = false
          }
        })
      }
    },
    copyToClipboard(text: string) {
      return navigator.clipboard.writeText(text)
          .then(() => {
            this.toastStore.appendToast({
              label: `Endpoint URL copied`,
              success: true ,
              data: {},
              autoRemove: false})
          })
    }
  }
})
</script>

<style scoped>

.accordion {
  width: 100%;
}

.hidden-content,
.panel-chips {
  display: grid;
  grid-template-columns: 50% 50%;
  text-align: left;
}

.panel-chips {
  grid-template-rows: 50% 50%;
  height: 100%;
  padding-left: 15px;
  position: relative;
  overflow-y: auto;
  outline: none;
  /*flex-direction: column;*/
  flex-wrap: wrap;
  align-content: start;
}



.panel-chips-container {
  position: relative;
  overflow-y: auto;
  outline: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: start;
}

.owner {
  background-color: transparent !important;
  border: solid 1.5px #F0F0F0;
}

.panel-chip.owner.light {
  color: #004AAD;
}

.panel-chip.owner.dark {
  color: #FFFFFF;
}

.panel-chip,
.panel-chip.owner{
  border-radius: 10px;
  width: fit-content;
  height: 35px;
  padding: 8px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: default;
  font-size: 14px;
  font-weight: bold;
  margin: 10px 10px 0 0;
}

.panel-chip.chip {
  border-radius: 10px;
  background: #004AAD;
  color: #FFFFFF;
  width: fit-content;
  height: 35px;
  padding: 8px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: default;
  font-size: 14px;
  font-weight: bold;
  margin: 10px 10px 0 0;
}

.panel-chip.link {
  font-family: Poppins, sans-serif;
  font-style: italic;
  font-size: 12px;
  text-decoration: underline;
  margin: 5px 5px 0 0;
  align-items: center;
  align-self: center;
  width: fit-content;
  height: 25px;
  padding: 0;
}

.hidden-content {
  border-top: solid 1px #F0F0F0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.text {
  grid-area: text;
}

.list {
  grid-area: list;
}
.download {
  grid-area: download;
}
.copy {
  grid-area: copy;
}
.header {
  grid-area: header;
}

</style>