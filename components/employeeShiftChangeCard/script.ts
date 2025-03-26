import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface'

export default defineComponent({
  name: 'employeeShiftChangeCard',
  props: {
    employeeShiftChange: { type: Object as PropType<EmployeeShiftChangeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },

    isDeleted: { type: Boolean, required: true },
    canManageToPreviousDays: { type: Boolean, required: true },
    canManageShiftChange: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
  }),
  computed: {

  },
  mounted() {
  },
  methods: {
    getFormattedDate(date: string) {
      const dateNew = DateTime.fromISO(date, { zone: 'utc' })
      return dateNew.setLocale('en').toFormat('DDDD')
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