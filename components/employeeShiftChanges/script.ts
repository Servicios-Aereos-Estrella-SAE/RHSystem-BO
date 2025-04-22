import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import EmployeeShiftChangeService from '~/resources/scripts/services/EmployeeShiftChangeService'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftChange',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    employeeCalendar: {
      type: Object as PropType<AssistDayInterface>, required: true
    },
    canManageChange: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    employeeShiftChangesList: [] as EmployeeShiftChangeInterface[],
    changeTypesList: [
      { label: 'Shift change with employee', value: 'shift change with employee' },
      { label: 'Shift change personal', value: 'shift change personal' },
    ],
    selectedChangeTypeId: null as number | null,
    selectedDate: '' as string,
    employeeShiftChange: null as EmployeeShiftChangeInterface | null,
    drawerEmployeeShiftChangeForm: false,
    drawerEmployeeShiftChangeDelete: false,
    selectedDateTimeDeleted: '' as string | null,
    isDeleted: false,
    drawerEmployeeShiftChangesError: false,
    canManageToPreviousDays: false,
    sessionUser: null as UserInterface | null
  }),
  computed: {
    selectedChangeDate() {
      const day = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale('en').toFormat('DDDD')
      return day
    },
    displayAddButton() {
      if (!this.sessionUser) {
        return false
      }

      if (this.employeeShiftChangesList.length > 0) {
        return false
      }

      if ((this.employee.employeeId === this.sessionUser.person?.employee?.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (!this.isDeleted && this.canManageToPreviousDays && this.canManageChange) {
        return true
      }

      return false
    }
  },
  async mounted() {
    this.isReady = false
    await this.setSessionUser()
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    this.selectedDate = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale('en').toFormat('yyyy-LL-dd')

    await this.getShiftChangeEmployee()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }

    if (myGeneralStore.isRoot || myGeneralStore.isAdmin) {
      this.canManageToPreviousDays = true
    } else {
      if (myGeneralStore.isRh) {
        this.canManageToPreviousDays = true
      } else {
        if (this.isDateGreaterOrEqualToToday(this.date.toString())) {
          this.canManageToPreviousDays = true
        }
      }
      if (myGeneralStore.isRh) {
        if (this.isDateAfterOrEqualToFirstDayPeriod()) {
          this.canManageToPreviousDays = true
        } else {
          this.canManageToPreviousDays = false
        }
      }
    }
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
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
    async getShiftChangeEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShiftChangesList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeShiftChangeService = new EmployeeShiftChangeService()
      const employeeShiftChangeResponse = await employeeShiftChangeService.getByEmployee(employeeId, this.selectedDate)
      this.employeeShiftChangesList = employeeShiftChangeResponse.employeeShiftChanges
      if (this.employeeShiftChangesList.length > 1) {
        this.employeeShiftChangesList = [this.employeeShiftChangesList[0]];
      }
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      let employeeShiftChangeDateFromIsRestDay = 0
      if (this.employeeCalendar.assist) {
        if (this.employeeCalendar.assist.isRestDay) {
          employeeShiftChangeDateFromIsRestDay = 1
        }
      }
      const newEmployeeShiftChange: EmployeeShiftChangeInterface = {
        employeeShiftChangeId: null,
        employeeIdFrom: this.employee.employeeId,
        shiftIdFrom: this.shift.shiftId,
        employeeShiftChangeDateFrom: this.selectedDate,
        employeeShiftChangeDateFromIsRestDay: employeeShiftChangeDateFromIsRestDay,
        employeeIdTo: null,
        shiftIdTo: null,
        employeeShiftChangeDateTo: null,
        employeeShiftChangeDateToIsRestDay: 0,
        employeeShiftChangeChangeThisShift: false,
        employeeShiftChangeNote: ''
      }
      this.employeeShiftChange = newEmployeeShiftChange
      this.drawerEmployeeShiftChangeForm = true
    },
    onSave(employeeShiftChange: EmployeeShiftChangeInterface) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShiftChange = { ...employeeShiftChange }
      if (this.employeeShiftChange.shiftChangesDate) {
        const newDate = DateTime.fromISO(this.employeeShiftChange.shiftChangesDate.toString(), { setZone: true }).setZone('UTC-6')
        this.employeeShiftChange.shiftChangesDate = newDate ? newDate.toString() : ''
      }
      const index = this.employeeShiftChangesList.findIndex((employeeShiftChange: EmployeeShiftChangeInterface) => employeeShiftChange.employeeShiftChangeId === this.employeeShiftChange?.shiftChangeId)
      if (index !== -1) {
        this.employeeShiftChangesList[index] = employeeShiftChange
        this.$forceUpdate()
      } else {
        this.employeeShiftChangesList.push(employeeShiftChange)
        this.$forceUpdate()
      }
      this.$emit('saveShiftChanges', [])
      this.drawerEmployeeShiftChangeForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    async onSaveAll(shiftChanges: Array<EmployeeShiftChangeInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      for await (const employeeShiftChange of shiftChanges) {
        this.employeeShiftChange = { ...employeeShiftChange }
        if (this.employeeShiftChange.shiftChangesDate) {
          const newDate = DateTime.fromISO(this.employeeShiftChange.shiftChangesDate.toString(), { setZone: true }).setZone('UTC-6')
          this.employeeShiftChange.shiftChangesDate = newDate ? newDate.toString() : ''
        }
        const index = this.employeeShiftChangesList.findIndex((employeeShiftChange: EmployeeShiftChangeInterface) => employeeShiftChange.employeeShiftChangeId === this.employeeShiftChange?.employeeShiftChangeId)
        if (index !== -1) {
          this.employeeShiftChangesList[index] = employeeShiftChange
          this.$forceUpdate()
        } else {
          this.employeeShiftChangesList.push(employeeShiftChange)
          this.$forceUpdate()
        }

        this.drawerEmployeeShiftChangeForm = false
      }
      this.$emit('save')
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeShiftChange: EmployeeShiftChangeInterface) {
      this.employeeShiftChange = { ...employeeShiftChange }
      this.drawerEmployeeShiftChangeForm = true
    },
    onDelete(employeeShiftChange: EmployeeShiftChangeInterface) {
      this.employeeShiftChange = { ...employeeShiftChange }
      this.selectedDateTimeDeleted = ''
      if (this.employeeShiftChange.shiftChangesDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.employeeShiftChange.shiftChangesDate.toString()).toHTTP()
      }
      this.drawerEmployeeShiftChangeDelete = true
    },

    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeShiftChange) {
        this.drawerEmployeeShiftChangeDelete = false
        const employeeShiftChangeService = new EmployeeShiftChangeService()
        const employeeShiftChangeResponse = await employeeShiftChangeService.delete(this.employeeShiftChange)
        if (employeeShiftChangeResponse.status === 200) {
          const index = this.employeeShiftChangesList.findIndex((employeeShiftChange: EmployeeShiftChangeInterface) => employeeShiftChange.shiftChangeId === this.employeeShiftChange?.shiftChangeId)
          if (index !== -1) {
            this.employeeShiftChangesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$emit('saveShiftChanges', [])
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift change',
            detail: employeeShiftChangeResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})
