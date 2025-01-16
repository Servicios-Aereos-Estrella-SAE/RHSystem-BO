import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface'

export default defineComponent({
  name: 'workDisabilityPeriodInfoCard',
  props: {
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    canManageWorkDisability: { type: Boolean, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
    this.canManageCurrentPeriod = this.canManageWorkDisability

   await this.isDateRangeAfterOrEqualToFirstDayPeriod()
  },
  methods: {
    getDate(date: string) {
      const dateWorDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorDisabilityPeriod.setLocale('en').toFormat('DDDD')
    },
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
    openFile() {
      window.open(this.workDisabilityPeriod?.workDisabilityPeriodFile)
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
    async isDateRangeAfterOrEqualToFirstDayPeriod() {
      //console.log('verificando fechas....')
      const datePay = this.getNextPayThursday()
      const monthPerdiod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))
      let start
      const date = DateTime.local(yearPeriod, monthPerdiod, dayPeriod)
      const startOfWeek = date.startOf('week')
      let thursday = startOfWeek.plus({ days: 3 })
      start = thursday.minus({ days: 24 })
      let currentDay = start
      currentDay = currentDay.minus({ days: 1 })
      //console.log(currentDay.toFormat('DDDD'))
      let currentDate = DateTime.fromISO(this.workDisabilityPeriod.workDisabilityPeriodStartDate, { zone: 'utc' })
      const endDate = DateTime.fromISO(this.workDisabilityPeriod.workDisabilityPeriodEndDate, { zone: 'utc' })
      for await (const dateRange of this.iterateDates(currentDate, endDate)) {
       if (!(dateRange >= currentDay)) {
        this.canManageCurrentPeriod = false
        //console.log('esta fecha es menor: ' + dateRange.toFormat('DDDD'))
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