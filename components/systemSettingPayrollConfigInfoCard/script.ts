import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SystemSettingPayrollConfigInterface } from '~/resources/scripts/interfaces/SystemSettingPayrollConfigInterface'

export default defineComponent({
  name: 'SystemSettingPayrollConfigInfoCard',
  props: {
    systemSettingPayrollConfig: { type: Object as PropType<SystemSettingPayrollConfigInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null }
  },
  data: () => ({
  }),
  computed: {
  },
  async mounted() {

  },
  methods: {
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
    getFormattedDate(date: string) {
      const dateNew = DateTime.fromISO(date, { setZone: true })
      return dateNew.setLocale('en').toFormat('DDDD')
    },
    getPaymentTypeName(type: string) {
      if (type === 'specific_day_of_month') {
        return 'Monthly'
      } else if (type === 'fixed_day_every_n_weeks') {
        return 'Specific day'
      } else if (type === 'biweekly') {
        return 'Biweekly'
      }
    }
  }
})