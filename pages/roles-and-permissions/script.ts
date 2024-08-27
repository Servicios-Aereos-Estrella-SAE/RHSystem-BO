import type { RoleInterface } from "~/resources/scripts/interfaces/RoleInterface";
import type { SystemModuleInterface } from "~/resources/scripts/interfaces/SystemModuleInterface";
import RoleService from "~/resources/scripts/services/RoleService";
import SystemModuleService from "~/resources/scripts/services/SystemModuleService";
export default defineComponent({
    name: 'RolesAndPermissions',
    props: {},
    data: () => ({
        search: '' as string,
        roleList: [] as RoleInterface[],
        systemModulesList: [] as SystemModuleInterface[],
        permissions: [] as Array<any>,
    }),
    computed: {},
    created() { },
    async mounted() {
        this.getSystemModules()
        this.getRoles()
    },
    methods: {
        async getSystemModules() {
            const response = await new SystemModuleService().getFilteredList('', 1, 100)
            const list = response.status === 200 ? response._data.data.systemModules.data : []
            //console.log(response._data.data)
            this.systemModulesList = list
            //console.log(this.systemModulesList)
        },
        async getRoles() {
            const response = await new RoleService().getFilteredList('', 1, 100)
            const list = response.status === 200 ? response._data.data.roles.data : []
            this.roleList = list
            //console.log(this.roleList)
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
          // console.log(roleModules)
              const permissions = [] as any
              for await (const [i, r] of roleModules.entries()) {
                permissions[i] = [];
                
                for (const m of r.modules) {
                  // console.log(m.permissions)
                  permissions[i].push(...m.permissions.map((p: { systemPermissionId: number; }) => p));
                }
              }
              //console.log(permissions)
              for await (const permission of permissions) {
                // console.log(permission)
                this.permissions.push(permission)
              }
             //console.log(this.permissions)
          },
    }
});
