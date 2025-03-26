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
    shiftList: [] as EmployeeShiftInterface[],
    employeeToSelectedName: '',
    dateTo: ''
  }),
  computed: {
    selectedDate() {
      const day = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').setLocale('en').toFormat('DDDD')
      return day
    }
  },
  watch: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewEmployeeShiftChange = !this.employeeShiftChange.employeeShiftChangeId ? true : false
    if (this.employeeShiftChange.employeeShiftChangeId) {
      const employeeShiftChangeService = new EmployeeShiftChangeService()
      const employeeShiftChangeResponse = await employeeShiftChangeService.show(this.employeeShiftChange.employeeShiftChangeId)

      if (employeeShiftChangeResponse.status === 200) {
        this.currentEmployeeShiftChange = employeeShiftChangeResponse._data.data.employeeShiftChange.employeeShiftChange
      }
      console.log(this.currentEmployeeShiftChange)
      if (this.currentEmployeeShiftChange && this.currentEmployeeShiftChange.employeeShiftChangeDateTo) {
        const currentDate = `${this.currentEmployeeShiftChange.employeeShiftChangeDateTo}`
        console.log(currentDate)
        const newDate = DateTime.fromISO(this.currentEmployeeShiftChange.employeeShiftChangeDateTo.toString(), { setZone: true }).setZone('America/Mexico_City').setLocale('en').toFormat('DDDD')
        console.log(newDate)
        this.dateTo = newDate
      }
      this.employeeToSelectedName = `${this.employeeShiftChange.employeeTo.employeeFirstName} ${this.employeeShiftChange.employeeTo.employeeLastName}`
    } else {
      this.employeeShiftChange.employeeShiftChangeDateFrom = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').setLocale('en').toFormat('yyyy-MM-dd')
      this.currentDate = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').toISO()
      this.employeeShiftChange.employeeIdTo = this.employee.employeeId
    }
    await this.getShifts()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
    if (!this.employeeShiftChange.employeeShiftChangeId) {
      this.handleTypeChange()
    }
  },
  methods: {
    async getShifts() {
      const response = await new ShiftService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftList = list
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
        }
      }
    },
    getDate(date: Date) {
      if (!date) {
        return ''
      }
      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerDisplayDateTo() {
      this.displayDateToCalendar = true
      this.setShiftTo()
    },
    handlerDisplayCloseDateTo() {
      this.displayDateToCalendar = false
      this.setShiftTo()
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
      this.employeeShiftChange.shiftIdTo = 0
      if (this.employeeShiftChange.employeeIdTo && this.employeeShiftChange.employeeShiftChangeDateTo) {
        const fullDate = new Date(this.employeeShiftChange.employeeShiftChangeDateTo);

        // Obtener el año, mes y día
        const year = fullDate.getFullYear();
        const month = String(fullDate.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por eso se suma 1
        const day = String(fullDate.getDate()).padStart(2, '0');

        // Formatear la fecha como 'YYYY-MM-DD'
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate)
        const assistReq = await new AssistService().index(formattedDate, formattedDate, this.employeeShiftChange.employeeIdTo)
        const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
        if (employeeCalendar.length > 0) {
          console.log(employeeCalendar[0].assist)
          if (employeeCalendar[0].assist) {
            if (employeeCalendar[0].assist.isRestDay) {
              console.log('es dia de descanso')
              this.employeeShiftChange.employeeShiftChangeDateToIsRestDay = 1
            }
          }
          if (employeeCalendar[0].assist.dateShift?.shiftId) {
            this.employeeShiftChange.shiftIdTo = employeeCalendar[0].assist.dateShift.shiftId
            console.log(this.employeeShiftChange.shiftIdTo)
          }
        }
      }
    },
    onEmployeeToSelect() {
      if (this.selectedEmployee && this.selectedEmployee.employeeCode) {
        this.employeeShiftChange.employeeIdTo = this.selectedEmployee.employeeId
        this.setShiftTo()
      }
    },
  }
})