import type { RoleInterface } from '~/resources/scripts/interfaces/RoleInterface'
import type { RoleModuleInterface } from '~/resources/scripts/interfaces/RoleModuleInterface'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { SystemModuleInterface } from '~/resources/scripts/interfaces/SystemModuleInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import SystemModuleService from '~/resources/scripts/services/SystemModuleService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'RolesAndPermissions',
  props: {},
  data: () => ({
    search: '' as string,
    roleList: [] as RoleInterface[],
    systemModulesList: [] as SystemModuleInterface[],
    permissions: [] as number[][],
    roleSelected: 0,
    canCreate: false,
    canUpdate: false,
    canRead: false,
    activeEdit: false,
    role: null as RoleInterface | null,
    newRole: null as RoleInterface | null,
    drawerRoleForm: false,
    drawerRoleDelete: false,
    activeSwicht: false,
    submitted: false,
    roleManagementDays: 0 as number | null,
    roleManagementWithOutLimit: false
  }),
  computed: {
  },
  watch: {
    'activeSwicht': function () {
      if (this.role) {
        this.role.roleActive = this.activeSwicht ? 1 : 0
      }
    },
    'roleManagementWithOutLimit'(val: Boolean) {
      if (val) {
        this.roleManagementDays = null
      }
    },
  },
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await this.validateAccess()
    await this.init()
    if (this.roleList.length > 0) {
      this.handlerSelectRole(0)
    }
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async validateAccess() {
      const myGeneralStore = useMyGeneralStore()
      const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
      const permissions = await myGeneralStore.getAccess(systemModuleSlug)

      if (myGeneralStore.isRoot) {
        this.canCreate = true
        this.canUpdate = true
        this.canRead = true
      } else {
        this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
        this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
        this.canRead = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
      }

      if (!this.canRead) {
        throw showError({
          statusCode: 403,
          fatal: true,
          message: 'You don´t have access permission'
        })
      }
    },
    async init() {
      await Promise.all([
        this.getSystemModules(),
      ])
      await this.getRoles()
    },
    async getSystemModules() {
      const response = await new SystemModuleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.systemModules.data : []
      this.systemModulesList = list
    },
    async getRoles() {
      const response = await new RoleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.roles.data : []
      this.roleList = list.filter((a: RoleInterface) => a.roleSlug !== 'root')
      const roleModules = [] as Array<RoleModuleInterface>

      for await (const role of this.roleList) {
        const roleModule = { role, modules: [] as Array<SystemModuleInterface> }
        if (role.roleSystemPermissions) {
          for await (const rolePermission of role.roleSystemPermissions) {
            if (rolePermission.systemPermissions) {
              const p = rolePermission.systemPermissions
              if (p.systemModule) {
                const same = roleModule.modules.findIndex((rm: { systemModuleId: number }) => rm.systemModuleId === p.systemModule.systemModuleId)
                if (same < 0) {
                  roleModule.modules.push({
                    ...p.systemModule,
                    permissions: [p]
                  })
                } else {
                  roleModule.modules[same].permissions.push(p)
                }
              }
            }
          }
        }
        roleModules.push(roleModule)
      }

      const permissions = [] as number[][]

      for await (const [i, r] of roleModules.entries()) {
        permissions[i] = []

        for (const m of r.modules) {
          m.permissions.forEach((element) => {
            permissions[i].push(element.systemPermissionId)
          })
        }
      }

      this.permissions = permissions
      if (this.roleList.length > 0) {
        this.setManagementDays()
      }
    },
    async onSave() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.submitted = true
      if (this.role) {
        const roleService = new RoleService()
        if (!roleService.validateInfo(this.role)) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'Missing data',
            life: 5000,
          })
          myGeneralStore.setFullLoader(false)
          return
        }
        let roleResponse = null
        if (!this.role.roleId) {
          roleResponse = await roleService.store(this.role)
        } else {
          roleResponse = await roleService.update(this.role)
        }
        if (roleResponse.status === 201 || roleResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `Role ${this.role.roleId ? 'updated' : 'created'}`,
            detail: roleResponse._data.message,
            life: 5000,
          })

          roleResponse = await roleService.show(roleResponse._data.data.role.roleId)
          if (roleResponse && roleResponse.status === 200) {
            const role = roleResponse._data.data.role
            this.role = role
            this.onSaveRole(role)
          }
        } else {
          const msgError = roleResponse._data.error ? roleResponse._data.error : roleResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `Role ${this.role.roleId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
          myGeneralStore.setFullLoader(false)
          return
        }
      }

      const role = this.roleList[this.roleSelected]
      if (role) {
        if (this.roleManagementWithOutLimit) {
          role.roleManagementDays = null
        } else {
          role.roleManagementDays = this.roleManagementDays
        }
      }
      try {
        const promises = this.roleList.map(async (role, index) => {
          const permissions = []
          for (const permissionId of this.permissions[index]) {
            permissions.push(permissionId)
          }
          if (role.roleId) {
            const response = await new RoleService().assign(role.roleId, permissions, role.roleManagementDays)
            if (response.status !== 201) {
              throw new Error(response._data.message || 'Failed to assign role')
            }
          }
        })

        await Promise.all(promises)

        this.$toast.add({
          severity: 'success',
          summary: 'Roles assigned',
          detail: 'All roles were assigned successfully.',
          life: 5000,
        })
        this.getRoles()
        if (this.roleList.length > 0) {
          this.handlerSelectRole(0)
        }
        this.activeEdit = false
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'There was an error assigning roles.'
        this.$toast.add({
          severity: 'warn',
          summary: 'Roles assigned',
          detail: errorMessage,
          life: 5000,
        })
      }

      myGeneralStore.setFullLoader(false)
    },
    async onCancelEdit() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.init()
      this.activeEdit = false
      myGeneralStore.setFullLoader(false)
    },
    handlerSelectRole(index: number) {
      if (this.activeEdit) {
        return
      }

      this.roleSelected = index
      this.role = { ...this.roleList[this.roleSelected] }
      let isActive: number = 1
      isActive = this.role.roleActive
      this.activeSwicht = isActive === 1 ? true : false
    },
    addNew() {
      const newRole: RoleInterface = {
        roleId: null,
        roleName: '',
        roleActive: 1,
        roleDescription: '',
        roleSlug: '',
        roleManagementDays: null,
        roleCreatedAt: '',
        roleUpdatedAt: '',
        roleDeletedAt: null
      }
      this.newRole = newRole
      this.drawerRoleForm = true
    },
    async onSaveRole(role: RoleInterface) {
      this.newRole = { ...role }

      const index = this.roleList.findIndex((role: RoleInterface) => role.roleId === this.newRole?.roleId)
      if (index !== -1) {
        this.roleList[index] = role
        this.$forceUpdate()
      } else {
        this.roleList.push(role)
        this.$forceUpdate()
      }
      this.getRoles()
      if (this.roleList.length > 0) {
        this.handlerSelectRole(0)
      }
      this.$forceUpdate()
      this.newRole = null
      this.drawerRoleForm = false
    },
    onDelete(role: RoleInterface) {
      this.role = role
      this.drawerRoleDelete = true
    },
    async confirmDelete() {
      if (this.role) {
        this.drawerRoleDelete = false
        const roleService = new RoleService()
        const roleResponse = await roleService.delete(this.role)
        if (roleResponse.status === 200) {
          const index = this.roleList.findIndex((role: RoleInterface) => role.roleId === this.role?.roleId)
          if (index !== -1) {
            this.roleList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete role',
            detail: roleResponse._data.message,
            life: 5000,
          })
          this.getRoles()
          if (this.roleList.length > 0) {
            this.handlerSelectRole(0)
          }
          this.$forceUpdate()
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete role',
            detail: roleResponse._data.message,
            life: 5000,
          })
        }
      }
      this.setManagementDays()

    },
    setManagementDays() {
      const role = this.roleList[this.roleSelected]
      if (role) {
        if (!role.roleManagementDays) {
          this.roleManagementDays = null
          this.roleManagementWithOutLimit = true
        } else {
          this.roleManagementDays = role.roleManagementDays
          this.roleManagementWithOutLimit = false
        }
      }
    }

  }
})
