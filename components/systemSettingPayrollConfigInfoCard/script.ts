import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SystemSettingPayrollConfigInterface } from '~/resources/scripts/interfaces/SystemSettingPayrollConfigInterface'

export default defineComponent({
  name: 'SystemSettingPayrollConfigInfoCard',
  props: {
    systemSettingPayrollConfig: { type: Object as PropType<SystemSettingPayrollConfigInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
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
      return dateNew.setLocale(this.localeToUse).toFormat('DDDD')
    },
  }
})