import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/EmployeeSupplyStatus'

export default defineComponent({
  name: 'assignmentCard',
  props: {
    assignment: { type: Object as PropType<EmployeeSupplyInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  data: () => ({
    isLoading: false as boolean,
  }),
  computed: {
    assignmentInitial() {
      if (this.assignment?.employee?.person?.personName) {
        return this.assignment.employee.person.personName.charAt(0).toUpperCase()
      }
      return 'A'
    }
  },
  methods: {
    getStatusClass(status: string) {
      const statusClasses: { [key: string]: string } = {
        'active': 'status-active',
        'retired': 'status-retired',
        'shipping': 'status-shipping'
      }
      return statusClasses[status] || 'status-unknown'
    },
    getStatusLabel(status: string) {
      const statusOption = EMPLOYEE_SUPPLY_STATUS_OPTIONS.find(option => option.value === status)
      return statusOption ? statusOption.label : status
    },
    formatDate(date: Date | null) {
      if (!date) return '---'
      return new Date(date).toLocaleDateString()
    },
    handlerClickOnEdit() {
      if (this.clickOnEdit && this.assignment) {
        this.clickOnEdit(this.assignment)
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete && this.assignment) {
        this.clickOnDelete(this.assignment)
      }
    }
  }
})
