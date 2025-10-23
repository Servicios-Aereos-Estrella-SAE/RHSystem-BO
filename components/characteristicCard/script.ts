import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { SupplyCharacteristicInterface } from '~/resources/scripts/interfaces/SupplyCharacteristicInterface'
import { SUPPLY_CHARACTERISTIC_TYPES } from '~/resources/scripts/enums/SupplyCharacteristicType'

export default defineComponent({
  name: 'characteristicCard',
  props: {
    characteristic: { type: Object as PropType<SupplyCharacteristicInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
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
      if (this.clickOnEdit && this.characteristic) {
        this.clickOnEdit(this.characteristic)
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete && this.characteristic) {
        this.clickOnDelete(this.characteristic)
      }
    }
  }
})
