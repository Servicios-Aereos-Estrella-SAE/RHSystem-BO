import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  name: 'employeeModalInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    hideBottomLine: { type: Boolean, default: false }
  },
  data: () => ({
  }),
  computed: {
    getEmployeePhoto() {
      const CONFIG = useRuntimeConfig()
      const API_PATH = CONFIG.public.BASE_API_PATH
      const photoPath = `${API_PATH}/proxy-image?url=${this.employee.employeePhoto}`
      let photoIsValid = false
      const employeeService = new EmployeeService()
      employeeService.checkImage(photoPath).then(valid => {
        photoIsValid = valid
      });
      if (photoIsValid) {
        return photoPath
      }
      return this.employee.employeePhoto
    },
    employeeInitial() {
      const name = this.employee.employeeFirstName.trim()
      const first = name.charAt(0)
      return first.toUpperCase()
    },
    getName() {
      return `${this.employee?.person?.personFirstname} ${this.employee?.person?.personLastname} ${this.employee?.person?.personSecondLastname}`
    }
  },
  async mounted() {
  },
  methods: {
  }
})