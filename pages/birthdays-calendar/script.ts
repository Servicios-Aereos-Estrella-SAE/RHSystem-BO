import { useMyGeneralStore } from '~/store/general'
import { DateTime, type DateObjectUnits } from 'luxon'
import PositionService from '~/resources/scripts/services/PositionService'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { CalendarDayMarkerInterface } from '~/resources/scripts/interfaces/CalendarDayMarkerInterface'

interface BirthdayInterface {
  date: string;
  icon: string;
  quantity: number;
}

interface CalendarDay {
  day: number | string;
  birthday: BirthdayInterface | null;
  icon: string;
  quantity: number;
  isToday: boolean;
  isEmpty: boolean;
}

interface CalendarMonth {
  monthNumber: number;
  monthName: string;
  status: string;
  weeks: number;
  days: CalendarDay[][];
}

export default defineComponent({
  name: 'Birthday-days',
  props: {},
  data: () => ({
    date: new Date(),
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterBirthdays: [] as CalendarDayMarkerInterface[],
    search: '',
    currentPage: 1,

    periodSelected: new Date() as Date | null,

    minDate: new Date() as Date,
    maxDate: new Date() as Date,
    isReady: false as boolean,
    yearSelected: new Date().getFullYear() as number,
    departmentId: null as number | null,
    positionId: null as number | null,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    filteredEmployees: [] as EmployeeInterface[],
    filteredEmployeesBirthday: [] as EmployeeInterface[],
    drawerEmployeesBirthday: false,
    currentBirthday: '',
    calendarData: [] as CalendarMonth[]
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
            date: employee.person.personBirthday.toString(),
            icon: '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 7c1.714 0 2-1.34 2-2.444C14 3.45 13.262 1.5 12 1.5s-2 1.951-2 3.056C10 5.66 10.286 7 12 7ZM3.5 10.25A2.25 2.25 0 0 1 5.75 8h12.5a2.25 2.25 0 0 1 2.25 2.25v.875l-3.634 2.726a1.25 1.25 0 0 1-1.384.077l-2.04-1.2a2.75 2.75 0 0 0-2.884.06l-1.761 1.136a1.25 1.25 0 0 1-1.35.003L3.5 11.408V10.25Z" fill="#88a4bf" class="fill-212121"></path><path d="M3.5 13.188V18.5h-.75a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5h-.75V13l-2.734 2.05a2.75 2.75 0 0 1-3.044.171l-2.04-1.2a1.25 1.25 0 0 0-1.311.027l-1.76 1.136a2.75 2.75 0 0 1-2.971.008L3.5 13.187Z" fill="#88a4bf" class="fill-212121"></path></svg>',
            quantity: 0
          })
        }
      }

      // Calculate quantity for each date
      this.updateBirthdaysQuantity()

      myGeneralStore.setFullLoader(false)
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
    // Updates quantity for each date that has multiple birthdays
    updateBirthdaysQuantity() {
      // Group birthdays by date (MM-DD format)
      const groupedByDate = this.filterBirthdays.reduce((acc, curr) => {
        const date = DateTime.fromISO(curr.date.toString(), { zone: 'utc' }).setLocale('en').toFormat('MM-dd')
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(curr)
        return acc
      }, {} as Record<string, CalendarDayMarkerInterface[]>)

      // Update quantities
      this.filterBirthdays = Object.entries(groupedByDate).map(([, birthdays]) => {
        const firstBirthday = birthdays[0]
        return {
          ...firstBirthday,
          quantity: birthdays.length
        }
      })
    },
    onShowCurrentBirthday({ year, month, day }: { year: number, month: number, day: number }) {
      const date = DateTime.fromObject({ year, month, day })
      this.currentBirthday = date.setLocale('en').toFormat('DDDD')
      this.filteredEmployeesBirthday = this.getEmployeesWithBirthday(month, day)
      this.drawerEmployeesBirthday = true
    },
    getEmployeesWithBirthday(currentMonth: number, currentDay: number) {
      return this.filteredEmployees.filter(employee => {
        if (employee.person?.personBirthday) {
          const birthdayDate = DateTime.fromISO(employee.person.personBirthday.toString()).setLocale('en').setZone('UTC')
          return birthdayDate.month === currentMonth && birthdayDate.day === currentDay
        }
        return false
      })

    },
    onPhoto(employee: EmployeeInterface) {
      // TO-DO
    },
    onEdit(employee: EmployeeInterface) {
      // TO-DO
    },
    onDelete(employee: EmployeeInterface) {
      // TO-DO
    }
  }
})
