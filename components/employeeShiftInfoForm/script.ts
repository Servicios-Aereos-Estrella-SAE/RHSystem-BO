import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { DateTime } from 'luxon'
import { useMyGeneralStore } from '~/store/general'
import ShiftService from '~/resources/scripts/services/ShiftService'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'
import EmployeeShiftService from '~/resources/scripts/services/EmployeeShiftService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeShiftForm',
  props: {
    employeeShift: { type: Object as PropType<EmployeeShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    shiftList: [] as EmployeeShiftInterface[],
    submitted: false,
    currentEmployeeShift: null as EmployeeShiftInterface | null,
    isNewEmployeeShift: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewEmployeeShift = !this.employeeShift.employeeShiftId ? true : false
    if (this.employeeShift.employeeShiftId) {
      const employeeShiftService = new EmployeeShiftService()
      const employeeShiftResponse = await  employeeShiftService.show(this.employeeShift.employeeShiftId)
      if (employeeShiftResponse.status === 200) {
        this.currentEmployeeShift = employeeShiftResponse._data.data.employeeShift
      }
      if (this.currentEmployeeShift && this.currentEmployeeShift.employeShiftsApplySince) {
        this.currentDate = `${this.currentEmployeeShift.employeShiftsApplySince}`
        const newDate = DateTime.fromISO(this.currentEmployeeShift.employeShiftsApplySince.toString(), { setZone: true }).setZone('America/Mexico_City').toFormat('yyyy-MM-dd')
        this.employeeShift.employeShiftsApplySince = newDate ? newDate.toString() : ''
      }
    }
    await this.getShifts()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getShifts() {
      const response = await new ShiftService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftList = list
    },
    async onSave() {
      this.submitted = true
      const employeeShiftService = new EmployeeShiftService()
      if (!employeeShiftService.validateInfo(this.employeeShift)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let employeeShiftResponse = null
      const employeeShiftDateTemp = this.employeeShift.employeShiftsApplySince
      if (!this.dateWasChange) {
        this.employeeShift.employeShiftsApplySince = this.currentDate
      }
      if (!this.employeeShift.employeeShiftId) {
        employeeShiftResponse = await employeeShiftService.store(this.employeeShift)
      } else {
        employeeShiftResponse = await employeeShiftService.update(this.employeeShift)
      }
      if (employeeShiftResponse.status === 201 || employeeShiftResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Employee shift ${this.employeeShift.employeeShiftId ? 'updated' : 'created'}`,
          detail: employeeShiftResponse._data.message,
            life: 5000,
        })
        employeeShiftResponse = await  employeeShiftService.show(employeeShiftResponse._data.data.employeeShiftId)
        if (employeeShiftResponse.status === 200) {
          const employeeShift = employeeShiftResponse._data.data.employeeShift
          myGeneralStore.setFullLoader(false)
          this.$emit('onEmployeeShiftSave', employeeShift as EmployeeShiftInterface)
        }
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
      this.employeeShift.employeShiftsApplySince = employeeShiftDateTemp
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    }
  }
})