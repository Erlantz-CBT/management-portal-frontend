<template>
  <h3>Add a new Data product</h3>
  <div @click.self="(e) => closeOtherMultiSelect(e, false)" class="data-product">
    <p>
      Choose a Data product type:
    </p>
    <select
        style="width: auto; font-weight: 700"
        class="search-select"
        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
        v-model="dataProductSelected"
    >
      <option
          v-for="product in dataProductsTypes"
          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
          :key="product"
          :value="product.value?.value">
        {{product.value.label}}
      </option>
    </select>
  </div>
  <div @click.self="(e) => closeOtherMultiSelect(e, false)" class="product-form">
    <select
        class="search-select domain"
        :class="settingsStore.colorScheme"
        v-model="selectedDomain"
    >
      <option
          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
          selected
          :value="null">
        Select a domain *
      </option>
      <option
          v-for="option in domains.domains"
          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
          :key="option"
          :value="option.id">
        {{option.id.split(":Domain:")[1]}}
      </option>
    </select>
    <div v-for="(field, index) in ['name', 'description']"
         :key="field"
         :class="field"
    >
      <input
          :tabindex="index"
          :class="settingsStore.colorScheme"
          class="search-input"
          v-if="field === 'name'"
          :placeholder="`${newDataProduct[field].label} ${newDataProduct[field].required? '*' : ''}`"
          v-model="newDataProduct[field].value"
          type="text"
      >
      <textarea
          style="height: 100%; resize: none; background-color: transparent"
          :class="settingsStore.colorScheme"
          :placeholder="`${newDataProduct[field].label} ${newDataProduct[field].required? '*' : ''}`"
          v-model="newDataProduct[field].value"
          class="search-input"
          v-if="field === 'description'"></textarea>
    </div>
    <div
        v-for="(field, index) in ['owner', 'glossary']"
        :key="field"
        :class="field">
      <select
          :tabindex="index"
          class="search-select"
          v-if="field === 'owner'"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          v-model="newDataProduct.owner.value"
      >
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            selected
            :value="null">
          Owner *
        </option>
        <option
            v-for="option in newDataProduct.owner.options"
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :key="option"
            :value="option">
          {{option}}
        </option>
      </select>
