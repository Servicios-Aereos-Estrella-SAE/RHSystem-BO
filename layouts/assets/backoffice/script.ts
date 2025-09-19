import { defineComponent } from 'vue'
import { io } from 'socket.io-client'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import { useMyGeneralStore } from '~/store/general'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

export default defineComponent({
  name: 'backoffice',
  components: {
    Toast,
    ToastService,
  },
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
      titleTemplate: `${businessName.value} RH | %s`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: businessFavicon.value }
      ]
    })
  },
  mounted() {
    // window.addEventListener('focus', async () => {
    //   await this.validateSession()
    // })
    window.addEventListener('resize', this.updateScreenWidth);
    this.updateScreenWidth()
  },
  methods: {
    // setcolor () {
    //   definePageMeta({
    //     colorMode: this.$colorMode.preference,
    //   })
    // }
    async validateSession() {
      const { data } = useAuth()
      const session: unknown = data.value as unknown as UserInterface
      if (!session) {
        await this.handlerLogout()
      } else {
        this.authAccess = true
      }
    },
    async setAuthUser() {
      const { data } = useAuth()
      const session: unknown = data.value as unknown as UserInterface
      const authUser = session as UserInterface
      this.authUser = authUser
    },
    async handlerLogout() {
      try {
        const { signOut } = useAuth()
        const localePath = useLocalePath()
        await signOut({ callbackUrl: localePath('/') })
      } catch (error) {
        const localePath = useLocalePath()
        this.$router.push(localePath('/'))
      }
    },
    updateScreenWidth () {
      const width = window.innerWidth
      document.documentElement.style.setProperty('--screen-width', `${width <= 500 ? width + 12 : width}px`)
    }
  }
})
