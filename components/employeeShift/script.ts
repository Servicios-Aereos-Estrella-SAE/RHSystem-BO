import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import ShiftService from '~/resources/scripts/services/ShiftService';
import EmployeeShiftService from '~/resources/scripts/services/EmployeeShiftService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShift',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    employeeShiftsList: [] as EmployeeShiftInterface[],
    shiftsList: [] as ShiftInterface[],
    selectedShiftId: null as number | null,
    selectedDateRange: ref(null),
    selectedDateStart: '' as string | null,
    selectedDateEnd: '' as string | null,
    employeeShift: null as EmployeeShiftInterface | null,
    employeeShiftActiveId: 0 as number | null,
    drawerEmployeeShiftForm: false,
    drawerEmployeeShiftDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getShifts()
    await this.getShiftActive()
    await this.getEmployeeShift()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async handleDateChange(e: any) {
      this.selectedDateStart = null
      this.selectedDateEnd = null
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      try {
        const selectedDate = e
        if (selectedDate && selectedDate.length === 2) {
          const [startDate, endDate] = selectedDate
          const formattedStartDate = startDate.toISOString().split('T')[0]
          const formattedEndDate = endDate.toISOString().split('T')[0]
          this.selectedDateStart = formattedStartDate
          this.selectedDateEnd = formattedEndDate
        }
      } catch (error) {
      }
      myGeneralStore.setFullLoader(false)
      await this.getEmployeeShift()
    },
    async getEmployeeShift() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShiftsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeShiftService = new EmployeeShiftService()
      const employeeShiftResponse = await employeeShiftService.getByEmployee(employeeId, this.selectedShiftId, this.selectedDateStart,this.selectedDateEnd)
      this.employeeShiftsList = employeeShiftResponse.employeeShifts
      const index = this.employeeShiftsList.findIndex((employeeShift: EmployeeShiftInterface) => employeeShift.employeeShiftId === this.employeeShiftActiveId)
      if (index !== -1) {
        this.employeeShiftsList[index].isActive = true
        this.$forceUpdate()
      }
      myGeneralStore.setFullLoader(false)
    },
    async getShifts() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new ShiftService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftsList = list
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newEmployeeShift: EmployeeShiftInterface = {
        employeeShiftId: null,
        employeeId: this.employee.employeeId,
        shiftId: null,
        employeShiftsApplySince: '',
        employeShiftsCreatedAt: null,
        employeShiftsUpdatedAt: null,
        employeShiftsDeletedAt: null
      }
      this.employeeShift = newEmployeeShift
      this.drawerEmployeeShiftForm = true
    },
    async onSave(employeeShift: EmployeeShiftInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShift = {...employeeShift}
      if (this.employeeShift.employeShiftsApplySince) {
        const newDate = DateTime.fromISO(this.employeeShift.employeShiftsApplySince.toString(), { setZone: true }).setZone('America/Mexico_City')
        this.employeeShift.employeShiftsApplySince = newDate ? newDate.toString() : ''
      }
      const index = this.employeeShiftsList.findIndex((employeeShift: EmployeeShiftInterface) => employeeShift.employeeShiftId === this.employeeShift?.employeeShiftId)
      if (index !== -1) {
        this.employeeShiftsList[index] = employeeShift
        this.$forceUpdate()
      } else {
        this.employeeShiftsList.push(employeeShift)
        this.$forceUpdate()
      }
      await this.getShiftActive()
      this.drawerEmployeeShiftForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeShift: EmployeeShiftInterface) {
      this.employeeShift = {...employeeShift}
      this.drawerEmployeeShiftForm = true
    },
    onDelete(employeeShift: EmployeeShiftInterface) {
      this.employeeShift = {...employeeShift}
      this.selectedDateTimeDeleted = ''
      if (this.employeeShift.employeShiftsApplySince) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.employeeShift.employeShiftsApplySince.toString()).toHTTP()
      }
      this.drawerEmployeeShiftDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeShift) {
        this.drawerEmployeeShiftDelete = false
        const employeeShiftService = new EmployeeShiftService()
        const employeeShiftResponse = await employeeShiftService.delete(this.employeeShift)
        if (employeeShiftResponse.status === 200) {
          const index = this.employeeShiftsList.findIndex((employeeShift: EmployeeShiftInterface) => employeeShift.employeeShiftId === this.employeeShift?.employeeShiftId)
          if (index !== -1) {
            this.employeeShiftsList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete shift employee',
            detail: employeeShiftResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift employee',
            detail: employeeShiftResponse._data.message,
              life: 5000,
          })
        }
      }
      await this.getShiftActive()
      myGeneralStore.setFullLoader(false)
    },
    async getShiftActive() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShiftActiveId = null
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeShiftService = new EmployeeShiftService()
      const employeeShiftResponse = await employeeShiftService.getShiftActiveByEmployee(employeeId)
      
      if (employeeShiftResponse.employeeShift) {
        this.employeeShiftActiveId = employeeShiftResponse.employeeShift.employeeShiftId || null
        for await (const employeeShift of this.employeeShiftsList) {
          employeeShift.isActive = false
        }
        const index = this.employeeShiftsList.findIndex((employeeShift: EmployeeShiftInterface) => employeeShift.employeeShiftId === this.employeeShiftActiveId)
        if (index !== -1) {
          this.employeeShiftsList[index].isActive = true
          this.$forceUpdate()
        }
      }

      myGeneralStore.setFullLoader(false)
    },
  }
})