import { defineComponent } from 'vue'

export default defineComponent({
  name: 'asideMenu',
  props: {
    asideVisibilityStatus: { type: Boolean },
  },
  data: () => ({
    menu: [
      {
        label: 'Attendance Monitor',
        name: 'Reporte de asistencia',
        path: '/attendance-monitor',
        icon: `<svg viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 30 30"><path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm0 15-5.707-5.707a.999.999 0 1 1 1.414-1.414L15 15.172l5.293-5.293a.999.999 0 1 1 1.414 1.414L15 18zM3 22.184V25a2 2 0 0 0 2 2h2.816A14.032 14.032 0 0 1 3 22.184zM22.184 27H25a2 2 0 0 0 2-2v-2.816A14.032 14.032 0 0 1 22.184 27z" fill="#ffffff" class="fill-000000"></path></svg>`
      }
    ]
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    handlerLogout () {
      this.$router.push({ path: "/" })
    },
    setLinkActive (link: any) {
      const path = this.$route.path
      return !!path.includes(link.path)
    }
  }
})