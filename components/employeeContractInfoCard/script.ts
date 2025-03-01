import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeContractInterface } from '~/resources/scripts/interfaces/EmployeeContractInterface'

export default defineComponent({
  name: 'employeeContractInfoCard',
  props: {
    employeeContract: { type: Object as PropType<EmployeeContractInterface>, required: true },
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
  },
  methods: {
    getDate(date: string) {
      if (!date) {
        return ''
      }
      const employeeContractDate = DateTime.fromISO(date, { zone: 'utc' })
      return employeeContractDate.setLocale('en').toFormat('DDDD')
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
      if (this.employeeContract.employeeContractFile) {
        window.open(this.employeeContract?.employeeContractFile)
      }
    },
    currencyFormat(value: number | string) {
      const val = parseFloat(`${value}`)
      const amount = new Intl.NumberFormat().format(val)
      return amount
    }
  }
})