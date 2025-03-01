import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeChildrenInterface } from '~/resources/scripts/interfaces/EmployeeChildrenInterface'

export default defineComponent({
  name: 'employeeChildrenInfoCard',
  props: {
    employeeChildren: { type: Object as PropType<EmployeeChildrenInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    getDate(date: string) {
      const dateWorDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorDisabilityPeriod
        .setLocale('en')
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