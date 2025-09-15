import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftException',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    canManageException: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    shiftExceptionsList: [] as ShiftExceptionInterface[],
    exceptionTypesList: [] as ExceptionTypeInterface[],
    selectedExceptionTypeId: null as number | null,
    selectedDateStart: '' as string,
    selectedDateEnd: '' as string,
    shiftException: null as ShiftExceptionInterface | null,
    drawerShiftExceptionForm: false,
    drawerShiftExceptionDelete: false,
    selectedDateTimeDeleted: '' as string | null,
    isDeleted: false,
    drawershiftExceptionsError: false,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>,
    canManageToPreviousDays: false,
    sessionUser: null as UserInterface | null,
    localeToUse: 'en',
  }),
  computed: {
    selectedExceptionDate() {
      const day = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('DDDD')
      return day
    },
    displayAddButton() {
      if (!this.sessionUser) {
        return false
      }

      if ((this.employee.employeeId === this.sessionUser.person?.employee?.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (!this.isDeleted && this.canManageToPreviousDays && this.canManageException) {
        return true
      }
      return false
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.isReady = false
    await this.setSessionUser()
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    this.selectedDateStart = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('yyyy-LL-dd')
    this.selectedDateEnd = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('yyyy-LL-dd')

    await this.getShiftEmployee()

    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    if (myGeneralStore.isRoot) {
      this.canManageToPreviousDays = true
    } else {
      if (this.isDateAfterOrEqualToStartDay()) {
        this.canManageToPreviousDays = true
      }
    }

    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    isDateAfterOrEqualToStartDay() {
      const { data } = useAuth()

      const authUser = data.value as unknown as UserInterface
      if (authUser.role) {
        if (authUser.role.roleManagementDays === null) {
          return true
        } else if (typeof authUser.role.roleManagementDays === 'number') {
          if (authUser.role.roleManagementDays > 0) {
            const startDateLimit = DateTime.now().minus({ days: authUser.role.roleManagementDays }).toJSDate()
            const inputDate = new Date(this.date.toString())
            startDateLimit.setHours(0, 0, 0, 0)
            return inputDate >= startDateLimit
          } else {
            return false
          }
        }
      }
    },
    async setSessionUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.sessionUser = authUser
    },
    getNextPayThursday() {
      const today = DateTime.now(); // Fecha actual
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      return nextPayDate.toJSDate()
    },
    isDateAfterOrEqualToFirstDayPeriod() {
      const datePay = this.getNextPayThursday()
      const monthPerdiod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))
      let start
      const date = DateTime.local(yearPeriod, monthPerdiod, dayPeriod)
      const startOfWeek = date.startOf('week')
      let thursday = startOfWeek.plus({ days: 3 })
      start = thursday.minus({ days: 24 })
      let currentDay = start
      currentDay = currentDay.minus({ days: 1 })
      return DateTime.fromJSDate(this.date) >= currentDay
    },
    isDateGreaterOrEqualToToday(dateString: string) {
      const inputDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return inputDate >= today
    },
    async getShiftEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftExceptionsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await shiftExceptionService.getByEmployee(employeeId, this.selectedExceptionTypeId, this.selectedDateStart, this.selectedDateEnd)
      this.shiftExceptionsList = shiftExceptionResponse
      const exceptionTypeVacationId = await this.getExceptionTypeBySlug('vacation')
      const exceptionTypeWorkDisabilityId = await this.getExceptionTypeBySlug('falta-por-incapacidad')
      if (exceptionTypeVacationId) {
        this.shiftExceptionsList = this.shiftExceptionsList.filter(a => a.exceptionTypeId !== exceptionTypeVacationId && a.exceptionTypeId !== exceptionTypeWorkDisabilityId)
      }
      myGeneralStore.setFullLoader(false)
    },
    async getExceptionTypeBySlug(type: string) {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      const exceptionTypeList = list.filter(item => item.exceptionTypeSlug === type)
      return exceptionTypeList.length > 0 ? exceptionTypeList[0].exceptionTypeId : null
    },
    addNew() {
      const newShiftException: ShiftExceptionInterface = {
        shiftExceptionId: null,
        employeeId: this.employee.employeeId,
        exceptionTypeId: null,
        shiftExceptionsDescription: '',
        shiftExceptionsDate: '',
        shiftExceptionsCreatedAt: null,
        shiftExceptionsUpdatedAt: null,
        shiftExceptionsDeletedAt: null,
        shiftExceptionCheckInTime: null,
        shiftExceptionCheckOutTime: null,
        daysToApply: 0,
        shiftExceptionEnjoymentOfSalary: null,
        shiftExceptionTimeByTime: null,
        vacationSettingId: null
      }
      this.shiftException = newShiftException
      this.drawerShiftExceptionForm = true
    },
    onSave(shiftException: ShiftExceptionInterface) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftException = { ...shiftException }
      if (this.shiftException.shiftExceptionsDate) {
        const newDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('UTC-6')
        this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
      }
      const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
      if (index !== -1) {
        this.shiftExceptionsList[index] = shiftException
        this.$forceUpdate()
      } else {
        this.shiftExceptionsList.push(shiftException)
        this.$forceUpdate()
      }
      this.$emit('save', [])
      this.drawerShiftExceptionForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    async onSaveAll(shiftExceptions: Array<ShiftExceptionInterface>, shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      for await (const shiftException of shiftExceptions) {
        this.shiftException = { ...shiftException }
        if (this.shiftException.shiftExceptionsDate) {
          const newDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('UTC-6')
          this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
        }
        const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
        if (index !== -1) {
          this.shiftExceptionsList[index] = shiftException
          this.$forceUpdate()
        } else {
          this.shiftExceptionsList.push(shiftException)
          this.$forceUpdate()
        }

        this.drawerShiftExceptionForm = false
      }
      this.$emit('save', shiftExceptionsError)
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEdit(shiftException: ShiftExceptionInterface) {
      this.shiftException = { ...shiftException }
      this.drawerShiftExceptionForm = true
    },
    onDelete(shiftException: ShiftExceptionInterface) {
      this.shiftException = { ...shiftException }
      this.selectedDateTimeDeleted = ''
      if (this.shiftException.shiftExceptionsDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString()).toHTTP()
      }
      this.drawerShiftExceptionDelete = true
    },

    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.shiftException) {
        this.drawerShiftExceptionDelete = false
        const shiftExceptionService = new ShiftExceptionService()
        const shiftExceptionResponse = await shiftExceptionService.delete(this.shiftException)
        if (shiftExceptionResponse.status === 200) {
          const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
          if (index !== -1) {
            this.shiftExceptionsList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$emit('save', [])
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift exception',
            detail: shiftExceptionResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})
