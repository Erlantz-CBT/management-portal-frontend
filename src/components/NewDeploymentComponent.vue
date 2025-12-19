<template>
  <div>
    <Transition name="fade" mode="out-in">
      <div :key="$route.fullPath" style="display: grid; align-self: start; padding: 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; padding: 15px 0px 55px;">
          <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">{{ $t('deployments.newDeployment') }}</h2>
          <router-link to="/deployments" class="back"><font-awesome-icon style="font-size: 16px" icon="arrow-left" /> {{$t('sidebar.deployments')}} <span></span></router-link>
        </div>
        <div style="display: grid; justify-content: center;width: calc(-245px + 100vw)">
          <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"  style="padding: 40px 0 15px 0">
            {{actualStep.count}}° step
          </h3>
          <div class="new-deployment">
            <!-- DEPLOYMENT CONFIG -->
            <div :key="actualStep.count" style="display: grid; height: 90%; width: 640px ; justify-items: center; row-gap: 15px;" v-if="actualStep.count === 1">
              <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">
                {{ $t('deployments.service') }}
              </p>
              <input
                  :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                  class="stepper-input"
                  v-model="setStepper[0].fields[0].field"
                  type="text"
                  :placeholder="$t('deployments.deploymentName')">
              <input
                  :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                  class="stepper-input"
                  v-model="setStepper[0].fields[1].field"
                  type="text"
                  :placeholder="$t('deployments.description')">
              <div class="stepper-combo">
                <label for="service_overlay">{{ $t('deployments.serviceOverlay') }}</label>
                <input id="service_overlay"
                       class="stepper-switch"
                       v-model="setStepper[0].fields[3].field"
                       type="checkbox"/>
              </div>
              <div class="stepper-combo">
                <label style="margin-top: 10px; text-align: left" for="ie_elements">{{ $t('deployments.numberOfComponents') }}: <b>{{setStepper.length - setStepper.filter(s => s.name !== 'serviceConfig').length}}</b></label>
                <input
                    class="stepper-input"
                    id="ie_elements"
                    name="ie_elements"
                    type="range"
                    step="1"
                    v-model="setStepper[0].fields[2].field"
                    @input="event => {setNewServices(event.target.value)}" min="0" max="10">
              </div>
              <button :disabled="setStepper[0].fields.find(f => !f.field && f.required)" @click="moveStep" class="stepper-btn">{{$t('deployments.next')}}</button>
            </div>
            <!-- SERVICES      -->
            <div :key="actualStep.count" style="display: grid; row-gap:15px ;height: 90%;min-width: 640px ;justify-items: center" v-if="actualStep.name !== 'deploymentType' && actualStep.name !== 'deploymentConfig' && actualStep.name !== 'summary' && actualStep.name !== 'connectivity'">
              <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">
                {{ $t('deployments.componentNumber') }} {{ actualStep.count - 1 }}
              </p>
              <!-- Deploy type toggle -->
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
                  <label class="toggle" :for="toggle.label">{{ $t(toggle.label)}}</label>
                </div>
              </div>
              <div style="display: flex; gap: 15px">
                <!-- Left column fields -->
                <div style="display: grid; row-gap: 15px; grid-auto-rows: max-content;">
                  <input
                      :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                      class="stepper-input"
                      v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'name').field" type="text"
                      :placeholder="$t('deployments.name')">
                  <input
                      :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                      class="stepper-input"
                      v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'description').field"
                      type="text"
                      :placeholder="$t('deployments.description')">
                  <input
                      :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                      class="stepper-input"
                      type="text"
                      v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'containerImage').field"
                      :placeholder="$t('deployments.containerImage')">
                  <div v-if="setStepper[actualStep.count - 1].fields[0].field === 'manual'" class="stepper-combo">
                    <select
                        class="stepper-input"
                        v-model="selectedDomain[setStepper[actualStep.count - 1].id].value"
                        v-on:change="fetchIE(setStepper[actualStep.count - 1].id)"
                        style="min-width: 320px;"
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
                          :value="domain">{{ domain.description }}</option>
                    </select>
                  </div>
                  <div
                      class="loader-placeholer"
                      :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                      v-if="IE.fetching && setStepper[actualStep.count - 1].fields[0].field === 'manual'">
                    <VueSpinner color="#004AAD"></VueSpinner>
                  </div>
                  <div v-if="setStepper[actualStep.count - 1].fields[0].field === 'manual' && !IE.fetching && selectedDomain[setStepper[actualStep.count - 1].id].value" class="stepper-combo">
                    <select
                        class="stepper-input"
                        style="min-width: 320px;"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'selected_ie').field"
                        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                        name="domain" id="domain">
                      <option
                          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
                          :value="null">Select a IE</option>
                      <option
                          v-for="d in IE.IE[setStepper[actualStep.count - 1].id]"
                          :key="d.id"
                          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#282828',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#282828' : '#ffffff'
                }"
                          :value="d">{{ d?.hostname }}</option>
                    </select>
                  </div>
                  <div v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" class="stepper-combo">
                    <select
                        class="stepper-input"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'domain').field"
                        style="min-width: 320px;"
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
                          :value="domain">{{ domain.description }}</option>
                    </select>
                  </div>
                  <button class="stepper-btn arguments" style="cursor: pointer" @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'requirements')">
                    <font-awesome-icon icon="circle-plus"></font-awesome-icon>
                    CLI arguments - ENV variables
                  </button>
                  <button class="stepper-btn arguments" style="cursor: pointer" @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'portMapping')">
                    <font-awesome-icon icon="network-wired"></font-awesome-icon>
                    Network ports
                  </button>
                </div>
                <!-- Right column fields -->
                <div style="display: grid; row-gap: 15px; grid-auto-rows: max-content;">
                  <div v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" class="stepper-combo">
                    <label for="cpuUsage">{{ $t('deployments.cpuUsage') }}</label>
                    <select
                        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                        class="stepper-input" v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'cpu').field" id="cpuUsage">
                      <option
                          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                          v-for="v in cpuOptions" :value="v" :key="v">{{ v }}%</option>
                    </select>
                  </div>
                  <div v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'" class="stepper-combo">
                    <label for="ramUsage">{{ $t('deployments.requiredRam') }}</label>
                    <select
                        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                        class="stepper-input"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'ram').field" id="ramUsage">
                      <option
                          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                          v-for="v in ramOptions" :value="v" :key="v">{{ v }} GB</option>
                    </select>
                  </div>
                  <div class="stepper-combo" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'">
                    <label for="cpuarch">{{ $t('deployments.cpuArch') }}</label>
                    <select
                        :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'"
                        class="stepper-input"
                        id="cpuarch"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'cpu_arch').field"
                    >
                      <option
                          :style="{
                'color': settingsStore.colorScheme === 'dark' ? '#ffffff' : '#000000',
                'background-color':  settingsStore.colorScheme === 'dark' ? '#0F0F0F' : '#ffffff'
                }"
                          v-for="v in cpuArchOptions" :value="v" :key="v" selected>{{ v }}</option>
                    </select>
                  </div>
                  <div class="stepper-combo" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'">
                    <label for="rtcapable">Real time capable</label>
                    <input id="rtcapable"
                           class="stepper-switch"
                           type="checkbox"
                           v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'real_time').field">
                  </div>
                  <div class="stepper-combo">
                    <label for="ports_exposed">Expose ports</label>
                    <input id="ports_exposed"
                           class="stepper-switch"
                           type="checkbox"
                           v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'expose_ports').field">
                  </div>
                  <div class="stepper-combo">
                    <label for="deployasjob">{{ $t(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'deployAsJob').label) }}</label>
                    <input id="deployasjob"
                           class="stepper-switch"
                           type="checkbox"
                           v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'deployAsJob').field">
                  </div>
                  <div class="stepper-combo">
                    <div style="display: flex; align-items: center">
                      <label for="privateImage">{{ $t(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').label) }}</label>
                      <a @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'EditServiceCredentials')" :class="settingsStore?.colorScheme"
                         style="margin-left: 15px; cursor: pointer; font-size: 20px; vertical-align: middle" v-if="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field">
                        <font-awesome-icon
                            :class="(!setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userName ||
                        !setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userPassword) ? 'invalid' : null"
                            :icon="(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userName &&
                        setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userPassword) ? 'lock' : 'circle-exclamation'"></font-awesome-icon>
                      </a>
                      <a @click="copyToClipboard(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field, 'Credentials')"
                         v-if="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userName &&
                        setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field?.userPassword"
                         style="margin-left: 15px; cursor: pointer; font-size: 20px; vertical-align: middle">
                        <font-awesome-icon icon="copy"></font-awesome-icon>
                      </a>
                    </div>
                    <div style="display: flex; align-items: center">
                      <input id="privateImage"
                             class="stepper-switch"
                             type="checkbox"
                             @change="(e) => e.target.checked ? openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1}, 'EditServiceCredentials', e) : setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field = false"
                             :checked="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'privateImage').field">
                    </div>

                  </div>
                  <button
                      v-if="setStepper[actualStep.count - 1].fields[0].field === 'semiauto'"
                      class="stepper-btn arguments"
                      style="cursor: pointer"
                      @click="openModal({service: setStepper[actualStep.count - 1], index: actualStep.count - 1, domains: domains.domains}, 'IEPool')">
                    <font-awesome-icon icon="list"></font-awesome-icon>
                    Select IE Pool
                    <font-awesome-icon
                        v-if="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'iePool').field.length === 0"
                        icon="circle-exclamation"></font-awesome-icon>
                  </button>
                  <div class="stepper-combo" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto'">
                    <label for="efficiencyOptions">{{ $t(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenOptions').label) }}</label>
                    <input id="efficiencyOptions"
                           class="stepper-switch"
                           type="checkbox"
                           v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenOptions').field">
                  </div>
                  <div class="stepper-combo" style="margin-top: 0" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto' && setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenOptions').field">
                    <label for="efficiency">Efficiency {{(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'energyEfficiencyRatio').field * 100)}}%
                    </label>
                    <input
                        id="efficiency"
                        class="stepper-input"
                        step="0.1"
                        min="0"
                        max="1"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'energyEfficiencyRatio').field"
                        type="range">
                  </div>
                  <div class="stepper-combo" style="margin-top: 0" v-if="setStepper[actualStep.count - 1].fields[0].field === 'auto' && setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenOptions').field">
                    <label for="green">Green {{(setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenEnergyRatio').field * 100)}}%
                    </label>
                    <input
                        id="green"
                        class="stepper-input"
                        step="0.1"
                        min="0"
                        max="1"
                        v-model="setStepper[actualStep.count - 1].fields.find(f => f.fieldName === 'greenEnergyRatio').field"
                        type="range">
                  </div>
                </div>
              </div>
              <button :disabled="setStepper[actualStep.count - 1].fields.find(f => (Array.isArray(f.field) ? f.field.length === 0 : f.field === null) && f.required)" @click="moveStep" class="stepper-btn">{{$t('deployments.next')}}</button>
            </div>
            <!-- CONNECTIVITY -->
            <!--        <div style="height: 90%; width: 640px" v-if="actualStep.name === 'connectivity'">-->
            <!--          <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="padding-top: 20px">Connection with other components</h3>-->
            <!--          <div v-for="(service, index) in setStepper.filter(s => s.name === 'serviceConfig')" :key="service" class="summary-row">-->
            <!--            <div style="text-align: left; grid-area: component">-->
            <!--              <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="font-weight: bold">Component {{index + 1}}</p>-->
            <!--            </div>-->
            <!--            <div style="display: grid; justify-items: right; grid-area: description">-->
            <!--              <span v-for="field in service.fields" :key="field">-->
            <!--                <div v-if="field.fieldName === 'name'">-->
            <!--                  <span style="text-transform: capitalize;">Name: </span> {{field.field}}-->
            <!--                </div>-->
            <!--                <div v-if="field.fieldName === 'description'">-->
            <!--                  <span style="text-transform: capitalize;">Description: </span> {{field.field}}-->
            <!--                </div>-->
            <!--              </span>-->
            <!--            </div>-->
            <!--            <div style="grid-area: connection">-->
            <!--              <AerosChips-->
            <!--                  :opts="setStepper.filter(s => s.name === 'serviceConfig')"-->
            <!--                  :connections="service.fields.find(f => f.fieldName === 'connections').field"-->
            <!--                  :component-index="index"-->
            <!--                  :type="'component'"-->
            <!--                  @valueChange="(e) => {service.fields.find(f => f.fieldName === 'connections').field = e}"-->
            <!--                  :component-id="service.id">-->
            <!--              </AerosChips>-->
            <!--            </div>-->
            <!--          </div>-->
            <!--          <button style="bottom: 20px" @click="moveStep" class="stepper-btn">{{$t('deployments.next')}}</button>-->
            <!--        </div>-->
            <!-- SUMMARY  -->
            <div :key="actualStep.count" style="display: grid; width: 800px ;height: 90%; justify-items: center" v-if="actualStep.name === 'summary'">
              <h3 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="padding-top: 20px">{{ $t('deployments.summary') }}</h3>
              <div class="summary">
                <div class="summary-row">
                  <div style="text-align: left">
                    <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="font-weight: bold">{{ $t('deployments.generalData') }}</p>
                  </div>
                  <div style="display: grid; justify-items: left; width: 100%">
                    <p v-for="data in setStepper[0].fields" :key="data"><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$tc(data.label, setStepper.filter(s => s.name === 'serviceConfig').length)}}</span>
                      {{ data.fieldName !== 'serviceOverlay' ? data.field : null }}
                      <font-awesome-icon style="margin-left: 10px" v-if="data.fieldName === 'serviceOverlay'" :icon="data.field ? 'check' : 'xmark'"/>
                    </p>
                  </div>
                </div>
                <div v-for="(service, index) in setStepper.filter(s => s.name === 'serviceConfig')" :key="service" class="summary-row">
                  <div style="text-align: left">
                    <p :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'" style="font-weight: bold">{{ $t('deployments.component') }} {{index + 1}}</p>
                  </div>
                  <div style="display: grid; justify-items: left; width: 100%">
              <span v-for="field in service.fields" :key="field">
                <div
                    v-if="field.fieldName !== 'arguments' &&
                    field.fieldName !== 'networkPorts' &&
                    field.fieldName !== 'connections' &&
                    field.fieldName !== 'selected_ie' &&
                    field.fieldName !== 'real_time' &&
                    field.fieldName !== 'iePool' &&
                    field.fieldName !== 'domain' &&
                    field.fieldName !== 'serviceOverlay' &&
                    field.fieldName !== 'privateImage' &&
                    field.fieldName !== 'deployAsJob' &&
                    field.fieldName !== 'expose_ports'">
                  <p><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$t(field.label)}}</span>  {{field.field || '---'}}</p>
                </div>
                <div v-if="field.fieldName === 'expose_ports' || field.fieldName === 'real_time' || field.fieldName === 'deployAsJob' || field.fieldName === 'serviceOverlay'">
                  <p><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$t(field.label)}}</span><font-awesome-icon style="margin-left: 10px" :icon="field.field ? 'check' : 'xmark'" /></p>
                </div>
                <div v-if="field.fieldName === 'privateImage' ">
                  <p><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$t(field.label)}}</span>
                    <font-awesome-icon style="margin-left: 10px" :icon="field.field ? 'check' : 'xmark'" />
                    <a v-if="field.field" style="cursor: pointer" @click="copyToClipboard(field.field, 'Credentials')"><font-awesome-icon style="margin-left: 10px" icon="copy" /></a></p>
                </div>
                <div v-if="field.fieldName === 'selected_ie'">
                  <p><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$t(field.label)}}</span>  {{field.field?.hostname}}</p>
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
                <div style="display: grid; justify-items: baseline" v-if="field.fieldName === 'connections'">
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">Connections:</span>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="text-align: left" v-for="f in field.field" :key="f">
                      {{f?.component.fields.find(x => x.fieldName === 'name').field}}
                    </li>
                  </ul>
                </div>
                <div style="display: grid; justify-items: baseline" v-if="field.fieldName === 'iePool'">
                  <span style="text-transform: capitalize; color: #979797; font-style: italic">IEs:</span>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="text-align: left" v-for="f in field.field" :key="f">
                      {{f?.domain.split(":").at(-1)}} - {{f?.ie.split(":").at(-1)}}
                    </li>
                  </ul>
                </div>
                <div v-if="field.fieldName === 'domain'">
                  <p><span style="text-transform: capitalize; color: #979797; font-style: italic">{{$t(field.label)}}</span> {{field.field?.id.split(":").at(-1)}}</p>
                </div>
              </span>
                  </div>
                </div>
                <button @click="deployService" :disabled="!checkFields()" style="margin-top: 15px; justify-self: center" class="stepper-btn">{{$t('deployments.confirmDeploy')}}</button>
              </div>
            </div>
          </div>
          <div class="steps">
            <a v-for="(step, index) in setStepper"
               :class="{'disabled': actualStep.count ===  index+1 ? null : enableStep(step)}"
               class="step"
               :key="step"
               @click="enableStep(step) ? null : goToStep(index, step.name)
        ">
              <font-awesome-icon :icon="['fas', 'circle']" :style="{'color': actualStep.count === index+1 ? '#004AAD' : '#8E9DCC'}"/>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useModalStore} from "@/stores/modal";
