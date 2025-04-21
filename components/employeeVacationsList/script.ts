import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  components: {
  },
  name: 'employeeVacationsList',
  props: {
    employeeCode: { type: String, required: false },
    departmentId: { type: Number, required: false },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
  },
  data: () => ({
    filteredEmployees: [] as EmployeeInterface[],
    filteredEmployeesVacation: [] as VacationCalendarInterface[],
    currentVacation: '',
    isReady: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    await this.getVacations()
    this.isReady = true
  },
  methods: {
    async getVacations() {
      const dateStart = DateTime.fromISO(this.dateStart, { zone: 'UTC-6' }).startOf('day').setLocale('en')
      const dateEnd = DateTime.fromISO(this.dateEnd, { zone: 'UTC-6' }).endOf('day').setLocale('en')
      this.currentVacation = `Period from ${dateStart.toFormat('DDD')} to ${dateEnd.toFormat('DDD')}`
      const employeeService = new EmployeeService()
      const employeCode = this.employeeCode ? this.employeeCode.trim() : ''
      const departmentId = this.departmentId ? this.departmentId : null
      const employeeResponse = await employeeService.getAllVacationsByPeriod(employeCode, departmentId, null, this.dateStart, this.dateEnd)
      const list = employeeResponse.status === 200 ? employeeResponse._data.data.employees : []
      this.filteredEmployees = list
    },
    getEmployeesWithVacation() {
      return this.filteredEmployees.filter(employee => {
        if (employee.shift_exceptions) {
          return employee.shift_exceptions.some(shift_exception => {
            if (shift_exception.shiftExceptionsDate) {
              return true
            }
            return false
          })
        }
        return false
      })
    },
    getDateFormatted(date: Date) {
      if (!date) {
        return ''
      }
      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale('en')
        .toFormat('DDD')
    },
  }
})
