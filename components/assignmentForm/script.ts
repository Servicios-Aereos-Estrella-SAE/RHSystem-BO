import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/EmployeeSupplyStatus'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  name: 'assignmentForm',
  props: {
    assignment: { type: Object as PropType<EmployeeSupplyInterface>, default: null },
    supplyTypeId: { type: Number, required: true },
    supplyId: { type: Number, default: null },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
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
    submitted: false,
    isLoading: false,
    assignmentStatusOptions: EMPLOYEE_SUPPLY_STATUS_OPTIONS,
    employees: [] as EmployeeInterface[],
    supplies: [] as any[],
    isLoadingEmployees: false as boolean
  }),
  computed: {
    assignmentData() {
      if (this.assignment) {
        return this.assignment
      }
      return {
        employeeSupplyId: null,
        employeeId: null,
        supplyId: this.supplyId,
        employeeSupplyStatus: 'active',
        employeeSupplyCreatedAt: null,
        employeeSupplyReturnDate: null,
        employee: null,
        supply: null
      }
    }
  },
  mounted() {
    this.loadEmployees()
    this.loadSupplies()
  },
  methods: {
    async onSave() {
      this.submitted = true
      this.isLoading = true

      if (!this.assignment.employeeId || !this.assignment.supplyId || !this.assignment.employeeSupplyStatus) {
        this.isLoading = false
        return
      }

      try {
        // Implementar guardado de asignación
        this.$toast.add({
          severity: 'success',
          summary: this.assignment.employeeSupplyId ? this.t('assignment_updated') : this.t('assignment_created'),
          detail: 'Asignación guardada correctamente',
          life: 5000,
        })

        if (this.clickOnSave) {
          this.clickOnSave(this.assignment)
        }
      } catch (error) {
        console.error('Error saving assignment:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_saving_assignment'),
          life: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
    handlerClickOnClose() {
      if (this.clickOnClose) {
        this.clickOnClose()
      }
    },
    async loadEmployees() {
      this.isLoadingEmployees = true
      try {
        const employeeService = new EmployeeService()
        const response = await employeeService.getFilteredList('', null, null, null, 1, 1000, false, null)

        if (response.status === 200) {
          this.employees = response._data.data.employees.data || []
        } else {
          this.employees = []
        }
      } catch (error) {
        console.error('Error loading employees:', error)
        this.employees = []
      } finally {
        this.isLoadingEmployees = false
      }
    },
    async loadSupplies() {
      try {
        // Si ya tenemos un supplyId preseleccionado, no necesitamos cargar la lista
        if (this.supplyId) {
          this.supplies = [{
            supplyId: this.supplyId,
            supplyName: 'Supply preseleccionado',
            supplyDescription: 'Supply ya seleccionado'
          }]
          return
        }

        // Si no hay supplyId, cargar todos los supplies del tipo
        const supplyService = new (await import('~/resources/scripts/services/SupplyService')).default()
        const response = await supplyService.getByType(this.supplyTypeId)

        if ((response as any).type === 'success') {
          this.supplies = (response as any).data.supplies.data || []
        } else {
          this.supplies = []
        }
      } catch (error) {
        console.error('Error loading supplies:', error)
        this.supplies = []
      }
    }
  }
})