<!--      <div class="search-input multi-select"-->
<!--           :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"-->
<!--           @click.self="(e) => closeOtherMultiSelect(e, field)"-->
<!--           v-if="field === 'glossary'">-->
<!--        {{newDataProduct.glossary.value.length === 0 ? `${newDataProduct.glossary.label} ${newDataProduct.glossary.required ? '*' : ''}` : `${newDataProduct.glossary.value.length} Terms selected`}}-->
<!--        <a-->
<!--            :style="{ 'transform' : newDataProduct.glossary.opened ? 'rotate(180deg)' : null}"-->
<!--            class="multi-select_open"-->
<!--        >-->
<!--          <font-awesome-icon-->
<!--              :icon="['fa', 'chevron-down']"-->
<!--          />-->
<!--        </a>-->
<!--      </div>-->
<!--      <ul-->
<!--          class="multi-select_options"-->
<!--          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"-->
<!--          v-show="newDataProduct[field].opened">-->
<!--        <li-->
<!--            class="multi-select_option"-->
<!--            :tabindex="index"-->
<!--            v-for="op in newDataProduct[field].options" :key="op">-->
<!--          <input class="multi-select_checkbox" style="cursor: pointer" type="checkbox" @change="(e) => updateMultiSelectValue(e, newDataProduct.glossary, op)"> {{ op }}-->
<!--        </li>-->
<!--      </ul>-->
    </div>
    <div class="tags-container glossary">
      <div class="chip" v-for="(glossary, i) of newDataProduct.glossary.value" :key="glossary.label">
        <p>
          {{glossary}}
        </p>
        <i @click="deleteChipGlossary(i)"><font-awesome-icon style="font-size: 16px; display: flex" icon="xmark" /></i>
      </div>
      <input placeholder="Glossary Terms (press Enter)"
             :class="settingsStore?.colorScheme"
             v-model="currentGlossaryInput"
             @keypress.enter="saveChipGlossary">
    </div>
    <div class="tags-container tags">
      <div class="chip" v-for="(tag, i) of newDataProduct.tags.value" :key="tag.label">
        {{tag}}
        <i @click="deleteChip(i)"><font-awesome-icon style="font-size: 16px; display: flex" icon="xmark" /></i>
      </div>
      <input placeholder="Tags (press Enter)"
             :class="settingsStore?.colorScheme"
             v-model="currentTagInput"
             @keypress.enter="saveChip">
    </div>

    <div
        v-for="form in Object.keys(newDataProduct[dataProductSelected])"
        :key="form"
    >
      <select
          :tabindex="index"
          class="search-select"
          v-if="newDataProduct[dataProductSelected][form].type === 'select'"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          v-model="newDataProduct[dataProductSelected][form].value"
      >
        <option
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            selected
            :value="null">
          {{ newDataProduct[dataProductSelected][form].label }} *
        </option>
        <option
            v-for="option in newDataProduct[dataProductSelected][form].options"
            :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
            :key="option"
            :value="option">
          {{option}}
        </option>
      </select>
      <input
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="search-input"
          :placeholder="`${newDataProduct[dataProductSelected][form].label} ${newDataProduct[dataProductSelected][form].required ? '*' : ''}`"
          v-if="newDataProduct[dataProductSelected][form].type === 'text'"
          v-model="newDataProduct[dataProductSelected][form].value"
          type="text">
      <div
          style="background: transparent"
          v-if="newDataProduct[dataProductSelected][form].type === 'file'"
          :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
          class="search-input file"
      >
        <label :for="form">
          {{newDataProduct[dataProductSelected][form]?.value?.item(0)?.name || newDataProduct[dataProductSelected][form].label}}
          {{newDataProduct[dataProductSelected][form].required && !newDataProduct[dataProductSelected][form]?.value?.item(0)?.name ? '*' : ''}}
          <font-awesome-icon
              v-if="!newDataProduct[dataProductSelected][form]?.value"
              :icon="['fa', 'upload']"
          />
        </label>
        <input
            :name="form"
            :id="form"
            :accept="newDataProduct[dataProductSelected][form].accept"
            v-on:change="(e) => newDataProduct[dataProductSelected][form].value = e.target?.files"
            :placeholder="`${newDataProduct[dataProductSelected][form].label} ${newDataProduct[dataProductSelected][form].required ? '*' : ''}`"
            type="file">
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 30px">
    <button @click="$emit('back')" class="confirm">Back</button>
    <button
        :disabled="checkForm()"
        @click="confirm()"
        class="cancel">Save
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import DATA_PRODUCTS from "@/constants/data_product";
import CUSTOM_EVENTS from "@/constants/events";
import {useSettings} from "@/stores/settings";
import {useModalStore} from "@/stores/modal";
import {useDataCatalogStore} from "@/stores/data_catalog";
import {useToastsStore} from "@/stores/toasts";
import {useUsersStore} from "@/stores/users";
import {useDomainStore} from "@/stores/domain";

