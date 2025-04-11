import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import HolidayService from '../../resources/scripts/services/HolidayService'
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
    holiday: null as HolidayInterface | null,
    search: '',
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 20,

    periodSelected: new Date() as Date | null,

    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    holidayService: new HolidayService(),
    drawerHolidayForm: false as boolean,
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
      const response = await new EmployeeService().getBirthday(this.search, this.departmentId, this.positionId)
      const list = response.status === 200 ? response._data.data.employees : []
      this.filteredEmployees = list
      this.filterBirthdays = []
      for await (const employee of this.filteredEmployees) {
        if (employee.person?.personBirthday) {
          this.filterBirthdays.push({
            date: employee.person.personBirthday,
            icon: '<svg data-name="Layer 1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M211.86 245.66v196.17h88.29V245.71c-11.8-26.5-26.88-54.85-44.15-75.1-17.27 20.24-32.34 48.57-44.14 75.05ZM445.29 173.36H438a46.67 46.67 0 0 1-14.78 20.17c-.08.07-.17.12-.25.18h12.19v220.36H313.72v20.36h131.57a10.18 10.18 0 0 0 10.18-10.18V183.53a10.17 10.17 0 0 0-10.18-10.17ZM130.16 258l31.36-7.49 16.1 45.29c9.91-29.06 31.11-84.52 59.78-123.32h-2.78a28.81 28.81 0 0 1-20.55-8.62c-13 8.16-30.58 18.23-49 26A209.09 209.09 0 0 0 130.16 258ZM234.62 158.86h42.77a15.32 15.32 0 0 0 15.3-15.32v-42.77a15.32 15.32 0 0 0-15.3-15.31h-42.77a15.33 15.33 0 0 0-15.31 15.31v42.77a15.33 15.33 0 0 0 15.31 15.32ZM97.24 182.88c18.34 14.44 59.23-2.09 91.94-20.23 6.33-3.51 12.35-7.08 17.85-10.5a28.75 28.75 0 0 1-1.31-8.6v-17.42l-86.31-31.69c39.56-4 71.81 12.78 86.33 22.08v-15.75a28.77 28.77 0 0 1 .44-4.85c-21.8-12.84-49.82-25.75-72-25.75-10 0-18.76 2.63-25.21 9.09-7.16 7.24-27.09 44.18-25.26 74.74.75 12.69 5.29 22.41 13.53 28.88ZM306.26 143.54a28.68 28.68 0 0 1-1.3 8.59c4 2.5 8.28 5.07 12.78 7.65 33.43 19.18 77.69 38.29 97 23.08 8.21-6.48 12.76-16.2 13.52-28.9 1.82-30.56-18.11-67.48-25.32-74.72-20.73-20.75-65.53-2-97.16 16.64a29 29 0 0 1 .44 4.87v15.76c14.51-9.3 46.77-26 86.33-22.09l-86.33 31.69ZM274.6 172.43c28.67 38.8 49.87 94.27 59.78 123.33l16.11-45.3 31.35 7.54A209.21 209.21 0 0 0 347 189.81c-18.45-7.75-36-17.83-49.07-26a28.8 28.8 0 0 1-20.55 8.62ZM76.88 193.71h12.2a2.15 2.15 0 0 1-.24-.18 46.45 46.45 0 0 1-14.78-20.17h-7.35a10.17 10.17 0 0 0-10.18 10.17v240.72a10.18 10.18 0 0 0 10.18 10.18h131.58v-20.36H76.88Z" fill="#87a4bf" class="fill-000000"></path></svg>'
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

      this.handlerSearchBirthday()
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
      const holiday = this.filterBirthdays.find((day: BirthdayInterface) => {
        const holidayDate = DateTime.fromISO(day.date as string, { zone: 'utc' }).setLocale('en')
        return holidayDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return holiday
    },
    firstWeekDay(monthNumber: number, weekDayNumber: number, iweekDayNumber: number) {
      let day = 0
      let holiday = null
      let holidayIcon = ''

      if (this.getMonthInfo(monthNumber).firstWeekDay === 7) {
        day = iweekDayNumber + 1
        holiday = this.isBirthday(monthNumber, (iweekDayNumber + 1))
        holidayIcon = holiday ? holiday.icon || '' : ''
      } else if (weekDayNumber >= this.getMonthInfo(monthNumber).firstWeekDay && weekDayNumber < 7) {
        day = (weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1
        holiday = this.isBirthday(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
        holidayIcon = holiday ? holiday.icon || '' : ''
      }

      return { day: day > 0 ? day : '', holiday, holidayIcon }
    },
    weekDay(monthNumber: number, iweekDayNumber: number) {
      let day = (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1)
      let holiday = this.isBirthday(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))
      let holidayIcon = holiday ? holiday.icon || '' : ''

      return { day: day > 0 ? day : '', holiday, holidayIcon }
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
