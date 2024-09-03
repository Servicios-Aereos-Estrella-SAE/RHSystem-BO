import { defineComponent } from 'vue'
import type { MenuGroupInterface } from '~/resources/scripts/interfaces/MenuGroupInterface'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { SystemModuleInterface } from '~/resources/scripts/interfaces/SystemModuleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import SystemModuleService from '~/resources/scripts/services/SystemModuleService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'asideMenu',
  props: {
  },
  data: () => ({
    isReady: false,
    roleSystemPermissions: [] as Array<RoleSystemPermissionInterface>,
    menuGroups: [] as Array<SystemModuleInterface>,
    menu: [] as Array<MenuGroupInterface>
  }),
  computed: {
    getBackgroundColor() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundColor = myGeneralStore.backgroundColor
      return backgroundColor
    },
    getBackgroundColorDark() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundColorDark = myGeneralStore.backgroundColorDark
      return backgroundColorDark
    }
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
    this.isReady = true
  },
  async created() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.displayContent = false
    await this.getGroupMenu()
    myGeneralStore.getSystemSettings()
    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1];
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'read')
    if (!hasAccess) {
      this.$toast.add({
        severity: 'warn',
        summary: 'Not access',
        detail: 'you don´t have access',
        life: 5000,
      });
      throw showError({
        statusCode: 403,
        fatal: true,
        message: 'You don´t have access'
     })
    }
    myGeneralStore.displayContent = true

  },
  methods: {
    async getGroupMenu() {
      const systemModuleService = new SystemModuleService()
      const systemModuleGroupsResponse = await systemModuleService.getGroups()
      if (systemModuleGroupsResponse && systemModuleGroupsResponse.status === 200) {
        this.menuGroups = systemModuleGroupsResponse._data.data.systemModulesGroups
      }
      for await (const group of this.menuGroups) {
        this.menu.push(
          {
          label: group.systemModuleGroup,
          name: group.systemModuleGroup,
          path: '',
          icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
          items: []
          }
        )
      }
      const systemModuleResponse = await systemModuleService.getFilteredList('', 1, 1000)
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      const roleService = new RoleService()
      this.roleSystemPermissions = []
      if (authUser && authUser.roleId) {
        const roleResponse = await roleService.getAccess(authUser.roleId)
        if (roleResponse && roleResponse.status === 200) {
          this.roleSystemPermissions = roleResponse._data.data.permissions
        }
      }
      if (systemModuleResponse.status === 200) {
        const systemModules = systemModuleResponse._data.data.systemModules.data
        for await (const group of this.menuGroups) {
          await this.assignItemsMenu(systemModules, group.systemModuleGroup)
        }
      }
      this.menu = this.menu.filter((element) => element.items.length > 0)
    },
    async assignItemsMenu(systemModules: Array<SystemModuleInterface>, group: string) {
      const myGeneralStore = useMyGeneralStore()
      const existGroupMenu = this.menu.find(a => a.label === group)
   
      if (existGroupMenu) {
        const items = systemModules.filter((a: SystemModuleInterface) => a.systemModuleGroup === group)
        for await (const item of items) {
          if (!item.systemModulePath.toString().includes('#')) {
            const hasPermission = this.roleSystemPermissions.find((a) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read' && a.systemPermissions.systemModule && a.systemPermissions.systemModule.systemModuleSlug === item.systemModuleSlug)
            if (hasPermission || myGeneralStore.isRoot) {
              existGroupMenu.items.push(
              {
                label: item.systemModuleName,
                name: item.systemModuleName,
                path: item.systemModulePath,
                icon: item.systemModuleIcon,
                items: []
              })
            }
          }
        }
      }
    },
    async handlerLogout() {
      try {
        const { signOut } = useAuth()
        await signOut({ callbackUrl: '/' })
      } catch (error) {
        console.error('🚀 ---------------------------------🚀')
        console.error('🚀 ~ handlerLogout ~ error:', error)
        console.error('🚀 ---------------------------------🚀')
      }
    },
    setLinkActive(link: any) {
      const path = this.$route.path
      // return !!path.includes(link.path)
      return false
    }
  }
})
