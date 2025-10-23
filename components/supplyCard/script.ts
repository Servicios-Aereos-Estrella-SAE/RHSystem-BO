import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import { SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/SupplyStatus'

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
    return {
      t
    }
  },
  data: () => ({
    characteristicsCount: 0 as number,
    assignmentsCount: 0 as number,
  }),
  mounted() {
    this.updateCounts()
  },
  watch: {
    supply: {
      handler() {
        this.updateCounts()
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
    }
  },
  methods: {
    getStatusClass(status: string) {
      const statusClasses: { [key: string]: string } = {
        'active': 'status-active',
        'inactive': 'status-inactive',
        'lost': 'status-lost',
        'damaged': 'status-damaged'
      }
      return statusClasses[status] || 'status-unknown'
    },
    getStatusLabel(status: string) {
      const statusOption = SUPPLY_STATUS_OPTIONS.find(option => option.value === status)
      return statusOption ? statusOption.label : status
    },
    formatDate(date: Date | null) {
      if (!date) return '---'
      return new Date(date).toLocaleDateString()
    },
    updateCounts() {
      this.characteristicsCount = this.supply?.characteristics?.length || 0
      this.assignmentsCount = this.supply?.assignments?.length || 0
    },
    handlerClickOnEdit() {
      console.log('handlerClickOnEdit', this.clickOnEdit, this.supply)
      if (this.clickOnEdit && this.supply) {
        console.log('handlerClickOnEdit')
        this.clickOnEdit(this.supply)
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete && this.supply) {
        this.clickOnDelete(this.supply)
      }
    },
    handlerClickOnAssign() {
      console.log('handlerClickOnAssign', this.clickOnAssign, this.supply)
      if (this.clickOnAssign && this.supply) {
        this.clickOnAssign(this.supply)
      }
    }
  }
})
