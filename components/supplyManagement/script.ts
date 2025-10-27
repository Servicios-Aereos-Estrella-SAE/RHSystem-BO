import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { EmployeeSupplyInterface } from '~/resources/scripts/interfaces/EmployeeSupplyInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import EmployeeSupplyService from '~/resources/scripts/services/EmployeeSupplyService'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'
import SupplyCharacteristicValueService from '~/resources/scripts/services/SupplyCharacteristicValueService'
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
    allSupplies: [] as SupplyInterface[], // Nuevo array para almacenar todos los insumos
    supplySearch: '' as string,
    selectedSupplyStatus: null as string | null, // Cambiado de 'active' a null para mostrar todos
    supplyStatusOptions: SUPPLY_STATUS_OPTIONS,

    // Assignments data
    filteredAssignments: [] as EmployeeSupplyInterface[],
    employeeSearch: '' as string,
    selectedAssignmentStatus: 'active' as string,
    assignmentStatusOptions: EMPLOYEE_SUPPLY_STATUS_OPTIONS,

    // Form data
    selectedSupply: null as SupplyInterface | null,
    selectedAssignment: null as EmployeeSupplyInterface | null,
    newAssignment: {
      employeeSupplyId: null,
      employeeId: 0,
      supplyId: 0,
      employeeSupplyStatus: 'active',
      employeeSupplyRetirementReason: null,
      employeeSupplyRetirementDate: null,
      employeeSupplyCreatedAt: null,
      employeeSupplyUpdatedAt: null,
      deletedAt: null
    } as EmployeeSupplyInterface,

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
          //console.log('API Response structure:', response)

          // Verificar la estructura de la respuesta
          const responseData = (response as any).data
          //console.log('Response data:', responseData)

          let supplies = []
          if (responseData?.supplies?.data) {
            supplies = responseData.supplies.data
          } else if (responseData?.supplies && Array.isArray(responseData.supplies)) {
            supplies = responseData.supplies
          } else if (Array.isArray(responseData)) {
            supplies = responseData
          }

          //console.log('Supplies found:', supplies)

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

            this.allSupplies = suppliesWithCharacteristics
            //console.log('Supplies with characteristics loaded successfully:', this.allSupplies)
            // Aplicar filtros después de cargar
            this.filterSupplies()
          } else {
            //console.log('No supplies found in response')
            this.allSupplies = []
            this.filteredSupplies = []
          }
        } else {
          //console.log('API response not successful:', response)
          this.allSupplies = []
          this.filteredSupplies = []
        }
      } catch (error) {
        console.error('Error loading supplies:', error)
        this.allSupplies = []
        this.filteredSupplies = []
      } finally {
        this.isLoadingSupplies = false
      }
    },
    async loadAssignments() {
      this.isLoadingAssignments = true
      try {
        const employeeSupplyService = new EmployeeSupplyService()
        const response = await employeeSupplyService.getAll(1, 1000, null, null, this.supplyType?.supplyTypeId)
        this.filteredAssignments = (response as any).type === 'success' ? (response as any).data.employeeSupplies.data : []
      } catch (error) {
        console.error('Error loading assignments:', error)
        this.filteredAssignments = []
      } finally {
        this.isLoadingAssignments = false
      }
    },
    handlerSearchSupplies() {
      // Filtrar supplies en el frontend
      this.filterSupplies()
    },
    filterSupplies() {
      let filtered = [...this.allSupplies]

      // Filtrar por status
      if (this.selectedSupplyStatus) {
        filtered = filtered.filter(supply => supply.supplyStatus === this.selectedSupplyStatus)
      }

      // Filtrar por búsqueda de texto
      if (this.supplySearch.trim()) {
        const searchLower = this.supplySearch.toLowerCase()
        filtered = filtered.filter(supply =>
          supply.supplyName.toLowerCase().includes(searchLower) ||
          supply.supplyDescription?.toLowerCase().includes(searchLower) ||
          supply.supplyFileNumber?.toString().includes(searchLower)
        )
      }

      // Ordenar por status (active primero, luego inactive, damaged, lost)
      const statusOrder = ['active', 'inactive', 'damaged', 'lost']
      filtered.sort((a, b) => {
        const indexA = statusOrder.indexOf(a.supplyStatus || '')
        const indexB = statusOrder.indexOf(b.supplyStatus || '')
        return indexA - indexB
      })

      this.filteredSupplies = filtered
    },
    handlerSearchAssignments() {
      // Implementar búsqueda de asignaciones
      this.loadAssignments()
    },
    clearSupplyFilters() {
      this.supplySearch = ''
      this.selectedSupplyStatus = null
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
      if (!this.supplyToDelete?.supplyId) return

      try {
        const supplyService = new SupplyService()
        const response = await supplyService.delete(this.supplyToDelete.supplyId)

        if ((response as any).type === 'success') {
          // Recargar supplies después de eliminar
          await this.loadSupplies()

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('supply_deleted_successfully'),
            life: 3000,
          })
        } else {
          throw new Error((response as any).message || 'Error deleting supply')
        }
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
    async deactivateSupply(supply: SupplyInterface) {
      if (!supply.supplyId) return

      try {
        const supplyService = new SupplyService()
        const response = await supplyService.deactivate(
          supply.supplyId,
          supply.supplyDeactivationReason || 'Desactivado por administrador',
          (supply.supplyDeactivationDate instanceof Date ? supply.supplyDeactivationDate.toISOString() : supply.supplyDeactivationDate) || new Date().toISOString()
        )

        if ((response as any).type === 'success') {
          // Recargar supplies después de desactivar
          await this.loadSupplies()

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('supply_deactivated_successfully'),
            life: 3000,
          })
        } else {
          throw new Error((response as any).message || 'Error deactivating supply')
        }
      } catch (error) {
        console.error('Error deactivating supply:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_deactivating_supply'),
          life: 5000,
        })
      }
    },
    cancelDeleteSupply() {
      this.showConfirmDeleteSupply = false
      this.supplyToDelete = null
    },
    onAssignSupply(supply: SupplyInterface) {
      //console.log('onAssignSupply called with supply:', supply)
      this.selectedSupply = { ...supply }
      this.selectedAssignment = null
      this.newAssignment = {
        employeeSupplyId: null,
        employeeId: 0,
        supplyId: supply.supplyId ?? 0,
        employeeSupplyStatus: 'active',
        employeeSupplyRetirementReason: null,
        employeeSupplyRetirementDate: null,
        employeeSupplyCreatedAt: null,
        employeeSupplyUpdatedAt: null,
        deletedAt: null
      }
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
      if (!this.assignmentToDelete?.employeeSupplyId) return

      try {
        const employeeSupplyService = new EmployeeSupplyService()
        const response = await employeeSupplyService.delete(this.assignmentToDelete.employeeSupplyId)

        if ((response as any).type === 'success') {
          // Recargar asignaciones después de eliminar
          await this.loadAssignments()

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('assignment_deleted_successfully'),
            life: 3000,
          })
        } else {
          throw new Error((response as any).message || 'Error deleting assignment')
        }
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
    async retireAssignment(assignment: EmployeeSupplyInterface) {
      if (!assignment.employeeSupplyId) return

      try {
        const employeeSupplyService = new EmployeeSupplyService()
        const response = await employeeSupplyService.retire(
          assignment.employeeSupplyId,
          assignment.employeeSupplyRetirementReason || 'Retirado por administrador',
          (assignment.employeeSupplyRetirementDate instanceof Date ? assignment.employeeSupplyRetirementDate.toISOString() : assignment.employeeSupplyRetirementDate) || new Date().toISOString()
        )

        if ((response as any).type === 'success') {
          // Recargar asignaciones después de retirar
          await this.loadAssignments()

          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('assignment_retired_successfully'),
            life: 3000,
          })
        } else {
          throw new Error((response as any).message || 'Error retiring assignment')
        }
      } catch (error) {
        console.error('Error retiring assignment:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_retiring_assignment'),
          life: 5000,
        })
      }
    },
    cancelDeleteAssignment() {
      this.showConfirmDeleteAssignment = false
      this.assignmentToDelete = null
    },
    async onSaveSupply(supply: SupplyInterface) {
      this.selectedSupply = { ...supply }

      // Recargar supplies desde el servidor
      await this.loadSupplies()

      // Desactivar el foco del elemento activo para evitar conflictos
      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur()
      }

      // Cerrar el formulario después de que se complete la operación
      await this.$nextTick()
      this.drawerSupplyForm = false
    },
    onCloseSupplyForm() {
      // Usar nextTick para evitar conflictos de foco
      this.$nextTick(() => {
        this.drawerSupplyForm = false
      })
    },
    onCloseSupplyManagement() {
      this.$emit('close')
    },
    async onSaveAssignment(assignment: EmployeeSupplyInterface) {
      //console.log('onSaveAssignment called with:', assignment)
      this.selectedAssignment = { ...assignment }

      // Recargar assignments desde el servidor
      await this.loadAssignments()

      // Mostrar notificación de éxito
      this.$toast.add({
        severity: 'success',
        summary: this.t('success'),
        detail: this.t('assignment_saved_successfully'),
        life: 3000,
      })

      // Desactivar el foco del elemento activo para evitar conflictos
      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur()
      }

      // Cerrar el formulario después de que se complete la operación
      await this.$nextTick()
      this.drawerAssignmentForm = false
    },
    onCloseAssignmentForm() {
      //console.log('onCloseAssignmentForm called')
      // Usar nextTick para evitar conflictos de foco
      this.$nextTick(() => {
        this.drawerAssignmentForm = false
      })
    },
    showCharacteristicsManagement() {
      //console.log('showCharacteristicsManagement', this.drawerCharacteristicsManagement)
      this.drawerCharacteristicsManagement = true
    },
    async onSaveCharacteristic() {
      //console.log('onSaveCharacteristic called in supplyManagement')
      // Recargar supplies para actualizar las características
      await this.loadSupplies()

      // Mostrar notificación de éxito
      this.$toast.add({
        severity: 'success',
        summary: this.t('success'),
        detail: this.t('characteristic_saved_successfully'),
        life: 3000,
      })

      // Desactivar el foco del elemento activo para evitar conflictos
      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur()
      }

      // Cerrar el drawer de características después de que se complete la operación
      await this.$nextTick()
      this.drawerCharacteristicsManagement = false
    },
    onCloseCharacteristicsManagement() {
      // Usar nextTick para evitar conflictos de foco
      this.$nextTick(() => {
        this.drawerCharacteristicsManagement = false
      })
    },
    async loadSupplyCharacteristics(supplyId: number) {
      try {
        // Cargar los valores de características específicos del supply
        const supplyCharacteristicValueService = new SupplyCharacteristicValueService()
        const response = await supplyCharacteristicValueService.getBySupply(supplyId)

        //console.log('Supply characteristic values response for supply', supplyId, ':', response)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          // Según el JSON proporcionado, la estructura es data.data
          if (data?.data && Array.isArray(data.data)) {
            return data.data
          } else if (Array.isArray(data)) {
            return data
          }
        }
        return []
      } catch (error) {
        console.error('Error loading supply characteristic values:', error)
        return []
      }
    }
  }
})
