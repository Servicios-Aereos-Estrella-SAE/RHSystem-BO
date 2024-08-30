import { defineStore } from 'pinia'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'

export const useMyGeneralStore = defineStore({
  id: 'myGeneralStore',
  state: () => ({
    displayAside: true as boolean,
    fullLoader: false as boolean,
    backgroundColor: '#093057',
    backgroundColorDark: '#092c50',
    backgroundImage: 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
  }),
  actions: {
    setDisplayAside (status: boolean) {
      this.displayAside = status
    },

    toggleDisplayAside () {
      const currentStatus = this.displayAside
      this.displayAside = !currentStatus
    },

    setFullLoader (status: boolean) {
      this.fullLoader = status
    },

    async getSystemSettings() {
      // this.fullLoader = true
      this.backgroundColor = '#093057'
      this.backgroundColorDark = '#092c50'
      this.backgroundImage = 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
      const systemSettingService = new SystemSettingService()
      const systemSettingResponse = await systemSettingService.getActive()
      if (systemSettingResponse) {
        if (systemSettingResponse.systemSettingSidebarColor) {
          this.backgroundColor = `#${systemSettingResponse.systemSettingSidebarColor}`
          const shades = this.generateColorShades(this.backgroundColor)
          this.backgroundColorDark = shades.darker
        }
        if (systemSettingResponse.systemSettingLogo) {
          this.backgroundImage = `${systemSettingResponse.systemSettingLogo}`
        }
      }
      // this.fullLoader = false
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
      let hasAccess = false
      if (authUser && authUser.roleId) {
        const roleService = new RoleService()
        const roleResponse = await roleService.hasAccess(authUser.roleId, systemModuleSlug, systemPermissionSlug)
        if (roleResponse && roleResponse.status === 200) {
          hasAccess = roleResponse._data.data.roleHasAccess
        }
      }
     return hasAccess
    },

    async getAccess(systemModuleSlug: string) {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      let systemPermissions = [] as Array<RoleSystemPermissionInterface>
      if (authUser && authUser.roleId) {
        const roleService = new RoleService()
        const roleResponse = await roleService.getAccess(authUser.roleId, systemModuleSlug)
        if (roleResponse && roleResponse.status === 200) {
          systemPermissions = roleResponse._data.data.permissions
        /*   permissions.forEach((permission: RoleSystemPermissionInterface) => {
            systemPermissions.push(permission)
          }) */
        }
      }
     return systemPermissions
    }
  }
})
