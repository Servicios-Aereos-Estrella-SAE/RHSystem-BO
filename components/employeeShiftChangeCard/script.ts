import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'

export default defineComponent({
  name: 'employeeShiftChangeCard',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employeeShiftChange: { type: Object as PropType<EmployeeShiftChangeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    isDeleted: { type: Boolean, required: true },
    canManageToPreviousDays: { type: Boolean, required: true },
    canManageShiftChange: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    localeToUse: 'en',
  }),
  computed: {

  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  mounted() {
  },
  methods: {
    getFormattedDate(date: string) {
      const dateNew = DateTime.fromISO(date, { zone: 'utc' })
      return dateNew.setLocale(this.localeToUse).toFormat('DDDD')
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
  }
})
