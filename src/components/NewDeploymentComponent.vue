<template>
  <div style="display: grid; align-self: start;">
    <div style="display: flex; justify-content: start; padding: 24px 0 24px 0">
      <h2>Deploy a new service</h2>
    </div>
    <h3 style="padding: 40px 0 40px 0">
      {{actualStep.count}}° step
    </h3>
    <div class="new-deployment">
      <!-- DEPLOYMENT CONFIG -->
      <div style="display: grid; height: 90%; justify-items: center" v-if="actualStep.count === 1">
        <p style="padding-top: 10px">
          Service
        </p>
        <input class="stepper-input" v-model="setStepper[0].fields[0].field" type="text" placeholder="Insert name">
        <input class="stepper-input" v-model="setStepper[0].fields[1].field" type="text" placeholder="Description">
        <div class="stepper-combo">
          <label style="margin-top: 10px" for="ie_elements">Number of Components: <b>{{setStepper.length - 2}}</b></label>
          <input
              class="stepper-input"
              id="ie_elements"
              name="ie_elements"
              type="range"
              step="1"
              v-model="setStepper[0].fields[2].field"
              @input="event => {setNewServices(event.target.value)}" min="0" max="10">
        </div>
        <button style="margin-top: 20px" :disabled="setStepper[0].fields.find(f => !f.field && f.required)" @click="moveStep" class="stepper-btn">Next</button>
      </div>
      <!-- SERVICES      -->
      <div style="display: grid; height: 90%; justify-items: center" v-if="actualStep.name !== 'deploymentType' && actualStep.name !== 'deploymentConfig' && actualStep.name !== 'summary' && actualStep.name !== 'connectivity'">
        <p style="padding-top: 10px">
          Component number {{ actualStep.count - 1 }}
        </p>
        <div class="service-type-toggle">
          <div class="stepper-btn toggle" v-for="toggle in setStepper[actualStep.count - 1].fields[0].toggle" :key="toggle">
            <input
                class="stepper-service-type"
                @change="toggleSwitch(setStepper[actualStep.count - 1], toggle)"
                :id="toggle.label"
                :disabled="toggle.disabled"
                :checked="toggle.checked"
                type="checkbox"
                :value="toggle.value">
            <label class="toggle" :for="toggle.label">{{toggle.label}}</label>
          </div>
        </div>
        <input class="stepper-input" v-model="setStepper[actualStep.count - 1].fields[1].field" type="text" placeholder="Name">
        <input class="stepper-input" v-model="setStepper[actualStep.count - 1].fields[2].field"  type="text" placeholder="Description">
        <input class="stepper-input" type="text" v-model="setStepper[actualStep.count - 1].fields[3].field"  placeholder="Container image">
        <input v-if="setStepper[actualStep.count - 1].fields[0].field === 'manual'" class="stepper-input" type="text" v-model="setStepper[actualStep.count - 1].fields[4].field"  placeholder="Selected IE">
        <input v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" class="stepper-input" type="number" min="1" max="100" v-model="setStepper[actualStep.count - 1].fields[5].field"  placeholder="CPU usage (%)">
        <input v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" class="stepper-input" type="number" v-model="setStepper[actualStep.count - 1].fields[6].field" placeholder="Required RAM (mb)">
        <div class="stepper-combo">
          <label v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" for="cpuarch">CPU architecture</label>
          <select
              v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'"
              class="stepper-input"
              id="cpuarch"
              v-model="setStepper[actualStep.count - 1].fields[7].field"
          >
            <option value="x64" selected>x64</option>
            <option value="ARM64">ARM64</option>
            <option value="ARM32">ARM32</option>
          </select>
        </div>

        <div class="stepper-combo" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'">
          <label for="rtcapable">Real time capable</label>
          <input id="rtcapable"
                 class="stepper-switch"
                 type="checkbox"
                 v-model="setStepper[actualStep.count - 1].fields[8].field">
        </div>
        <button class="stepper-btn arguments" style="cursor: pointer" @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'requirements')">
          <font-awesome-icon icon="circle-plus"></font-awesome-icon>
          CLI arguments - ENV variables
        </button>
        <button class="stepper-btn arguments" style="cursor: pointer" @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'portMapping')">
          <font-awesome-icon icon="network-wired"></font-awesome-icon>
          Network ports
        </button>
        <button style="margin-top: 20px; margin-bottom: 20px" :disabled="setStepper[actualStep.count - 1].fields.find(f => f.field === null && f.required)" @click="moveStep" class="stepper-btn">Next</button>
      </div>
      <!-- CONNECTIVITY -->
