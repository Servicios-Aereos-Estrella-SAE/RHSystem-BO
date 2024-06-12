// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://sae.com.mx/wp-content/uploads/2023/03/cropped-Favicon-Servicios-Aereos-Estrella-SAE-Renta-Avion-Privado-FBO-Handling.webp' },
      ]
    }
  },
  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
    ['nuxt-highcharts', {
    }]
  ],

  css: ['~/assets/theme/primevue-sass-theme-3.52.0/themes/lara/lara-light/blue/theme.scss'],

  primevue: {
    directives: {
      include: ['Ripple']
    }
  },
})
