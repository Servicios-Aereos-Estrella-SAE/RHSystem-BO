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
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import EmployeeShiftService from '~/resources/scripts/services/EmployeeShiftService';
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface';
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface';
import UserResponsibleEmployeeService from '~/resources/scripts/services/UserResponsibleEmployeeService';
import type { WeekInfoInterface } from '~/resources/scripts/interfaces/WeekInfoInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShift',
  setup() {
    const router = useRouter()
    const { t, locale } = useI18n()
    return {
      t,
      locale,
      router
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canManageVacation: { type: Boolean, required: true },
    canManageExceptionRequest: { type: Boolean, required: true },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
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
    drawerShiftChanges: false,
    drawerShiftException: false,
    selectedExceptionDate: new Date() as Date,
    displaySidebarVacations: false as boolean,
    displaySidebarVacationsManager: false as boolean,
    displaySidebarWorkDisabilities: false as boolean,
    isDeleted: false as boolean,
    drawershiftExceptionsError: false,
    drawerExceptionRequestsError: false,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>,
    exceptionRequestsError: [] as Array<ExceptionRequestErrorInterface>,
    currentShift: null as ShiftInterface | null,
    currentEmployeeCalendar: null as AssistDayInterface | null,
    canManageShiftOrException: true,
    startDateLimit: DateTime.local(2023, 12, 29).toJSDate(),
    canManageShiftChanges: false,
    canManageUserResponsible: false,
    canRemoveShiftAssigned: false,
    drawerCalendarShiftDelete: false,
    employeeCalendarAssist: null as AssistDayInterface | null,
    canSeeReportAssist: false,
    withOutLimitDays: false,
    localeToUse: 'en',
    weeks: [] as WeekInfoInterface[],
    hoursAssignedMonth: 0,
    showWeeksContainer: false
  }),
  computed: {
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    monthName() {
      const calendarDate = this.selectedDate.setZone('UTC-6').setLocale(this.localeToUse)
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
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {


    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await Promise.all([
      this.getStartPeriodDay(),
      this.getShifts(),
      this.getEmployeeCalendar()
    ])
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    const { getSession } = useAuth()
    const session: unknown = await getSession()
    const authUser = session as UserInterface
    if (!myGeneralStore.isRoot && !myGeneralStore.isAdmin && !myGeneralStore.isRh) {
      if (authUser.personId && this.employee) {
        if (authUser.personId === this.employee.personId) {
          this.canManageShiftOrException = false
        }
      }
    }
    if (myGeneralStore.isRoot) {
      this.canManageShiftChanges = true
      this.canRemoveShiftAssigned = true
    } else {
      let systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").toString().replaceAll('/', '')
      if (systemModuleSlug.toString().includes('employees-attendance-monitor')) {
        systemModuleSlug = 'employees'
      }
      this.canManageShiftChanges = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-shift-change')
      this.canRemoveShiftAssigned = await myGeneralStore.hasAccess(systemModuleSlug, 'remove-shift-assigned-to-the-day')
    }
    if (this.employee.employeeId) {
      this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(this.employee.employeeId)
      this.canSeeReportReportAssist(this.employee.employeeId)
    }
    if (this.canManageUserResponsible && !this.canUpdate) {
      this.canManageUserResponsible = false
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
        summary: this.t('employee_shift_assigned'),
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
      const exceptionTypeVacationId = await this.getExceptionTypeBySlug('vacation')
      const exceptionTypeWorkDisabilityId = await this.getExceptionTypeBySlug('falta-por-incapacidad')
      if (exceptionTypeVacationId) {
        for await (const day of this.employeeCalendar) {
          const exceptions = day.assist.exceptions.filter(a => a.exceptionTypeId !== exceptionTypeVacationId)
          day.assist.exceptions = exceptions
          if (day.assist.exceptions.length === 0) {
            day.assist.hasExceptions = false
          }
        }
      }
      if (exceptionTypeWorkDisabilityId) {
        for await (const day of this.employeeCalendar) {
          const exceptions = day.assist.exceptions.filter(a => a.exceptionTypeId !== exceptionTypeWorkDisabilityId)
          day.assist.exceptions = exceptions
          if (day.assist.exceptions.length === 0) {
            day.assist.hasExceptions = false
          }
        }
      }
      this.getHoursAssigned()
      this.displayCalendar = true
    },
    async getHoursAssigned() {
      let hoursAssignedMonth = 0
      this.displayCalendar = false
      const firstDay = this.period[0]
      const lastDay = this.period[this.period.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employeeId || 0

      this.weeks = this.getWeeksInRange(startDay, endDay)
      const start = this.weeks[0].start
      const end = this.weeks[this.weeks.length - 1].end

      const assistReq = await new AssistService().index(start, end, employeeID)
      let employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
      employeeCalendar = employeeCalendar.length > 0 ? employeeCalendar : this.getFakeEmployeeCalendar()
      const exceptionTypeVacationId = await this.getExceptionTypeBySlug('vacation')
      const exceptionTypeWorkDisabilityId = await this.getExceptionTypeBySlug('falta-por-incapacidad')
      if (exceptionTypeVacationId) {
        for await (const day of employeeCalendar) {
          const assist = day.assist
          const dateShift = assist?.dateShift

          if (
            dateShift &&
            !dateShift.shiftIsChange &&
            !assist.isRestDay &&
            !assist.isVacationDate &&
            !assist.isWorkDisabilityDate &&
            !(assist.isHoliday && assist.holiday)
          ) {
            const currentDate = DateTime.fromISO(day.day)

            const existWeek = this.weeks.find((week) => {
              const weekStart = DateTime.fromISO(week.start);
              const weekEnd = DateTime.fromISO(week.end);
              return currentDate >= weekStart && currentDate <= weekEnd;
            })
            if (existWeek) {
              existWeek.hours += parseFloat(dateShift.shiftActiveHours.toString())
            }
            hoursAssignedMonth += parseFloat(dateShift.shiftActiveHours.toString())
          }
          const exceptions = day.assist.exceptions.filter(a => a.exceptionTypeId !== exceptionTypeVacationId)
          day.assist.exceptions = exceptions
          if (day.assist.exceptions.length === 0) {
            day.assist.hasExceptions = false
          }
        }
      }
      this.hoursAssignedMonth = hoursAssignedMonth
      if (exceptionTypeWorkDisabilityId) {
        for await (const day of this.employeeCalendar) {
          const exceptions = day.assist.exceptions.filter(a => a.exceptionTypeId !== exceptionTypeWorkDisabilityId)
          day.assist.exceptions = exceptions
          if (day.assist.exceptions.length === 0) {
            day.assist.hasExceptions = false
          }
        }
      }
      this.displayCalendar = true
    },
    async getExceptionTypeBySlug(type: string) {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      const exceptionTypeList = list.filter(item => item.exceptionTypeSlug === type)
      return exceptionTypeList.length > 0 ? exceptionTypeList[0].exceptionTypeId : null
    },
    async handlerCalendarChange() {
      const calendarDate = DateTime.fromJSDate(this.inputSelectedDate).setZone('UTC-6').setLocale(this.localeToUse)

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
      this.selectedDate = this.selectedDate.plus({ month: -1 }).setZone('UTC-6').setLocale(this.localeToUse)
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    async handlerNextMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: 1 }).setZone('UTC-6').setLocale(this.localeToUse)
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
            isWorkDisabilityDate: false,
            isHoliday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: [],
            isBirthday: false
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
      this.selectedExceptionDate = DateTime.fromISO(`${employeeCalendar.day}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6').toJSDate()
      this.currentShift = employeeCalendar.assist.dateShift
      this.drawerShiftExceptions = true
    },
    onClickShiftChanges(employeeCalendar: AssistDayInterface) {
      this.selectedExceptionDate = DateTime.fromISO(`${employeeCalendar.day}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6').toJSDate()
      this.currentShift = employeeCalendar.assist.dateShift
      this.drawerShiftChanges = true
      this.currentEmployeeCalendar = employeeCalendar
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
    onClickWorkDisabilities() {
      this.displaySidebarWorkDisabilities = true
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
        this.displaySidebarWorkDisabilities = false
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
    async onSaveShiftChanges() {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.getShifts()
      await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
      this.isReady = true
    },
    confirm() {
      this.drawershiftExceptionsError = false
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
    getStartPeriodDay() {
      const { data } = useAuth()

      const authUser = data.value as unknown as UserInterface
      if (authUser.role) {
        this.withOutLimitDays = false
        if (authUser.role.roleManagementDays === null) {
          this.startDateLimit = DateTime.local(1999, 12, 29).setZone('UTC-6').toJSDate()
          this.withOutLimitDays = true
        } else if (typeof authUser.role.roleManagementDays === 'number') {
          const days = authUser.role.roleManagementDays
          const date = DateTime.now().setZone('UTC-6')
          this.startDateLimit = (days > 0 ? date.minus({ days }) : date).toJSDate()
        }
      }
    },
    onDeleteShift(employeeCalendarAssist: AssistDayInterface) {
      this.employeeCalendarAssist = employeeCalendarAssist
      this.drawerCalendarShiftDelete = true
    },
    async confirmDeleteShift() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeCalendarAssist && this.employeeCalendarAssist.assist.employeeShiftId) {
        this.drawerCalendarShiftDelete = false
        const employeShiftService = new EmployeeShiftService()
        const employeeShift = {
          employeeShiftId: this.employeeCalendarAssist.assist.employeeShiftId,
        } as EmployeeShiftInterface
        const employeeShiftResponse = await employeShiftService.delete(employeeShift)
        if (employeeShiftResponse.status === 200) {

          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee shift',
            detail: employeeShiftResponse._data.message,
            life: 5000,
          })

          await this.getEmployeeCalendar()
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete employee shift',
            detail: employeeShiftResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)

    },
    async canSeeReportReportAssist(employeeId: number,) {
      let userResponsibleEmployeesList = [] as Array<UserResponsibleEmployeeInterface>
      this.canSeeReportAssist = false
      const myGeneralStore = useMyGeneralStore()
      if (!myGeneralStore.isRoot) {
        myGeneralStore.setFullLoader(true)
        const { data } = useAuth()
        const session: unknown = data.value as unknown as UserInterface
        const authUser = session as UserInterface

        userResponsibleEmployeesList = []
        const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
        const userResponsibleEmployeeResponse = await userResponsibleEmployeeService.getByEmployee(employeeId, authUser.userId)
        userResponsibleEmployeesList = userResponsibleEmployeeResponse.data.data
        if (userResponsibleEmployeesList.length > 0) {
          this.canSeeReportAssist = true
        }
        myGeneralStore.setFullLoader(false)
      } else {
        this.canSeeReportAssist = true
      }
    },
    getWeeksInRange(startDay: string, endDay: string) {
      const start = DateTime.fromISO(startDay)
      const end = DateTime.fromISO(endDay)

      const weeks = [] as WeekInfoInterface[]

      let cursor = start.startOf('week')
      let weekIndex = 1

      while (cursor <= end) {
        const weekStart = cursor
        const weekEnd = cursor.endOf('week')
        //const weekStart = cursor < start ? start : cursor
        //const weekEnd = cursor.endOf('week') > end ? end : cursor.endOf('week')

        weeks.push({
          weekNumber: weekIndex,
          start: weekStart.toISODate() ?? '',
          end: weekEnd.toISODate() ?? '',
          hours: 0,
        })

        cursor = cursor.plus({ weeks: 1 })
        weekIndex++
      }

      return weeks
    },
    getDateFormatted(date: string) {
      if (!date) {
        return ''
      }

      return DateTime.fromISO(date)
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('DD')
    },
    toggleWeeksContainer() {
      this.showWeeksContainer = !this.showWeeksContainer
    }
  }
})
