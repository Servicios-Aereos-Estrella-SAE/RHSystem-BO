import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface'

export default defineComponent({
  name: 'workDisabilityPeriodInfoCard',
  props: {
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
    await this.validateDisabilityDateRange()
  },
  methods: {
    getDate(date: string) {
      const dateWorkDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorkDisabilityPeriod.setLocale('en').toFormat('DDDD')
    },
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    openFile() {
      if (this.workDisabilityPeriod.workDisabilityPeriodFile) {
        window.open(this.workDisabilityPeriod?.workDisabilityPeriodFile)
      }
    },
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
    async validateDisabilityDateRange() {
      const datePay = this.getNextPayThursday();
      const monthPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'));
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'));
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'));

      const date = DateTime.local(yearPeriod, monthPeriod, dayPeriod)
      const startOfWeek = date.startOf('week')
      const thursday = startOfWeek.plus({ days: 3 })
      const start = thursday.minus({ days: 24 })
      const currentDay = start.minus({ days: 1 }).startOf('day').setZone('utc')
      const normalizedCurrentDay = currentDay.startOf('day')

      const startDateISO = this.workDisabilityPeriod.workDisabilityPeriodStartDate
      const endDateISO = this.workDisabilityPeriod.workDisabilityPeriodEndDate

      if (!startDateISO || !endDateISO) {
        return
      }

      const currentDate = DateTime.fromISO(startDateISO, { zone: 'utc' }).startOf('day')
      const endDate = DateTime.fromISO(endDateISO, { zone: 'utc' }).startOf('day')

      if (!currentDate.isValid || !endDate.isValid || !normalizedCurrentDay.isValid) {
        console.error('Date invalid', {
          currentDate: currentDate.invalidExplanation,
          endDate: endDate.invalidExplanation,
          currentDay: normalizedCurrentDay.invalidExplanation,
        })
        return
      }

      for await (const dateRange of this.iterateDates(currentDate, endDate)) {
        const normalizedDateRange = dateRange.startOf('day')
        if (normalizedDateRange < normalizedCurrentDay) {
          this.canManageCurrentPeriod = false
          return
        }
      }
    },
    async *iterateDates(startDate: DateTime, endDate: DateTime) {
      while (startDate <= endDate) {
        yield startDate
        startDate = startDate.plus({ days: 1 })
      }
    }
  }
})