<!--      <div style="height: 90%" v-if="actualStep.name === 'connectivity'">-->
<!--        <h3 style="padding-top: 20px">Connection with other components</h3>-->
<!--        <div v-for="(service, index) in setStepper.filter(s => s.name === 'serviceConfig')" :key="service" class="summary-row">-->
<!--          <div style="text-align: left">-->
<!--            <p style="font-weight: bold">Component {{index + 1}}</p>-->
<!--          </div>-->
<!--          <div style="display: grid; justify-items: right">-->
<!--              <span v-for="field in service.fields" :key="field">-->
<!--                <div v-if="field.fieldName == 'name'">-->
<!--                  <span style="text-transform: capitalize;">Name: </span> {{field.field}}-->
<!--                </div>-->
<!--                <div v-if="field.fieldName == 'description'">-->
<!--                  <span style="text-transform: capitalize;">Description: </span> {{field.field}}-->
<!--                </div>-->
<!--              </span>-->
<!--          </div>-->
<!--          <AerosChips :opts="[...setStepper.filter(s => s.name === 'serviceConfig')]" :component-index="index"></AerosChips>-->
<!--        </div>-->
<!--        <button style="margin-top: 20px; margin-bottom: 20px" @click="moveStep" class="stepper-btn">Next</button>-->
<!--      </div>-->
      <!-- SUMMARY  -->
      <div style="display: grid; height: 90%; justify-items: center" v-if="actualStep.name === 'summary'">
        <h3 style="padding-top: 20px">Summary</h3>
        <div class="summary">
          <div class="summary-row">
            <div style="text-align: left">
              <p style="font-weight: bold">General data</p>
            </div>
            <div style="display: grid; justify-items: left;">
              <p v-for="data in setStepper[0].fields" :key="data"><span style="text-transform: capitalize; color: #979797; font-style: italic">{{data.label}}</span>  {{data.field}}</p>
            </div>
          </div>
          <div v-for="(service, index) in setStepper.filter(s => s.name === 'serviceConfig')" :key="service" class="summary-row">
            <div style="text-align: left">
              <p style="font-weight: bold">Component {{index + 1}}</p>
            </div>
            <div style="display: grid; justify-items: left">
              <span v-for="field in service.fields" :key="field">
                <div v-if="field.fieldName !== 'arguments' && field.fieldName !== 'networkPorts'">
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">{{field.label}}</span>  {{field.field}}
                </div>
                <div style="display: grid; justify-items: baseline" v-if="field.fieldName === 'arguments'">
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">CLI arguments:</span>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="text-align: left" v-for="f in filterArgs(field.field, 'CLI')" :key="f">
                      {{f.key}}={{f.value}}
                    </li>
                  </ul>
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">ENV variables:</span>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="text-align: left" v-for="f in filterArgs(field.field, 'ENV')" :key="f">
                      {{f.key}}={{f.value}}
                    </li>
                  </ul>
                </div>
                <div style="display: grid; justify-items: baseline" v-if="field.fieldName === 'networkPorts'">
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">Network ports:</span>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="text-align: left" v-for="f in field.field" :key="f">
                      {{f.portNumber}}/{{f.protocol}}
                    </li>
                  </ul>
                </div>
              </span>
            </div>
          </div>
          <button @click="deployService" style="margin-top: 20px; margin-bottom: 20px; justify-self: center" class="stepper-btn">Confirm and deploy service</button>
        </div>
      </div>
    </div>
    <div class="steps">
      <a v-for="(step, index) in setStepper" :class="{'disabled': setStepper[index - 1]?.fields.find(s => !s.field && s.required)}" :key="step" @click="goToStep(index, step.name)">
        <font-awesome-icon :icon="['fas', 'circle']" :style="{'color': actualStep.count === index+1 ? '#004AAD' : '#8E9DCC'}"/>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import {useRouter} from "vue-router";
