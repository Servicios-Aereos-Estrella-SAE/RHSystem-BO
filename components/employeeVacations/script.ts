import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
  },
  name: 'employeeVacations',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    statusForm: { type: Boolean, required: false, default: false }
  },
  data: () => ({
    isReady: false as boolean,
    vacationPeriods: [] as Array<VacationPeriodInterface>
  }),
  watch: {
    async 'statusForm'(value) {
      this.isReady = false
      await this.getPeriods()
      this.isReady = true
    }
  },
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.getPeriods()
    this.isReady = true
  },
  methods: {
    async getPeriods() {
      this.vacationPeriods = []
      if (this.employee.employeeId && this.employee.employeeHireDate) {
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getYearsWorked(this.employee.employeeId, null)
        if (employeeResponse.status === 200) {
          const years = employeeResponse._data.data.yearsWorked
          const start = DateTime.fromISO(this.employee.employeeHireDate.toString())
          const month = start.month.toString().padStart(2, '0')
          const day = start.day.toString().padStart(2, '0')
          for await (const year of years) {
            if (year.vacationSetting) {
              const correspondingDays = year.vacationSetting.vacationSettingVacationDays
              const usedDays = year.vacationsUsedList.length
              const availableDays = correspondingDays - usedDays
              const vacationPeriod = {
                vacationPeriodRange: this.formatDateWithYearDifference(`${year.year}-${month}-${day}`),
                vacationSettingId: year.vacationSetting.vacationSettingId,
                vacationPeriodYear: year.year,
                vacationPeriodActiveWorkYears: year.yearsPassed,
                vacationPeriodCorrespondingDays: correspondingDays,
                vacationPeriodUsedDays: usedDays,
                vacationPeriodAvailableDays: availableDays
              } as VacationPeriodInterface
              this.vacationPeriods.push(vacationPeriod)
            }
          }
        }
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setUserVacationFormStatus(false)
    },
    handlerClickManage(vacationPeriod: VacationPeriodInterface) {
      this.$emit('manageVacations', vacationPeriod)
    },
    formatDateWithYearDifference(date: string) {
      const originalDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
      const nextYearDate = originalDate.plus({ years: 1 })

      const formattedOriginalDate = originalDate.toFormat('MMMM dd, yyyy')
      const formattedNextYearDate = nextYearDate.toFormat('MMMM dd, yyyy')

      return `${formattedOriginalDate} - ${formattedNextYearDate}`
    }
  }
})