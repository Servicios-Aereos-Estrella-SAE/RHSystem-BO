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
    clickOnPhoto: { type: Function, default: null }
  },
  data: () => ({
    dateFirstYear: '',
    canHaveVacations: false,
    daysVacationsUsed: 0,
    daysVacationsCorresponding: 0,
    dateRenovation: ''
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
      if (employeeVacationsInfo && employeeVacationsInfo.vacationPeriodEnd) {
        this.dateRenovation = DateTime.fromISO(employeeVacationsInfo.vacationPeriodEnd).toFormat('DD')
      }
      if (hasCompletedYear) {
        this.canHaveVacations = true
        await this.getVacationsUsed()
        await this.getVacationsCorresponding()
      }
    }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
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
        }
      }
    },
    getCurrentVacationPeriod(employeeHireDate:  string) {
      // Fecha actual
      const currentDate = DateTime.now()
      // Fecha de inicio del empleo
      const startDate = DateTime.fromISO(employeeHireDate)
      // Verificar si la fecha de inicio es válida
      if (!startDate.isValid) {
        // console.log('Fecha de inicio del empleo no es válida')
        return null
      }
      // Calcular los años trabajados
      const yearsWorked = currentDate.diff(startDate, 'years').years
      // Verificar si el empleado ha cumplido al menos un año
      if (yearsWorked < 1) {
        // console.log('El empleado aún no ha cumplido un año de servicio')
        return null
      }
      // Calcular el año de vacaciones actual
      const vacationYear = Math.floor(yearsWorked)
      // Determinar las fechas de inicio y fin del período de vacaciones actual
      const vacationPeriodStart = startDate.plus({ years: vacationYear }).startOf('day')
      const vacationPeriodEnd = vacationPeriodStart.plus({ years: 1 }).minus({ days: 1 }).endOf('day')
      return {
        yearsWorked,
        startDate,
        vacationYear,
        vacationPeriodStart: vacationPeriodStart.toISODate(),
        vacationPeriodEnd: vacationPeriodEnd.toISODate()
      }
    }
  }
})