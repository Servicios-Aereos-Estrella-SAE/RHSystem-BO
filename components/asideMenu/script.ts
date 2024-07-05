import { defineComponent } from 'vue'

export default defineComponent({
  name: 'asideMenu',
  props: {
  },
  data: () => ({
    menu: [
      {
        label: 'Attendance Monitor',
        name: 'Reporte de asistencia',
        path: '/attendance-monitor',
        icon: `<svg viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 30 30"><path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm0 15-5.707-5.707a.999.999 0 1 1 1.414-1.414L15 15.172l5.293-5.293a.999.999 0 1 1 1.414 1.414L15 18zM3 22.184V25a2 2 0 0 0 2 2h2.816A14.032 14.032 0 0 1 3 22.184zM22.184 27H25a2 2 0 0 0 2-2v-2.816A14.032 14.032 0 0 1 22.184 27z" fill="#ffffff" class="fill-000000"></path></svg>`
      },
      {
        label: 'Users',
        name: 'Usuarios',
        path: '/users',
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><path d="M20 10a3 3 0 1 0-3 3 3 3 0 0 0 3-3Zm-4 0a1 1 0 1 1 1 1 1 1 0 0 1-1-1ZM17 14a5 5 0 0 0-3.56 1.48A6 6 0 0 0 2 18v3h20v-2a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0Z" fill="#ffffff" class="fill-000000"></path><circle cx="8" cy="7" r="4" fill="#ffffff" class="fill-000000"></circle></g></svg>`
      }
    ]
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    async handlerLogout () {
      try {
        const { signOut } = useAuth()
        await signOut({callbackUrl: '/'})
      } catch (error) {
        console.error('🚀 ---------------------------------🚀')
        console.error('🚀 ~ handlerLogout ~ error:', error)
        console.error('🚀 ---------------------------------🚀')
      }
    },
    setLinkActive (link: any) {
      const path = this.$route.path
      return !!path.includes(link.path)
    }
  }
})
