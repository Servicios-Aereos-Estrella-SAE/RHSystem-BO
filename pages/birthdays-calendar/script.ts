import { useMyGeneralStore } from '~/store/general'
import { DateTime, type DateObjectUnits } from 'luxon'
import PositionService from '~/resources/scripts/services/PositionService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'

export default defineComponent({
  name: 'Birthday-days',
  props: {},
  data: () => ({
    date: new Date(),
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterBirthdays: [] as BirthdayInterface[],
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
    filteredEmployeesBirthday: [] as EmployeeInterface[],
    drawerEmployeesBirthday: false,
    currentBirthday: ''
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
    await this.handlerSearchEmployee()
    await this.getDepartments()
    //await this.verifyPermissions()
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
      const response = await new EmployeeService().getBirthday(this.search, this.departmentId, this.positionId, this.yearSelected)
      const list = response.status === 200 ? response._data.data.employees : []
      this.filteredEmployees = list
      this.filterBirthdays = []
      for await (const employee of this.filteredEmployees) {
        if (employee.person?.personBirthday) {
          this.filterBirthdays.push({
            date: employee.person.personBirthday,
            icon: '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 7c1.714 0 2-1.34 2-2.444C14 3.45 13.262 1.5 12 1.5s-2 1.951-2 3.056C10 5.66 10.286 7 12 7ZM3.5 10.25A2.25 2.25 0 0 1 5.75 8h12.5a2.25 2.25 0 0 1 2.25 2.25v.875l-3.634 2.726a1.25 1.25 0 0 1-1.384.077l-2.04-1.2a2.75 2.75 0 0 0-2.884.06l-1.761 1.136a1.25 1.25 0 0 1-1.35.003L3.5 11.408V10.25Z" fill="#88a4bf" class="fill-212121"></path><path d="M3.5 13.188V18.5h-.75a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5h-.75V13l-2.734 2.05a2.75 2.75 0 0 1-3.044.171l-2.04-1.2a1.25 1.25 0 0 0-1.311.027l-1.76 1.136a2.75 2.75 0 0 1-2.971.008L3.5 13.187Z" fill="#88a4bf" class="fill-212121"></path></svg>',
            quantity: 0
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    setShowDate(date: Date) {
      this.date = date
    },
    async handlerSearchBirthday() {
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
      this.handlerSearchBirthday()
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
      this.handlerSearchBirthday()
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
    isBirthday(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const birthday = this.filterBirthdays.find((day: BirthdayInterface) => {
        const birthdayDate = DateTime.fromISO(day.date as string, { zone: 'utc' }).setLocale('en')
        return birthdayDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return birthday
    },
    getCountBirthday(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const birthday = this.filterBirthdays.filter((day: BirthdayInterface) => {
        const birthdayDate = DateTime.fromISO(day.date as string, { zone: 'utc' }).setLocale('en')
        return birthdayDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return birthday.length
    },
    firstWeekDay(monthNumber: number, weekDayNumber: number, iweekDayNumber: number) {
      let day = 0
      let birthday = null
      let icon = ''
      let quantity = 0

      if (this.getMonthInfo(monthNumber).firstWeekDay === 7) {
        day = iweekDayNumber + 1
        birthday = this.isBirthday(monthNumber, (iweekDayNumber + 1))
        icon = birthday ? birthday.icon || '' : ''
        quantity = this.getCountBirthday(monthNumber, (iweekDayNumber + 1))
      } else if (weekDayNumber >= this.getMonthInfo(monthNumber).firstWeekDay && weekDayNumber < 7) {
        day = (weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1
        birthday = this.isBirthday(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
        icon = birthday ? birthday.icon || '' : ''
        quantity = this.getCountBirthday(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
      }

      return { day: day > 0 ? day : '', birthday, icon, quantity }
    },
    weekDay(monthNumber: number, iweekDayNumber: number) {
      let day = (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1)
      let birthday = this.isBirthday(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))
      let icon = birthday ? birthday.icon || '' : ''
      const quantity = this.getCountBirthday(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))

      return { day: day > 0 ? day : '', birthday, icon, quantity }
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
    async onShowCurrentBirthday(year: number, month: number, day: number) {
      const date = DateTime.fromObject({ year, month, day }, { zone: 'local' });
      this.currentBirthday = date.setLocale('en').toFormat('DDDD');
      this.filteredEmployeesBirthday = await JSON.parse(JSON.stringify(this.getEmployeesWithBirthday(month, day)))
      if (this.filteredEmployeesBirthday) {
        this.drawerEmployeesBirthday = true
      }
    },
    getEmployeesWithBirthday(currentMonth: number, currentDay: number) {
      return this.filteredEmployees.filter(employee => {
        if (employee.person?.personBirthday) {
          const birthdayString = employee.person.personBirthday.toString()
          const [year, month, day] = birthdayString.split('T')[0].split('-')
          return Number(month) === currentMonth && Number(day) === currentDay
        }
      });
    }
  },
})
