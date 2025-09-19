import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import HolidayService from '../../resources/scripts/services/HolidayService'
import { useMyGeneralStore } from '~/store/general'
import { DateTime, type DateObjectUnits } from 'luxon'
import type { CalendarDayMarkerInterface } from '~/resources/scripts/interfaces/CalendarDayMarkerInterface'

export default defineComponent({
  name: 'Holidays',
  props: {},
  data: () => ({
    date: new Date(),
    firstDate: null as string | null,
    lastDate: null as string | null,
    filterHolidays: [] as HolidayInterface[],
    calendarHolidays: [] as CalendarDayMarkerInterface[],
    holiday: null as HolidayInterface | null,
    search: '',
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 20,

    periodSelected: new Date() as Date | null,

    holidayService: new HolidayService(),
    drawerHolidayForm: false as boolean,
    canCreate: false as boolean,
    canUpdate: false as boolean,
    canDelete: false as boolean,
    isReady: false as boolean,
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
    async verifyPermissions() {
      const myGeneralStore = useMyGeneralStore()
      const systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").toString().replaceAll('/', '')
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

      // Convert holidays to calendar markers
      this.convertHolidaysToCalendarMarkers()
    },
    convertHolidaysToCalendarMarkers() {
      this.calendarHolidays = this.filterHolidays.map(holiday => {
        const holidayDate = DateTime.fromISO(holiday.holidayDate.toString())
        return {
          date: holidayDate.toISO() as string,
          icon: holiday.holidayIcon || '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="#fff0b8" class="fil-FCD751"></path><path d="M11.08 14.817c.413.413.826.826 1.227 1.227.424.424.909.788 1.448 1.092.545.306 1.216.41 1.833.269a4.536 4.536 0 0 0 .822-.243c.336-.127.646-.32.935-.544.562-.434 1.04-.984 1.53-1.475a8.624 8.624 0 0 0 1.353-1.538c.1-.153.19-.315.261-.485.065-.158.112-.322.14-.49.032-.183.025-.373.016-.557a5.847 5.847 0 0 0-.109-.812 9.394 9.394 0 0 0-.574-1.831 11.932 11.932 0 0 0-.893-1.702c-.368-.59-.8-1.14-1.294-1.635-.252-.251-.512-.485-.806-.674-.162-.106-.331-.196-.505-.282a5.088 5.088 0 0 0-1.1-.397 4.076 4.076 0 0 0-.992-.066 3.33 3.33 0 0 0-1.045.234c-.34.133-.638.356-.935.567-.33.236-.645.494-.948.769-.309.28-.608.573-.897.878a18.167 18.167 0 0 0-1.599 1.917c-.46.637-.863 1.311-1.173 2.025-.31.709-.526 1.47-.603 2.245-.038.387-.038.777.015 1.161.05.362.146.718.293 1.053.153.35.373.673.645.945.288.288.635.498 1.016.63.406.143.853.185 1.273.109.408-.073.778-.24 1.1-.458.33-.222.624-.499.897-.772l.17-.17Z" fill="#faaf00" class="fil-E42C07"></path><path d="M14.94 9.999a.75.75 0 0 1 0 1.5.75.75 0 0 1 0-1.5Zm-3-1a.75.75 0 0 1 0 1.5.75.75 0 0 1 0-1.5Zm-3-1a.75.75 0 0 1 0 1.5.75.75 0 0 1 0-1.5Z" fill="#88a4bf" class="fill-212121"></path></svg>',
          quantity: 1
        }
      })
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
      } else {
        this.filterHolidays.push(holiday)
      }
      // Update calendar markers after saving
      this.convertHolidaysToCalendarMarkers()
      this.drawerHolidayForm = false
    },
    onDayClick({ year, month, day }: { year: number, month: number, day: number }) {
      // Find if there's a holiday on this day
      const holidayDate = DateTime.fromObject({ year, month, day })
      const foundHoliday = this.filterHolidays.find(holiday => {
        const date = DateTime.fromISO(holiday.holidayDate.toString()).setZone('UTC')
        return date.hasSame(holidayDate, 'day')
      }) || null

      this.onEdit(foundHoliday, month, day)
    },
    onEdit(holiday: HolidayInterface | null, month: number, day: number) {
      if (day) {
        let holidayObj: HolidayInterface

        if (!holiday) {
          holidayObj = {
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
        } else {
          holidayObj = holiday
        }

        this.holiday = { ...holidayObj }
        this.drawerHolidayForm = true
      }
    },
    async confirmDelete(holiday: HolidayInterface) {
      if (this.holiday) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const holidayResponse = await this.holidayService.delete(this.holiday)
        if (holidayResponse.status === 201 || holidayResponse.status === 200) {
          const holidayIdToDelete = this.holiday.holidayId

          this.drawerHolidayForm = false
          this.holiday = null

          const index = this.filterHolidays.findIndex(
            (h: HolidayInterface) => h.holidayId === holidayIdToDelete
          )

          if (index !== -1) {
            this.filterHolidays = [...this.filterHolidays.slice(0, index), ...this.filterHolidays.slice(index + 1)]
            this.convertHolidaysToCalendarMarkers()
          }

          this.$toast.add({
            severity: 'success',
            summary: 'Delete holiday',
            detail: holidayResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete holiday',
            detail: holidayResponse._data.message,
            life: 5000,
          })
        }
        myGeneralStore.setFullLoader(false)
      }
    }
  }
})
