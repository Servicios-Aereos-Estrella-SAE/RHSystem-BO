import { defineComponent } from 'vue'
import type { UserCredentialsInterface } from '~/resources/scripts/interfaces/UserCredentialsInterface'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: "Login",
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
  },
  data: () => ({
    credentials: {
      userEmail: '',
      userPassword: ''
    } as UserCredentialsInterface,
    invalidCredentials: false,
    isGuest: false,
  }),
  computed: {
    getBackgroundImageLogo() {
      const myGeneralStore = useMyGeneralStore()
      const backgroundImage = myGeneralStore.backgroundImage
      return backgroundImage
    }
  },
  created() {
    this.validateSession()

    if (this.$config.public.ENVIRONMENT !== 'production') {
      this.credentials.userEmail = 'developer@sae.com.mx'
      this.credentials.userPassword = 'adminSystemSAE123.'
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.getSystemSettings()
  },
  methods: {
    resetInvalidCredentials() {
      this.invalidCredentials = false
    },
    async validateSession() {
      const { status } = useAuth()
      const session: string = status.value as string

      if (session === 'authenticated') {
        return this.$router.push({ path: '/employees-attendance-monitor' })
      }

      this.isGuest = true
    },
    async handlerLogin() {
      if (!this.credentials.userEmail || !this.credentials.userPassword) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
        return
      }

      try {
        const { signIn } = useAuth()
        await signIn(this.credentials, { callbackUrl: '/employees-attendance-monitor' })
      } catch (error) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
      }
    }
  }
})
