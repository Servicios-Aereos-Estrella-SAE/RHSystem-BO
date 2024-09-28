import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  name: 'employeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnPhoto: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    dateFirstYear: '',
    canHaveVacations: false,
    daysVacationsUsed: 0,
    daysVacationsCorresponding: 0,
    daysVacationsRest: 0,
    dateRenovation: '',
    dateLimit: ''
  }),
  computed: {
  },
  async mounted() {
    if (this.employee.employeeHireDate) {
      const now = DateTime.now()
      const hasCompletedYear = now.diff(DateTime.fromISO(this.employee.employeeHireDate.toString()), 'years').years >= 1
      const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
      this.dateFirstYear = dateFirstYear.toFormat('DD')
      const employeeVacationsInfo = await this.getCurrentVacationPeriod(this.employee.employeeHireDate.toString())
      if (hasCompletedYear) {
        this.canHaveVacations = true
        await Promise.all([
          this.getVacationsUsed(),
          this.getVacationsCorresponding()
        ])
        if (this.daysVacationsCorresponding === 0) {
          this.daysVacationsRest = 0
        } else {
          this.daysVacationsRest = this.daysVacationsCorresponding - this.daysVacationsUsed
        }
        if (employeeVacationsInfo && employeeVacationsInfo.vacationPeriodEnd) {
          this.dateRenovation = DateTime.fromISO(employeeVacationsInfo.vacationPeriodEnd).toFormat('DD')
          this.dateLimit = DateTime.fromISO(employeeVacationsInfo.vacationPeriodEnd).minus({ days: this.daysVacationsRest }).toFormat('DD')
        }
      }
    }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnShifts () {
      this.$emit('clickShifts', this.employee)
    },
    onClickPhoto() {
      this.clickOnPhoto()
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    async getVacationsUsed() {
      if (this.employee.employeeId) {
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getVacationsUsed(this.employee.employeeId)
        if (employeeResponse.status === 200) {
          this.daysVacationsUsed = employeeResponse._data.data.vacations
        }
      }
    },
    async getVacationsCorresponding() {
      if (this.employee.employeeId) {
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getVacationsCorresponding(this.employee.employeeId)
        if (employeeResponse.status === 200) {
          this.daysVacationsCorresponding = employeeResponse._data.data.vacations
        } else {
          this.daysVacationsCorresponding = 0
        }
      }
    },
    getCurrentVacationPeriod(employeeHireDate:  string) {
      const currentDate = DateTime.now()
      const startDate = DateTime.fromISO(employeeHireDate)
      if (!startDate.isValid) {
        return null
      }
      const yearsWorked = currentDate.diff(startDate, 'years').years
      if (yearsWorked < 1) {
        return null
      }
      const vacationYear = Math.floor(yearsWorked)
      const vacationPeriodStart = startDate.plus({ years: vacationYear }).startOf('day')
      const vacationPeriodEnd = vacationPeriodStart.plus({ years: 1 }).minus({ days: 1 }).endOf('day')
      return {
        yearsWorked,
        startDate,
        vacationYear,
        vacationPeriodStart: vacationPeriodStart.toISODate(),
        vacationPeriodEnd: vacationPeriodEnd.toISODate()
      }
    },
    handlerOpenProceedingFiles () {
      this.$emit('clickProceedingFiles', this.employee)
    }
  }
})