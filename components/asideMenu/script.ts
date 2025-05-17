import { defineComponent } from 'vue'
import type { MenuGroupInterface } from '~/resources/scripts/interfaces/MenuGroupInterface'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { SystemModuleInterface } from '~/resources/scripts/interfaces/SystemModuleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import SystemModuleService from '~/resources/scripts/services/SystemModuleService'
import LogService from '~/resources/scripts/services/mongo-db/LogService'
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
    },
    getBackgroundImage() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundImage = myGeneralStore.backgroundImage
      return backgroundImage
    },
    visible() {
      const myGeneralStore = useMyGeneralStore()
      const displayAside = myGeneralStore.displayAside
      return displayAside
    },
  },
  async mounted() {
    await setTimeout(async () => {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.displayContent = false

      const fullPath = this.$route.path;
      const firstSegment = fullPath.split('/')[1];
      const systemModuleSlug = firstSegment
      const hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'read')

      if (!hasAccess) {
        throw showError({
          statusCode: 403,
          fatal: true,
          message: 'You don´t have access'
        })
      }

      if (
        (systemModuleSlug === 'departments' || systemModuleSlug === 'departments-attendance-monitor') &&
        fullPath.split('/')[2] &&
        !myGeneralStore.isRoot
      ) {
        const departmentId = fullPath.split('/')[2]
        let hasAccessDepartment = false
        hasAccessDepartment = await myGeneralStore.hasAccessDepartment(parseInt(departmentId))

        if (!hasAccessDepartment) {
          console.log('systemModuleSlug error')
          throw showError({
            statusCode: 403,
            fatal: true,
            message: 'You don´t have access to this department'
          })
        }
      }

      const logService = new LogService()
      await logService.store(systemModuleSlug)
      await this.getGroupMenu()

      myGeneralStore.displayContent = true
      this.isReady = true
    }, 1000);
  },
  methods: {
    async getGroupMenu() {
      const systemModuleService = new SystemModuleService()
      const systemModuleGroupsResponse = await systemModuleService.getGroups()

      this.menuGroups = []
      this.menu = []

      if (systemModuleGroupsResponse && systemModuleGroupsResponse.status === 200) {
        this.menuGroups = systemModuleGroupsResponse._data.data.systemModulesGroups
      }

      for await (const group of this.menuGroups) {
        this.menu.push(
          {
            label: group.systemModuleGroup,
            name: group.systemModuleGroup,
            path: '',
            icon: `<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0Z" fill="#ffffff" class="fill-212121"></path></svg>`,
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
      const systemModulesActive = myGeneralStore.systemModules

      if (existGroupMenu) {
        const items = systemModules.filter((a: SystemModuleInterface) => a.systemModuleGroup === group)

        for await (const item of items) {
          const isItemActive = systemModulesActive.find(a => a && a.systemModuleId === item.systemModuleId)

          if (
            isItemActive ||
            item.systemModuleSlug === 'users' ||
            item.systemModuleSlug === 'system-settings' ||
            item.systemModuleSlug === 'roles-and-permissions'
          ) {
            if (!item.systemModulePath.toString().includes('#')) {
              const hasPermission = this.roleSystemPermissions.find((a) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read' && a.systemPermissions.systemModule && a.systemPermissions.systemModule.systemModuleSlug === item.systemModuleSlug)
              const itemExists = existGroupMenu.items.find(itemCompare => itemCompare.path === item.systemModulePath)

              if ((hasPermission || myGeneralStore.isRoot) && !itemExists) {
                existGroupMenu.items.push({
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
    },
    async closeCallback() {
      const myGeneralStore = useMyGeneralStore()
      await myGeneralStore.toggleDisplayAside()
    }
  }
})
