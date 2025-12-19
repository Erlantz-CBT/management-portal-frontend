import {defineStore} from 'pinia'
import axios from "axios";

interface Group {
    cn: string;
    gidnumber: number,
    memberuid?: string[]
}

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [] as any[],
        groups: [] as Group[]
    }),
    actions: {
        /**
         * Retrieve a list of users
         */
        fetchUsers() {
            return axios
                .get(`/portal-backend/users`)
                .then((res) => {
                    this.$state.users = res.data
                    return res.data
                })
                .catch(err => console.error(err))
        },
        /**
         * Create a new user
         * @param user new user to create
         */
        createUser(user: any) {
            return axios
                .post(`/portal-backend/users`, user)
                .then((res) => {
                    this.$state.users.push(user)
                    return this.$state.users
                })
                .catch(err => console.error(err))
        },
        /**
         * Get the user details
         * @param userId uiser uid
         */
        getUserDetail(userId: string) {
            return axios
                .get(`/portal-backend/users/${userId}`)
                .then((res) => res.data)
                .catch(err => console.error(err))
        },
        /**
         * Retrieve a list of roles
         */
        getRoles() {
            return axios
                .get(`/portal-backend/roles`)
                .then((res) => res.data)
                .catch(err => console.error(err))
        },
        /**
         * Retrieve a list of organizations
         */
        getGroups() {
            return axios
                .get(`/portal-backend/groups`)
                .then((res) => {
                    this.$state.groups = res.data
                    return res.data
                })
                .catch(err => console.error(err))
        },
        /**
         * Create a new organization
         * @param group
         */
        newGroup(group: Group) {
            return axios
                .post(`/portal-backend/groups`, group)
                .then((res) => {
                    this.$state.groups.push(group)
                    return res.data
                })
                .catch(err => console.error(err))
        },
        /**
         * Update a user organization
         * @param userId user uid
         * @param groupId user organization
         */
        updateGroup(userId: string, groupId: any) {
            return axios
                .put(`/portal-backend/groups/${groupId}`,
                    {
                        memberuid: userId
                    })
                .then(res => {
                    console.log(groupId)
                    this.$state.users.find(u => u.uid === userId).group = groupId
                    return this.$state.users
                })
        },
        /**
         * Delete a user
         * @param userId user uid
         */
        deleteUser(userId: string) {
            return axios
                .delete(`/portal-backend/users/${userId}`)
                .then((res) => this.$state.users.filter(u => u.uid !== userId))
                .catch(err => console.error(err))
        },
        /**
         * Update user role
         * @param userId user uid
         * @param role user role
         */
        updateRole(userId: string, role: string) {
            return axios
                .put(`/portal-backend/roles/${role}`,
                    {
                        memberuid: userId
                    })
                .then(res => {
                    const findUser = this.$state.users.find(u => u.uid === userId)
                    findUser.role = role
                    return this.$state.users
                })
        }
    }
})