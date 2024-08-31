import { defineStore } from 'pinia'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'

export const useMyRoleStore = defineStore({
    id: 'myRoleStore',
    state: () => ({
        isRoot: false,
        roleWasVerified: false
    }),
    actions: {
        async verifyRoleRoot() {
            if (!this.isRoot) {
                this.roleWasVerified = true
                const { getSession } = useAuth()
                const session: unknown = await getSession()
                const authUser = session as UserInterface
                if (authUser && authUser.roleId) {
                    const roleService = new RoleService()
                    const roleResponse = await roleService.show(authUser.roleId)
                    if (roleResponse && roleResponse.status === 200) {
                        if (roleResponse._data.data.role) {
                            if (roleResponse._data.data.role.roleSlug === 'root') {
                                this.isRoot = true
                            }
                        }
                    }
                }
                this.roleWasVerified = true
            }
        }
    }
})
