import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { WorkDisabilityPeriodExpenseInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodExpenseInterface'

export default defineComponent({
  name: 'workDisabilityPeriodExpenseInfoCard',
  props: {
    workDisabilityPeriodExpense: { type: Object as PropType<WorkDisabilityPeriodExpenseInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
    date: { type: String, required: true },
    startDateLimit: { type: Date, required: true }
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
    if (this.canManageCurrentPeriod) {
      const workDisabilityPeriodStartDate = DateTime
        .fromISO(this.date, { zone: 'utc' })
        .startOf('day')

      const limitDate = DateTime
        .fromJSDate(this.startDateLimit)
        .toUTC()
        .startOf('day')
      if (workDisabilityPeriodStartDate.toMillis() >= limitDate.toMillis()) {
        this.canManageCurrentPeriod = true
      } else {
        this.canManageCurrentPeriod = false
      }
    }
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
      if (this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseFile) {
        window.open(this.workDisabilityPeriodExpense?.workDisabilityPeriodExpenseFile)
      }
    },
    formatCurrency(amount: number) {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(amount);
    },
  }
})