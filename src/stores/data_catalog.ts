import {defineStore} from "pinia";
import DATA_PRODUCTS from "@/constants/data_product";
import axios from "axios";
import {Panel} from "@/shared/Accordion/interfaces/Panel";

export const useDataCatalogStore = defineStore('data_catalog', {
    state: () => ({
        data_catalog: [] as Panel[],
        glossaryTerms: []
    }),
    getters: {
        getDataCatalog(state) {
            return state.data_catalog
        }
    },
    actions: {
        /**
         * Get Data products
         */
        fetchDataProducts(){
          return axios
              .get(`/portal-backend/data/products/all`)
              .then(res => {
                  res.data
                      .map((p: any) => {
                          if (p?.contextBroker) {
                              //   p.domain = p.contextBroker.domain.replace("urn:ngsi-ld:Domain:", "")
                              p.domain = p.contextBroker.domain
                              p.additionalData = [
                                  {
                                      type: 'text',
                                      label: 'Domain',
                                      icon: 'at',
                                      //   value: p.contextBroker.domain.split(":Domain:")[1],
                                      //   value: p.contextBroker.domain
                                      value: p.contextBroker.domain.replace("urn:ngsi-ld:Domain:", "")
                                  },
                                  {
                                      type: 'download',
                                      label: 'Specification',
                                      value: p.contextBroker.conformsTo,
                                  },
                                  {
                                      type: 'copy',
                                      label: 'Endpoint URL',
                                      value: p.contextBroker.endpointURL,
                                  }
                              ]
                          }
                          p.header = p.title
                          p.subtitle = {
                              label: p.type
                          }
                          // There is no Domain field to be used
                          // just extract the Domain from the id
                          // TODO: Not the best solution at all
                          if (!p?.contextBroker) p.domain = `urn:ngsi-ld:Domain:${p.id.split(":")[p.id.split(":").indexOf("Domain") + 1]}`
                          p.content = p.description
                          p.owner = p.publisher[1].replace("urn:ngsi-ld:Organization:", "").replace("urn:Organization:", "").replace("urn:User:", "")
                            //   .find((pub: string) => pub.split(":")[1] === "Organization")
                            //   .split(":Organization:")[1]
                          p.metadata = [
                              {
                                  key: "tags",
                                  style: "chip",
                                  label: "dataCatalog.tags",
                                  values: p.keyword
                              },
                              {
                                  key: "glossary",
                                  style: "link",
                                  label: "dataCatalog.glossary",
                                  values: p.theme
                              },
                          ]
                      })
                  this.$state.data_catalog = res.data
                  return res.data
              })
        },
        /**
         * Get Glossary Items
         */
        fetchGlossaryTerms() {
            return axios
                .get(`/portal-backend/data/products/concepts`)
                .then(res => {
                    this.$state.glossaryTerms = res.data
                    return res?.data || []
                })
        },
        /**
         * Delete a data product by domainId and id
         * @param id Data product unique id
         * @param domain id of the domain related to the DP
         */
        deleteDataProduct({identifier, domain}: any) {
            return axios
                .delete(`/portal-backend/data/products/${domain}/${identifier}`)
                .then(() => this.$state.data_catalog.filter((p: any) => p.identifier !== identifier))
        },
        /**
         * Add a new Data Product
         * Only "panel" is used to show the DP panel
         * All other properties are used for the API
         * @param product Data product to be added
         */
        addDataProduct(product: any) {
            const {panel, details, files, domain} = product
            const form = new FormData()
            form.append('data_source', JSON.stringify({details: details}))
            const filesFields = [
                'mappings_file',
                'translation_source_to_central_file',
                'translation_central_to_target_file'
            ]
            filesFields.forEach((k: string) => {
                form.append(k,
                    files[k]?.item(0) || null
                );
            })
            return axios
                .post(`/portal-backend/data/products/${domain}`, form)
                .then(() => {
                    this.$state.data_catalog.push(panel)
                    return this.$state.data_catalog
                })
                .catch(err => {
                    console.error(err)
                    return this.$state.data_catalog
                })
        }
    }
})