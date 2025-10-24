import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import EmployeeSupplyService from '~/resources/scripts/services/EmployeeSupplyService'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'
import { SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/SupplyStatus'
import { EMPLOYEE_SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/EmployeeSupplyStatus'

export default defineComponent({
  name: 'supplyManagement',
  props: {
    supplyType: {
      type: Object as PropType<SupplyTypeInterface>,
      required: true,
      default: () => ({
        supplyTypeId: null,
        supplyTypeName: 'Cargando...',
        supplyTypeDescription: 'Cargando información...',
        supplyTypeSlug: 'cargando'
      })
    },
    canCreate: { type: Boolean, default: false, required: true },
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
    // Supplies data
    filteredSupplies: [] as SupplyInterface[],
    supplySearch: '' as string,
    selectedSupplyStatus: 'active' as string,
    supplyStatusOptions: SUPPLY_STATUS_OPTIONS,

    // Assignments data
    filteredAssignments: [] as EmployeeSupplyInterface[],
    employeeSearch: '' as string,
    selectedAssignmentStatus: 'active' as string,
    assignmentStatusOptions: EMPLOYEE_SUPPLY_STATUS_OPTIONS,

    // Form data
    selectedSupply: null as SupplyInterface | null,
    selectedAssignment: null as EmployeeSupplyInterface | null,

    // Delete confirmation
    showConfirmDeleteSupply: false as boolean,
    showConfirmDeleteAssignment: false as boolean,
    supplyToDelete: null as SupplyInterface | null,
    assignmentToDelete: null as EmployeeSupplyInterface | null,

    // Drawers
    drawerSupplyForm: false as boolean,
    drawerAssignmentForm: false as boolean,
    drawerCharacteristicsManagement: false as boolean,

    // Loading states
    isLoadingSupplies: false as boolean,
    isLoadingAssignments: false as boolean,
    isInitialLoad: true as boolean,
  }),
  computed: {
    supplyFormTitle() {
      return this.selectedSupply?.supplyId
        ? this.t('edit_supply')
        : this.t('add_supply')
    },
    assignmentFormTitle() {
      return this.selectedAssignment?.employeeSupplyId
        ? this.t('edit_assignment')
        : this.t('add_assignment')
    }
  },
  async mounted() {
    this.isInitialLoad = true
    if (this.supplyType?.supplyTypeId) {
      await Promise.all([
        this.loadSupplies(),
        this.loadAssignments()
      ])
    }
    this.isInitialLoad = false
  },
  methods: {
    async loadSupplies() {
      this.isLoadingSupplies = true
      try {
        if (!this.supplyType?.supplyTypeId) {
          console.warn('SupplyType not available for loading supplies')
          return
        }
        const supplyService = new SupplyService()
        const response = await supplyService.getByType(this.supplyType.supplyTypeId)

        if ((response as any).type === 'success') {
          console.log('API Response structure:', response)

          // Verificar la estructura de la respuesta
          const responseData = (response as any).data
          console.log('Response data:', responseData)

          let supplies = []
          if (responseData?.supplies?.data) {
            supplies = responseData.supplies.data
          } else if (responseData?.supplies && Array.isArray(responseData.supplies)) {
            supplies = responseData.supplies
          } else if (Array.isArray(responseData)) {
            supplies = responseData
          }

          console.log('Supplies found:', supplies)

          if (supplies && supplies.length > 0) {
            // Cargar características para cada supply
            const suppliesWithCharacteristics = await Promise.all(
              supplies.map(async (supply: any) => {
                try {
                  const characteristicsResponse = await this.loadSupplyCharacteristics(supply.supplyId)
                  return {
                    ...supply,
                    characteristics: characteristicsResponse
                  }
                } catch (error) {
                  console.error(`Error loading characteristics for supply ${supply.supplyId}:`, error)
                  return {
                    ...supply,
                    characteristics: []
                  }
                }
              })
            )

            this.filteredSupplies = suppliesWithCharacteristics
            console.log('Supplies with characteristics loaded successfully:', this.filteredSupplies)
          } else {
            console.log('No supplies found in response')
            this.filteredSupplies = []
          }
        } else {
          console.log('API response not successful:', response)
          this.filteredSupplies = []
        }
      } catch (error) {
        console.error('Error loading supplies:', error)
        this.filteredSupplies = []
      } finally {
        this.isLoadingSupplies = false
      }
    },
    async loadAssignments() {
      this.isLoadingAssignments = true
      try {
        const employeeSupplyService = new EmployeeSupplyService()
        const response = await employeeSupplyService.getAll(1, 1000)
        this.filteredAssignments = (response as any).type === 'success' ? (response as any).data.employeeSupplies.data : []
      } catch (error) {
        console.error('Error loading assignments:', error)
        this.filteredAssignments = []
      } finally {
        this.isLoadingAssignments = false
      }
    },
    handlerSearchSupplies() {
      // Implementar búsqueda de supplies
      this.loadSupplies()
    },
    handlerSearchAssignments() {
      // Implementar búsqueda de asignaciones
      this.loadAssignments()
    },
    clearSupplyFilters() {
      this.supplySearch = ''
      this.selectedSupplyStatus = 'active'
      this.handlerSearchSupplies()
    },
    clearAssignmentFilters() {
      this.employeeSearch = ''
      this.selectedAssignmentStatus = 'active'
      this.handlerSearchAssignments()
    },
    addNewSupply() {
      const newSupply: SupplyInterface = {
        supplyId: null,
        supplyFileNumber: 0,
        supplyName: "",
        supplyDescription: "",
        supplyTypeId: this.supplyType.supplyTypeId!,
        supplyStatus: "active",
        supplyDeactivationReason: null,
        supplyDeactivationDate: null,
        supplyCreatedAt: null,
        supplyUpdatedAt: null,
        deletedAt: null
      }
      this.selectedSupply = newSupply
      this.drawerSupplyForm = true
    },
    onEditSupply(supply: SupplyInterface) {
      this.selectedSupply = { ...supply }
      this.drawerSupplyForm = true
    },
    onDeleteSupply(supply: SupplyInterface) {
      this.supplyToDelete = supply
      this.showConfirmDeleteSupply = true
    },
    async confirmDeleteSupply() {
      if (!this.supplyToDelete) return

      try {
        // Aquí implementarías la llamada al API para eliminar el supply
        console.log('Deleting supply:', this.supplyToDelete)

        // Recargar supplies después de eliminar
        await this.loadSupplies()

        this.$toast.add({
          severity: 'success',
          summary: this.t('success'),
          detail: this.t('supply_deleted_successfully'),
          life: 3000,
        })
      } catch (error) {
        console.error('Error deleting supply:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_deleting_supply'),
          life: 5000,
        })
      } finally {
        this.showConfirmDeleteSupply = false
        this.supplyToDelete = null
      }
    },
    cancelDeleteSupply() {
      this.showConfirmDeleteSupply = false
      this.supplyToDelete = null
    },
    onAssignSupply(supply: SupplyInterface) {
      console.log('onAssignSupply called with supply:', supply)
      this.selectedSupply = { ...supply }
      this.drawerAssignmentForm = true
    },
    onEditAssignment(assignment: EmployeeSupplyInterface) {
      this.selectedAssignment = { ...assignment }
      this.drawerAssignmentForm = true
    },
    onDeleteAssignment(assignment: EmployeeSupplyInterface) {
      this.assignmentToDelete = assignment
      this.showConfirmDeleteAssignment = true
    },
    async confirmDeleteAssignment() {
      if (!this.assignmentToDelete) return

      try {
        // Aquí implementarías la llamada al API para eliminar la asignación
        console.log('Deleting assignment:', this.assignmentToDelete)

        // Recargar asignaciones después de eliminar
        await this.loadAssignments()

        this.$toast.add({
          severity: 'success',
          summary: this.t('success'),
          detail: this.t('assignment_deleted_successfully'),
          life: 3000,
        })
      } catch (error) {
        console.error('Error deleting assignment:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_deleting_assignment'),
          life: 5000,
        })
      } finally {
        this.showConfirmDeleteAssignment = false
        this.assignmentToDelete = null
      }
    },
    cancelDeleteAssignment() {
      this.showConfirmDeleteAssignment = false
      this.assignmentToDelete = null
    },
    onSaveSupply(supply: SupplyInterface) {
      this.selectedSupply = { ...supply }
      this.loadSupplies()
      this.drawerSupplyForm = false
    },
    onCloseSupplyForm() {
      this.drawerSupplyForm = false
    },
    onCloseSupplyManagement() {
      this.$emit('close')
    },
    onSaveAssignment(assignment: EmployeeSupplyInterface) {
      this.selectedAssignment = { ...assignment }
      this.loadAssignments()
      this.drawerAssignmentForm = false
    },
    onCloseAssignmentForm() {
      this.drawerAssignmentForm = false
    },
    showCharacteristicsManagement() {
      console.log('showCharacteristicsManagement', this.drawerCharacteristicsManagement)
      this.drawerCharacteristicsManagement = true
    },
    onSaveCharacteristic() {
      this.loadSupplies()
    },
    onCloseCharacteristicsManagement() {
      this.drawerCharacteristicsManagement = false
    },
    async loadSupplyCharacteristics(supplyId: number) {
      try {
        // Obtener el supplyTypeId del supply
        const supply = this.filteredSupplies.find(s => s.supplyId === supplyId)
        if (!supply?.supplyTypeId) {
          console.warn('No supplyTypeId found for supply:', supplyId)
          return []
        }

        const supplyCharacteristicService = new SupplyCharacteristicService()
        const response = await supplyCharacteristicService.getAll(1, 100, supply.supplyTypeId)

        console.log('Characteristics response for supply type', supply.supplyTypeId, ':', response)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          // Según el JSON proporcionado, la estructura es supplieCharacteristics.data
          if (data?.supplieCharacteristics?.data) {
            return data.supplieCharacteristics.data
          } else if (data?.supplieCaracteristic?.data) {
            return data.supplieCaracteristic.data
          } else if (Array.isArray(data)) {
            return data
          }
        }
        return []
      } catch (error) {
        console.error('Error loading supply characteristics:', error)
        return []
      }
    }
  }
})
