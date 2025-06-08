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
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
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