import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  name: 'employeeModalInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    hideBottomLine: { type: Boolean, default: false }
  },
  data: () => ({
  }),
  computed: {
    getEmployeePhoto () {
      const CONFIG = useRuntimeConfig()
      const API_PATH = CONFIG.public.BASE_API_PATH
      const photoPath = `${API_PATH}/proxy-image?url=${this.employee.employeePhoto}`
      return photoPath
    },
    employeeInitial() {
      const name = this.employee.employeeFirstName.trim()
      const first = name.charAt(0)
      return first.toUpperCase()
    }
  },
  async mounted() {
  },
  methods: {
  }
})