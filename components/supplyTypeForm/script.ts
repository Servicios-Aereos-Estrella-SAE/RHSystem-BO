import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import SupplyTypeService from '~/resources/scripts/services/SupplyTypeService'

export default defineComponent({
  name: 'supplyTypeForm',
  props: {
    supplyType: { type: Object as PropType<SupplyTypeInterface>, required: true },
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
    isLoading: false
  }),
  methods: {
    generateSlug() {
      if (this.supplyType.supplyTypeName) {
        this.supplyType.supplyTypeSlug = this.supplyType.supplyTypeName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
    },
    async onSave() {
      this.submitted = true
      this.isLoading = true

      if (!this.supplyType.supplyTypeName || !this.supplyType.supplyTypeDescription || !this.supplyType.supplyTypeSlug) {
        this.isLoading = false
        return
      }

      try {
        const supplyTypeService = new SupplyTypeService()
        let response

        if (this.supplyType.supplyTypeId) {
          response = await supplyTypeService.update(this.supplyType.supplyTypeId, this.supplyType)
        } else {
          response = await supplyTypeService.create(this.supplyType)
        }

        if ((response as any).type === 'success') {
          this.$toast.add({
            severity: 'success',
            summary: this.supplyType.supplyTypeId ? this.t('supply_type_updated') : this.t('supply_type_created'),
            detail: (response as any).message,
            life: 5000,
          })

          if (this.clickOnSave) {
            this.clickOnSave(this.supplyType)
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.supplyType.supplyTypeId ? this.t('supply_type_updated') : this.t('supply_type_created'),
            detail: (response as any).message,
            life: 5000,
          })
        }
      } catch (error) {
        console.error('Error saving supply type:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_saving_supply_type'),
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
