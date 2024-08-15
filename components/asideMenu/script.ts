import { defineComponent } from 'vue'

export default defineComponent({
  name: 'asideMenu',
  props: {
  },
  data: () => ({
    menu: [
      {
        label: 'Attendance Monitor Reporter',
        name: 'Reporte de asistencia de empleados',
        path: '',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
        items: [
          {
            label: 'Departments Attendance Monitor',
            name: 'Reporte de asistencia por departamento',
            path: '/departments-attendance-monitor',
            icon: `<svg viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 30 30"><path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm0 15-5.707-5.707a.999.999 0 1 1 1.414-1.414L15 15.172l5.293-5.293a.999.999 0 1 1 1.414 1.414L15 18zM3 22.184V25a2 2 0 0 0 2 2h2.816A14.032 14.032 0 0 1 3 22.184zM22.184 27H25a2 2 0 0 0 2-2v-2.816A14.032 14.032 0 0 1 22.184 27z" fill="#ffffff" class="fill-000000"></path></svg>`,
          },
          {
            label: 'Employees Attendance Monitor',
            name: 'Reporte de asistencia por departamento',
            path: '/employees-attendance-monitor',
            icon: `<svg viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 30 30"><path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm0 15-5.707-5.707a.999.999 0 1 1 1.414-1.414L15 15.172l5.293-5.293a.999.999 0 1 1 1.414 1.414L15 18zM3 22.184V25a2 2 0 0 0 2 2h2.816A14.032 14.032 0 0 1 3 22.184zM22.184 27H25a2 2 0 0 0 2-2v-2.816A14.032 14.032 0 0 1 22.184 27z" fill="#ffffff" class="fill-000000"></path></svg>`,
          }
        ]
      },
      {
        label: 'Organization',
        name: 'Organización',
        path: '',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
        items: [
          {
            label: 'Departments',
            name: 'Departamentos',
            path: '/departments',
            icon: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M488.6 250.2 392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1-85 42.5v-79.1l85-38.8v75.4zm0-112-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112-85 42.5v-79.1l85-38.8v75.4zm0-112-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z" fill="#ffffff" class="fill-000000"></path></svg>`
          },
          {
            label: 'Employees',
            name: 'Empleados',
            path: '/employees',
            icon: `<svg viewBox="0 0 16 16" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 16 16"><path d="M7.516 11.094C7.688 10.609 9 8.938 9 6a3 3 0 1 0-6 0c0 2.938 1.313 4.609 1.484 5.094C2.953 11.234 0 12.211 0 14c0 .422.336 1 1 1h10c.664 0 1-.578 1-1 0-1.789-2.953-2.766-4.484-2.906zm5.132-3.055C12.889 7.311 14 5.273 14 4a3 3 0 0 0-5.143-2.098A5 5 0 0 1 11 6c0 1.521-.297 2.779-.645 3.748.775.307 1.527.723 2.146 1.252H15c.578 0 1-.453 1-1 0-1.258-2.422-1.789-3.352-1.961z" fill="#ffffff" class="fill-000000"></path></svg>`
          }
        ]
      },
      {
        label: 'Shifts Control',
        name: 'Control de turnos',
        path: '',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
        items: [
          {
            label: 'Shifts',
            name: 'Turnos',
            path: '/shifts',
            icon: `<svg class="bi bi-calendar-week-fill" fill="#fff" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"></path></svg>`
          },
          {
            label: 'Holidays',
            name: 'Días festivos',
            path: '/holidays',
            icon: `<svg class="bi bi-calendar-heart-fill" fill="#fff" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5ZM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"></path></svg>`
          },
        ]
      },
      {
        label: 'System Control',
        name: 'Control del sistema',
        path: '',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
        items: [
          {
            label: 'Users',
            name: 'Usuarios',
            path: '/users',
            icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 10c.714 0 1.34.374 1.694.936-.125.33-.194.69-.194 1.064v.063A2 2 0 0 0 11 14v2.317c-.904.436-2.089.683-3.5.683C4.088 17 2 15.554 2 13.5V12a2 2 0 0 1 2-2h7Zm1 4a1 1 0 0 1 1-1h.5v-1a1.998 1.998 0 0 1 3.543-1.272c.286.345.457.789.457 1.272v1h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4Zm4.07 1.512a.753.753 0 0 0-.57-.262.75.75 0 1 0 .57.262ZM15.5 11a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Zm-2.25-.984.015-.017h-.03l.014.017ZM7.5 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#ffffff" class="fill-212121"></path></svg>`
          },
          {
            label: 'Vacation Settings',
            name: 'Vacations',
            path: '/vacations',
            icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 10c.714 0 1.34.374 1.694.936-.125.33-.194.69-.194 1.064v.063A2 2 0 0 0 11 14v2.317c-.904.436-2.089.683-3.5.683C4.088 17 2 15.554 2 13.5V12a2 2 0 0 1 2-2h7Zm1 4a1 1 0 0 1 1-1h.5v-1a1.998 1.998 0 0 1 3.543-1.272c.286.345.457.789.457 1.272v1h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4Zm4.07 1.512a.753.753 0 0 0-.57-.262.75.75 0 1 0 .57.262ZM15.5 11a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Zm-2.25-.984.015-.017h-.03l.014.017ZM7.5 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#ffffff" class="fill-212121"></path></svg>`
          },
        ]
      },
      {
        label: 'Managed Aircraft',
        name: 'Aeronaves administradas',
        path: '',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 14.204a1 1 0 0 0 1.628.778l4.723-3.815a1.5 1.5 0 0 0 0-2.334L8.628 5.02A1 1 0 0 0 7 5.797v8.407Z" fill="#ffffff" class="fill-212121"></path></svg>`,
        items: [
          {
            label: 'Aircraft Class',
            name: 'Clase Aeronaves',
            path: '/aircraft-class',
            icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 10c.714 0 1.34.374 1.694.936-.125.33-.194.69-.194 1.064v.063A2 2 0 0 0 11 14v2.317c-.904.436-2.089.683-3.5.683C4.088 17 2 15.554 2 13.5V12a2 2 0 0 1 2-2h7Zm1 4a1 1 0 0 1 1-1h.5v-1a1.998 1.998 0 0 1 3.543-1.272c.286.345.457.789.457 1.272v1h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4Zm4.07 1.512a.753.753 0 0 0-.57-.262.75.75 0 1 0 .57.262ZM15.5 11a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Zm-2.25-.984.015-.017h-.03l.014.017ZM7.5 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#ffffff" class="fill-212121"></path></svg>`
          },
          {
            label: 'Aircraft Properties',
            name: 'Propiedades de Aeronaves',
            path: '/aircraft-properties',
            icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 10c.714 0 1.34.374 1.694.936-.125.33-.194.69-.194 1.064v.063A2 2 0 0 0 11 14v2.317c-.904.436-2.089.683-3.5.683C4.088 17 2 15.554 2 13.5V12a2 2 0 0 1 2-2h7Zm1 4a1 1 0 0 1 1-1h.5v-1a1.998 1.998 0 0 1 3.543-1.272c.286.345.457.789.457 1.272v1h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4Zm4.07 1.512a.753.753 0 0 0-.57-.262.75.75 0 1 0 .57.262ZM15.5 11a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1Zm-2.25-.984.015-.017h-.03l.014.017ZM7.5 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm7 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#ffffff" class="fill-212121"></path></svg>`
          },
        ]
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
      // return !!path.includes(link.path)
      return false
    }
  }
})
