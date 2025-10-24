import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import SupplyCharacteristicService from '~/resources/scripts/services/SupplyCharacteristicService'

export default defineComponent({
  name: 'characteristicsManagement',
  props: {
    supplyType: { type: Object as PropType<SupplyTypeInterface>, required: true },
    canCreate: { type: Boolean, default: false, required: true },
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
    characteristics: [] as SupplyCharacteristicInterface[],
    selectedCharacteristic: null as SupplyCharacteristicInterface | null,
    drawerCharacteristicForm: false as boolean,
    isLoading: false as boolean,
    isInitialLoad: true as boolean,
    isSaving: false as boolean,
    isDeleting: false as boolean,
  }),
  computed: {
    characteristicFormTitle() {
      return this.selectedCharacteristic?.supplieCaracteristicId
        ? this.t('edit_characteristic')
        : this.t('add_characteristic')
    }
  },
  watch: {
    supplyType: {
      handler(newSupplyType) {
        console.log('supplyType changed:', newSupplyType)
        if (newSupplyType?.supplyTypeId) {
          this.loadCharacteristics()
        }
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    console.log('Component mounted, supplyType:', this.supplyType)
    this.isInitialLoad = true
    await this.loadCharacteristics()
    this.isInitialLoad = false
  },
  methods: {
    async loadCharacteristics() {
      console.log('loadCharacteristics called, supplyType:', this.supplyType)
      this.isLoading = true
      try {
        if (!this.supplyType?.supplyTypeId) {
          console.warn('SupplyType not available for loading characteristics')
          return
        }

        console.log('Making API call to getAll with supplyTypeId:', this.supplyType.supplyTypeId)
        const response = await this.supplyCharacteristicService.getAll(1, 10, this.supplyType.supplyTypeId!)

        console.log('Characteristics response:', response)

        if ((response as any).type === 'success') {
          const data = (response as any).data
          // Según el JSON proporcionado, la estructura es supplieCharacteristics.data
          if (data?.supplieCharacteristics?.data) {
            this.characteristics = data.supplieCharacteristics.data
          } else if (data?.supplyCharacteristics?.data) {
            this.characteristics = data.supplyCharacteristics.data
          } else if (Array.isArray(data)) {
            this.characteristics = data
          } else {
            this.characteristics = []
          }
        } else {
          this.characteristics = []
        }
      } catch (error) {
        console.error('Error loading characteristics:', error)
        this.characteristics = []
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_loading_characteristics'),
          life: 3000
        })
      } finally {
        this.isLoading = false
      }
    },
    async refreshCharacteristics() {
      await this.loadCharacteristics()
    },
    addNewCharacteristic() {
      const newCharacteristic: SupplyCharacteristicInterface = {
        supplieCaracteristicId: null,
        supplyTypeId: this.supplyType.supplyTypeId!,
        supplieCaracteristicName: "",
        supplieCaracteristicType: "text",
        supplieCaracteristicCreatedAt: null,
        supplieCaracteristicUpdatedAt: null,
        deletedAt: null
      }
      this.selectedCharacteristic = newCharacteristic
      this.drawerCharacteristicForm = true
    },
    onEditCharacteristic(characteristic: SupplyCharacteristicInterface) {
      this.selectedCharacteristic = { ...characteristic }
      this.drawerCharacteristicForm = true
    },
    async onDeleteCharacteristic(characteristic: SupplyCharacteristicInterface) {
      console.log('onDeleteCharacteristic called with:', characteristic)
      if (!characteristic.supplieCaracteristicId) {
        console.error('Cannot delete characteristic without ID')
        return
      }

      this.isDeleting = true
      try {
        const response = await this.supplyCharacteristicService.delete(characteristic.supplieCaracteristicId)

        if ((response as any).type === 'success') {
          // Remover la característica de la lista
          this.characteristics = this.characteristics.filter(
            c => c.supplieCaracteristicId !== characteristic.supplieCaracteristicId
          )

          // Mostrar notificación de éxito
          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('characteristic_deleted_successfully'),
            life: 3000
          })
        } else {
          throw new Error((response as any).message || 'Error deleting characteristic')
        }
      } catch (error) {
        console.error('Error deleting characteristic:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_deleting_characteristic'),
          life: 3000
        })
      } finally {
        this.isDeleting = false
      }
    },
    async onSaveCharacteristic(characteristic: SupplyCharacteristicInterface) {
      console.log('onSaveCharacteristic called with:', characteristic)
      this.isSaving = true
      try {
        // Recargar las características después de guardar
        await this.loadCharacteristics()

        // Mostrar notificación de éxito
        this.$toast.add({
          severity: 'success',
          summary: this.t('success'),
          detail: characteristic.supplieCaracteristicId
            ? this.t('characteristic_updated_successfully')
            : this.t('characteristic_created_successfully'),
          life: 3000
        })

        this.drawerCharacteristicForm = false
        this.$emit('save', characteristic)
      } catch (error) {
        console.error('Error saving characteristic:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('error'),
          detail: this.t('error_saving_characteristic'),
          life: 3000
        })
      } finally {
        this.isSaving = false
      }
    },
    onCloseCharacteristicForm() {
      this.drawerCharacteristicForm = false
    },
    onCloseCharacteristicsManagement() {
      this.$emit('close')
    }
  }
})
