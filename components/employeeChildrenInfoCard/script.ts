import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeChildrenInterface } from '~/resources/scripts/interfaces/EmployeeChildrenInterface'

export default defineComponent({
  name: 'employeeChildrenInfoCard',
  setup() {
    const { locale } = useI18n()
    return {
      locale
    }
  },
  props: {
    employeeChildren: { type: Object as PropType<EmployeeChildrenInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
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
    getDate(date: string) {
      const dateWorDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorDisabilityPeriod
        .setLocale(this.localeToUse)
        .toFormat('DDD')
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