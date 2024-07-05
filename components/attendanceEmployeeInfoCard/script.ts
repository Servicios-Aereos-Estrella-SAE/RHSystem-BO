import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { EmployeeAssistStatisticInterface } from '~/resources/scripts/interfaces/EmployeeAssistStatisticInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import AssistService from '~/resources/scripts/services/AssistService'

export default defineComponent({
  name: 'attendanceEmployeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeAssistStatisticInterface> | null | undefined, required: false },
    visualizationMode: { type: String, required: false },
    periodSelected: { type: Date, required: false }
  },
  data: () => ({
    employeeCalendar: [] as AssistDayInterface[],
    onTimePercentage: 0 as number,
    onTolerancePercentage: 0 as number,
    onDelayPercentage: 0 as number,
    onFaultPercentage: 0 as number
  }),
  watch: {
    async periodSelected () {
      this.getEmployeeAssistCalendar()
    }
  },
  computed: {
    weeklyStartDay () {
      const daysList =[]

      if (!this.periodSelected) {
        return []
      }

      switch (this.visualizationMode) {
        case 'monthly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('month')
          const daysInMonth = (start.daysInMonth || 0)
          
          for (let index = 0; index < daysInMonth; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        case 'weekly': {
          const date = DateTime.fromJSDate(this.periodSelected)
          const start = date.startOf('week')
          
          for (let index = 0; index < 7; index++) {
            const currentDay = start.plus({ days: index })
            const year = parseInt(currentDay.toFormat('yyyy'))
            const month = parseInt(currentDay.toFormat('LL'))
            const day = parseInt(currentDay.toFormat('dd'))
  
            daysList.push({
              year,
              month,
              day
            })
          }
          break;
        }
        default:
          break;
      }

      return daysList
    },
  },
  async mounted() {
    await this.getEmployeeAssistCalendar()
  },
  methods: {
    async getEmployeeAssistCalendar () {
      const firstDay = this.weeklyStartDay[0]
      const lastDay = this.weeklyStartDay[this.weeklyStartDay.length - 1]
      const startDay = `${firstDay.year}-${`${firstDay.month}`.padStart(2, '0')}-${`${firstDay.day}`.padStart(2, '0')}`
      const endDay = `${lastDay.year}-${`${lastDay.month}`.padStart(2, '0')}-${`${lastDay.day}`.padStart(2, '0')}`
      const employeeID = this.employee?.employee?.employeeId || 0

      try {
        const assistReq = await new AssistService().index(startDay, endDay, employeeID)
        const employeeCalendar = (assistReq.status === 200 ? assistReq._data.data.employeeCalendar : []) as AssistDayInterface[]
        this.employeeCalendar = employeeCalendar
        this.setGeneralData()
      } catch (error) {
      }
    },
    setGeneralData () {
      const totalDays = this.employeeCalendar.filter((assistDate) => !assistDate.assist.isFutureDay).length
      const assists = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'ontime').length
      const rests = this.employeeCalendar.filter((assistDate) => assistDate.assist.isRestDay && !assistDate.assist.isFutureDay).length
      const tolerances = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'tolerance').length
      const delays = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'delay').length
      const faults = this.employeeCalendar.filter((assistDate) => assistDate.assist.checkInStatus === 'fault' && !assistDate.assist.isFutureDay && !assistDate.assist.isRestDay).length
      const totalAvailable = totalDays - rests

      const assist = Math.round((assists / totalAvailable) * 100)
      const tolerance = Math.round((tolerances / totalAvailable) * 100)
      const delay = Math.round((delays / totalAvailable) * 100)
      const fault = Math.round((faults / totalAvailable) * 100)

      this.onTimePercentage = assist
      this.onTolerancePercentage = tolerance
      this.onDelayPercentage = delay
      this.onFaultPercentage = fault

      if (this.employee?.employee) {
        this.$emit('onStatisticsChange', {
          employee: this.employee.employee,
          assistStatistics: {
            onTimePercentage: this.onTimePercentage,
            onTolerancePercentage: this.onTolerancePercentage,
            onDelayPercentage: this.onDelayPercentage,
            onFaultPercentage: this.onFaultPercentage,
          }
        } as EmployeeAssistStatisticInterface)
      }
    }
  }
})