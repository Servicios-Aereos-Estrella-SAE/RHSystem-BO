import { defineComponent } from 'vue'
import type { UserCredentialsInterface } from '~/resources/scripts/interfaces/UserCredentialsInterface'

export default defineComponent({
  name: "Login",
  props: {
  },
  data: () => ({
    credentials: {
      userEmail: '',
      userPassword: ''
    } as UserCredentialsInterface,
    invalidCredentials: false,
    isGuest: false
  }),
  created() {
    this.validateSession()

    if (this.$config.public.ENVIRONMENT !== 'production') {
      this.credentials.userEmail = 'developer@sae.com.mx'
      this.credentials.userPassword = 'adminSystemSAE123.'
    }
  },
  mounted() {
  },
  methods: {
    resetInvalidCredentials() {
      this.invalidCredentials = false
    },
    async validateSession() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()

      if (session) {
        return this.$router.push({ path: '/departments-attendance-monitor' })
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
        await signIn(this.credentials, { callbackUrl: '/departments-attendance-monitor' })
      } catch (error) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
      }
    }
  }
})
