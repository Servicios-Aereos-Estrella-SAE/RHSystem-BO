import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import { SUPPLY_CHARACTERISTIC_TYPES, SUPPLY_CHARACTERISTIC_TYPES_EN } from '~/resources/scripts/enums/SupplyCharacteristicType'

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
  data: () => ({
    isLoading: false as boolean
  }),
  computed: {
    characteristicTypeOptions(): Array<{label: string, value: any}> {
      const lang = (this.$i18n?.locale || 'es').toString().toLowerCase()
      return lang.startsWith('en') ? SUPPLY_CHARACTERISTIC_TYPES_EN : SUPPLY_CHARACTERISTIC_TYPES
    }
  },
  methods: {
    getTypeLabel(type: string) {
      const typeOption = this.characteristicTypeOptions.find((option: any) => option.value === type)
      return typeOption ? typeOption.label : type
    },
    handlerClickOnEdit() {
      //console.log('CharacteristicCard: Edit clicked for characteristic:', this.characteristic)
      this.$emit('click-edit', this.characteristic)
    },
    handlerClickOnDelete() {
      this.$emit('click-delete', this.characteristic)
    }
  }
})