import {useModalStore} from "@/stores/modal";
import AerosChips from "@/shared/Chips/AerosChips.vue";
import {useEventBus} from "@/stores/eventbus";
import {useDeploymentsStore} from "@/stores/deployment";
import {useToastsStore} from "@/stores/toasts";


interface Field {
  fieldName: string;
  label: string;
  field: any;
  required: boolean;
  toggle?: any[]

}

interface Step {
  name: string;
  index?: number;
  fields: Array<Field>
}

/**
 * Deployment step wizard
 * TODO: Pinia store integration
 */
export default defineComponent({
  name: "NewDeploymentComponent",
  // components: {AerosChips},
  props: {
    set: {
      type: Boolean,
      default: true
    }
  },

  setup: () => {
    const modalStore = useModalStore()
    const eventBus = useEventBus()
    const deploymentsStore = useDeploymentsStore()
    const toastStore = useToastsStore()
    const router = useRouter()
    const actualStep = ref({
      count: 1,
      name: 'deploymentConfig'
    })
    const setStepper = ref([] as Array<Step> | never);
    setStepper.value.push({
      name: 'deploymentConfig',
      fields: [
        {
          fieldName: 'name',
          label: 'Name',
          field: null,
          required: true
        },
        {
          fieldName: 'description',
          label: 'Description',
          field: null,
          required: true
        },
        {
          fieldName: 'IE',
          label: 'Components',
          field: 0,
          required: true
        }
      ]
    });
    // setStepper.value.push({
    //    name: "connectivity",
    //    fields: []
    // })
    setStepper.value.push({
      name: 'summary',
      fields: []
    })

    eventBus.on("modal-confirm", (result: any) => {
      const selectedField: any = setStepper.value[result.index].fields.find((f: { fieldName: any; }) => f.fieldName == result.field)
      if (selectedField) {
        selectedField.field = result.data
      }
    })

    function filterArgs(args: any[], type: string) {
      return args.filter(arg => arg.type === type)
    }

    /** Move the stepper forward **/
    function moveStep() {
      actualStep.value.count++
      actualStep.value.name = setStepper.value[actualStep.value.count -1].name
    }

    /**
     * Deploy a new service
     */
    function deployService() {
      // Remove the summary section from the body
      const deploymentFields = [...setStepper.value]
      deploymentFields.pop()
      const payload = {
        config: {
          name: deploymentFields[0].fields[0].field,
          description: deploymentFields[0].fields[1].field
        },
        serviceComponents: [
            ...deploymentFields
                .filter(field => field.name === "serviceConfig")
                .map(f => f.fields)
                .map((f: any) => {
                  const mapField: any = {}
                  f.map((field: { fieldName: string | number; field: any; }) => {
                    mapField[field.fieldName] = field.field
                  })
                  return mapField
                })
        ]
      }
      deploymentsStore.newDeployment(payload)
        .then(r => {
          let toast: any = {
            label: 'Service deployed successfully',
            success: true,
            autoRemove: true
          }
          if (r.status !== 200) {
            toast = {
              label: 'Looks like something went wrong',
              success: false,
              autoRemove: true
            }
          }
          toastStore.appendToast(toast)
          router.push('/deployments')
        })
        .catch(err => console.error(err))

    }

    /**
     * Got to a specific step
     * @param selected step selected
     * @param name name of the step
     */
    function goToStep(selected: number, name: string) {
      actualStep.value.count = selected + 1
      actualStep.value.name = name
    }

    /**
     * Set the field value for a step
     * @param field field to be valuated
     * @param value value
     */
    function setField(field: Field, value: string) {
      field.field = value;
    }

    /**
     * Prevent from insert a wrong max-min value
     * @param el
     */
    function minMaxInput(el: any) {
      if (el.value != "") {
        if (parseInt(el.value) < parseInt(el.min)) {
          el.value = el.min;
        }
        if (parseInt(el.value) > parseInt(el.max)) {
          el.value = el.max;
        }
      }
    }

    /**
     * Switch toggle function for service type
     * @param service selected service
     * @param toggle toggle
     */
    function toggleSwitch(service: any, toggle: any) {
      service?.fields[0].toggle.map((t: { checked: boolean; }) => t.checked = false)
      toggle.checked = true
      // const requirementField = service.fields.find((f: { fieldName: string; }) => f.fieldName == 'requirements')
      const IEField = service.fields.find((f: { fieldName: string; }) => f.fieldName == 'selected_ie')
      // Some fields are required for specific service type
      IEField.required = toggle.value !== 'auto'
      service.fields
        .filter((f: { fieldName: string; }) =>
          f.fieldName == 'cpu' ||
          f.fieldName == 'ram' ||
          f.fieldName == 'cpu_arch' ||
          f.fieldName == 'real_time'
        )
        .map( (f: { required: boolean; }) => {
          f.required = toggle.value == 'auto'
        })
      setField(service.fields[0], toggle.value)
    }

    /**
     * Set a new list of services
     * FIXME: services doesnt keep data when a service is removed
     * TODO: Update the service creation design
     * @param services number of services to be created
     */
    function setNewServices(services: number) {
      const summaryStep = setStepper.value.pop() as Step
      // const connectivityStep = setStepper.value.pop() as Step
      let newServices = [] as any
      const serviceStep: Step = {
        name:  `serviceConfig`,
        fields: [
          {
            fieldName: 'type',
            field: 'manual',
            label: 'Deployment mode',
            required: true,
            toggle: [
              {
                label: 'Manual',
                value: 'manual',
                disabled: false,
                checked: true
              },
              {
                label: 'Semi-automatic',
                value: 'semiauto',
                disabled: true,
                checked: false
              },
              {
                label: 'Automatic',
                value: 'auto',
                disabled: false,
                checked: false
              }
            ]
          },
          {
            fieldName: 'name',
            label: 'Name',
            field: null,
            required: true
          },
          {
            fieldName: 'description',
            label: 'Description',
            field: null,
            required: true
          },
          {
            fieldName: 'containerImage',
            label: 'Container image',
            field: null,
            required: true
          },
          {
            fieldName: 'selected_ie',
            label: 'Selected IE',
            field: null,
            required: true
          },
          {
            fieldName: 'cpu',
            label: 'Required CPU (%)',
            field: null,
            required: false
          },
          {
            fieldName: 'ram',
            label: 'Required RAM (mb)',
            field: null,
            required: false
          },
          {
            fieldName: 'cpu_arch',
            label: 'CPU architecture',
            field: 'x64',
            required: false
          },
          {
            fieldName: 'real_time',
            label: 'Real time capable',
            field: false,
            required: false
          },
          {
            fieldName: 'arguments',
            label: "arguments",
            field: [],
            required: false
          },
          {
            fieldName: 'networkPorts',
            label: 'Network ports',
            field: [],
            required: false
          }
        ]
      };

      // Create a new list of services
      const configLength = setStepper.value.filter((s: { name: string; }) => s.name === 'serviceConfig').length
      if (configLength < +services || setStepper.value.filter((s: { name: string; }) => s.name === 'serviceConfig').length === 0 ) {
        // FIXED: serviceStep deep copy to remove object reference
        newServices = [...Array.from({length: +services - configLength})
            .map((_, i) => JSON.parse(JSON.stringify(serviceStep)))]
        newServices.map((s: any) => setStepper.value.push(s))
      } else {
        const deleteCount =  configLength - +services;
        setStepper.value.splice(-deleteCount)
      }
      // setStepper.value.push(connectivityStep)
      setStepper.value.push(summaryStep)

    }
    return {
      setStepper,
      actualStep,
      modalStore,
      moveStep,
      goToStep,
      setField,
      setNewServices,
      minMaxInput,
      toggleSwitch,
      deployService,
      filterArgs
    }
  },
  methods: {
    openModal(service: any, template: string) {
      this.modalStore.showModal(
          {
            template,
            data: service,
            styles: {
              height: '40vh',
              top: '15vh'
            }
          }
      )
    }
  }
})
</script>

