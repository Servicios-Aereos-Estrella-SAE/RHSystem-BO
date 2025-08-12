import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSyncInterface } from '~/resources/scripts/interfaces/EmployeeSyncInterface'

export default defineComponent({
  name: 'employeeSyncInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeSyncInterface>, required: true }
  },
  data: () => ({
  }),
  computed: {
    employeeName() {
      const name = `${this.employee.employeeFirstName || ''} ${this.employee.employeeLastName || ''}`
      return name
    },
    employeeInitial() {
      const name = this.employeeName.trim()
      const first = name.charAt(0)
      return first.toUpperCase()
    }
  },
  mounted() {
  },
  methods: {
  }
})
