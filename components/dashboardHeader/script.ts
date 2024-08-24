import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    authUser: null as UserInterface | null,
    backgroundImage: 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
  }),
  computed: {
    displayBackButton () {
      const path = this.$route.fullPath
      const isRoot = path.split('/').length > 2
      return isRoot
    },
    avatarLetter () {
      const initial = `${this.authUser?.userEmail?.charAt(0) || ''}`.toLocaleUpperCase()
      return initial
    }
  },
  created () {
  },
  mounted() {
    this.getSystemSettings()
    this.setAuthUser()
  },
  methods: {
    async getSystemSettings() {
      const systemSettingService = new SystemSettingService()
      const systemSettingResponse = await systemSettingService.getActive()
      if (systemSettingResponse) {
        if (systemSettingResponse.systemSettingLogo) {
          this.backgroundImage = `${systemSettingResponse.systemSettingLogo}`
        }
      }
    },
    async setAuthUser () {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.authUser = authUser
    },
    async toggleAside () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.toggleDisplayAside()
    },
    handlerBack () {
      this.$router.go(-1)
    }
  }
})