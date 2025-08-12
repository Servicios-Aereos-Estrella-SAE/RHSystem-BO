import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { DateTime } from 'luxon';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface';
import EmployeeShiftChangeService from '~/resources/scripts/services/EmployeeShiftChangeService';
import EmployeeService from '~/resources/scripts/services/EmployeeService';
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface';
import ShiftService from '~/resources/scripts/services/ShiftService';
import AssistService from '~/resources/scripts/services/AssistService';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeShiftChangeForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    employeeShiftChange: { type: Object as PropType<EmployeeShiftChangeInterface>, required: true },
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    submitted: false,
    currentEmployeeShiftChange: null as EmployeeShiftChangeInterface | null,
    isNewEmployeeShiftChange: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
    minDate: DateTime.fromISO('2000-10-10').toJSDate(),
    changeTypesList: [
      { label: 'Shift change with employee', value: 'shift change with employee' },
      { label: 'Shift change personal', value: 'shift change personal' },
    ],
    changeType: 'shift change personal',
    isPersonal: false,
    displayDateToCalendar: false as boolean,
    selectedEmployee: null as EmployeeInterface | null,
    filteredEmployees: [] as EmployeeInterface[],
    shiftList: [] as ShiftInterface[],
    dateRestDayFrom: 'Work day' as string,
    employeeToSelectedName: '' as string,
    dateTo: '' as string,
    dateRestDayTo: '' as string,
    startDateLimit: DateTime.local(1999, 12, 29).toJSDate(),
    employeeShiftChangeChangeThisShift: false,
    shiftTemp: null as ShiftInterface | null,
    drawerShiftForm: false,
    canCreateShift: false,
  }),
  computed: {
    selectedDate() {
      const day = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale('en').toFormat('DDDD')
      return day
    }
  },
  watch: {
    'employeeShiftChange.employeeShiftChangeDateTo'(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!this.employeeShiftChange.employeeShiftChangeId) {
          this.setShiftTo();
        }
      }
    },
    'employeeShiftChange.employeeShiftChangeChangeThisShift'(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.employeeShiftChange.employeeShiftChangeChangeThisShift) {
          this.displayDateToCalendar = false
          this.changeType = 'shift change personal'
          this.employeeShiftChange.employeeShiftChangeDateTo = this.date
          this.employeeShiftChange.employeeIdTo = this.employee.employeeId
          this.selectedEmployee = this.employee
          if (!this.employeeShiftChange.employeeShiftChangeId) {
            this.employeeShiftChange.shiftIdTo = null
            this.setShiftTo();
          }
        }
      }
    },
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    if (!myGeneralStore.isRoot) {
      this.getStartPeriodDay()
    }
    this.isNewEmployeeShiftChange = !this.employeeShiftChange.employeeShiftChangeId ? true : false
    if (this.employeeShiftChange.employeeShiftChangeDateFromIsRestDay === 1) {
      this.dateRestDayFrom = 'Rest day'
    }
    if (this.employeeShiftChange.employeeShiftChangeId) {
      const employeeShiftChangeService = new EmployeeShiftChangeService()
      const employeeShiftChangeResponse = await employeeShiftChangeService.show(this.employeeShiftChange.employeeShiftChangeId)

      if (employeeShiftChangeResponse.status === 200) {
        this.currentEmployeeShiftChange = employeeShiftChangeResponse._data.data.employeeShiftChange.employeeShiftChange
      }
      if (this.currentEmployeeShiftChange && this.currentEmployeeShiftChange.employeeShiftChangeDateTo) {
        const newDate = DateTime.fromISO(this.currentEmployeeShiftChange.employeeShiftChangeDateTo.toString(), { setZone: true }).setZone('UTC-6').setLocale('en').toFormat('DDDD')
        this.dateTo = newDate
      }
      this.employeeToSelectedName = `${this.employeeShiftChange.employeeTo.person?.personFirstname} ${this.employeeShiftChange.employeeTo.person?.personLastname} ${this.employeeShiftChange.employeeTo.person?.personSecondLastname}`
      if (this.employeeShiftChange.employeeShiftChangeDateToIsRestDay === 1) {
        this.dateRestDayTo = 'Rest day'
      } else {
        this.dateRestDayTo = 'Work day'
      }
      if (this.employeeShiftChange.employeeShiftChangeChangeThisShift) {
        this.employeeShiftChange.employeeShiftChangeChangeThisShift = true
      }
    } else {
      this.employeeShiftChange.employeeShiftChangeDateFrom = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale('en').toFormat('yyyy-MM-dd')
      this.currentDate = DateTime.fromJSDate(this.date).setZone('UTC-6').toISO()
      this.employeeShiftChange.employeeIdTo = this.employee.employeeId
    }
    await this.getShifts()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
    if (!this.employeeShiftChange.employeeShiftChangeId) {
      this.handleTypeChange()
    }

    const systemModuleSlug = 'shifts'
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)
    if (myGeneralStore.isRoot) {
      this.canCreateShift = true
    } else {
      this.canCreateShift = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
    }

  },
  methods: {
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
      const myGeneralStore = useMyGeneralStore()
      if (myGeneralStore.isAdmin || myGeneralStore.isRh) {
        const datePay = this.getNextPayThursday()
        const payDate = DateTime.fromJSDate(datePay).startOf('day')
        const startOfWeek = payDate.minus({ days: payDate.weekday % 7 })
        const thursday = startOfWeek.plus({ days: 3 })
        const startLimit = thursday.minus({ days: 24 }).startOf('day').setZone('local')
        this.startDateLimit = startLimit.toJSDate()
      } else {
        this.startDateLimit = DateTime.now().toJSDate()
      }

    },
    async getShifts() {
      const response = await new ShiftService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftList = list
      if (this.employeeShiftChange.shiftIdTo) {
        const existShift = this.shiftList.find(a => a.shiftId === this.employeeShiftChange.shiftIdTo)
        if (!existShift) {
          const shiftResponse = await new ShiftService().show(this.employeeShiftChange.shiftIdTo)
          if (shiftResponse?.status === 200) {
            this.shiftList.push(shiftResponse._data.data.shift)
          }
        }
      }

    },
    async onSave() {
      this.submitted = true
      const employeeShiftChangeService = new EmployeeShiftChangeService()

      if (!employeeShiftChangeService.validateInfo(this.employeeShiftChange)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.employeeShiftChange.employeeShiftChangeChangeThisShift) {
        if (this.employeeShiftChange.shiftIdFrom === this.employeeShiftChange.shiftIdTo && this.dateRestDayFrom !== 'Rest day') {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: `If the change is for the same day and it's a rest day, the shift must be different.`,
            life: 5000,
          })
          return
        }
      }

      const employeeShiftChangeCheckInTimeTemp = this.employeeShiftChange.employeeShiftChangeCheckInTime
      const employeeShiftChangeCheckOutTimeTemp = this.employeeShiftChange.employeeShiftChangeCheckOutTime

      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let employeeShiftChangeResponse = null
      const employeeShiftChangeDateTemp = this.employeeShiftChange.employeeShiftChangesDate

      if (!this.employeeShiftChange.employeeShiftChangeId) {
        employeeShiftChangeResponse = await employeeShiftChangeService.store(this.employeeShiftChange)
      }

      if (employeeShiftChangeResponse.status === 201) {
        employeeShiftChangeResponse = await employeeShiftChangeService.show(employeeShiftChangeResponse._data.data.employeeShiftChange.employeeShiftChangeId)
        if (employeeShiftChangeResponse.status === 200) {
          const employeeShiftChange = employeeShiftChangeResponse._data.data.employeeShiftChange.employeeShiftChange
          this.$emit('onShiftChangeSave', employeeShiftChange as EmployeeShiftChangeInterface)
        }
      } else {
        const msgError = employeeShiftChangeResponse._data.error ? employeeShiftChangeResponse._data.error : employeeShiftChangeResponse._data.message
        const severityType = employeeShiftChangeResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Shift change ${this.employeeShiftChange.employeeShiftChangeId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.employeeShiftChange.employeeShiftChangeCheckInTime = employeeShiftChangeCheckInTimeTemp
      this.employeeShiftChange.employeeShiftChangeCheckOutTime = employeeShiftChangeCheckOutTimeTemp
      this.employeeShiftChange.employeeShiftChangesDate = employeeShiftChangeDateTemp
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    },
    handleTypeChange() {
      if (this.isReady) {
        if (this.changeType === 'shift change personal') {
          this.isPersonal = true
          this.employeeShiftChange.employeeIdTo = this.employee.employeeId
          this.setShiftTo()
        } else {
          this.isPersonal = false
          this.employeeShiftChange.employeeIdTo = null
          this.selectedEmployee = null
          this.setShiftTo()
        }
      }
    },
    getDate(date: Date) {
      if (!date) {
        return ''
      }
      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerDisplayDateTo() {
      this.displayDateToCalendar = true
    },
    handlerDisplayCloseDateTo() {
      this.displayDateToCalendar = false
    },
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30, false, null)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    async setShiftTo() {
      this.employeeShiftChange.employeeShiftChangeDateToIsRestDay = 0
      this.employeeShiftChange.shiftIdTo = null
      this.dateRestDayTo = 'Work day'
      if (this.employeeShiftChange.employeeIdTo && this.employeeShiftChange.employeeShiftChangeDateTo) {
        const fullDate = new Date(this.employeeShiftChange.employeeShiftChangeDateTo);

        const year = fullDate.getFullYear()
        const month = String(fullDate.getMonth() + 1).padStart(2, '0')
        const day = String(fullDate.getDate()).padStart(2, '0')

        const formattedDate = `${year}-${month}-${day}`
        const assistReq = await new AssistService().index(formattedDate, formattedDate, this.employeeShiftChange.employeeIdTo)
        const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
        if (employeeCalendar.length > 0) {
          if (employeeCalendar[0].assist) {
            if (employeeCalendar[0].assist.isVacationDate) {
              this.dateRestDayTo = 'Vacation day'
              this.$toast.add({
                severity: 'warn',
                summary: 'Vacation day',
                detail: 'The date to is vacation day',
                life: 5000,
              })
              return
            }
            if (employeeCalendar[0].assist.hasExceptions) {
              this.dateRestDayTo = 'Exception day'
              this.$toast.add({
                severity: 'warn',
                summary: 'Shift exception day',
                detail: 'The date to has shift exception',
                life: 5000,
              })
              return
            }
            if (employeeCalendar[0].assist.isRestDay && !this.employeeShiftChange.employeeShiftChangeChangeThisShift) {
              this.employeeShiftChange.employeeShiftChangeDateToIsRestDay = 1
              this.dateRestDayTo = 'Rest day'
            }
          }
          if (employeeCalendar[0].assist.dateShift?.shiftId) {
            this.employeeShiftChange.shiftIdTo = employeeCalendar[0].assist.dateShift.shiftId
          }
        } else {
          this.$toast.add({
            severity: 'warn',
            summary: 'Shift not found',
            detail: 'The shift was not found with the date',
            life: 5000,
          })
          return
        }
      }
    },
    onEmployeeToSelect() {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.employeeShiftChange.employeeIdTo = this.selectedEmployee.employeeId
        this.setShiftTo()
      }
    },
    addNewShift() {
      const newShift: ShiftInterface = {
        employees: [],
        shiftId: null,
        shiftName: "",
        shiftDayStart: 0,
        shiftTimeStart: "",
        shiftActiveHours: 0,
        shiftRestDays: "",
        shiftAccumulatedFault: 1,
        shiftCreatedAt: null,
        shiftUpdatedAt: null,
        shiftDeletedAt: null,
        employee_count: undefined,
        shiftTemp: 1,
      }
      this.shiftTemp = newShift
      this.drawerShiftForm = true
    },
    onSaveShift(shift: ShiftInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftTemp = { ...shift }
      const index = this.shiftList.findIndex((s: ShiftInterface) => s.shiftId === this.shiftTemp?.shiftId)
      if (index !== -1) {
        this.shiftList[index] = shift
        this.$forceUpdate()
      } else {
        this.shiftList.unshift(shift)
        this.$forceUpdate()
      }
      this.employeeShiftChange.shiftIdTo = this.shiftTemp.shiftId
      myGeneralStore.setFullLoader(false)
      this.drawerShiftForm = false
    }
  }
})
