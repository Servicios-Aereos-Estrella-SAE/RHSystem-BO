import { defineComponent } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeWithFaultList',
  props: {
    employeesWithFaults: { type: Array<EmployeeInterface>, required: true },
  },
  data: () => ({
    isReady: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = true
  },
  methods: {
  }
})
