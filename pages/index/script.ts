import { defineComponent } from 'vue'
import type { UserCredentialsInterface } from '~/resources/scripts/interfaces/UserCredentialsInterface'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: "Login",
  setup() {
    const { locales, t, locale, setLocale } = useI18n()
    return {
      locales,
      t,
      locale,
      setLocale
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
    const availableLocales = this.locales.map((l) =>
      typeof l === 'string' ? l : l.code
    )
    const savedLang = localStorage.getItem('rh-language') as 'en' | 'es' | null

    if (savedLang && availableLocales.includes(savedLang)) {
      this.setLocale(savedLang)
    } else {
      const browserLang = navigator.language.split('-')[0] as 'en' | 'es'
      const defaultLang = availableLocales.includes(browserLang) ? browserLang : 'en'
      this.setLocale(defaultLang)
      localStorage.setItem('rh-language', defaultLang)
    }
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
        const localePath = useLocalePath()
        return this.$router.push(localePath('/employees-attendance-monitor'))
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
        const localePath = useLocalePath()
        await signIn(this.credentials, { callbackUrl: localePath('/employees-attendance-monitor') as unknown as string })
      } catch (error) {
        this.credentials.userPassword = ''
        this.invalidCredentials = true
      }
    }
  }
})
