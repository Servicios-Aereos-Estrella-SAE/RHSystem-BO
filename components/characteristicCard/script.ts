import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import { SUPPLY_CHARACTERISTIC_TYPES } from '~/resources/scripts/enums/SupplyCharacteristicType'

export default defineComponent({
  name: 'characteristicCard',
  props: {
    characteristic: { type: Object as PropType<SupplyCharacteristicInterface>, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    isDeleting: { type: Boolean, default: false },
  },
  emits: ['click-edit', 'click-delete'],
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  methods: {
    getTypeLabel(type: string) {
      const typeOption = SUPPLY_CHARACTERISTIC_TYPES.find(option => option.value === type)
      return typeOption ? typeOption.label : type
    },
    handlerClickOnEdit() {
      console.log('CharacteristicCard: Edit clicked for characteristic:', this.characteristic)
      this.$emit('click-edit', this.characteristic)
    },
    handlerClickOnDelete() {
      console.log('CharacteristicCard: Delete clicked for characteristic:', this.characteristic)
      this.$emit('click-delete', this.characteristic)
    }
  }
})
