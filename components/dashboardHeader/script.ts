import { defineComponent } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'dashboardHeader',
  props: {
  },
  data: () => ({
    authUser: null as UserInterface | null,
  }),
  computed: {
    getBackgroundImage(){
      const myGeneralStore = useMyGeneralStore()
      const backgroundImage = myGeneralStore.backgroundImage
      return backgroundImage
    },
    displayBackButton () {
      const path = this.$route.fullPath
      const isRoot = path.split('/').length > 2
      return isRoot
    },
    avatarLetter () {
      const initial = `${this.authUser?.userEmail?.charAt(0) || ''}`.toLocaleUpperCase()
      return initial
    },
    avatarImage () {
      const initial = `${this.authUser?.person?.employee?.employeePhoto || ''}`
      return initial
    }
  },
  created () {
  },
  mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
    this.setAuthUser()
  },
  methods: {
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
  }
})