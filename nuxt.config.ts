export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  ssr: false,

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0',
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' }
      ]
    }
  },

  modules: ['nuxt-primevue', '@pinia/nuxt', 'nuxt-highcharts', '@nuxtjs/color-mode', '@sidebase/nuxt-auth', "vue3-carousel-nuxt"],

  carousel: {
    prefix: 'VueCar',
  },

  auth: {
    baseURL: process.env.BASE_API_PATH,
    provider: {
      type: 'local',
      pages: {
        login: '/'
      },
      endpoints: {
        signIn: { path: '/auth/login', method: 'post' },
        signOut: { path: '/auth/logout', method: 'post' },
        getSession: { path: '/auth/session', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        maxAgeInSeconds: (60 * 60) * 24
      },
      sessionDataType: {
        deletedAt: 'string | null',
        personId: 'number',
        roleId: 'number',
        userActive: 'number',
        userCreatedAt: 'string',
        userEmail: 'string',
        userId: 'number',
        userToken: 'string | null',
        userUpdatedAt: 'string',
        person: {
          deletedAt: 'string | null',
          personBirthday: 'string | null',
          personCreatedAt: 'string | null',
          personCurp: 'string | null',
          personFirstname: 'string',
          personGender: 'string | null',
          personId: 'number',
          personImssNss: 'string | null',
          personLastname: 'string',
          personPhone: 'string | null',
          personRfc: 'string | null',
          personSecondLastname: 'string',
          personUpdatedAt: 'string | null',
        }
      },
    },
    globalAppMiddleware: {
      isEnabled: false,
    },
  },

  css: ['~/assets/theme/primevue-sass-theme-3.52.0/themes/lara/lara-light/blue/theme.scss'],

  primevue: {
    directives: {
      include: ['Ripple']
    }
  },

  runtimeConfig: {
    public: {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      ENVIRONMENT: process.env.ENVIRONMENT,
      BASE_API_PATH: process.env.BASE_API_PATH,
      SOCKET: process.env.SOCKET,
    },
  },

  devServer: {
    host: process.env.HOST || '127.0.0.1',
    port: parseInt(`${process.env.PORT}`) || 3000
  }
})