import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'

export default defineComponent({
  name: 'employeeShiftInfoCard',
  props: {
    employeeShift: { type: Object as PropType<EmployeeShiftInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
    dateYear () {
      if (!this.employeeShift?.employeShiftsApplySince) {
        return 0
      }

      const year = parseInt(`${this.employeeShift.employeShiftsApplySince.toString().split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.employeeShift.employeShiftsApplySince) {
        return 0
      }

      const month = parseInt(`${this.employeeShift.employeShiftsApplySince.toString().split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.employeeShift.employeShiftsApplySince) {
        return 0
      }

      const day = parseInt(`${this.employeeShift.employeShiftsApplySince.toString().split('-')[2]}`)
      return day
    },
    calendarDay () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('DD')
      return day
    },
    chekInTime () {
      if (!this.employeeShift.employeShiftsApplySince) {
        return ''
      }
      const time = DateTime.fromISO(this.employeeShift.employeShiftsApplySince.toString())
      const timeCST = time.toFormat('HH:mm:ss')
      return timeCST
    }
  },
  mounted() {
    if (this.employeeShift.employeShiftsApplySince) {
      const newDate = DateTime.fromISO(this.employeeShift.employeShiftsApplySince.toString(), { setZone: true }).setZone('America/Mexico_City')
      this.employeeShift.employeShiftsApplySince = newDate ? newDate.toString() : ''
    }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    getRestDaysNames(restDays: string): string {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let daysArray: number[];
      
      if (typeof restDays === 'string') {
        daysArray = restDays.split(',').map(Number);
      } else if (typeof restDays === 'number') {
        daysArray = [restDays];
      } else {
        return '';
      }

      return daysArray.map(day => dayNames[day - 1]).join(', ');
    },
  }
})