<template>
  <div v-show="$route.name === 'users'" class="container">
    <div class="header">
      <div style="display: flex; justify-content: space-between">
        <h2 :class="settingsStore.colorScheme === 'dark' ? 'dark' : 'light'">Users list</h2>
<!--        <router-link :to="'/users/new'" style="min-width: 185px" :class="{'disabled': hasError}" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="circle-plus" /> {{$t("users.newUser")}} <span></span></router-link>-->
        <div style="display: flex; gap: 15px">
          <a @click="createUser" style="min-width: 185px" class="btn-new"><font-awesome-icon style="font-size: 16px" icon="circle-plus" /> {{$t("users.newUser")}} <span></span></a>
        </div>
      </div>
      <AerosFilter
          @result="(e) => setFilteredResult(e)"
          @isEmpty="(e) => setEmptyFilters(e)"
          v-if="usersTable.tableData.rows"
          :store="usersStore"
          :actions="updateActions"
          :values="usersTable.tableData.rows"
          :filters="filters"/>
    </div>
    <div class="users">
      <DataTable
          v-if="usersTable.tableData.rows?.length > 0"
          :data="usersTable.tableData"
      />
      <div v-if="usersTable.tableData.rows?.length === 0 && !emptyFilters">
        <h3>{{ $t("filter.noResults") }}</h3>
      </div>
      <ErrorComponent style="justify-self: center" @reload="async () => await fetchDeployments()" />
    </div>
  </div>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted, reactive, ref} from "vue";
import ROLES from "@/constants/roles";
import DataTable from "@/shared/DataTable/DataTable.vue";
import {useSettings} from "@/stores/settings";
import {TableConfig} from "@/shared/DataTable/interfaces/TableConfig";
import AerosFilter from "@/shared/Filter/AerosFilter.vue";
import {Filter} from "@/shared/Filter/interfaces/Filter";
import {useUsersStore} from "@/stores/users";
import {useModalStore} from "@/stores/modal";
import {useToastsStore} from "@/stores/toasts";
import AuthenticationService from "@/services/AuthenticationService";
import {useLoaderStore} from "@/stores/loader";

interface User {
  name: string;
  role: string;
  status: string;
  actions: Array<string>;
}

