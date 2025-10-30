import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import { SUPPLY_STATUS_OPTIONS, SUPPLY_STATUS_OPTIONS_EN } from '~/resources/scripts/enums/SupplyStatus'
import EmployeeSupplyService from '~/resources/scripts/services/EmployeeSupplyService'
import SupplyCharacteristicValueService from '~/resources/scripts/services/SupplyCharacteristicValueService'

export default defineComponent({
  name: 'supplyCard',
  props: {
    supply: {
      type: Object as PropType<SupplyInterface>,
      required: true,
      default: () => ({
        supplyId: null,
        supplyName: 'Cargando...',
        supplyDescription: 'Cargando información...',
        supplyFileNumber: '---',
        supplyStatus: 'active'
      })
    },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnAssign: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data: () => ({
    characteristicsCount: 0 as number,
    assignmentsCount: 0 as number,
    isLoading: false as boolean,
    isAssigned: false as boolean,
    assignedEmployee: null as any,
    characteristicsLoaded: false as boolean // ✅ evita ciclo
  }),
  mounted() {
    this.updateCounts()
    this.checkAssignmentStatus()
  },
  watch: {
    supply: {
      handler() {
        this.updateCounts()
        this.checkAssignmentStatus()
      },
      deep: true
    }
  },
  computed: {
    supplyInitial() {
      if (this.supply?.supplyName) {
        return this.supply.supplyName.charAt(0).toUpperCase()
      }
      return 'S'
    },
    supplyStatusOptions(): Array<{label: string, value: any}> {
      const lang = (this.$i18n?.locale || 'es').toString().toLowerCase()
      return lang.startsWith('en') ? SUPPLY_STATUS_OPTIONS_EN : SUPPLY_STATUS_OPTIONS
    }
  },
  methods: {
    getStatusClass(status: string) {
      const statusClasses: Record<string, string> = {
        active: 'p-tag-success',
        inactive: 'p-tag-warning',
        lost: 'p-tag-danger',
        damaged: 'p-tag-danger'
      }
      return statusClasses[status] || 'p-tag-unknown'
    },
    getStatusLabel(status: string) {
      const statusOption = this.supplyStatusOptions.find((option: any) => option.value === status)
      return statusOption ? statusOption.label : status
    },
    formatDate(date: Date | null) {
      if (!date) return '---'
      return new Date(date).toLocaleDateString()
    },

    updateCounts() {
      this.characteristicsCount = this.supply?.characteristics?.length || 0
      this.assignmentsCount = this.supply?.assignments?.length || 0

      // ✅ Solo intenta cargar una vez, y solo si no hay características
      if (
        this.supply?.supplyId &&
        this.characteristicsCount === 0 &&
        !this.characteristicsLoaded
      ) {
        this.loadSupplyCharacteristics()
      }
    },

    async loadSupplyCharacteristics() {
      if (!this.supply?.supplyId) return

      this.isLoading = true
      try {
        const supplyCharacteristicValueService = new SupplyCharacteristicValueService()
        const response = await supplyCharacteristicValueService.getBySupply(this.supply.supplyId)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          if (data?.data && Array.isArray(data.data)) {
            // ✅ Soporta array vacío sin reiniciar el ciclo
            this.supply.characteristics = data.data
            this.characteristicsCount = data.data.length
          }
        }
      } catch (error) {
        console.error('Error loading supply characteristics:', error)
      } finally {
        this.isLoading = false
        this.characteristicsLoaded = true // ✅ Marca como cargado, incluso si está vacío
      }
    },

    getTypeLabel(type: string) {
      const typeLabels: Record<string, string> = {
        text: this.t('text'),
        number: this.t('number'),
        date: this.t('date'),
        email: this.t('email'),
        url: this.t('url'),
        boolean: this.t('boolean')
      }
      return typeLabels[type] || type
    },

    handlerClickOnEdit() {
      //console.log('handlerClickOnEdit', this.clickOnEdit, this.supply)
      if (this.clickOnEdit && this.supply) {
        this.clickOnEdit(this.supply)
      }
    },

    handlerClickOnDelete() {
      if (this.clickOnDelete && this.supply) {
        this.clickOnDelete(this.supply)
      }
    },

    async checkAssignmentStatus() {
      if (!this.supply?.supplyId) return

      try {
        const employeeSupplyService = new EmployeeSupplyService()
        const response = await employeeSupplyService.getAll(1, 100, null, 'active')

        if ((response as any).type === 'success') {
          const assignments = (response as any).data.employeeSupplies.data || []
          const activeAssignment = assignments.find(
            (assignment: any) =>
              assignment.supplyId === this.supply.supplyId &&
              assignment.employeeSupplyStatus === 'active'
          )

          this.isAssigned = !!activeAssignment
          this.assignedEmployee = activeAssignment || null
        }
      } catch (error) {
        console.error('Error checking assignment status:', error)
      }
    },

    handlerClickOnAssign() {
      //console.log('handlerClickOnAssign', this.clickOnAssign, this.supply)
      if (this.clickOnAssign && this.supply) {
        this.clickOnAssign(this.supply)
      }
    }
  }
})
