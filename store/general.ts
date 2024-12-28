import { defineStore } from 'pinia'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { SystemModuleInterface } from '~/resources/scripts/interfaces/SystemModuleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import SystemModuleService from '~/resources/scripts/services/SystemModuleService'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'

export const useMyGeneralStore = defineStore({
  id: 'myGeneralStore',
  state: () => ({
    displayAside: false as boolean,
    fullLoader: false as boolean,
    backgroundColor: '#093057',
    backgroundColorDark: '#092c50',
    backgroundImage: 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg',
    isRoot: false,
    isRh: false,
    isAdmin: false,
    displayContent: false,
    userVacationFormClosed: false,
    systemSettingId: null as number | null,
    systemModules: [] as Array<SystemModuleInterface>
  }),
  actions: {
    setDisplayAside(status: boolean) {
      this.displayAside = status
    },

    toggleDisplayAside() {
      const currentStatus = this.displayAside
      this.displayAside = !currentStatus
    },

    setFullLoader(status: boolean) {
      this.fullLoader = status
    },

    async getSystemSettings() {
      this.backgroundColor = '#093057'
      this.backgroundColorDark = '#092c50'
      this.backgroundImage = 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
      const systemSettingService = new SystemSettingService()
      const systemSettingResponse = await systemSettingService.getActive()
      if (systemSettingResponse) {
        this.systemSettingId = systemSettingResponse.systemSettingId
        if (systemSettingResponse.systemSettingSidebarColor) {
          this.backgroundColor = `#${systemSettingResponse.systemSettingSidebarColor}`
          const shades = this.generateColorShades(this.backgroundColor)
          this.backgroundColorDark = shades.darker
        }
        if (systemSettingResponse.systemSettingLogo) {
          this.backgroundImage = `${systemSettingResponse.systemSettingLogo}`
        }
        await this.getSystemModules()
      }
    },

    adjustColorBrightness(color: string, amount: number) {
      let usePound = false;

      if (color[0] === "#") {
        color = color.slice(1);
        usePound = true;
      }

      let num = parseInt(color, 16);

      let r = (num >> 16) + amount;
      r = r > 255 ? 255 : r < 0 ? 0 : r;

      let g = ((num >> 8) & 0x00FF) + amount;
      g = g > 255 ? 255 : g < 0 ? 0 : g;

      let b = (num & 0x0000FF) + amount;
      b = b > 255 ? 255 : b < 0 ? 0 : b;

      return (usePound ? "#" : "") + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));
    },

    generateColorShades(hexColor: string) {
      const darkerShade = this.adjustColorBrightness(hexColor, -30); // Ajusta este valor para obtener el tono oscuro deseado

      return {
        darker: darkerShade
      };
    },

    async hasAccess(systemModuleSlug: string, systemPermissionSlug: string) {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface

      if (authUser && authUser.roleId && authUser.role && authUser.role.roleSlug === 'root') {
        this.isRoot = true
        return true
      }
      if (authUser && authUser.roleId && authUser.role && authUser.role.roleSlug === 'rh-manager') {
        this.isRh = true
        return true
      }
      if (authUser && authUser.roleId && authUser.role && authUser.role.roleSlug === 'admin') {
        this.isAdmin = true
        return true
      }

      if (!authUser || !authUser.roleId) {
        return false
      }

      this.isRoot = false
      this.isRh = false
      this.isAdmin = false
      let hasAccess = false

      if (this.systemModules.length === 0) {
        await this.getSystemModules()
      }

      const isModuleActive = this.systemModules.find(a => a && a.systemModuleSlug === systemModuleSlug)

      if (!isModuleActive && (systemModuleSlug !== 'users' && systemModuleSlug !== 'system-settings' && systemModuleSlug !== 'roles-and-permissions')) {
        return false
      }

      const roleService = new RoleService()
      const roleResponse = await roleService.hasAccess(authUser.roleId, systemModuleSlug, systemPermissionSlug)

      if (roleResponse && roleResponse.status === 200) {
        hasAccess = roleResponse._data.data.roleHasAccess
      }

      return hasAccess
    },

    async hasAccessDepartment(departmentId: number) {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      let hasAccess = false
      if (authUser && authUser.roleId) {
        const roleService = new RoleService()
        const roleResponse = await roleService.hasAccessDepartment(authUser.roleId, departmentId)
        if (roleResponse && roleResponse.status === 200) {
          hasAccess = roleResponse._data.data.roleHasAccess
        }
      } else {
        this.isRoot = false
        this.isRh = false
        this.isAdmin = false
      }
      return hasAccess
    },

    async getAccess(systemModuleSlug: string) {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      let systemPermissions = [] as Array<RoleSystemPermissionInterface>
      if (authUser && authUser.roleId) {
        if (authUser.role) {
          if (authUser.role.roleSlug === 'root') {
            this.isRoot = true
          } else if (authUser.role.roleSlug === 'rh-manager') {
            this.isRh = true
          }  else if (authUser.role.roleSlug === 'admin') {
            this.isAdmin = true
          } else {
            this.isRoot = false
            this.isRh = false
            this.isAdmin = false
          }
        }
        const roleService = new RoleService()
        const roleResponse = await roleService.getAccessByModule(authUser.roleId, systemModuleSlug)
        if (roleResponse && roleResponse.status === 200) {
          systemPermissions = roleResponse._data.data.permissions
        }
      } else {
        this.isRoot = false
        this.isRh = false
        this.isAdmin = false
      }
      return systemPermissions
    },
    async getSystemModules() {
      this.systemModules = []
      if (this.systemSettingId) {
        const systemSettingService = new SystemSettingService()
        const systemSettimgResponse = await systemSettingService.show(this.systemSettingId)

        if (systemSettimgResponse && systemSettimgResponse.status === 200) {
          const systemSettingSystemModules = systemSettimgResponse._data.data.systemSetting.systemSettingSystemModules

          for await (const systemModule of systemSettingSystemModules) {
            this.systemModules.push(systemModule.systemModule)
          }
        }
      }
    },
    setUserVacationFormStatus(status: boolean) {
      this.userVacationFormClosed = status
    }
  }
})
