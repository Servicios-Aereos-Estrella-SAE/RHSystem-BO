import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyInterface } from '~/resources/scripts/interfaces/SupplyInterface'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import type { SupplyCharacteristicValueInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicValueInterface'
import SupplyService from '~/resources/scripts/services/SupplyService'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'
import SupplyCharacteristicValueService from '~/resources/scripts/services/SupplyCharacteristicValueService'
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
    const supplyCharacteristicService = new SupplyCharacteristicService()
    const supplyCharacteristicValueService = new SupplyCharacteristicValueService()
    return {
      t,
      supplyCharacteristicService,
      supplyCharacteristicValueService
    }
  },
  data: () => ({
    submitted: false,
    isLoading: false,
    supplyStatusOptions: SUPPLY_STATUS_OPTIONS,
    supplyCharacteristics: [] as SupplyCharacteristicInterface[],
    characteristicValues: [] as SupplyCharacteristicValueInterface[],
    booleanOptions: [
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ]
  }),
  async mounted() {
    if (this.supply.supplyId) {
      await this.loadSupplyCharacteristics()
      await this.loadCharacteristicValues()
    }
  },
  methods: {
    async loadSupplyCharacteristics() {
      try {
        const response = await this.supplyCharacteristicService.getAll(1, 100, this.supplyTypeId)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          if (data?.supplieCharacteristics?.data) {
            this.supplyCharacteristics = data.supplieCharacteristics.data
          }
        }
      } catch (error) {
        console.error('Error loading supply characteristics:', error)
      }
    },
    async loadCharacteristicValues() {
      if (!this.supply.supplyId) return

      try {
        const response = await this.supplyCharacteristicValueService.getBySupply(this.supply.supplyId)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          if (data?.supplieCaracteristic?.data) {
            this.characteristicValues = data.supplieCaracteristic.data
          }
        }
      } catch (error) {
        console.error('Error loading characteristic values:', error)
      }
    },
    getCharacteristicValue(characteristicId: number): SupplyCharacteristicValueInterface {
      let value = this.characteristicValues.find(v => v.supplieCaracteristicId === characteristicId)

      if (!value) {
        value = {
          supplieCaracteristicValueId: null,
          supplieCaracteristicId: characteristicId,
          supplieId: this.supply.supplyId!,
          supplieCaracteristicValueValue: '',
          supplieCaracteristicValueCreatedAt: null,
          supplieCaracteristicValueUpdatedAt: null,
          deletedAt: null
        }
        this.characteristicValues.push(value)
      }

      return value
    },
    async saveCharacteristicValues() {
      for (const value of this.characteristicValues) {
        try {
          if (value.supplieCaracteristicValueId) {
            // Actualizar valor existente
            await this.supplyCharacteristicValueService.update(value.supplieCaracteristicValueId, value)
          } else if (value.supplieCaracteristicValueValue) {
            // Crear nuevo valor
            await this.supplyCharacteristicValueService.create(value)
          }
        } catch (error) {
          console.error('Error saving characteristic value:', error)
        }
      }
    },
    async onSave() {
  this.submitted = true
  this.isLoading = true

  if (!this.supply.supplyName || !this.supply.supplyDescription || !this.supply.supplyFileNumber) {
    this.isLoading = false
    return
  }

  // Si es un nuevo supply, forzamos estado 'active'
  if (!this.supply.supplyId) {
    this.supply.supplyStatus = 'active'
  }

  // Validar desactivación si corresponde
  const isDeactivation =
    this.supply.supplyStatus === 'inactive' ||
    this.supply.supplyStatus === 'lost' ||
    this.supply.supplyStatus === 'damaged'

  if (isDeactivation &&
      (!this.supply.supplyDeactivationReason || !this.supply.supplyDeactivationDate)) {
    this.isLoading = false
    return
  }

  try {
    const supplyService = new SupplyService()
    let response

    this.supply.supplyTypeId = this.supplyTypeId

    // Si el insumo ya existe
    if (this.supply.supplyId) {
      // Caso especial: desactivación
      if (isDeactivation) {
        // 1️⃣ Desactivar primero
        const deactivateResponse = await supplyService.deactivate(
          this.supply.supplyId,
          this.supply.supplyDeactivationReason!,
          (this.supply.supplyDeactivationDate instanceof Date
            ? this.supply.supplyDeactivationDate.toISOString()
            : this.supply.supplyDeactivationDate) || new Date().toISOString()
        )

        if ((deactivateResponse as any).type === 'success') {
          // 2️⃣ Si la desactivación fue exitosa, actualizar el estado
          response = await supplyService.update(this.supply.supplyId, this.supply)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('error'),
            detail: (deactivateResponse as any).message || this.t('error_deactivating_supply'),
            life: 5000,
          })
          this.isLoading = false
          return
        }
      } else {
        // Caso normal de actualización
        response = await supplyService.update(this.supply.supplyId, this.supply)
      }
    } else {
      // Creación de nuevo insumo
      response = await supplyService.create(this.supply)
    }

    // Manejo de respuesta general
    if ((response as any).type === 'success') {
      if (this.characteristicValues.length > 0) {
        await this.saveCharacteristicValues()
      }

      this.$toast.add({
        severity: 'success',
        summary: this.supply.supplyId ? this.t('supply_updated') : this.t('supply_created'),
        detail: (response as any).message || 'Insumo guardado correctamente',
        life: 5000,
      })

      if (this.clickOnSave) {
        this.clickOnSave(this.supply)
      }

      // Emitir evento para notificar al componente padre
      this.$emit('save', this.supply)
    } else {
      this.$toast.add({
        severity: 'error',
        summary: this.t('error'),
        detail: (response as any).message || this.t('error_saving_supply'),
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
}
,
    handlerClickOnClose() {
      if (this.clickOnClose) {
        this.clickOnClose()
      }
    }
  }
})
