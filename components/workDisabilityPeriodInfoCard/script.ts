import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface'

export default defineComponent({
  name: 'workDisabilityPeriodInfoCard',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
    onlySeeInfo: { type: Boolean, required: false },
    startDateLimit: { type: Date, required: true }
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false,
    sessionUser: null as UserInterface | null,
    localeToUse: 'en',
  }),
  computed: {
    displayPeriodActions() {
      if (!this.sessionUser) {
        return false
      }

      if ((this.sessionUser.person?.employee?.employeeId === this.employee.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (!this.isDeleted) {
        return true
      }

      return true
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
    await this.setSessionUser()
    await this.validateDisabilityDateRange()
    if (this.canManageCurrentPeriod) {
      if (this.workDisabilityPeriod.workDisabilityPeriodStartDate) {

      }
      const workDisabilityPeriodStartDate = DateTime
        .fromISO(this.workDisabilityPeriod.workDisabilityPeriodStartDate, { zone: 'utc' })

      const limitDate = DateTime
        .fromJSDate(this.startDateLimit)

      if (workDisabilityPeriodStartDate.isValid && limitDate.isValid && workDisabilityPeriodStartDate.toISODate() >= limitDate.toISODate()) {
        this.canManageCurrentPeriod = true
      } else {
        this.canManageCurrentPeriod = false
      }
    }
  },
  methods: {
    async setSessionUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.sessionUser = authUser
    },
    getDate(date: string) {
      const dateWorkDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorkDisabilityPeriod.setLocale(this.localeToUse).toFormat('DDDD')
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
        console.error(this.t('date_invalid'), {
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
