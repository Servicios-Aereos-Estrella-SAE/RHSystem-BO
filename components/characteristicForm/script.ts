import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import { SUPPLY_CHARACTERISTIC_TYPES } from '~/resources/scripts/enums/SupplyCharacteristicType'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'

export default defineComponent({
  name: 'characteristicForm',
  props: {
    characteristic: { type: Object as PropType<SupplyCharacteristicInterface>, required: true },
    supplyTypeId: { type: Number, required: true },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  setup() {
    const { t } = useI18n()
    const supplyCharacteristicService = new SupplyCharacteristicService()
    return {
      t,
      supplyCharacteristicService
    }
  },
  data: () => ({
    submitted: false,
    isLoading: false,
    characteristicTypeOptions: SUPPLY_CHARACTERISTIC_TYPES
  }),
  methods: {
    async onSave() {
      this.submitted = true
      this.isLoading = true

      if (!this.characteristic.supplieCaracteristicName || !this.characteristic.supplieCaracteristicType) {
        this.isLoading = false
        return
      }

      try {
        // Asegurar que el supplyTypeId esté asignado
        this.characteristic.supplyTypeId = this.supplyTypeId

        let response
        if (this.characteristic.supplieCaracteristicId) {
          // Actualizar característica existente
          response = await this.supplyCharacteristicService.update(
            this.characteristic.supplieCaracteristicId,
            this.characteristic
          )
        } else {
          // Crear nueva característica
          response = await this.supplyCharacteristicService.create(this.characteristic)
        }

        if ((response as any).type === 'success') {
          this.$toast.add({
            severity: 'success',
            summary: this.characteristic.supplieCaracteristicId ? this.t('characteristic_updated') : this.t('characteristic_created'),
            detail: (response as any).message || 'Característica guardada correctamente',
            life: 5000,
          })

          if (this.clickOnSave) {
            this.clickOnSave(this.characteristic)
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('error'),
            detail: (response as any).message || this.t('error_saving_characteristic'),
            life: 5000,
          })
        }
      } catch (error) {
        console.error('Error saving characteristic:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_saving_characteristic'),
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
