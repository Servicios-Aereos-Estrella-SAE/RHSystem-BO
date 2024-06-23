// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://sae.com.mx/wp-content/uploads/2023/03/cropped-Favicon-Servicios-Aereos-Estrella-SAE-Renta-Avion-Privado-FBO-Handling.webp' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap' }
      ]
    }
  },
  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
    'nuxt-highcharts',
    '@nuxtjs/color-mode'
  ],

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
    }
  },

  devServer: {
    host: process.env.HOST || '127.0.0.1',
    port: parseInt(`${process.env.PORT}`) || 3000
  },
})
