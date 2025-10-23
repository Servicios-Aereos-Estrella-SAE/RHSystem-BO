import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import EmployeeSupplyService from '~/resources/scripts/services/EmployeeSupplyService'

export default defineComponent({
  name: 'supplyTypeInfoCard',
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
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnManage: { type: Function, default: null },
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
    totalSupplies: 0,
    activeSupplies: 0,
    assignedSupplies: 0,
    isLoading: false
  }),
  computed: {
    supplyTypeInitial() {
      if (this.supplyType?.supplyTypeName) {
        return this.supplyType.supplyTypeName.charAt(0).toUpperCase()
      }
      return 'S'
    }
  },
  async mounted() {
    if (this.supplyType?.supplyTypeId) {
      await this.loadSupplyStats()
    }
  },
  methods: {
    async loadSupplyStats() {
      this.isLoading = true
      try {
        // Obtener supplies por tipo
        const supplyService = new SupplyService()
        const suppliesResponse = await supplyService.getByType(this.supplyType.supplyTypeId!)

        if (suppliesResponse.status === 200) {
          const supplies = suppliesResponse._data.data.supplies.data
          this.totalSupplies = supplies.length
          this.activeSupplies = supplies.filter((supply: any) => supply.supplyStatus === 'active').length
        }

        // Obtener asignaciones activas
        const employeeSupplyService = new EmployeeSupplyService()
        const assignmentsResponse = await employeeSupplyService.getAll(1, 1000)

        if (assignmentsResponse.status === 200) {
          const assignments = assignmentsResponse._data.data.employeeSupplies.data
          this.assignedSupplies = assignments.filter((assignment: any) =>
            assignment.employeeSupplyStatus === 'active' &&
            this.supplyType?.supplyTypeId === assignment.supply?.supplyTypeId
          ).length
        }
      } catch (error) {
        console.error('Error loading supply stats:', error)
      } finally {
        this.isLoading = false
      }
    },
    handlerClickOnEdit() {
      console.log('handlerClickOnEdit', this.clickOnEdit, this.supplyType)
      if (this.clickOnEdit && this.supplyType) {
        this.clickOnEdit(this.supplyType)
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete && this.supplyType) {
        this.clickOnDelete(this.supplyType)
      }
    },
    handlerClickOnManage() {
      if (this.clickOnManage && this.supplyType) {
        this.clickOnManage(this.supplyType)
      }
    },
    formatDate(dateString: string) {
      if (!dateString) return this.t('not_assigned')
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
  }
})
