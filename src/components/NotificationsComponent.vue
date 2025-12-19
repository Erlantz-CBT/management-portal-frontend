<template>
  <div class="container">
    <div class="header">
      <div style="display: flex; justify-content: space-between">
        <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Notifications</h2>
      </div>
      <a v-if="notificationTable.tableData.rows?.length > 0" style="cursor: pointer; align-self: center" @click="clearNotifications()">
        <font-awesome-icon :icon="['fas', 'trash']" /> {{ $t("filter.clear") }}
      </a>
    </div>
    <div class="notifications">
      <h4
          style="display: grid; align-self: center"
          v-if="notificationTable.tableData?.rows?.length === 0"
      >
        No notifications available
      </h4>
      <DataTable v-if="notificationTable.tableData.rows && notificationTable.tableData.rows?.length > 0" :data="notificationTable.tableData"></DataTable>
    </div>
  </div>
</template>

<script>
import {defineComponent, inject, reactive, ref} from "vue";
import DataTable from "../shared/DataTable/DataTable";
import {useNotificationStore} from "../stores/notifications";
import {useSettings} from "../stores/settings";
import {useModalStore} from "../stores/modal";
import {useToastsStore} from "../stores/toasts";
import {useLoaderStore} from "../stores/loader";

export default defineComponent({
  name: "NotificationsComponent",
  components: {DataTable},
  setup: () => {
    const notificationsStore = useNotificationStore()
    const notifications = ref(0)
    const settingsStore = useSettings()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const loaderStore = useLoaderStore()
    const moment = inject('$moment')
    const severityThemes = Object.freeze({
      INFORMATIONAL: {
        'background-color': '#1E88E5',
        'opacity': 1
      },
      LOW: {
        'opacity': 1,
        'background-color': '#4CAF50'
      },
      MEDIUM: {
        'opacity': 1,
        'background-color': '#FFEB3B'
      },
      HIGH: {
        'opacity': 1,
        'background-color': '#FB8C00'
      },
      CRITICAL: {
        'opacity': 1,
        'background-color': '#F44336'
      }

    })
    const notificationTable = reactive({
      tableData: {
        tableConfig: {
          sized: true,
          pagination: {
            items: 15,
            pages: 1
          }
        },
        sortKey: '',
        columns: [
          // {
          //   label: 'ID',
          //   value: 'id',
          //   format: ({value}) => value.split(':Alert:')[1],
          //   style: {'width': '15%'}
          // },
          {
            label: 'Category',
            value: 'category',
            style: {'width': '15%'}
          },
          {
            label: 'Source',
            value: 'alertSource',
            format: ({value}) => {
              if(value.length < 15) {
                return value
              }
              return`${value.substring(0, 15)}...`
            },
            style: {'width': '15%'}
          },
          {
            label: 'notifications.description',
            value: 'description',
            format: ({value}) => {
              if(value.length < 40) {
                return value
              }
              return`${value.substring(0, 40)}...`
            },
            style: {'width': '30%'}
          },
          {
            label: 'notifications.date',
            value: 'dateIssued',
            format: ({value}) => moment(value).format('DD-MM-YYYY HH:mm'),
            style: {'width': '15%'}
          },
          {
            label: 'notifications.priority',
            chip: {
              style: (chip) => {
                return severityThemes[chip.severity.toUpperCase()]
              }
            },
            value: 'severity',
            sortable: (cols, direction) => {
              const priorities = {
                critical: 4,
                high: 3,
                medium: 2,
                low: 1,
                informational: 0
              }
              if (direction === 'ASCENDING') {
                return cols.sort((a, b) => priorities[b.severity] - priorities[a.severity])
              }
              return cols.sort((a, b) => priorities[a.severity] - priorities[b.severity])

            },
            style: {'width': '15%'}},
          {
            label: '',
            value: 'actions',
            hasActions: true,
            style: {'width': '5%'}}
        ],
        rows: null
      }
    })
    notificationsStore.$onAction(({name, after}) => {
      after(({notifications}) => {
        notifications?.forEach(r => {
          r.actions = [
            {
              icon: 'eye',
              onClick: () => {
                modalStore.showModal({
                  template: 'ReadOnly',
                  styles: {
                    'height': 'auto'
                  },
                  data: {
                    header: `Notification ${r.id.split(":Alert:")[1]}`,
                    data: [
                        `Severity: ${r.severity.toUpperCase()}`,
                        `Source: ${r.alertSource}`,
                        `Date: ${moment(r.dateIssued).format('DD-MM-YYYY')}`,
                        `Category: ${r.category}`,
                        `Description: ${r.description}`
                    ]
                  }
                })
              },
            },
            {
              icon: 'trash',
              onClick: () => {
                loaderStore.hasLoader = false
                modalStore.showModal({
                  template: "delete",
                  data: {
                    header: "notifications.deleteNotification",
                    subtitle: r.id.split(":Alert:")[1],
                    onConfirm: () => {
                      notificationsStore.removeNotification(r.id)
                          .then(() => {
                            modalStore.hideModal(null)
                            modalStore.$reset()
                            loaderStore.$reset()
                            toastStore.appendToast(
                                {
                                  label: `Notification ${r.id} deleted`,
                                  success: true ,
                                  data: {},
                                  autoRemove: false
                                }
                            )
                          })
                    }
                  }})
              },
            }
          ]
        })
        // Sort the notifications so the user can see the most recent one on top
        notificationTable.tableData.rows = [...notifications]
            .sort((a, b) => moment(b.dateIssued) - moment(a.dateIssued))
      })
      if (name === 'addNotification') {
        notifications.value++
      }
    }, true)
    notificationsStore.fetchNotifications()
    return {
      settingsStore,
      notificationTable,
      notifications,
      notificationsStore,
      toastStore
    }
  },
  methods: {
    clearNotifications() {
      this.notificationsStore.clearNotifications()
        .then(() => {
          this.toastStore.appendToast(
              {
                label: `Notifications cleared`,
                success: true ,
                data: {},
                autoRemove: false
              }
          )
        })
    }
  }
})
</script>

<style scoped>

.header {
  display: grid;
  align-items: start;
  justify-items: left;
  padding: 15px 0 0 0;
  height: 100%;
  grid-auto-columns: 100%;
}

.notifications {
  justify-self: center;
  align-self: start;
  height: calc(100vh - 306px);
  display: flex;
}

</style>