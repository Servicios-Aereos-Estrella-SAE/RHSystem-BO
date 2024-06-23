import { defineComponent } from 'vue'
import type { UserCredentialsInterface } from '~/resources/scripts/interfaces/UserCredentialsInterface'

export default defineComponent({
  name: "Login",
  props: {
  },
  data: () => ({
    credentials: {
      userEmail: 'developer@sae.com.mx',
      userPassword: 'adminSystemSAE123.'
    } as UserCredentialsInterface,
    invalidCredentials: false
  }),
  created () {
    definePageMeta({
      auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/attendance-monitor',
      },
    })
  },
  mounted() {
  },
  methods: {
    resetInvalidCredentials () {
      this.invalidCredentials = false
    },
    async handlerLogin () {
      if (!this.credentials.userEmail || !this.credentials.userPassword) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
        return
      }

      try {
        const { signIn } = useAuth()
        await signIn(this.credentials, { callbackUrl: '/attendance-monitor' })
      } catch (error) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
      }
    }
  }
})