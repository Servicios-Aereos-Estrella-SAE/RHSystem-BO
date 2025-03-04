import { defineComponent } from 'vue'
import { io } from 'socket.io-client'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'backoffice',
  props: {
  },
  data: () => ({
    socketIO: null as any,
    authUser: null as UserInterface | null,
    authAccess: false
  }),
  computed: {
    getBackgroundImageBanner() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundImageBanner = myGeneralStore.backgroundImageBannner
      return backgroundImageBanner
    },
    getPrimaryColor() {
      const myGeneralStore = useMyGeneralStore()
      const color = myGeneralStore.backgroundColor
      return color
    },
    displayContent() {
      const myGeneralStore = useMyGeneralStore()
      const displayContent = myGeneralStore.displayContent
      return displayContent
    },
    asideVisibilityStatus() {
      const myGeneralStore = useMyGeneralStore()
      const status = myGeneralStore.displayAside
      return status
    },
    statusFullLoader() {
      const myGeneralStore = useMyGeneralStore()
      const status = myGeneralStore.fullLoader
      return status
    },
  },
  async created() {
    await this.validateSession()
    await this.setAuthUser()

    this.socketIO = io(this.$config.public.SOCKET)
    this.socketIO.on(`user-forze-logout:${this.authUser?.userEmail}`, async () => {
      this.socketIO.close()
      await this.handlerLogout()
    })

    const myGeneralStore = useMyGeneralStore()
    await myGeneralStore.getSystemSettings()

    const businessName = ref(myGeneralStore.activeSystemBusinessName)
    const businessFavicon = ref(myGeneralStore.favicon)

    useHead({
      titleTemplate: `${businessName.value} BO | %s`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: businessFavicon.value }
      ]
    })
  },
  mounted() {
    // window.addEventListener('focus', async () => {
    //   await this.validateSession()
    // })
  },
  methods: {
    // setcolor () {
    //   definePageMeta({
    //     colorMode: this.$colorMode.preference,
    //   })
    // }
    async validateSession() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      if (!session) {
        await this.handlerLogout()
      } else {
        this.authAccess = true
      }
    },
    async setAuthUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.authUser = authUser
    },
    async handlerLogout() {
      try {
        const { signOut } = useAuth()
        await signOut({ callbackUrl: '/' })
      } catch (error) {
        this.$router.push({ path: "/" })
      }
    },
  }
})
