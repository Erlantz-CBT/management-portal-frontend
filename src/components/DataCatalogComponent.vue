<template>
  <div style="display: block; width: 100%">
    <div class="container">
      <div class="header">
        <div style="display: flex; justify-content: space-between">
          <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Data Catalog</h2>
          <a @click="addDataProduct()" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="circle-plus" />
            {{ $t("dataCatalog.addDataProduct") }} <span></span></a>
        </div>
        <AerosFilter
            @result="(e) => setFilterResults(e)"
            @isEmpty="(e) => setEmptyFilters(e)"
            v-if="glossaryTerms.terms.length > 0 && organizations.organizations.length > 0 && tags.tags.length > 0"
            :values="dataCatalogs.panels"
            :store="dataCatalogStore"
            :actions="['addDataProduct', 'deleteDataProduct']"
            :filters="filters"
        />
      </div>
      <AerosAccordion
          :key="panels.length"
          v-if="dataCatalogs.panels?.length > 0 && !hasError"
          :accordion="dataCatalogs"
      />
      <ErrorComponent style="justify-self: center" v-if="hasError" @reload="async () => await fetchAll()" />
      <div v-if="dataCatalogs.panels?.length === 0 && !emptyFilters">
        <h3>{{ $t("filter.noResults") }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">


import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {useSettings} from "@/stores/settings";
import {useDataCatalogStore} from "@/stores/data_catalog";
import AerosAccordion from "@/shared/Accordion/AerosAccordion.vue";
import AerosFilter from "@/shared/Filter/AerosFilter.vue";
import {useModalStore} from "@/stores/modal";
import {Filter} from "@/shared/Filter/interfaces/Filter";
import FIREBASE_EVENTS from "@/constants/firebase_events"
import {useToastsStore} from "@/stores/toasts";
import {Panel} from "@/shared/Accordion/interfaces/Panel";
import {useUsersStore} from "@/stores/users";
import {useLoaderStore} from "@/stores/loader";
import ErrorComponent from "@/shared/ErrorComponent.vue";
import {logEventAndStore} from "../firebase"

export default defineComponent({
  name: "DataCatalogComponent",
  components: {
    AerosAccordion,
    AerosFilter,
    ErrorComponent
  },
  setup: () => {
    const settingsStore = useSettings()
    const dataCatalogStore = useDataCatalogStore()
    const userStore = useUsersStore()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const loaderStore = useLoaderStore()
    const panels = dataCatalogStore.getDataCatalog
    const glossaryTerms = reactive({terms: []})
    const organizations = reactive({organizations: []})
    const tags = reactive({tags: [] as string[]})
    const emptyFilters = ref(true)
    const hasError = ref(false)
    const fetchOrganizations = async() => {
      organizations.organizations = await userStore.getGroups()
        .then(res => {
          return res

        })
        .catch(err => console.error(err))
    }
    const fetchDataProducts = async() => {
      await dataCatalogStore.fetchDataProducts()
        .then((products) => {
          hasError.value = false
          products.forEach((p: any) => {
            p.metadata.find((k: any) => k.key === 'tags')!.values
              .forEach((v: string) => !tags.tags.includes(v) && tags.tags.push(v))
          })
        })
        .catch(err => {
          hasError.value = true
          toastStore.appendToast(
              {
                label: `Looks like something went wrong: ${err?.message}`,
                success: false,
                data: {},
                autoRemove: false
              }
          )
        })
    }
    const fetchCGlossaryTerms = async() => {
      glossaryTerms.terms = await dataCatalogStore.fetchGlossaryTerms()
        .then(res => res)
        .catch(err => console.error(err))
    }

    const fetchAll = async() => {
      await Promise.all([
        await fetchCGlossaryTerms(),
        await fetchOrganizations(),
        await fetchDataProducts()
      ])
    }

    onMounted(async() => {
      await fetchAll()
    })
    const filters = computed(() => [
      {
        key: 'header',
        label: 'general.name',
        type: 'input'
      },
      {
        key: 'glossary',
        label: 'dataCatalog.allGlossary',
        type: 'select',
        customCondition: (value: any, filter: Filter) => {
          return value.metadata
              .find((v: any) => v.key === filter.key)
              ?.values
              .includes(filter.value)
        },
        options: glossaryTerms.terms.map((k: any) => {
          return {
            key: k.id,
            value: k.id
          }
        })
      },
      {
        key: 'owner',
        label: 'dataCatalog.allOwners',
        type: 'select',
        options: organizations.organizations.map((o: any) => {
          return {
            key: o.cn,
            value: o.cn
          }
        })
      },
      {
        key: 'tags',
        label: 'dataCatalog.allTags',
        type: 'select',
        customCondition: (value: any, filter: Filter) => {
          return value.metadata
              .find((v: any) => v.key === filter.key)
              ?.values
              .includes(filter.value)
        },
        options: computed(() =>
          tags.tags.map((tag: string) => {
            return {
              key: tag,
              value: tag
            }
          }))
      }
    ] as Filter[])
    const dataCatalogs = reactive({
      autoCollapse: true,
      panels: dataCatalogStore.getDataCatalog as Panel[]
    })
    dataCatalogStore.$onAction(({name, after}) => {
      after( async(result: any) =>  {
        if (name === 'addDataProduct') {
          await fetchAll()
        }
        if (name === 'fetchDataProducts') {
          result.forEach((p: Panel) => {
            p.expanded = false
            p.actions = [
              {
                icon: 'trash',
                onClick: () => {
                  return modalStore.showModal({
                    template: "delete",
                    data: {
                      onConfirm: () => {
                        modalStore.hideModal(null)
                        modalStore.$reset()
                        loaderStore.hasLoader = false
                        dataCatalogStore.deleteDataProduct(p)
                            .then(() => {
                              toastStore.appendToast(
                                  {
                                    label: `Data Product: ${p.header} deleted`,
                                    success: true,
                                    data: {},
                                    autoRemove: false
                                  }
                              )
                              loaderStore.$reset()
                            })
                            .catch((error) => {
                              console.error(error)
                              toastStore.appendToast(
                                  {
                                    label: `Looks like something went wrong: ${error?.message}`,
                                    success: false,
                                    data: {},
                                    autoRemove: false
                                  }
                              )
                              loaderStore.$reset()
                            })
                      },
                      header: "dataCatalog.deleteDataProduct",
                      subtitle: p.header,
                    }
                  })
                }
              }
            ]
          })
          dataCatalogs.panels = result
          emptyFilters.value = true
        }
      })
    })
    const filterResults = ref({
      autoCollapse: dataCatalogs.autoCollapse,
      panels: [] as Panel[]
    })
    panels.forEach((p: Panel) => {
      p.expanded = false
      p.actions = [
        {
          icon: 'trash',
          onClick: () => {
            return modalStore.showModal({
              template: "delete",
              data: {
                onConfirm: () => {
                  dataCatalogStore.deleteDataProduct(p)
                      .then(() => {
                        toastStore.appendToast(
                            {
                              label: `Product ${p.header} deleted`,
                              success: true ,
                              data: {},
                              autoRemove: false
                            }
                        )
                        modalStore.hideModal(null)
                        modalStore.$reset()
                      })
                      .catch((error) => console.error(error))
                },
                header: "dataCatalog.deleteDataProduct",
                subtitle: p.header,
              }
            })
          }
        }
      ]
    })

    return {
      settingsStore,
      modalStore,
      toastStore,
      dataCatalogs,
      dataCatalogStore,
      panels,
      filters,
      filterResults,
      emptyFilters,
      glossaryTerms,
      organizations,
      tags,
      loaderStore,
      hasError,
      fetchAll,
      logEventAndStore
    }
  },
  methods: {
    setFilterResults(results: Panel[]) {
      this.dataCatalogs.panels = results
    },
    setEmptyFilters(e: boolean) {
      this.emptyFilters = e
    },
    addDataProduct() {
      this.loaderStore.hasLoader = false
      this.logEventAndStore({
        eventName: FIREBASE_EVENTS.dataProductDeployStart
      })
      return this.modalStore.showModal({
        template: "NewDataProduct",
        data: {
          tags: this.tags,
          onConfirm: (data: any) => {
            this.logEventAndStore({
              eventName: FIREBASE_EVENTS.dataProductDeployEnd
            })
            this.loaderStore.$reset()
            this.modalStore.hideModal(data)
            this.modalStore.$reset()
            this.dataCatalogStore.addDataProduct(data)
              .then(() => {
                this.toastStore.appendToast(
                    {
                      label: `Product created`,
                      success: true,
                      data: {},
                      autoRemove: false
                    }
                )
              })
                .catch(err => {
                  this.toastStore.appendToast(
                      {
                        label: `Looks like something went wrong: ${err.message}`,
                        success: true,
                        data: {},
                        autoRemove: false
                      }
                  )
                })

          }
        },
        styles: {
          height: 'auto',
          top: '10vh',
          width: 'auto',
          'min-width': '950px',
        },
      })
    }
  }
})
</script>

<style scoped>

.filter {
  height: 40px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.search-input {
  border-radius: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  border: 1px solid #979797;
  outline: none;
  padding: 5px;
  height: 38px;
}

</style>