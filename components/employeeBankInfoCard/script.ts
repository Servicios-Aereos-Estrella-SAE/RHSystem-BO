import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeBankInterface } from '~/resources/scripts/interfaces/EmployeeBankInterface'

export default defineComponent({
  name: 'employeeBankInfoCard',
  props: {
    employeeBank: { type: Object as PropType<EmployeeBankInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
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