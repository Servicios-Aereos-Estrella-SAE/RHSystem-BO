import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import ShiftService from '~/resources/scripts/services/ShiftService';
import AssistService from '~/resources/scripts/services/AssistService';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { ExceptionRequestErrorInterface } from '~/resources/scripts/interfaces/ExceptionRequestErrorInterface';
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService';
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShift',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canManageVacation: { type: Boolean, required: true },
    canManageExceptionRequest: { type: Boolean, required: true }
  },
  data: () => ({
    isReady: false,
    shiftsList: [] as ShiftInterface[],
    employeeCalendar: [] as AssistDayInterface[],
    vacationPeriod: null as VacationPeriodInterface | null,
    selectedDate: DateTime.now() as DateTime,
    inputSelectedDate: new Date(),
    displayInputCalendar: false as boolean,
    displayCalendar: false,
    drawerShiftExceptions: false,
    drawerShiftException: false,
    selectedExceptionDate: new Date() as Date,
    displaySidebarVacations: false as boolean,
    displaySidebarVacationsManager: false as boolean,
    isDeleted: false as boolean,
    drawershiftExceptionsError: false,
    drawerExceptionRequestsError: false,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>,
    exceptionRequestsError: [] as Array<ExceptionRequestErrorInterface>,
    currentShift: null as ShiftInterface | null
  }),
  setup() {
    const router = useRouter()
    return { router }
  },
  computed: {
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    monthName() {
      const calendarDate = this.selectedDate.setZone('America/Mexico_City').setLocale('en')
      return calendarDate.toFormat('LLLL, y')
    },
    period() {
      const daysList = []

      const start = this.selectedDate.startOf('month')
      const daysInMonth = (start.daysInMonth || 0)

      for (let index = 0; index < daysInMonth; index++) {
        const currentDay = start.plus({ days: index })
        const year = parseInt(currentDay.toFormat('yyyy'))
        const month = parseInt(currentDay.toFormat('LL'))
        const day = parseInt(currentDay.toFormat('dd'))

        daysList.push({
          year,
          month,
          day
        })
      }

      return daysList
    },
    statusForm() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.userVacationFormClosed
    }
  },
  created() {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await Promise.all([
      this.getShifts(),
      this.getEmployeeCalendar()
    ])
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getShifts() {
      const response = await new ShiftService().getFilteredList('', 1, 999999)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftsList = list
    },
    async onSuccessShiftAssigned(employeeShiftResponse: any) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      await this.getEmployeeCalendar()

      this.$toast.add({
        severity: 'success',
        summary: 'Employee shift assigned',
        detail: employeeShiftResponse._data.message,
        life: 5000,
      })

      myGeneralStore.setFullLoader(false)
    },
    async getEmployeeCalendar() {
      this.displayCalendar = false
      const firstDay = this.period[0]
      const lastDay = this.period[this.period.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0
      const assistReq = await new AssistService().index(startDay, endDay, employeeID)
      const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
      this.employeeCalendar = employeeCalendar.length > 0 ? employeeCalendar : this.getFakeEmployeeCalendar()
      const exceptionTypeVacationId = await this.getExceptionTypeVacation()
      if (exceptionTypeVacationId) {
        for await (const day of this.employeeCalendar) {
          const exceptions = day.assist.exceptions.filter(a => a.exceptionTypeId !== exceptionTypeVacationId)
          day.assist.exceptions = exceptions
          if (day.assist.exceptions.length === 0) {
            day.assist.hasExceptions = false
          }
        }
      }
      this.displayCalendar = true
    },
    async getExceptionTypeVacation() {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      const exceptionTypeList = list.filter(item => item.exceptionTypeSlug === 'vacation')
      return exceptionTypeList.length > 0 ? exceptionTypeList[0].exceptionTypeId : null
    },
    async handlerCalendarChange() {
      const calendarDate = DateTime.fromJSDate(this.inputSelectedDate).setZone('America/Mexico_City').setLocale('en')

      if (calendarDate.toFormat('LLLL').toLocaleLowerCase() !== this.selectedDate.toFormat('LLLL').toLocaleLowerCase()) {
        this.selectedDate = calendarDate
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        this.displayInputCalendar = false
        await this.getEmployeeCalendar()
        myGeneralStore.setFullLoader(false)
      }
    },
    async handlerLastMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: -1 }).setZone('America/Mexico_City').setLocale('en')
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    async handlerNextMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: 1 }).setZone('America/Mexico_City').setLocale('en')
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    getFakeEmployeeCalendar() {
      const assistCalendar: AssistDayInterface[] = []

      this.period.forEach((periodDay) => {
        const assistDay: AssistDayInterface = {
          day: `${periodDay.year}-${`${periodDay.month}`.padStart(2, '0')}-${`${periodDay.day}`.padStart(2, '0')}`,
          assist: {
            checkIn: null,
            checkOut: null,
            checkEatIn: null,
            checkEatOut: null,
            dateShift: null,
            dateShiftApplySince: '',
            shiftCalculateFlag: '',
            checkInDateTime: '',
            checkOutDateTime: '',
            checkInStatus: '',
            checkOutStatus: '',
            isFutureDay: false,
            isSundayBonus: false,
            isRestDay: false,
            isVacationDate: false,
            isHoliday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: []
          }
        }

        assistCalendar.push(assistDay)
      })

      return assistCalendar
    },
    handlerDisplayInputDate() {
      this.inputSelectedDate = new Date()
      this.displayInputCalendar = true
    },
    handlerCalendarCancel() {
      this.displayInputCalendar = false
    },
    onClickExceptions(employeeCalendar: AssistDayInterface) {
      this.selectedExceptionDate = DateTime.fromISO(`${employeeCalendar.day}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').toJSDate()
      this.currentShift = employeeCalendar.assist.dateShift
      this.drawerShiftExceptions = true
    },
    onClickException() {
      this.drawerShiftException = true

    },
    onClickVacations() {
      this.displaySidebarVacations = true
    },
    handlerVacationsManager(vacationPeriod: VacationPeriodInterface) {
      this.vacationPeriod = vacationPeriod
      this.displaySidebarVacationsManager = true
    },
    handlerSidebarVacationsClose(vacationPeriod: VacationPeriodInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setUserVacationFormStatus(true)
    },
    async onSave(shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.getShifts()
      await this.getEmployeeCalendar()
      if (shiftExceptionsError.length > 0) {
        this.shiftExceptionsError = shiftExceptionsError
        this.drawershiftExceptionsError = true
        this.drawerShiftExceptions = false
        this.displaySidebarVacationsManager = false
        this.displaySidebarVacations = false
      }
      myGeneralStore.setFullLoader(false)

      this.isReady = true
    },
    async onSaveExceptionRequest(exceptionRequestsError: Array<ExceptionRequestErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.getShifts()
      await this.getEmployeeCalendar()
      if (exceptionRequestsError.length > 0) {
        this.exceptionRequestsError = exceptionRequestsError
        this.drawerExceptionRequestsError = true
        this.drawerShiftException = false
      }
      myGeneralStore.setFullLoader(false)
      this.isReady = true
    },
    confirm() {
      this.drawershiftExceptionsError = false
    }
  }
})