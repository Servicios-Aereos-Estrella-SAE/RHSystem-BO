import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'
import PositionService from '~/resources/scripts/services/PositionService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { CalendarDayMarkerInterface } from '~/resources/scripts/interfaces/CalendarDayMarkerInterface'

interface VacationData {
  startDate?: string | Date;
  endDate?: string | Date;
}

export default defineComponent({
  name: 'Vacation-days',
  props: {},
  data: () => ({
    date: new Date() as Date,
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterVacations: [] as CalendarDayMarkerInterface[],
    search: '' as string,
    searchTimeout: null as NodeJS.Timeout | null,
    currentPage: 1 as number,
    rowsPerPage: 20 as number,

    periodSelected: new Date() as Date | null,

    isReady: false as boolean,
    yearSelected: new Date().getFullYear() as number,
    departmentId: null as number | null,
    positionId: null as number | null,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    filteredEmployees: [] as EmployeeInterface[],
    filteredEmployeesVacation: [] as EmployeeInterface[],
    drawerEmployeesVacation: false as boolean,
    currentVacation: '' as string,
    isSearching: false as boolean,
  }),
  watch: {
    search(newValue) {
      // Clear previous timeout if any
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Set a new timeout to debounce search
      this.searchTimeout = setTimeout(() => {
        if (newValue && newValue.length >= 2) {
          this.handlerSearchEmployee()
        }
      }, 500) // 500ms debounce time
    },
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await this.getDepartments()
    await this.onPeriodChange()

    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async onHandlerDepartmentChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      this.positionId = null
      this.positions = []
      if (this.departmentId) {
        await this.getPositions(this.departmentId)
      }
      await this.handlerSearchEmployee()

      myGeneralStore.setFullLoader(false)
    },
    async onHandlerPositionChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await this.handlerSearchEmployee()

      myGeneralStore.setFullLoader(false)
    },
    async getPositions(departmentId: number) {
      const positionService = new PositionService()
      this.positions = await positionService.getPositionsDepartment(departmentId)
    },
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = response._data.data.departments
    },
    async handlerSearchEmployee() {
      if (this.isSearching) return

      this.isSearching = true
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      try {
        const response = await new EmployeeService().getVacations(
          this.search,
          this.departmentId,
          this.positionId,
          this.yearSelected
        )

        const list = response.status === 200 ? response._data.data.employees : []
        this.filteredEmployees = list
        this.filterVacations = []

        // Process employee vacations
        for (const employee of this.filteredEmployees) {
          if (employee.shift_exceptions) {
            for (const shift_exception of employee.shift_exceptions) {
              if (shift_exception?.shiftExceptionsDate) {
                const exceptionDate = DateTime.fromISO(shift_exception.shiftExceptionsDate.toString()).setZone('UTC')

                // Only add if it falls within this year
                if (exceptionDate.year === this.yearSelected) {
                  this.filterVacations.push({
                    date: exceptionDate.toISO() as string,
                    icon: `<svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512"><path d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z" fill="#87a4bf" class="fill-333333"></path><path d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z" fill="#87a4bf" class="fill-333333"></path><path d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z" fill="#87a4bf" class="fill-333333"></path></svg>`,
                    quantity: 0
                  })
                }
              }
            }
          }
        }

        // Calculate quantity for each date
        this.updateVacationsQuantity()
      } catch (error) {
        console.error("Error fetching vacations:", error)
      } finally {
        this.isSearching = false
        myGeneralStore.setFullLoader(false)
      }
    },
    setShowDate(date: Date) {
      this.periodSelected = date
    },
    async handlerSearchVacation() {
      if (this.search !== '' && this.search !== null) {
        this.periodSelected = null
        this.firstDate = null
        this.lastDate = null
      }
    },
    clearPeriod() {
      this.periodSelected = null
      this.firstDate = null
      this.lastDate = null
      this.handlerSearchVacation()
    },
    getDateRange(date: Date) {
      const dateTime = DateTime.fromJSDate(date)
      const yearFirst = dateTime.startOf('year').toFormat('yyyy-MM-dd')
      const yearLast = dateTime.endOf('year').toFormat('yyyy-MM-dd')
      const firstDay = yearFirst
      const lastDayFormatted = yearLast

      return { firstDay, lastDayFormatted }
    },
    async onPeriodChange() {
      if (this.periodSelected) {
        const { firstDay, lastDayFormatted } = this.getDateRange(this.periodSelected)
        this.firstDate = firstDay
        this.lastDate = lastDayFormatted
        this.yearSelected = this.periodSelected.getFullYear()
      }

      await this.handlerSearchEmployee()
    },
    async handlerPeriodChange() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await this.onPeriodChange()

      myGeneralStore.setFullLoader(false)
    },
    // Updates quantity for each date that has multiple vacations
    updateVacationsQuantity() {
      // Group vacations by date (YYYY-MM-DD format)
      const groupedByDate = this.filterVacations.reduce((acc, curr) => {
        const date = DateTime.fromISO(curr.date.toString(), { zone: 'utc' }).setZone('UTC').toFormat('yyyy-MM-dd')
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(curr)
        return acc
      }, {} as Record<string, CalendarDayMarkerInterface[]>)

      // Update quantities
      this.filterVacations = Object.entries(groupedByDate).map(([, vacations]) => {
        const firstVacation = vacations[0]
        return {
          ...firstVacation,
          quantity: vacations.length
        }
      })
    },
    onShowCurrentVacation({ year, month, day }: { year: number, month: number, day: number }) {
      const date = DateTime.fromObject({ year, month, day }).setZone('UTC')
      this.currentVacation = date.toFormat('MMMM dd, yyyy')
      this.filteredEmployeesVacation = this.getEmployeesWithVacation(month, day)
      this.drawerEmployeesVacation = true
    },
    getEmployeesWithVacation(currentMonth: number, currentDay: number) {
      return this.filteredEmployees.filter(employee => {
        if (employee.shift_exceptions) {
          // Check if employee has a vacation on this date
          return employee.shift_exceptions.some(shift_exception => {
            if (shift_exception.shiftExceptionsDate) {
              const vacationDate = DateTime.fromISO(shift_exception.shiftExceptionsDate.toString()).setZone('UTC')
              return vacationDate.month === currentMonth && vacationDate.day === currentDay
            }
            return false
          })
        }
        return false
      })
    },
    async getVacationExcel() {
      let yearStart = 2018
      const oldestEmployee = this.filteredEmployees.reduce((oldest, current) => {
        if (!current.employeeHireDate || !oldest.employeeHireDate) {
          return oldest;
        }

        const currentDate = new Date(current.employeeHireDate);
        const oldestDate = new Date(oldest.employeeHireDate);

        return currentDate < oldestDate ? current : oldest;
      });
      if (oldestEmployee && oldestEmployee.employeeHireDate) {
        yearStart = DateTime.fromISO(oldestEmployee.employeeHireDate.toString()).year
      }
      const yearEnd = (new Date().getFullYear()) + 1 as number
      const dateStart = `${yearStart}-01-01`
      const dateEnd = `${yearEnd}-12-31`
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const assistService = new EmployeeService()
      const assistResponse = await assistService.getVacationExcel(this.search, this.departmentId, this.positionId, dateStart, dateEnd, false, false)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Vacations Report.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$toast.add({
          severity: 'success',
          summary: 'Excel vacation',
          detail: 'Excel was created successfully',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      } else {
        const msgError = assistResponse._data.error ? assistResponse._data.error : assistResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: 'Excel vacation',
          detail: msgError,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      }
    },
    async getVacationsUsedExcel() {
      const dateStart = `${this.yearSelected}-01-01`
      const dateEnd = `${this.yearSelected}-12-31`
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const assistService = new EmployeeService()
      const assistResponse = await assistService.getVacationsUsedExcel(this.search, this.departmentId, this.positionId, dateStart, dateEnd, false)
      if (assistResponse.status === 201) {
        const blob = await assistResponse._data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${this.yearSelected} Vacations Used Report.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$toast.add({
          severity: 'success',
          summary: 'Excel vacation',
          detail: 'Excel was created successfully',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      } else {
        const msgError = assistResponse._data.error ? assistResponse._data.error : assistResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: 'Excel vacation',
          detail: msgError,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      }
    }
  }
})
