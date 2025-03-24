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
    changeType: '',
    isPersonal: false,
    displayDateToCalendar: false as boolean,
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
        this.currentEmployeeShiftChange = employeeShiftChangeResponse._data.data.employeeShiftChange
      }
      /*  if (this.currentEmployeeShiftChange && this.currentEmployeeShiftChange.employeeShiftChangesDate) {
         this.currentDate = `${this.currentEmployeeShiftChange.employeeShiftChangesDate}`
         const newDate = DateTime.fromISO(this.currentEmployeeShiftChange.employeeShiftChangesDate.toString(), { setZone: true }).setZone('America/Mexico_City').toFormat('yyyy-MM-dd HH:mm:ss')
         this.employeeShiftChange.employeeShiftChangesDate = newDate ? newDate.toString() : ''
       } */
    } else {
      this.employeeShiftChange.employeeShiftChangesDate = this.date
      this.currentDate = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').toISO()
      this.employeeShiftChange.employeeShiftChangeEnjoymentOfSalary = null
    }

    myGeneralStore.setFullLoader(false)
    this.isReady = true
    if (this.employeeShiftChange.employeeShiftChangeId) {
      this.handleTypeChange()
    }
  },
  methods: {
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
          const employeeShiftChange = employeeShiftChangeResponse._data.data.employeeShiftChange
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
        } else {
          this.isPersonal = false
        }
      }
    },
  }
})