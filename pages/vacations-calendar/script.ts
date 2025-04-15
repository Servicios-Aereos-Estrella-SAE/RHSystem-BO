import { useMyGeneralStore } from '~/store/general'
import { DateTime, type DateObjectUnits } from 'luxon'
import PositionService from '~/resources/scripts/services/PositionService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'

export default defineComponent({
  name: 'Vacation-days',
  props: {},
  data: () => ({
    date: new Date(),
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterVacations: [] as VacationCalendarInterface[],
    search: '',
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 20,

    periodSelected: new Date() as Date | null,

    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    canCreate: false as boolean,
    canUpdate: false as boolean,
    canDelete: false as boolean,
    isReady: false as boolean,
    weekDays: [7, 1, 2, 3, 4, 5, 6],
    yearSelected: new Date().getFullYear() as number,
    departmentId: null as number | null,
    positionId: null as number | null,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    filteredEmployees: [] as EmployeeInterface[],
    filteredEmployeesVacation: [] as VacationCalendarInterface[],
    drawerEmployeesVacation: false,
    currentVacation: ''
  }),
  watch: {
    'departmentId': function (newVal) {
      this.positionId = null
      this.positions = []
      this.handlerSearchEmployee()
      if (newVal) {
        this.getPositions(newVal)
      }
    },
    'positionId': function () {
      this.handlerSearchEmployee()
    },
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getDepartments()
    await this.handlerPeriodChange()

    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
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
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new EmployeeService().getVacations(this.search, this.departmentId, this.positionId, this.yearSelected)
      const list = response.status === 200 ? response._data.data.employees : []
      this.filteredEmployees = list
      this.filterVacations = []
      this.filteredEmployees.forEach(employee => {
        if (employee.shift_exceptions) {
          employee.shift_exceptions.forEach(shift_exception => {
            if (shift_exception?.shiftExceptionsDate) {
              this.filterVacations.push({
                date: shift_exception.shiftExceptionsDate.toString(),
                icon: '<svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" data-v-inspector="components/attendanceCalendarDay/index.vue:94:15" data-v-6de6f350=""><path d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z" fill="#87a4bf" class="fill-333333" data-v-inspector="components/attendanceCalendarDay/index.vue:96:17" data-v-6de6f350=""></path><path d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z" fill="#87a4bf" class="fill-333333" data-v-inspector="components/attendanceCalendarDay/index.vue:99:17" data-v-6de6f350=""></path><path d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z" fill="#87a4bf" class="fill-333333" data-v-inspector="components/attendanceCalendarDay/index.vue:102:17" data-v-6de6f350=""></path></svg>',
                quantity: 0
              })
            }
          })
        }
      })
      myGeneralStore.setFullLoader(false)
    },
    setShowDate(date: Date) {
      this.date = date
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
    handlerPeriodChange() {
      if (this.periodSelected) {
        const { firstDay, lastDayFormatted } = this.getDateRange(this.periodSelected)
        this.firstDate = firstDay
        this.lastDate = lastDayFormatted
        this.yearSelected = this.periodSelected.getFullYear()
      }
      this.handlerSearchEmployee()
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
      this.handlerSearchVacation()
    },
    weekDayName(numberDay: number) {
      if (numberDay < 1 || numberDay > 7) {
        return ''
      }

      const fecha = DateTime.fromObject({ weekday: numberDay as DateObjectUnits['weekday'] });
      return fecha.setLocale('en').toFormat('EEEE');
    },
    getMonthInfo(month: number = 0) {
      const monthDate = DateTime.fromObject({ year: this.yearSelected, month, day: 1 }).setLocale('en')
      const monthName = monthDate.monthLong
      const daysInMonth = monthDate.daysInMonth
      const firstWeekDay = monthDate.startOf('month').weekday
      const lastWeekDay = 7 - monthDate.startOf('month').weekday + 1
      const weeks = Math.ceil((daysInMonth as number + firstWeekDay) / 7)

      return { monthName, daysInMonth, firstWeekDay, weeks, lastWeekDay }
    },
    monthStatus(month: number = 0) {
      const monthDate = DateTime.fromObject({ year: this.yearSelected, month, day: 1 }).setLocale('en')
      const diff = monthDate.diffNow('months').months

      if (monthDate.toFormat('yyyy-MM') === DateTime.now().setLocale('en').toFormat('yyyy-MM')) {
        return 'current'
      }

      return diff < 0 ? 'past' : 'future'
    },
    isVacation(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const vacation = this.filterVacations.find((day: VacationCalendarInterface) => {
        const vacationDate = DateTime.fromISO(day.date as string, { zone: 'utc' }).setLocale('en')
        return vacationDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return vacation
    },
    getCountVacation(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const vacation = this.filterVacations.filter((day: VacationCalendarInterface) => {
        const vacationDate = DateTime.fromISO(day.date as string, { zone: 'utc' }).setLocale('en')
        return vacationDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return vacation.length
    },
    firstWeekDay(monthNumber: number, weekDayNumber: number, iweekDayNumber: number) {
      let day = 0
      let vacation = null
      let icon = ''
      let quantity = 0

      if (this.getMonthInfo(monthNumber).firstWeekDay === 7) {
        day = iweekDayNumber + 1
        vacation = this.isVacation(monthNumber, (iweekDayNumber + 1))
        icon = vacation ? vacation.icon || '' : ''
        quantity = this.getCountVacation(monthNumber, (iweekDayNumber + 1))
      } else if (weekDayNumber >= this.getMonthInfo(monthNumber).firstWeekDay && weekDayNumber < 7) {
        day = (weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1
        vacation = this.isVacation(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
        icon = vacation ? vacation.icon || '' : ''
        quantity = this.getCountVacation(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
      }

      return { day: day > 0 ? day : '', vacation, icon, quantity }
    },
    weekDay(monthNumber: number, iweekDayNumber: number) {
      let day = (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1)
      let vacation = this.isVacation(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))
      let icon = vacation ? vacation.icon || '' : ''
      const quantity = this.getCountVacation(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))

      return { day: day > 0 ? day : '', vacation, icon, quantity }
    },
    lastWeeksRestDays(monthNumber: number) {
      const days = ((this.getMonthInfo(monthNumber).daysInMonth || 0) - (7 - this.getMonthInfo(monthNumber).firstWeekDay))
      return days
    },
    isToday(month: number = 0, day: number = 0) {
      if (!month || !day) {
        return false
      }

      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const today = DateTime.now().setLocale('en')
      const isNow = compareDay.toFormat('yyyy-MM-dd') === today.toFormat('yyyy-MM-dd')
      return isNow
    },
    async onShowCurrentVacation(year: number, month: number, day: number) {
      const date = DateTime.fromObject({ year, month, day }, { zone: 'local' });
      this.currentVacation = date.setLocale('en').toFormat('DDDD');
      this.filteredEmployeesVacation = await JSON.parse(JSON.stringify(this.getEmployeesWithVacation(month, day)))
      if (this.filteredEmployeesVacation) {
        this.drawerEmployeesVacation = true
      }
    },
    getEmployeesWithVacation(currentMonth: number, currentDay: number) {
      return this.filteredEmployees.filter(employee => {
        if (employee.shift_exceptions) {
          return employee.shift_exceptions.some(shift_exception => {
            if (shift_exception.shiftExceptionsDate) {
              const vacationString = shift_exception.shiftExceptionsDate.toString()
              const [year, month, day] = vacationString.split('T')[0].split('-')
              return Number(month) === currentMonth && Number(day) === currentDay
            }
            return false
          })
        }
        return false
      })
    }
  },
})
