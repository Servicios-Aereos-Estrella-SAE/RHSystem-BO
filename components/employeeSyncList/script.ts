import { defineComponent } from 'vue'
import type { EmployeeSyncInterface } from '~/resources/scripts/interfaces/EmployeeSyncInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  emits: ['onSaveSync'],
  components: {
  },
  name: 'employeeSyncListList',
  props: {
    employeesSync: { type: Array<EmployeeSyncInterface>, required: true },
  },
  data: () => ({
    isReady: false,
    drawerEmployeeSync: false as boolean,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = true
  },
  methods: {
    async syncEmployees() {
      const employees = this.employeesSync
        .filter(employee => employee.checked)
        .map(employee => employee.employeeCode)
      if (employees.length === 0) {
        return this.$toast.add({
          severity: 'info',
          summary: 'Synchronization',
          detail: 'No employees selected',
          life: 5000,
        })
      }
      this.drawerEmployeeSync = true
    },
    async confirmSync() {
      this.drawerEmployeeSync = false
      const employees = this.employeesSync
        .filter(employee => employee.checked)
        .map(employee => employee.employeeCode)
      if (employees.length === 0) {
        return this.$toast.add({
          severity: 'info',
          summary: 'Synchronization',
          detail: 'No employees selected',
          life: 5000,
        })
      }
      const employeeService = new EmployeeService()
      const employeeResponse = await employeeService.synchronizationBySelection(employees)
      if (employeeResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: 'Sync employees',
          detail: employeeResponse._data.message,
          life: 5000,
        })
        this.$emit('onSaveSync')
      } else {
        const severityType = employeeResponse.status === 500 ? 'error' : 'warn'
        const msgError = employeeResponse._data.error ? employeeResponse._data.error : employeeResponse._data.message
        this.$toast.add({
          severity: severityType,
          summary: 'Sync employees',
          detail: msgError,
          life: 5000,
        })
      }
    }
  }
})
