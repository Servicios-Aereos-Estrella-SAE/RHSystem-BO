import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import EmployeeSupplyService from '~/resources/scripts/services/EmployeeSupplyService'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/EmployeeSupplyStatus'

export default defineComponent({
  name: 'assignmentForm',
  props: {
    assignment: { type: Object as PropType<EmployeeSupplyInterface>, required: true },
    supplyId: { type: Number, required: true },
    supplyTypeId: { type: Number, required: true },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  setup() {
    const { t } = useI18n()
    const employeeService = new EmployeeService()
    const employeeSupplyService = new EmployeeSupplyService()
    return {
      t,
      employeeService,
      employeeSupplyService
    }
  },
  data: () => ({
    submitted: false,
    isLoading: false,
    isLoadingEmployees: false,
    selectedEmployeeId: null as number | null,
    employeeOptions: [] as Array<{label: string, value: number}>,
    assignmentStatusOptions: EMPLOYEE_SUPPLY_STATUS_OPTIONS,
    searchText: '' as string,
    isSupplyAlreadyAssigned: false as boolean,
    currentAssignment: null as EmployeeSupplyInterface | null,
  }),
  async mounted() {
    await this.loadEmployees()
    await this.checkSupplyAssignment()
    if (this.assignment.employeeSupplyId) {
      this.selectedEmployeeId = this.assignment.employeeId
    }
  },
  methods: {
    async loadEmployees(searchText = '') {
      this.isLoadingEmployees = true
      try {
        const response = await this.employeeService.getFilteredList(
          searchText,
          null, // departmentId
          null, // positionId
          null, // employeeWorkSchedule
          1, // page
          100, // limit
          false, // onlyInactive
          null // employeeTypeId
        )

        if (response.status === 200) {
          const data = response._data.data
          let employees = []

          if (data?.employees?.data) {
            employees = data.employees.data
          } else if (data?.employees && Array.isArray(data.employees)) {
            employees = data.employees
          } else if (Array.isArray(data)) {
            employees = data
          }

          this.employeeOptions = employees.map((employee: any) => ({
            label: `${employee.employeeCode} - ${employee.employeeFirstName} ${employee.employeeLastName}`,
            value: employee.employeeId
          }))
        }
      } catch (error) {
        console.error('Error loading employees:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_loading_employees'),
          life: 3000,
        })
      } finally {
        this.isLoadingEmployees = false
      }
    },

    async onFilterEmployees(event: any) {
      this.searchText = event.value
      await this.loadEmployees(event.value)
    },

    async checkSupplyAssignment() {
      if (!this.supplyId) return

      try {
        const response = await this.employeeSupplyService.getAll(1, 100, undefined, 'active')
        if ((response as any).type === 'success') {
          const assignments = (response as any).data.employeeSupplies.data || []
          const activeAssignment = assignments.find((assignment: any) =>
            assignment.supplyId === this.supplyId && assignment.employeeSupplyStatus === 'active'
          )

          if (activeAssignment && !this.assignment.employeeSupplyId) {
            this.isSupplyAlreadyAssigned = true
            this.currentAssignment = activeAssignment
          }
        }
      } catch (error) {
        console.error('Error checking supply assignment:', error)
      }
    },

    async onSave() {
      this.submitted = true
      this.isLoading = true

      if (!this.selectedEmployeeId || !this.assignment.employeeSupplyStatus) {
        this.isLoading = false
        return
      }

      // Verificar si el supply ya está asignado a otro empleado
      if (this.isSupplyAlreadyAssigned && !this.assignment.employeeSupplyId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('warning'),
          detail: this.t('supply_already_assigned'),
          life: 5000,
        })
        this.isLoading = false
        return
      }

      // Validar campos de retiro si es necesario
      if (this.assignment.employeeSupplyStatus === 'retired' &&
          (!this.assignment.employeeSupplyRetirementReason || !this.assignment.employeeSupplyRetirementDate)) {
        this.isLoading = false
        return
      }

      try {
        // Asignar valores
        this.assignment.employeeId = this.selectedEmployeeId
        this.assignment.supplyId = this.supplyId

        let response

        // 🔹 Lógica mejorada para retiro o actualización
        if (this.assignment.employeeSupplyId) {
          if (this.assignment.employeeSupplyStatus === 'retired') {
            response = await this.employeeSupplyService.retire(
              this.assignment.employeeSupplyId,
              this.assignment.employeeSupplyRetirementReason,
              this.assignment.employeeSupplyRetirementDate
            )
          } else {
            response = await this.employeeSupplyService.update(
              this.assignment.employeeSupplyId,
              this.assignment
            )
          }
        } else {
          response = await this.employeeSupplyService.create(this.assignment)
        }

        // 🔹 Mostrar mensaje dinámico según la acción
        if ((response as any).type === 'success') {
          const messageKey = this.assignment.employeeSupplyStatus === 'retired'
            ? 'assignment_retired'
            : (this.assignment.employeeSupplyId ? 'assignment_updated' : 'assignment_created')

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t(messageKey),
            life: 5000,
          })

          if (this.clickOnSave) {
            this.clickOnSave(this.assignment)
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('error'),
            detail: (response as any).message || this.t('error_saving_assignment'),
            life: 5000,
          })
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
    }
  }
})
