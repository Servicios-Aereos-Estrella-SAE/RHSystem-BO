import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
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
  },
  data: () => ({
    employeeCalendar: null as AssistDayInterface | null,
    drawerEmployeeShiftForm: false,
    employeeShift: null as EmployeeShiftInterface | null,
    shiftEditSelected: null as AssistDayInterface | null
  }),
  computed: {
  },
  created () {
    this.employeeCalendar = JSON.parse(JSON.stringify(this.employeeCalendarAssist)) as AssistDayInterface
  },
  mounted() {
  },
  methods: {
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
    handlerShiftForm (calendarDate: AssistDayInterface) {
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
    handlerCancelEditShift () {
      this.drawerEmployeeShiftForm = false
      this.employeeShift = null
      this.shiftEditSelected = null
    },
    isNow (day: string) {
      const now = DateTime.now().setZone('America/Mexico_City').setLocale('en').toFormat('yyyy-LL-dd')
      return (day === now)
    },
    getCalendarDayNumber (date: string) {
      const calendarDate = DateTime.fromISO(`${date}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').setLocale('en')
      return calendarDate.toFormat('dd')
    },
    getCalendarDayName (date: string) {
      const calendarDate = DateTime.fromISO(`${date}T00:00:00.000-06:00`, { setZone: true }).setZone('America/Mexico_City').setLocale('en')
      return calendarDate.toFormat('cccc')
    },
    getShiftName (shiftName: string) {
      return shiftName//.split('-')[0]
    },
    handlerClickExceptions () {
      this.$emit('clickExceptions', this.employeeCalendar as AssistDayInterface)
    }
  },
})