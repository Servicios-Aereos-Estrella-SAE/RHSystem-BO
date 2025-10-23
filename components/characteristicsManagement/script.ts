import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyTypeInterface } from '~/resources/scripts/interfaces/SupplyTypeInterface'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'

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
    return {
      t
    }
  },
  data: () => ({
    characteristics: [] as SupplyCharacteristicInterface[],
    selectedCharacteristic: null as SupplyCharacteristicInterface | null,
    drawerCharacteristicForm: false as boolean,
    isLoading: false as boolean,
    isInitialLoad: true as boolean,
  }),
  computed: {
    characteristicFormTitle() {
      return this.selectedCharacteristic?.supplieCaracteristicId
        ? this.t('edit_characteristic')
        : this.t('add_characteristic')
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
        // Implementar carga de características
        this.characteristics = []
      } catch (error) {
        console.error('Error loading characteristics:', error)
        this.characteristics = []
      } finally {
        this.isLoading = false
      }
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
    onDeleteCharacteristic(characteristic: SupplyCharacteristicInterface) {
      // Implementar eliminación
    },
    onSaveCharacteristic(characteristic: SupplyCharacteristicInterface) {
      this.selectedCharacteristic = { ...characteristic }
      this.loadCharacteristics()
      this.drawerCharacteristicForm = false
      this.$emit('save', characteristic)
    },
    onCloseCharacteristicForm() {
      this.drawerCharacteristicForm = false
    },
    onCloseCharacteristicsManagement() {
      this.$emit('close')
    }
  }
})
