import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  name: 'employeeWithOutShiftInfoCard',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
  }),
  computed: {
    employeeName() {
      if (!this.employee.person) {
        return '---'
      }

      const name = `${this.employee.person.personFirstname || ''} ${this.employee.person.personLastname || ''} ${this.employee.person.personSecondLastname || ''}`
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
