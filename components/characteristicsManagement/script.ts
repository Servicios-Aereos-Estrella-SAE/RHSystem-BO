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

    // Estados de carga
    isLoading: false as boolean,
    isInitialLoad: true as boolean,
    isSaving: false as boolean,
    isDeleting: false as boolean,

    // Confirmación de eliminación
    showConfirmDeleteCharacteristic: false as boolean,
    characteristicToDelete: null as SupplyCharacteristicInterface | null,
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
        if (newSupplyType?.supplyTypeId) {
          this.loadCharacteristics()
        }
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    this.isInitialLoad = true
    await this.loadCharacteristics()
    this.isInitialLoad = false
  },
  methods: {
    async loadCharacteristics() {
      this.isLoading = true
      try {
        if (!this.supplyType?.supplyTypeId) return

        const response = await this.supplyCharacteristicService.getAll(1, 10, this.supplyType.supplyTypeId!)
        if ((response as any).type === 'success') {
          const data = (response as any).data
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

    // ✅ Mostrar confirmación antes de eliminar
    onDeleteCharacteristic(characteristic: SupplyCharacteristicInterface) {
      this.characteristicToDelete = characteristic
      this.showConfirmDeleteCharacteristic = true
    },

    // ✅ Confirmar eliminación
    async confirmDeleteCharacteristic() {
      if (!this.characteristicToDelete?.supplieCaracteristicId) return
      this.isDeleting = true

      try {
        const response = await this.supplyCharacteristicService.delete(this.characteristicToDelete.supplieCaracteristicId)

        if ((response as any).type === 'success') {
          await this.loadCharacteristics()
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
        this.showConfirmDeleteCharacteristic = false
        this.characteristicToDelete = null
      }
    },

    cancelDeleteCharacteristic() {
      this.showConfirmDeleteCharacteristic = false
      this.characteristicToDelete = null
    },

    async onSaveCharacteristic(characteristic: SupplyCharacteristicInterface) {
      await this.loadCharacteristics()
      this.$emit('save', characteristic)

      if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur()
      }

      await this.$nextTick()
      this.drawerCharacteristicForm = false
    },

    onCloseCharacteristicForm() {
      this.$nextTick(() => {
        this.drawerCharacteristicForm = false
      })
    },

    onCloseCharacteristicsManagement() {
      this.$emit('close')
    }
  }
})
