import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import HolidayService from '../../resources/scripts/services/HolidayService'
import { useMyGeneralStore } from '~/store/general'
import { DateTime, type DateObjectUnits } from 'luxon'

export default defineComponent({
  name: 'Holidays',
  props: {},
  data: () => ({
    date: new Date(),
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterHolidays: [] as HolidayInterface[],
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
  }),
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await this.verifyPermissions()
    await this.handlerPeriodChange()
    
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async verifyPermissions () {
      const myGeneralStore = useMyGeneralStore()
      const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
      const permissions = await myGeneralStore.getAccess(systemModuleSlug)

      if (myGeneralStore.isRoot) {
        this.canCreate = true
        this.canUpdate = true
        this.canDelete = true
      } else {
        this.canCreate = permissions.find(
          (a: RoleSystemPermissionInterface) =>
            a.systemPermissions &&
            a.systemPermissions.systemPermissionSlug === 'create'
        )
          ? true
          : false
        this.canUpdate = permissions.find(
          (a: RoleSystemPermissionInterface) =>
            a.systemPermissions &&
            a.systemPermissions.systemPermissionSlug === 'update'
        )
          ? true
          : false
        this.canDelete = permissions.find(
          (a: RoleSystemPermissionInterface) =>
            a.systemPermissions &&
            a.systemPermissions.systemPermissionSlug === 'delete'
        )
          ? true
          : false
      }
    },
    addNew() {
      const newHoliday: HolidayInterface = {
        holidayId: null,
        holidayName: '',
        holidayIcon: null,
        holidayFrequency: 1,
        holidayDate: new Date(),
        holidayIconId: null,
        holidayCreatedAt: new Date(),
        holidayUpdatedAt: new Date(),
        holidayDeletedAt: null,
      }
      this.holiday = newHoliday
      this.drawerHolidayForm = true
    },
    setShowDate(date: Date) {
      this.date = date
    },
    async handlerSearchHoliday() {
      if (this.search !== '' && this.search !== null) {
        this.periodSelected = null
        this.firstDate = null
        this.lastDate = null
      }
      const response = await this.holidayService.getFilteredList(
        this.search,
        this.firstDate,
        this.lastDate,
        this.currentPage,
        this.rowsPerPage
      )
      const list = response.status === 200 ? response._data.holidays.data : []
      this.totalRecords =
        response.status === 200 ? response._data.holidays.meta.total : 0
      this.first =
        response.status === 200 ? response._data.holidays.meta.first_page : 0
      this.filterHolidays = list
    },
    clearPeriod() {
      this.periodSelected = null
      this.firstDate = null
      this.lastDate = null
      this.handlerSearchHoliday()
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

      this.handlerSearchHoliday()
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
      this.handlerSearchHoliday()
    },
    onSave(holiday: HolidayInterface) {
      this.holiday = { ...holiday }
      const index = this.filterHolidays.findIndex(
        (s: HolidayInterface) => s.holidayId === this.holiday?.holidayId
      )
      if (index !== -1) {
        this.filterHolidays[index] = holiday
        this.$forceUpdate()
      } else {
        this.filterHolidays.push(holiday)
        this.$forceUpdate()
      }
      this.drawerHolidayForm = false
    },
    onEdit(holiday: HolidayInterface, month: number, day: number) {
      if (day) {
        let holidayObj = holiday

        if (!holiday) {
          const newHoliday: HolidayInterface = {
            holidayId: null,
            holidayName: '',
            holidayIcon: null,
            holidayFrequency: 1,
            holidayDate: DateTime.fromObject({ year: this.yearSelected, month, day }).toJSDate(),
            holidayIconId: null,
            holidayCreatedAt: new Date(),
            holidayUpdatedAt: new Date(),
            holidayDeletedAt: null,
          }

          holidayObj = newHoliday
        }

        this.holiday = { ...holidayObj }
        this.drawerHolidayForm = true
      }
    },
    async confirmDelete() {
      if (this.holiday) {
        const holidayResponse = await this.holidayService.delete(this.holiday)
        if (holidayResponse.status === 201 || holidayResponse.status === 200) {
          const index = this.filterHolidays.findIndex(
            (holiday: HolidayInterface) =>
              holiday.holidayId === this.holiday?.holidayId
          )
          if (index !== -1) {
            this.filterHolidays.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete holiday',
            detail: holidayResponse._data.message,
            life: 5000,
          })
          this.drawerHolidayForm = false
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete holiday',
            detail: holidayResponse._data.message,
            life: 5000,
          })
        }
      }
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
    isHoliday(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.yearSelected, month, day }).setLocale('en')
      const holiday = this.filterHolidays.find((day: HolidayInterface) => {
        const holidayDate = DateTime.fromISO(day.holidayDate as string, { zone: 'utc' }).setLocale('en')
        return holidayDate.toFormat('yyyy-MM-dd') === compareDay.toFormat('yyyy-MM-dd')
      })

      return holiday
    },
    firstWeekDay(monthNumber: number, weekDayNumber: number, iweekDayNumber: number) {
      let day = 0
      let holiday = null
      let holidayIcon = ''

      if (this.getMonthInfo(monthNumber).firstWeekDay === 7) {
        day = iweekDayNumber + 1
        holiday = this.isHoliday(monthNumber, (iweekDayNumber + 1))
        holidayIcon = holiday ? holiday.holidayIcon || '' : ''
      } else if (weekDayNumber >= this.getMonthInfo(monthNumber).firstWeekDay && weekDayNumber < 7) {
        day = (weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1
        holiday = this.isHoliday(monthNumber, ((weekDayNumber - this.getMonthInfo(monthNumber).firstWeekDay) + 1))
        holidayIcon = holiday ? holiday.holidayIcon || '' : ''
      }

      return { day: day > 0 ? day : '', holiday, holidayIcon }
    },
    weekDay(monthNumber: number, iweekDayNumber: number) {
      let day = (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1)
      let holiday = this.isHoliday(monthNumber, (7 - this.getMonthInfo(monthNumber).firstWeekDay) + (iweekDayNumber + 1))
      let holidayIcon = holiday ? holiday.holidayIcon || '' : ''

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
    }
  },
})