// import AerosChips from "@/shared/Chips/AerosChips.vue";
import {useDeploymentsStore} from "@/stores/deployment";
import {useToastsStore} from "@/stores/toasts";
import {useSettings} from "@/stores/settings";
import {useDomainStore} from "@/stores/domain";
import {useLoaderStore} from "@/stores/loader";
import {VueSpinner} from "vue3-spinners";


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
  id?: number;
  fields: Array<Field>
}

/**
 * Deployment step wizard
 * TODO: Pinia store integration
 */
export default defineComponent({
  name: "NewDeploymentComponent",
  components: {
    // AerosChips,
    VueSpinner
  },
  props: {
    set: {
      type: Boolean,
      default: true
    }
  },

  setup: () => {
    const [
        deploymentsStore,
        domainStore,
        loaderStore,
        toastStore,
        settingsStore,
        modalStore
    ] = [
        useDeploymentsStore(),
        useDomainStore(),
        useLoaderStore(),
        useToastsStore(),
        useSettings(),
        useModalStore()
    ]
    const router = useRouter()
    const actualStep = ref({
      count: 1,
      name: 'deploymentConfig'
    })
    const ramOptions = ref([0.5, 1, 2, 4, 8, 16])
    const cpuOptions = ref([20,30,40,50,60,70,80])
    const cpuArchOptions = ref(['x64', 'ARM32', 'ARM64'])
    const domains = reactive({domains: []})
    const selectedDomain: any = ref({})
    const IE = reactive({IE: {} as any, fetching: false})
    const fetchDomains = async() => {
      domains.domains = await domainStore.fetchDomains()
          .then(res => res.data)
          .catch(err => console.error(err))
    }
    onMounted(async () => {
      await fetchDomains()
    })
    const energySaveOptions = ref([
      {
        value: 0,
        label: 'Performance',
        icon: 'bolt'
      },
      {
        value: 25,
        label: 'Less performance',
        icon: 'plug-circle-bolt'
      },
      {
        value: 50,
        label: 'Balanced',
        icon: 'scale-balanced'
      },
      {
        value: 75,
        label: 'Less efficient',
        icon: 'seedling'
      },
      {
        value: 100,
        label: 'Energy saving',
        icon: 'leaf'
      }
    ])
    // ServiceList used to generate a temporary identifier
    const serviceList = new WeakMap<Step, number>()
    const setStepper = ref([] as Array<Step> | never);
    // Global deployment options
    setStepper.value.push({
      name: 'deploymentConfig',
      fields: [
        {
          fieldName: 'name',
          label: 'deployments.name',
          field: null,
          required: true
        },
        {
          fieldName: 'description',
          label: 'deployments.description',
          field: null,
          required: true
        },
        {
          fieldName: 'IE',
          label: 'deployments.component',
          field: 0,
          required: true
        },
        {
          fieldName: 'serviceOverlay',
          label: 'deployments.serviceOverlay',
          field: false,
          required: false
        }
      ]
    });
    // TODO: connectivity step are disabled for now
    // setStepper.value.push({
    //    name: "connectivity",
    //    fields: []
    // })
    setStepper.value.push({
      name: 'summary',
      fields: []
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
     * Check if all the required fields are valid
     */
    function checkFields() {
      const fields = setStepper.value
          .filter(field => field.name === "serviceConfig")
          .map(f => f.fields)
          .map(f => {
            return f
                .find(field => (Array.isArray(field.field) ? field.field.length === 0 : field.field === null) && field.required)
          })
      // Check if every serviceConfig required fields are populated correctly
      return fields.every(f => f === undefined)
    }

    /**
     * Deploy a new service
     */
    function deployService() {
      // Remove the summary section from the body
      const deploymentFields = [...setStepper.value]
      deploymentFields.pop()

      // Check if all the required fields are valid
      if (!checkFields) {
        toastStore.appendToast({
          label: 'Check the required fields',
          success: false,
          autoRemove: true
        })
        return null
      }
      const payload = {
        config: {
          name: deploymentFields[0].fields[0].field,
          description: deploymentFields[0].fields[1].field,
          serviceOverlay: deploymentFields[0].fields[3].field,
        },
        serviceComponents: [
            ...deploymentFields
                .filter(field => field.name === "serviceConfig")
                .map(f => f.fields)
                .map((f: any) => {
                  const mapField: any = {}
                  f.map((field: { fieldName: string | number; field: any; }) => {
                    mapField[field.fieldName] = field.field
                    if (field.fieldName === 'selected_ie' || field.fieldName === 'domain') {
                      mapField[field.fieldName] = field.field?.id || null
                    }
                    if (field.fieldName === 'iePool') {
                      mapField[field.fieldName] = field.field.map((ie: any) => ie.ie)
                    }
                    if (field.fieldName === 'privateImage') {
                      mapField["isPrivateImage"] = !!field.field
                      // privateImage setted to false could cause a validation error
                      mapField["privateImage"] = field.field || null
                    }
                    if(field.fieldName === 'connections') {
                      mapField['connections'] = field.field
                          .map(
                              (c: any) => c.component.fields.find((x: any) => x.fieldName === 'name')?.field
                          )
                    }
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
      const imageCredentials = service.fields.find((f: { fieldName: string; }) => f.fieldName == 'privateImage')
      imageCredentials.field = null
      selectedDomain.value[service.id].value = null
      IE.IE[service.id] = []
      const requiredFields: any = {
        'auto': ['cpu', 'ram', 'cpu_arch'],
        'semiauto': ['iePool'],
        'manual': ['selected_ie']
      }
      // Reset all the fields
      Object.values(requiredFields).flat().forEach(fieldName => {
        const field = service.fields.find((f: { fieldName: string; }) => f.fieldName === fieldName)
        if (field) {
          field.required = false
          if (Array.isArray(field.field)) {
            field.field = []
          } else {
            field.field = null
          }

        }
      })
      requiredFields[toggle.value as keyof object].forEach((fieldName: string) => {
        const field = service.fields.find((f: { fieldName: string; }) => f.fieldName === fieldName)
        if (field) {
          field.required = true
        }
      })
      setField(service.fields[0], toggle.value)
    }

    /**
     * Set a new list of services
     * @param services number of services to be created
     */
    function setNewServices(services: number) {
      const summaryStep = setStepper.value.pop() as Step
      // TODO: connection step are disabled for now
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
                label: 'deployments.manual',
                value: 'manual',
                disabled: false,
                checked: true
              },
              {
                label: 'deployments.semiAutomatic',
                value: 'semiauto',
                disabled: false,
                checked: false
              },
              {
                label: 'deployments.automatic',
                value: 'auto',
                disabled: false,
                checked: false
              }
            ]
          },
          {
            fieldName: 'name',
            label: 'deployments.name',
            field: null,
            required: true
          },
          {
            fieldName: 'description',
            label: 'deployments.description',
            field: null,
            required: true
          },
          {
            fieldName: 'containerImage',
            label: 'deployments.containerImage',
            field: null,
            required: true
          },
          {
            fieldName: 'selected_ie',
            label: 'deployments.selectedIE',
            field: null,
            required: true
          },
          {
            fieldName: 'expose_ports',
            label: 'Expose ports',
            field: false,
            required: false
          },
          {
            fieldName: 'cpu',
            label: 'deployments.cpuUsage',
            field: null,
            required: false
          },
          {
            fieldName: 'ram',
            label: 'deployments.requiredRam',
            field: null,
            required: false
          },
          {
            fieldName: 'cpu_arch',
            label: 'deployments.cpuArch',
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
          },
          // {
          //   fieldName: 'connections',
          //   label: 'Connections',
          //   field: [],
          //   required: false
          // },
          {
            fieldName: 'greenOptions',
            label: 'Enable green options',
            field: false,
            required: false
          },
          {
            fieldName: 'energyEfficiencyRatio',
            label: 'Efficiency',
            field: 0.5,
            required: false
          },
          {
            fieldName: 'greenEnergyRatio',
            label: 'Green',
            field: 0.5,
            required: false
          },
          {
            fieldName: 'deployAsJob',
            label: 'deployments.deployAsJob',
            field: false,
            required: false
          },
          {
            fieldName: 'domain',
            label: 'Domain',
            field: null,
            required: false
          },
          {
            fieldName: 'privateImage',
            label: 'Private image',
            field: false,
            required: false
          },
          {
            fieldName: 'iePool',
            label: 'IE Pool',
            field: [],
            required: false
          }
        ]
      };

      // Create a new list of services
      const configLength = setStepper.value.filter((s: { name: string; }) => s.name === 'serviceConfig').length
      let idCounter = 0
      if (configLength < +services || setStepper.value.filter((s: { name: string; }) => s.name === 'serviceConfig').length === 0 ) {
        newServices = [...Array.from({length: +services - configLength})
            .map((_, i) => JSON.parse(JSON.stringify(serviceStep)))]
        newServices
            .map((e: any) => {
              if (!serviceList.has(e)) {
                idCounter++
                const id = Date.now() + idCounter
                serviceList.set(e, id)
              }
              e.id = serviceList.get(e)
              setStepper.value.push(e)
              selectedDomain.value[e.id] = {value: null}
              IE.IE[e.id] = []
            })
      } else {
        const deleteCount =  configLength - +services;
        const deletedServices = setStepper.value.splice(-deleteCount)
        // Iterate trough the deleted services
        deletedServices.forEach((s: any) => {
          // setStepper.value
          //     .forEach((st) => {
          //       let connectionsField = st.fields.find(step => step.fieldName === 'connections')
          //       if (connectionsField) {
          //         connectionsField!.field = connectionsField.field?.filter((field: { component: { id: any; }; }) => {
          //           return field?.component.id !== s.id
          //         })
          //         // Using ! not-null assertion because the connections field cannot be null/undefined
          //         st.fields.find(step => step.fieldName === 'connections')!.field = connectionsField.field
          //       }
          // })
          // Remove the serviceConfig from the WeakMap
          serviceList.delete(s)
          // Remove the refence of the temp service from Domains and IE
          delete selectedDomain.value[s.id]
          delete IE.IE[s.id]
        })
      }
      // TODO: Uncomment this line when connection step are enabled
      // setStepper.value.push(connectivityStep)
      setStepper.value.push(summaryStep)
    }

    const fetchIE = async(serviceId: keyof object) => {
      if (selectedDomain.value[serviceId].value) {
        loaderStore.hasLoader = false
        setStepper.value[actualStep.value.count - 1].fields[4].field = null
        IE.fetching = true
        const domainID: any = selectedDomain.value[serviceId].value.id.split(":Domain:")[1]
        IE.IE[serviceId] = await domainStore.fetchIE(domainID)
            .then(res => {
              IE.fetching = false
              loaderStore.$reset()
              return res.data
            })
            .catch(err => console.error(err))
      }
    }
    return {
      setStepper,
      actualStep,
      modalStore,
      toastStore,
      moveStep,
      goToStep,
      setNewServices,
      minMaxInput,
      toggleSwitch,
      deployService,
      filterArgs,
      checkFields,
      energySaveOptions,
      cpuOptions,
      ramOptions,
      cpuArchOptions,
      settingsStore,
      selectedDomain,
      domains,
      IE,
      fetchIE
    }
  },
  methods: {
    copyToClipboard(text: any, type: string) {
      return navigator.clipboard.writeText(`Username: ${text.userName} - Password: ${text.userPassword}`)
          .then(() => {
            this.toastStore.appendToast({
              label: `${type} copied`,
              success: true ,
              data: {},
              autoRemove: false
            })
          })
    },
    openModal(service: any, template: string, e: any | null = null) {
      this.modalStore.showModal(
          {
            template,
            data: {
              service: service,
              onConfirm: (result: any) => {
                // result.data could be the portmappings array, or the image credentials
                if (Array.isArray(result.data)) {
                  service.service.fields.find((f: any) => f.fieldName === result.field).field = [...result.data]
                } else {
                  service.service.fields.find((f: any) => f.fieldName === result.field).field = {...result.data}
                }
                this.modalStore.hideModal(null)
                this.modalStore.$reset()
              },
              onClose: () => {
                if (e?.target && !service.service.fields.find((f: any) => f.fieldName === 'privateImage').field) {
                  e.target.checked = false
                  service.service.fields.find((f: any) => f.fieldName === 'privateImage').field = null
                }
                this.modalStore.hideModal(null)
                this.modalStore.$reset()
              }
            },
            styles: {
              height: '40vh',
              width: template !== 'IEPool' ? null : 'auto',
              'min-width': template === 'IEPool' ? '750px' : '600px',
            }
          }
      )
    },
    /**
     * Check if a step is valid or not
     * @param step
     * @returns Step validity
     */
    enableStep(step: Step) {
      if(step.name === 'summary' || step.name === 'connectivity') {
        // If there is some service to be checked
        if (this.setStepper.filter(f => f.name === 'serviceConfig').length > 0) {
          return !this.checkFields()
        }
        return true
      } else {
        return step?.fields.find(s => (Array.isArray(s.field) ? s.field.length === 0 : s.field === null) && s.required)
      }
    }
  },
})
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.back {
  border-radius: 20px;
  background: #004AAD;
  color: #FFFFFF;
  min-width: 161px;
  height: 30px;
  padding: 3px;
  font-family: Poppins, sans-serif;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  align-self: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s ease-in-out;
}

.back:hover {
  opacity: 0.7;
}



.new-deployment {
  width: auto;
  height: auto;
  border-radius: 10px;
  border: solid 2px #E6EAF6;
  padding: 15px;
  align-self: start;
}


.summary {
  display: grid;
  width: 90%;
}

.summary-row {
  display: grid;
  grid-template-areas:
      "component description"
      "connection connection";
  grid-template-columns: 44% auto;
  padding-top: 20px;
}

.disabled.step {
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

.stepper-btn.arguments {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.stepper-btn.toggle {
  display: grid;
  margin-bottom: 10px;
  width: 180px;
  border-radius: 0;
}

.service-type-toggle {
  display: flex;
  justify-content: space-between;
}

.stepper-btn.toggle:first-child {
  border-radius: 10px 0 0 10px;
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
  height: 40px;
}

.stepper-input,
.stepper-combo,
.stepper-btn {
  width: 320px;
}

select.stepper-input {
  width: auto;
  min-width: 135px;
  margin-top: 0;
}

.loader-placeholer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 40px;
  opacity: 0.7;
  border: solid 1px #767676;
  border-radius: 10px;
  cursor: not-allowed;
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
  padding-top: 15px;
  min-width: 200px;
  justify-self: center;
  margin-bottom: 20px;
}

.step {
  cursor: pointer;
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
  left: 2%;
  content: "No";
}

.stepper-switch:checked:after {
  left: 53%;
  content: "Yes";
}

.invalid {
  color: #D22C2CFC;
}

</style>