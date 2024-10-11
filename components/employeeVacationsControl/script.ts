import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeVacationsControl',
  props: {
    vacationPeriod: { type: Object as PropType<VacationPeriodInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    shiftExceptions: [] as Array<ShiftExceptionInterface>,
    isReady: false as boolean,
    date: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toJSDate(),
    dateF: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toFormat('DDDD'),
    displayForm: false as boolean
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    if (this.employee.employeeId) {
      const employeeService = new EmployeeService()
      const employeeResponse = await employeeService.getVacationsByPeriod(this.employee.employeeId, this.vacationPeriod.vacationSettingId)
      if (employeeResponse.status === 200) {
       this.shiftExceptions = employeeResponse._data.data.vacations
      }
    }
    
    this.isReady = true
  },
  methods: {
  }
})