import type { RoleInterface } from "~/resources/scripts/interfaces/RoleInterface";
import type { SystemModuleInterface } from "~/resources/scripts/interfaces/SystemModuleInterface";
import RoleService from "~/resources/scripts/services/RoleService";
import SystemModuleService from "~/resources/scripts/services/SystemModuleService";
import { useMyGeneralStore } from "~/store/general";
export default defineComponent({
  name: 'RolesAndPermissions',
  props: {},
  data: () => ({
    search: '' as string,
    roleList: [] as RoleInterface[],
    systemModulesList: [] as SystemModuleInterface[],
    permissions: [] as Array<any>,
    roleSelected: 0
  }),
  computed: {},
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.getSystemModules()
    this.getRoles()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async getSystemModules() {
      const response = await new SystemModuleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.systemModules.data : []
      this.systemModulesList = list
    },
    async getRoles() {
      const response = await new RoleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.roles.data : []
      this.roleList = list
      const roleModules = [] as any
      for await (const role of this.roleList) {
        const roleModule = { role, modules: [] as any } as any
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
      const permissions = [] as any
      for await (const [i, r] of roleModules.entries()) {
        permissions[i] = [];

        for (const m of r.modules) {
          m.permissions.forEach((element: any) => {
            permissions[i].push(parseInt(element.systemPermissionId))
          });
        }
      }
      this.permissions = permissions
    },
    async onSave() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const role = this.roleList[this.roleSelected]
      const permissions = []
      for await (const permissionId of this.permissions[this.roleSelected]) {
        permissions.push(permissionId)
      }
      const response = await new RoleService().assign(role.roleId, permissions)
      if (response.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: 'Role assign',
          detail: response._data.message,
          life: 5000,
        });
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'Role assign',
          detail: response._data.message,
          life: 5000,
        });
      }
      myGeneralStore.setFullLoader(false)
    }
  }
});
