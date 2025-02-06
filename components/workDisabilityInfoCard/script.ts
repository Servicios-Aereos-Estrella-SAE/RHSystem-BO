import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface'

export default defineComponent({
  name: 'workDisabilityInfoCard',
  props: {
    workDisability: { type: Object as PropType<WorkDisabilityInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnEditException: { type: Function, default: null },
    clickOnDeleteException: { type: Function, default: null },
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
    handlerClickOnEditException () {
      if (this.clickOnEditException) {
        this.clickOnEditException()
      }
    },
    handlerClickOnDeleteException () {
      if (this.clickOnDeleteException) {
        this.clickOnDeleteException()
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
      if (!this.workDisability.workDisabilityPeriods) {
        return
      }
      const datePay = this.getNextPayThursday();
      const monthPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))

      const date = DateTime.local(yearPeriod, monthPeriod, dayPeriod)
      const startOfWeek = date.startOf('week')
      const thursday = startOfWeek.plus({ days: 3 })
      const start = thursday.minus({ days: 24 })
      const currentDay = start.minus({ days: 1 }).startOf('day').setZone('utc')
      const normalizedCurrentDay = currentDay.startOf('day')
      for await (const workDisabilityPeriod of this.workDisability.workDisabilityPeriods) {
        if (this.canManageCurrentPeriod === false) {
          return
        }

        const startDateISO = workDisabilityPeriod.workDisabilityPeriodStartDate
        const endDateISO = workDisabilityPeriod.workDisabilityPeriodEndDate

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