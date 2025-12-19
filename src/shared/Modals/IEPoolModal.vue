<template>
  <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">
    IE {{service?.service?.index}} Infrastructure elements pool
  </h3>
  <div class="ie-pool">
    <div class="ie" v-for="(ie, index) in ieList" :key="ie">
      <div>
        <select
            class="stepper-input"
            v-model="ie.domain"
            @change="fetchIE(ie)"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            name="domain" id="domain">
          <option
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="null">Select a domain</option>
          <option
              v-for="domain in domains.domains"
              :key="domain.id"
              :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
              :value="domain.id">{{ domain.description }}</option>
        </select>
      </div>
      <div>
        <div
            class="loader-placeholer"
            :key="ie.fetching"
            :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
            v-if="ie.fetching && ie.domain">
          <VueSpinner color="#004AAD"></VueSpinner>
        </div>
        <div v-if="!ie.fetching && ie.domain" class="stepper-combo">
          <select
              class="stepper-input"
              v-model="ie.ie"
              :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
              name="ie" id="ie">
            <option
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
                :value="null">Select a IE</option>
            <option
                v-for="d in ie.availableIes"
                :key="d"
                :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
                v-show="!ieList.some((item, i) => item.ie === d.id) && !ie.ie"
                :value="d.id">{{ d?.hostname }}</option>
          </select>
        </div>
      </div>
      <a class="remove" @click="removeIE(index)">
        <font-awesome-icon icon="trash"></font-awesome-icon>
      </a>
    </div>
    <button class="stepper-btn" style="justify-self: center"  @click="addIE()">Add IE</button>
  </div>
  <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 15px">
    <button @click="$emit('back')" class="confirm">Back</button>
    <button @click="$emit('confirm', {data: ieList.map((ie) => {return {ie: ie.ie, domain: ie.domain}}), index: service?.service, field: 'iePool'})" class="cancel">Save</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {useSettings} from "@/stores/settings";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import {VueSpinner} from "vue3-spinners";

interface IE {
  domain: string | null,
  ie: string | null,
  availableIes?: string[],
  fetching?: boolean,
}

export default defineComponent({
  name: "IEPoolModal",
  components: {
    VueSpinner,
  },
  props: ['service'],
  setup: (props) => {
    const settingsStore = useSettings();
    const domainStore = useDomainStore();
    const domains = reactive({domains: props.service?.service?.domains})
    const loaderStore = useLoaderStore();
    const iePool = props.service?.service?.service?.fields.find((field: {fieldName: string}) => field.fieldName === 'iePool')?.field;
    const ieList = reactive([...iePool] as IE[]);
    const fetchIE = async(ie: any, newIe = true) => {
      if (ie) {
        loaderStore.hasLoader = false;
        ie.fetching = newIe;
        const domainId: any = ie.domain.split(":Domain:")[1];
        ie.availableIes = await domainStore.fetchIE(domainId)
            .then(res => {
              ie.fetching = false;
              loaderStore.$reset()
              return res.data as string[];
            })
            .catch(err => {
              ie.fetching = false;
              loaderStore.$reset();
              return [];
            });
      }
    }
    ieList.forEach((ie: IE) => fetchIE(ie, false))
    return {
      settingsStore,
      domainStore,
      loaderStore,
      domains,
      ieList,
      fetchIE
    }
  },
  methods: {
    addIE() {
      this.ieList.push({domain: null, ie: null, fetching: true} as IE);
    },
    removeIE(index: number) {
      console.log(this.ieList)
      this.ieList.splice(index, 1);
    }
  }
})
</script>

<style scoped>

.stepper-input {
  height: 40px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-input[type=range] {
  width: auto;
  padding: 0;
}

.stepper-combo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: fit-content;
}

.stepper-input,
.stepper-combo,
.stepper-btn {
  width: 320px;
}

select.stepper-input {
  width: auto;
  min-width: 320px;
  margin-top: 0;
}

.loader-placeholer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 40px;
  opacity: 0.7;
  background: transparent;
  border: solid 1px #767676;
  border-radius: 10px;
  cursor: not-allowed;
}

.stepper-btn {
  background: #004AAD;
  color: #FFFFFF;
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
}

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
.ie {
  display: flex;
  gap: 15px;
  align-items: center;
}

.ie-pool {
  display: grid;
  grid-auto-rows: max-content;
  grid-row-gap: 15px;
  overflow: auto;
  height: calc(100% - 75px);
  padding: 10px;
}



</style>