<style scoped>

h2, h3, p {
  color: #004AAD;
}

.new-deployment {
  width: 637px;
  min-height: 333px;
  border-radius: 10px;
  border: solid 1.5px #E6EAF6;
  padding: 7px;
  align-self: start;

}


.summary {
  display: grid;
  width: 90%;
}

.summary-row {
  display: grid;
  justify-content: space-between;
  grid-template-columns: 50% 50%;
  padding-top: 20px;
}

a.disabled {
  pointer-events: none;
  cursor: not-allowed;
}

.stepper-btn {
  background: #004AAD;
  color: #FFFFFF;
  border: none;
  outline: none;
  border-radius: 10px;
  height: 40px;
  width: 298px;
  margin-top: 10px;
}

.stepper-btn.arguments {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.stepper-btn.toggle {
  display: grid;
  margin-bottom: 10px;
  width: 180px;
}

.service-type-toggle {
  display: flex;
  justify-content: space-between;
}

.stepper-btn.toggle:first-child {
  border-radius: 10px 0 0 10px;
}

.stepper-btn.toggle {
  border-radius: 0;
}

.stepper-service-type:checked + label.toggle {
  background: #04224f;
  pointer-events: none;
  border-radius: inherit;
}

.stepper-btn.toggle:last-child {
  border-radius: 0 10px 10px 0;
}

label.toggle ,
.stepper-btn {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

label.toggle {
  display: grid;
  align-content: center;
}

.stepper-btn.toggle > input {
  appearance: none;
  display: none;
}

.stepper-input {
  width: 298px;
  height: 40px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #979797;
  outline: none;
  padding: 4px;
}

.stepper-input[type=range] {
  width: auto;
}

.stepper-combo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  width: 298px;
}

select.stepper-input {
  width: auto;
  margin-top: 0;
}

.stepper-input[type=range] {
  padding: 0;
}

.stepper-btn:disabled,
.stepper-service-type:disabled + label.toggle {
  background: #8E9DCC;
  cursor: not-allowed;
}

.steps {
  display: flex;
  font-size: 10px;
  justify-content: space-around;
  align-self: start;
  padding-top: 20px;
  min-width: 200px;
  justify-self: center;
  cursor: pointer;
  margin-bottom: 20px;
}

.stepper-switch {
  position: relative;
  background: #8E9DCC;
  width: 80px;
  height: 35px;
  -webkit-appearance: initial;
  border-radius: 10px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  font-size: 14px;
  font-family: Trebuchet, Arial, sans-serif;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #ddd;
}

.stepper-switch:checked {
  background-color: #004AAD;
}

.stepper-switch:after {
  position: absolute;
  top: 5%;
  display: grid;
  align-content: center;
  justify-content: center;
  line-height: 32px;
  width: 45%;
  height: 90%;
  background: #fff;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  color: black;
  border: #888 1px solid;
  border-radius: 10px;
}

.stepper-switch:after {
  left: 2%;
  content: "No";
}

.stepper-switch:checked:after {
  left: 53%;
  content: "Yes";
}

</style>