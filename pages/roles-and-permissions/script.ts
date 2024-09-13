import type { DepartmentInterface } from "~/resources/scripts/interfaces/DepartmentInterface";
import type { RoleInterface } from "~/resources/scripts/interfaces/RoleInterface";
import type { RoleModuleInterface } from "~/resources/scripts/interfaces/RoleModuleInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import type { SystemModuleInterface } from "~/resources/scripts/interfaces/SystemModuleInterface";
import DepartmentService from "~/resources/scripts/services/DepartmentService";
import RoleService from "~/resources/scripts/services/RoleService";
import SystemModuleService from "~/resources/scripts/services/SystemModuleService";
import { useMyGeneralStore } from "~/store/general";
export default defineComponent({
  name: 'RolesAndPermissions',
  props: {},
  data: () => ({
    search: '' as string,
    departmentList: [] as DepartmentInterface[],
    roleList: [] as RoleInterface[],
    systemModulesList: [] as SystemModuleInterface[],
    permissions: []  as number[][],
    departmentPermissions: []  as number[][],
    roleSelected: 0,
    canUpdate: false,
  }),
  computed: {
  },
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)
    if (myGeneralStore.isRoot) {
      this.canUpdate = true
    } else {
      this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
    }
  
    await this.getSystemModules()
    await this.getRoles()
    await this.getDepartments()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async getSystemModules() {
      const response = await new SystemModuleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.systemModules.data : []
      this.systemModulesList = list
    },
    async getDepartments() {
      const response = await new DepartmentService().getAllDepartmentList()
      const list = response.status === 200 ? response._data.data.departments : []
      this.departmentList = list
      const departmentPermissions = [] as number[][]
      for (let index = 0; index < this.roleList.length; index++) {
        const role = this.roleList[index]
        const departments = [] as Array<number>
        for await (const roleDepartment of role.roleDepartments) {
         departments.push(roleDepartment.departmentId)
        }
        departmentPermissions[index] = departments
      }
     this.departmentPermissions = departmentPermissions 
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
                const same = roleModule.modules.findIndex((rm: { systemModuleId: number; }) => rm.systemModuleId === p.systemModule.systemModuleId)
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
        permissions[i] = [];

        for (const m of r.modules) {
          m.permissions.forEach((element) => {
            permissions[i].push(element.systemPermissionId)
          });
        }
      }
      this.permissions = permissions
    },
    async onSave() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      try {
        const promises = this.roleList.map(async (role, index) => {
          const permissions = []
          for (const permissionId of this.permissions[index]) {
            permissions.push(permissionId)
          }
          const departments = []
          for (const departmentId of this.departmentPermissions[index]) {
            departments.push(departmentId)
          }
          const response = await new RoleService().assign(role.roleId, permissions, departments)
          if (response.status !== 201) {
            throw new Error(response._data.message || 'Failed to assign role')
          }
        })
    
        await Promise.all(promises)
    
        this.$toast.add({
          severity: 'success',
          summary: 'Roles assigned',
          detail: 'All roles were assigned successfully.',
          life: 5000,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'There was an error assigning roles.';
        this.$toast.add({
          severity: 'warn',
          summary: 'Roles assigned',
          detail: errorMessage,
          life: 5000,
        });
      }
      myGeneralStore.setFullLoader(false)
    }
  }
});
