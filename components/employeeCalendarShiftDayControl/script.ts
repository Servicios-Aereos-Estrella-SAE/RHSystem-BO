import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import EmployeeShiftService from '~/resources/scripts/services/EmployeeShiftService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
  },
  name: 'employeeCalendarShiftDayControl',
  props: {
    employeeCalendarAssist: { type: Object as PropType<AssistDayInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    shiftsList: { type: Array as PropType<ShiftInterface[]>, required: true },
    isDeleted: { type: Boolean, required: true },
    canUpdateShift: { type: Boolean, required: true },
    canManageShiftChanges: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
    startDateLimit: { type: Date, required: true }
  },
  data: () => ({
    employeeCalendar: null as AssistDayInterface | null,
    drawerEmployeeShiftForm: false,
    employeeShift: null as EmployeeShiftInterface | null,
    shiftEditSelected: null as AssistDayInterface | null,
    canManagementShift: false,
    sessionUser: null as UserInterface | null,
    isReady: false
  }),
  computed: {
    displayButtonManageShift() {
      let display = false

      if (!this.displayAcceptEditShiftButton && !this.displayCancelEditShiftButton) {
        if (this.canUpdateShift && this.canManagementShift) {
          display = true
        }
      }

      return display
    },
    displayButtonManageExceptions() {
      let display = false

      if (!this.displayAcceptEditShiftButton && !this.displayCancelEditShiftButton) {
        display = true
      }

      return display
    },
    displayButtonManageShiftChanges() {
      if (!this.canManageShiftChanges) {
        return false
      }

      if (!this.displayAcceptEditShiftButton && !this.displayCancelEditShiftButton) {
        if (!this.employeeCalendar?.assist.hasExceptions && !this.employeeCalendar?.assist.isVacationDate && !this.employeeCalendar?.assist.isWorkDisabilityDate) {
          return true
        }
      }

      return false
    },
    displayAcceptEditShiftButton() {
      let display = false

      if (this.drawerEmployeeShiftForm && this.shiftEditSelected && (this.shiftEditSelected.day === this.employeeCalendar?.day)) {
        display = true
      }

      return display
    },
    displayCancelEditShiftButton() {
      let display = false

      if (this.drawerEmployeeShiftForm && this.shiftEditSelected && (this.shiftEditSelected.day === this.employeeCalendar?.day)) {
        display = true
      }

      return display
    }
  },
  created() {
    this.employeeCalendar = JSON.parse(JSON.stringify(this.employeeCalendarAssist)) as AssistDayInterface
  },
  async mounted() {
    this.setSessionUser()
    this.validateAccess()
    this.isReady = true
  },
  methods: {
    setSessionUser() {
      const { data } = useAuth()
      const authUser = data.value as unknown as UserInterface
      this.sessionUser = authUser
    },
    validateAccess() {
      const myGeneralStore = useMyGeneralStore()
      if (myGeneralStore.isRoot) {
        this.canManagementShift = true
      } else {
        this.validateCanUpdateShift()
      }
    },
    validateCanUpdateShift() {
      if (!this.sessionUser) {
        return
      }

      if (!this.employeeCalendarAssist.day) {
        return
      }

      const selectedDate = DateTime.fromISO(this.employeeCalendarAssist.day, { zone: 'utc' }).startOf('day')

      if (!selectedDate.isValid) {
        return
      }

      const startLimit = DateTime.fromJSDate(this.startDateLimit, { zone: 'utc' }).startOf('day')

      if (selectedDate < startLimit) {
        this.canManagementShift = false
        return
      }

      if ((this.employee.employeeId === this.sessionUser.person?.employee?.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        this.canManagementShift = false
        return
      }

      this.canManagementShift = true
    },
    async onSave() {
      if (!this.employeeShift) {
        return false
      }

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      const employeeShiftResponse = await new EmployeeShiftService().store(this.employeeShift)

      if (employeeShiftResponse.status === 201 || employeeShiftResponse.status === 200) {
        this.drawerEmployeeShiftForm = false
        this.employeeShift = null
        this.shiftEditSelected = null

        this.drawerEmployeeShiftForm = false
        myGeneralStore.setFullLoader(false)

        this.$emit('successShiftAssigned', employeeShiftResponse)
      } else {
        let msgError = employeeShiftResponse._data.message
        const severityType = employeeShiftResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Employee shift ${this.employeeShift.employeeShiftId ? 'updated' : 'created'}`,
          detail: msgError,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      }
    },
    handlerShiftForm(calendarDate: AssistDayInterface) {
      const newEmployeeShift: EmployeeShiftInterface = {
        employeeShiftId: null,
        employeeId: this.employee.employeeId,
        shiftId: calendarDate.assist.dateShift?.shiftId || null,
        employeShiftsApplySince: `${calendarDate.day}T00:00:00.000-06:00`,
        employeShiftsCreatedAt: null,
        employeShiftsUpdatedAt: null,
        employeShiftsDeletedAt: null
      }

      this.employeeShift = newEmployeeShift
      this.shiftEditSelected = calendarDate
      this.drawerEmployeeShiftForm = true
    },
    handlerCancelEditShift() {
      this.drawerEmployeeShiftForm = false
      this.employeeShift = null
      this.shiftEditSelected = null
    },
    isNow(day: string) {
      const now = DateTime.now().setZone('UTC-6').setLocale('en').toFormat('yyyy-LL-dd')
      return (day === now)
    },
    getCalendarDayNumber(date: string) {
      const calendarDate = DateTime.fromISO(`${date}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6').setLocale('en')
      return calendarDate.toFormat('dd')
    },
    getCalendarDayName(date: string) {
      const calendarDate = DateTime.fromISO(`${date}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6').setLocale('en')
      return calendarDate.toFormat('cccc')
    },
    getShiftName(shiftName: string) {
      return shiftName//.split('-')[0]
    },
    handlerClickExceptions() {
      this.$emit('clickExceptions', this.employeeCalendar as AssistDayInterface)
    },
    handlerClickShiftChanges() {
      this.$emit('clickShiftChanges', this.employeeCalendar as AssistDayInterface)
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
    }
  },
})
