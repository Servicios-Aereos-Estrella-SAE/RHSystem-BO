import { defineComponent } from 'vue'

export default defineComponent({
  name: 'asideMenu',
  props: {
  },
  data: () => ({
    menu: [
      {
        label: 'Attendance Monitor',
        name: 'Reporte de asistencia de empleados',
        path: '',
        icon: `<svg viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 30 30"><path d="M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3zm0 15-5.707-5.707a.999.999 0 1 1 1.414-1.414L15 15.172l5.293-5.293a.999.999 0 1 1 1.414 1.414L15 18zM3 22.184V25a2 2 0 0 0 2 2h2.816A14.032 14.032 0 0 1 3 22.184zM22.184 27H25a2 2 0 0 0 2-2v-2.816A14.032 14.032 0 0 1 22.184 27z" fill="#ffffff" class="fill-000000"></path></svg>`,
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
        label: 'Users',
        name: 'Usuarios',
        path: '/users',
        icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><path d="M20 10a3 3 0 1 0-3 3 3 3 0 0 0 3-3Zm-4 0a1 1 0 1 1 1 1 1 1 0 0 1-1-1ZM17 14a5 5 0 0 0-3.56 1.48A6 6 0 0 0 2 18v3h20v-2a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0Z" fill="#ffffff" class="fill-000000"></path><circle cx="8" cy="7" r="4" fill="#ffffff" class="fill-000000"></circle></g></svg>`
      },
      {
        label: 'Shifts',
        name: 'Turnos',
        path: '/shifts',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17 7v2.6A5.5 5.5 0 0 0 9.6 17H5.5A2.5 2.5 0 0 1 3 14.5V7h14Zm-2.5-4A2.5 2.5 0 0 1 17 5.5V6H3v-.5A2.5 2.5 0 0 1 5.5 3h9Zm-2.434 8.442a2 2 0 0 1-1.43 2.478l-.462.118a4.703 4.703 0 0 0 .01 1.016l.35.083a2 2 0 0 1 1.456 2.519l-.127.422c.258.204.537.378.835.518l.325-.344a2 2 0 0 1 2.91.002l.337.358c.292-.135.568-.302.822-.498l-.156-.556a2 2 0 0 1 1.43-2.479l.46-.117a4.731 4.731 0 0 0-.01-1.017l-.348-.082a2 2 0 0 1-1.456-2.52l.126-.421a4.318 4.318 0 0 0-.835-.519l-.325.344a2 2 0 0 1-2.91-.001l-.337-.358a4.316 4.316 0 0 0-.822.497l.157.557ZM14.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#ffffff" class="fill-212121"></path></svg>`
      },
      {
        label: 'employees',
        name: 'Empleados',
        path: '/employees',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`
      }
      ,
      {
        label: 'Departments',
        name: 'Departamentos',
        path: '/departments',
        icon: `<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17 7v2.6A5.5 5.5 0 0 0 9.6 17H5.5A2.5 2.5 0 0 1 3 14.5V7h14Zm-2.5-4A2.5 2.5 0 0 1 17 5.5V6H3v-.5A2.5 2.5 0 0 1 5.5 3h9Zm-2.434 8.442a2 2 0 0 1-1.43 2.478l-.462.118a4.703 4.703 0 0 0 .01 1.016l.35.083a2 2 0 0 1 1.456 2.519l-.127.422c.258.204.537.378.835.518l.325-.344a2 2 0 0 1 2.91.002l.337.358c.292-.135.568-.302.822-.498l-.156-.556a2 2 0 0 1 1.43-2.479l.46-.117a4.731 4.731 0 0 0-.01-1.017l-.348-.082a2 2 0 0 1-1.456-2.52l.126-.421a4.318 4.318 0 0 0-.835-.519l-.325.344a2 2 0 0 1-2.91-.001l-.337-.358a4.316 4.316 0 0 0-.822.497l.157.557ZM14.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#ffffff" class="fill-212121"></path></svg>`
      }
    ],
    items: [
      {
          label: 'Documents',
          icon: 'pi pi-file',
          items: [
              {
                  label: 'Invoices',
                  icon: 'pi pi-file-pdf',
                  items: [
                      {
                          label: 'Pending',
                          icon: 'pi pi-stop'
                      },
                      {
                          label: 'Paid',
                          icon: 'pi pi-check-circle'
                      }
                  ]
              },
              {
                  label: 'Clients',
                  icon: 'pi pi-users'
              }
          ]
      },
      {
          label: 'Images',
          icon: 'pi pi-image',
          items: [
              {
                  label: 'Logos',
                  icon: 'pi pi-image'
              }
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