export default defineComponent({
  name: "NewDataProductModal",
  props: {
    set: {
      type: Boolean,
      default: true
    },
    setGlossary: {
      type: Boolean,
      default: true
    },
  },
  setup: () => {
    const settingsStore = useSettings()
    const dataProductSelected = ref('BATCH_FILE')
    const modalStore = useModalStore()
    const currentTagInput = ref('')
    const currentGlossaryInput = ref('')
    const dataCatalogStore = useDataCatalogStore()
    const toastStore = useToastsStore()
    const userStore = useUsersStore()
    const domainsStore = useDomainStore()
    const selectedDomain = ref(null)
    const domains = reactive({domains: []})
    const fetchDomains = async() => {
      domains.domains = await domainsStore.fetchDomains()
        .then((res) => res.data)
    }
    const organizations = reactive({organizations: []})
    const newDataProduct = reactive({
      name: {
        required: true,
        label: 'Name',
        key: 'name',
        value: null
      },
      owner: {
        required: true,
        label: 'Owner',
        key: 'owner',
        value: null,
        options: []
      },
      description: {
        required: true,
        label: 'Description',
        key: 'description',
        value: null
      },
      glossary: {
        required: true,
        label: 'Glossary terms',
        key: 'glossary_terms',
        value: [] as string[],
        options: []
      },
      tags: {
        required: false,
        opened: false,
        label: 'Tags',
        value: [] as string[],
      },
      BATCH_FILE: {
        freshness: {
          required: false,
          label: 'Freshness',
          key: 'freshness',
          type: 'text',
          value: null,
        },
        mappings: {
          required: true,
          label: 'Mappings File',
          key: 'mappings_file',
          accept: '.rml,.yaml',
          type: 'file',
          value: null,
        },
        pathToFile: {
          required: true,
          label: 'Path to file',
          key: 'file_path',
          type: 'text',
          value: null,
        },
        translation_source_to_central_file: {
          required: false,
          label: 'Translations source/central file',
          key: 'translation_source_to_central_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
        translation_central_to_target_file: {
          required: false,
          label: 'Translations central/target file',
          key: 'translation_central_to_target_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
      },
      BATCH_RELATIONAL_DATABASE: {
        freshness: {
          required: false,
          label: 'Freshness',
          key: 'freshness',
          type: 'text',
          value: null,
        },
        mappings: {
          required: true,
          label: 'Mappings File',
          key: 'mappings_file',
          accept: '.rml,.yaml',
          type: 'file',
          value: null,
        },
        dbUrl: {
          required: true,
          label: 'Database url',
          type: 'text',
          key: 'db_url',
          value: null,
        },
        translation_source_to_central_file: {
          required: false,
          label: 'Translations source/central file',
          key: 'translation_source_to_central_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
        translation_central_to_target_file: {
          required: false,
          label: 'Translations central/target file',
          key: 'translation_central_to_target_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
      },
      STREAMING_KAFKA: {
        inputFormat: {
          required: true,
          label: 'Input format',
          key: 'input_format',
          type: 'select',
          options: ['XML', 'JSON', 'CSV'],
          value: null,
        },
        inputTopic: {
          required: true,
          label: 'Input topic',
          key: 'input_topic',
          type: 'text',
          value: null,
        },
        host: {
          required: true,
          label: 'Host',
          key: 'host',
          type: 'text',
          value: null,
        },
        mappings: {
          required: true,
          label: 'Mappings File',
          key: 'mappings_file',
          accept: '.carml',
          type: 'file',
          value: null,
        },
        port: {
          required: true,
          label: 'Port',
          key: 'port',
          type: 'text',
          value: null,
        },
        translation_source_to_central_file: {
          required: false,
          label: 'Translations source/central file',
          key: 'translation_source_to_central_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
        translation_central_to_target_file: {
          required: false,
          label: 'Translations central/target file',
          key: 'translation_central_to_target_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
      },
      STREAMING_MQTT: {
        inputFormat: {
          required: true,
          label: 'Input format',
          key: 'input_format',
          type: 'select',
          options: ['XML', 'JSON', 'CSV'],
          value: null,
        },
        inputTopic: {
          required: true,
          label: 'Input topic',
          key: 'input_topic',
          type: 'text',
          value: null,
        },
        host: {
          required: true,
          label: 'Host',
          key: 'host',
          type: 'text',
          value: null,
        },
        mappings: {
          required: true,
          label: 'Mappings File',
          key: 'mappings_file',
          accept: '.carml',
          type: 'file',
          value: null,
        },
        port: {
          required: true,
          label: 'Port',
          key: 'port',
          type: 'text',
          value: null,
        },
        translation_source_to_central_file: {
          required: false,
          label: 'Translations source/central file',
          key: 'translation_source_to_central_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
        translation_central_to_target_file: {
          required: false,
          label: 'Translations central/target file',
          key: 'translation_central_to_target_file',
          accept: '.xml,.rdf',
          type: 'file',
          value: null,
        },
        protocol: {
          required: true,
          label: 'Protocol',
          key: 'protocol',
          type: 'select',
          options: ['tcp', 'udp'],
          value: null,
        },

      }
    } as any)
    const fetchGlossaryTerms = async() => {
      newDataProduct.glossary.options = await dataCatalogStore.fetchGlossaryTerms()
        .then((g: any[]) => g.map(({id}) => id))
    }
    const fetchOrganizations = async() => {
      newDataProduct.owner.options = await userStore.getGroups()
        .then((o: any[]) => o.map(({cn}) => cn))
    }
    const dataProductsTypes = Object.keys(DATA_PRODUCTS).map((k: any) => {
      return {
        key: k,
        value: DATA_PRODUCTS[k as keyof object]
      }
    })
    onMounted(async() => {
      await fetchOrganizations()
      await fetchGlossaryTerms()
      await fetchDomains()
    })
    return {
      dataProductsTypes,
      dataProductSelected,
      newDataProduct,
      settingsStore,
      dataCatalogStore,
      modalStore,
      toastStore,
      organizations,
      currentTagInput,
      currentGlossaryInput,
      selectedDomain,
      domains
    }
  },
  methods: {
    updateMultiSelectValue(e: any, field: any, option: string) {
      if(e.target.checked) {
        field.value.push(option)
      } else {
        field.value = field.value.filter((op: string) => op !== option)
      }
    },
    closeOtherMultiSelect(e: any, field: any) {
      this.newDataProduct.glossary.opened = !this.newDataProduct.glossary.opened
      if(!field) {
        this.newDataProduct.glossary.opened = false
      }
    },
    checkForm() {
      // The submission will be disabled until all the required fields are populated
      const checkValues = [
        'name',
        'description',
        'glossary',
        'owner'
      ]
      const checkStaticFields = Object.keys(this.newDataProduct)
          .filter(k => checkValues.includes(k))
          .find(field => (this.newDataProduct[field].value === null ||
              this.newDataProduct[field].value === []) &&
              this.newDataProduct[field].required) &&
          this.selectedDomain
      const checkDynamicFields = Object.keys(this.newDataProduct[this.dataProductSelected])
          .find(field => {
            return (this.newDataProduct[this.dataProductSelected][field].value === null ||
                    this.newDataProduct[this.dataProductSelected][field].value === []) &&
            this.newDataProduct[this.dataProductSelected][field].required
          })

      return checkDynamicFields !== undefined || checkStaticFields !== undefined
    },
    confirm() {
      const newProduct: any = {
        panel: {
          id: Math.random().toString(),
          header: this.newDataProduct.name.value,
          subtitle: this.dataProductSelected,
          data_source_type: this.dataProductSelected,
          owner: [`urn:Organization:${this.newDataProduct.owner.value}`],
          expanded: false,
          actions: [
            {
              icon: 'trash',
              onClick: () => {
                return this.modalStore.showModal({
                  template: "delete",
                  data: {
                    onConfirm: () => {
                      this.dataCatalogStore.deleteDataProduct(newProduct)
                          .then(() => {
                            this.toastStore.appendToast({label: `Product ${newProduct.header} deleted`, success: true ,data: {}, autoRemove: false})
                          })
                          .catch((error) => console.error(error))
                          .finally(() => {
                            this.modalStore.hideModal(null)
                            this.modalStore.$reset()
                          })
                    },
                    header: "dataCatalog.deleteDataProduct",
                    subtitle: newProduct.header,

                  }
                })
              }
            }
          ] as any[],
          content: this.newDataProduct.description.value,
          metadata: [
            {
              key: "tags",
              style: "chip",
              label: "dataCatalog.tags",
              values: this.newDataProduct.tags.value
            },
            {
              key: "glossary",
              style: "link",
              label: "dataCatalog.glossary",
              values: this.newDataProduct.glossary.value
            }
          ]
        },
        details: {
          name: this.newDataProduct.name.value,
          description: this.newDataProduct.description.value,
          owner: `urn:Organization:${this.newDataProduct.owner.value}`,
          glossary_terms: this.newDataProduct.glossary.value,
          tags: this.newDataProduct.tags.value,
          data_source_type: this.dataProductSelected,
        },
        files: {
          mappings_file: this.newDataProduct[this.dataProductSelected].mappings?.value,
          translation_source_to_central_file: this.newDataProduct[this.dataProductSelected].translation_source_to_central_file?.value,
          translation_central_to_target_file: this.newDataProduct[this.dataProductSelected].translation_central_to_target_file?.value
        },
        domain: this.selectedDomain

      }
      Object.keys(this.newDataProduct[this.dataProductSelected])
          .filter((k) => k !== 'mappings' &&
              k !== 'translation_source_to_central_file' &&
              k !== 'translation_central_to_target_file'
          )
          .forEach((p: any) => {
        newProduct.details[this.newDataProduct[this.dataProductSelected][p as keyof object].key] = this.newDataProduct[this.dataProductSelected][p as keyof object].value
      })
      this.$emit(CUSTOM_EVENTS.newDataProduct.confirm, newProduct)
    },
    saveChip() {
      if (this.currentTagInput !== '') {
        ((this.set && this.newDataProduct.tags.value.indexOf(this.currentTagInput) === -1) || !this.set) && this.newDataProduct.tags.value.push(this.currentTagInput);
        this.currentTagInput = '';
      }
    },
    deleteChip(index: any) {
      this.newDataProduct.tags.value.splice(index, 1);
    },
    saveChipGlossary() {
      if (this.currentGlossaryInput !== '') {
        ((this.setGlossary && this.newDataProduct.glossary.value.indexOf(this.currentGlossaryInput) === -1) || !this.setGlossary) && this.newDataProduct.glossary.value.push(this.currentGlossaryInput);
        this.currentGlossaryInput = '';
      }
    },
    deleteChipGlossary(index: any) {
      this.newDataProduct.glossary.value.splice(index, 1);
    }
  }
})
</script>

<style scoped>

.data-product {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
  border-bottom: solid 1.5px #D9DBF1;
  align-items: center;
  padding-bottom: 15px;
}

.search-select,
.search-input {
  display: flex;
  gap: 5px;
  width: 100%;
  color: #004AAD;
  align-items: center;
  outline: none;
  padding: 5px;
  height: 46px;
  border-radius: 10px;
}

.product-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas:
      "name owner"
      "description domain"
      "description glossary"
      "tags glossary";
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  text-align: left;
  margin-top: 25px;
}

.name {
  grid-area: name;
}

.description {
  grid-area: description;
}

.owner {
  grid-area: owner;
}

.glossary {
  grid-area: glossary;
  position: relative;
  height: 120px !important;
}
.domain {
  grid-area: domain;
}

.tags {
  grid-area: tags;
}

.glossary,
.tags {
  position: relative;
}

.search-select {
  border-radius: 10px;
  border: 1px solid #979797;
}

.multi-select {
  position: relative;
  cursor: pointer;
  background: transparent;
}

.multi-select_options {
  position: absolute;
  top: 100%;
  width: 100%;
  max-height: 134px;
  overflow-y: scroll;
  list-style: none;
  cursor: pointer;
  padding-left: 0;
  margin-top: 10px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  background-color: #282828;
  z-index: 100;
  border-radius: 10px;
  border: 1px solid #979797;
}

.multi-select_option {
  padding: 10px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
}

.multi-select_open {
  position: absolute;
  transition: all 150ms ease;
  right: 10px;
  font-size: 10px;
}

.search-input {
  border: 1px solid #979797;
  padding: 10px;
}

.search-input.file {
  background: transparent;
  display: grid;
  height: auto;
}

.search-input.file > label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
}

.not-valid {
  border: solid 1px crimson;
}

.confirm , .cancel{
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 150px;
  /*margin-top: 10px;*/
  cursor: pointer;
  font-weight: bold;
}

input[type=file] {
  display: none;
}

.confirm {
  background: #D9DBF1;
  color: #004AAD;
}

.cancel {
  background: #004AAD;
  color: #FFFFFF;
  transition: opacity 150ms ease;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tags-container {
  position: relative;
  height: 80px;
  max-width: 444px;
  padding: 3px;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  align-content: start;
}
.tags-container .chip {
  border-radius: 10px;
  background: #004AAD;
  color: #FFFFFF;
  padding: 8px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-left: 3px;
  margin-top: 3px;
}
.tags-container .chip i {
  cursor: pointer;
  opacity: 0.56;
  margin-left: 8px;
}
.tags-container input {
  flex: 1 1 auto;
  width: 30px;
  border: none;
  outline: none;
  padding: 4px;
  background: transparent;
  z-index: 2;
}

.tags-container .chip-select-container .chip {
  display: flex;
  justify-self: left;
  margin-bottom: 3px;
}

.tags-container input {
  flex: 1 1 auto;
  border-radius: 10px;
  outline: none;
  padding: 4px;
}
</style>