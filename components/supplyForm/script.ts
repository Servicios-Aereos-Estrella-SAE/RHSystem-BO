import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import { SUPPLY_STATUS_OPTIONS } from '~/resources/scripts/enums/SupplyStatus'

export default defineComponent({
  name: 'supplyForm',
  props: {
    supply: { type: Object as PropType<SupplyInterface>, required: true },
    supplyTypeId: { type: Number, required: true },
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
    supplyStatusOptions: SUPPLY_STATUS_OPTIONS
  }),
  methods: {
    async onSave() {
      this.submitted = true
      this.isLoading = true

      if (!this.supply.supplyName || !this.supply.supplyDescription || !this.supply.supplyFileNumber || !this.supply.supplyStatus) {
        this.isLoading = false
        return
      }

      // Validar campos de desactivación si es necesario
      if ((this.supply.supplyStatus === 'inactive' || this.supply.supplyStatus === 'damaged') &&
          (!this.supply.supplyDeactivationReason || !this.supply.supplyDeactivationDate)) {
        this.isLoading = false
        return
      }

      try {
        const supplyService = new SupplyService()
        let response

        // Asegurar que el supplyTypeId esté asignado
        this.supply.supplyTypeId = this.supplyTypeId

        if (this.supply.supplyId) {
          response = await supplyService.update(this.supply.supplyId, this.supply)
        } else {
          response = await supplyService.create(this.supply)
        }

        if ((response as any).type === 'success') {
          this.$toast.add({
            severity: 'success',
            summary: this.supply.supplyId ? this.t('supply_updated') : this.t('supply_created'),
            detail: (response as any).message,
            life: 5000,
          })

          if (this.clickOnSave) {
            this.clickOnSave(this.supply)
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.supply.supplyId ? this.t('supply_updated') : this.t('supply_created'),
            detail: (response as any).message,
            life: 5000,
          })
        }
      } catch (error) {
        console.error('Error saving supply:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_saving_supply'),
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