export default defineComponent({
  name: "UsersComponent",
  components: {
    DataTable,
    AerosFilter
  },
  setup: () => {
    const settingsStore = useSettings()
    const usersStore = useUsersStore()
    const modalStore = useModalStore()
    const toastStore = useToastsStore()
    const loaderStore = useLoaderStore()
    const user: any = inject('$user')
    const emptyFilters = ref(true)
    const updateActions = ['deleteUser', 'createUser', 'updateGroup', 'updateRole']
    /**
     * Enrich the row with actions
     * @param u User row
     */
    const userActions = (u: any) => {
      u.actions = [
        {
          icon: 'eye',
          onClick: () => {
            modalStore.showModal({
              template: 'ReadOnly',
              styles: {
                'min-width': '550px'
              },
              data: {
                header: `User: ${u.uid}`,
                data: [
                  `Name: ${u?.cn}`,
                  `Username: ${u.givenName}`,
                  `Email: ${u?.mail || '---'}`,
                  `Role: ${u?.role}`,
                  `Organization: ${u?.group || '---'}`
                ]
              }
            })
          },
        },
        {
          icon: 'pencil',
          onClick: () => {
            modalStore.showModal({
              template: 'UserEdit',
              styles: {
                'min-width': '550px',
                'height': 'auto'
              },
              data: {
                user: u,
                onConfirm: (data: any) => {
                  loaderStore.hasLoader = false
                  Promise.all([
                    usersStore.updateRole(data.user.uid, data.user.role),
                    usersStore.updateGroup(data.user.uid, data.user.group)
                  ])
                      .then(() => {
                        toastStore.appendToast({label: `User ${u.uid} updated`, success: true ,data: {}, autoRemove: false})
                        modalStore.hideModal(data)
                        modalStore.$reset()
                        loaderStore.$reset()
                      })
                      .catch((err: any) => {
                        toastStore.appendToast({label: `Looks like something went wrong: ${err?.response?.data?.message}`, success: false ,data: {}, autoRemove: false})
                        modalStore.hideModal(data)
                        loaderStore.$reset()
                        modalStore.$reset()
                      })

                }

              }
            })
          },
        }
      ]
      if(u.uid !== user!.preferred_username) {
        u.actions.push({
          icon: 'trash',
          onClick: () => {
            modalStore.showModal({
              template: "delete",
              data: {
                onConfirm: (data: any) => {
                  usersStore.deleteUser(u.uid)
                      .then(() => {
                        toastStore.appendToast({label: `User ${u.uid} deleted`, success: true ,data: {}, autoRemove: false})
                      })
                      .catch(err => console.error(err))
                      .finally(()=>{
                        modalStore.hideModal(data)
                        modalStore.$reset()
                      })
                },
                header: "Delete User",
                subtitle: u.givenName
              }})
          },
        })
      }
      return u
    }

    usersStore.$onAction(async({name, after}) => {
      if(updateActions.find(a => a === name)) {
        loaderStore.hasLoader = false
        after((result) => {
          // Set user actions
          result.forEach((u: any) => userActions(u))
          usersTable.tableData.rows = [...result]
          emptyFilters.value = true
          // await fetchGroups()
          // await getUsers()
          loaderStore.$reset()
        })
      }
    })
    const usersTable = reactive({
      tableData: {
        tableConfig: {
          sized: true,
          pagination: {
            items: 15
          }
        } as TableConfig,
        sortKey: '',
        columns: [
          {label: 'users.name', value: 'givenName', style: {'width': '30%'}},
          {label: 'users.role', value: 'role', style: {'width': '20%'}},
          {label: 'users.status', value: 'status', style: {'width': '12%'}},
          {label: 'Organization', value: 'group', style: {'width': '30%'}},
          {label: '', value: 'actions', hasActions: true,style: {'width': '8%'}}
        ],
        rows: null as unknown as any
      }
    })
    const filteredTable = reactive({
      tableData: {
        tableConfig: usersTable.tableData.tableConfig,
        sortKey: '',
        columns: usersTable.tableData.columns,
        rows: [] as any[]
      }
    })
    const groups = reactive({groups: []})
    const roles = reactive({roles: []})
    const fetchGroups = async() => {
      groups.groups = await usersStore.getGroups()
          .then(res => res)
          .catch(err => console.error(err))
    }
    const fetchRoles = async() => {
      roles.roles = await usersStore.getRoles()
        .then(res => res)
        .catch(err => console.error(err))
    }
    const getUsers = async () => {
      await usersStore.fetchUsers()
          .then((users) => {
            const mapRoles: string[] = Object.keys(ROLES)
                .map((r: any) => ROLES[r as keyof object])
            const filterRoles = roles.roles
                .filter((role: any) => mapRoles.includes(role.cn))
            users.forEach((u: any) => {
              // Since the organization is not included inside the user object
              // we gotta find out from the groups service
              const findGroup: any = groups.groups
                  .find((g: any) => g.memberuid.includes(u.uid))
              u.group = findGroup?.cn
              u.status = 'Active'
              u.actions = [
                {
                  icon: 'eye',
                  onClick: () => {
                    modalStore.showModal({
                      template: 'Details',
                      data: {
                        header: `User: ${u.uid}`,
                        data: [
                          {
                            label: "Username",
                            icon: 'id-card',
                            value: u?.cn
                          },
                          {
                            label: "Name",
                            icon: 'user',
                            value: u.givenName
                          },
                          {
                            label: "Email",
                            icon: 'envelope',
                            value: u?.mail || '---'
                          },
                          {
                            label: "Role",
                            icon: 'users',
                            value: u?.role
                          },
                          {
                            label: "Organization",
                            icon: 'at',
                            value: u?.group || '---'
                          }
                        ]
                      }
                    })
                  },
                },
                {
                  icon: 'pencil',
                  onClick: () => {
                    modalStore.showModal({
                      template: 'UserEdit',
                      styles: {
                        'min-width': '550px',
                        'min-height': '320px',
                        'height': 'auto'
                      },
                      data: {
                        user: u,
                        onConfirm: (data: any) => {
                          loaderStore.hasLoader = false
                          Promise.all([
                            usersStore.updateRole(data.user.uid, data.user.role),
                            usersStore.updateGroup(data.user.uid, data.user.group)
                          ])
                              .then(() => {
                                toastStore.appendToast({label: `User ${u.uid} updated`, success: true ,data: {}, autoRemove: false})
                                modalStore.hideModal(data)
                                modalStore.$reset()
                                loaderStore.$reset()
                              })
                              .catch((err: any) => {
                                toastStore.appendToast({label: `Looks like something went wrong: ${err?.response?.data?.message}`, success: false ,data: {}, autoRemove: false})
                                modalStore.hideModal(data)
                                loaderStore.$reset()
                                modalStore.$reset()
                              })

                        }

                      }
                    })
                  },
                }
              ]
              if(u.uid !== user!.preferred_username) {
                u.actions.push({
                  icon: 'trash',
                  onClick: () => {
                    modalStore.showModal({
                      template: "delete",
                      data: {
                        onConfirm: (data: any) => {
                          usersStore.deleteUser(u.uid)
                              .then(() => {
                                toastStore.appendToast({label: `User ${u.uid} deleted`, success: true ,data: {}, autoRemove: false})
                              })
                              .catch(err => console.error(err))
                              .finally(()=>{
                                modalStore.hideModal(data)
                                modalStore.$reset()
                              })
                        },
                        header: "Delete User",
                        subtitle: u.givenName
                      }})
                  },
                })
              }
              const findRole: any = filterRoles
                  .find((r: any) => r.memberuid.includes(u.uid))
              if(findRole) {
                u.role = findRole.cn
              } else {
                u.role = u.sn
              }
            })
            usersTable.tableData.rows = users
          })
    }
    onMounted(async () => {
      await fetchRoles()
      await fetchGroups()
      await getUsers()
    })
    const filters = computed(() => [
      {
        key: 'givenName',
        label: 'general.name',
        type: 'input'
      },
      {
        key: 'role',
        label: 'users.allRoles',
        type: 'select',
        options: Object.keys(ROLES).map((k: any) => {
          return {
            key: k,
            value: ROLES[k as keyof object]
          }
        }),
      },
      {
        key: 'status',
        label: 'users.allStatus',
        type: 'select',
        options: [
          {
            key: "active",
            value: "Active"
          },
          {
            key: "pending",
            value: "Pending"
          }
        ]
      },
      {
        key: 'group',
        label: 'All organizations',
        type: 'select',
        options: groups.groups.map((k: any) => {
          return {
            key: k,
            value: k.cn
          }
        }),
      },
    ] as Filter[])
    const users = computed(() => usersTable)
    return {
      settingsStore,
      usersTable,
      ROLES,
      filteredTable,
      filters,
      emptyFilters,
      modalStore,
      loaderStore,
      toastStore,
      usersStore,
      updateActions,
      users
    }
  },
  methods: {
    setFilteredResult(results: any[]) {
      this.usersTable.tableData.rows = results
    },
    setEmptyFilters(isEmpty: boolean) {
      this.emptyFilters = isEmpty
    },
    createUser() {
      this.loaderStore.hasLoader = false
      this.modalStore.showModal({
        template: "NewUser",
        data: {
          onConfirm: () => {
            this.modalStore.hideModal(null)
            this.toastStore.appendToast({label: `User created`, success: true ,data: {}, autoRemove: false})
            this.modalStore.$reset()
            this.loaderStore.$reset()
          },
          onClose: () => {
            this.modalStore.hideModal(null)
            this.modalStore.$reset()
            this.loaderStore.$reset()
          }
        },
        header: this.$t('users.userData'),
        styles: {
          'width': 'auto',
          'height': 'auto'
        }
      })
    }
  }
})
</script>

<style scoped>

h2 {
  color: #004AAD;
}

.users {
  justify-self: center;
  align-self: start;
  height: calc(100vh - 306px);
  display: flex;
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