import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftOperatorInterface } from '~/resources/scripts/interfaces/AircraftOperatorInterface'

export default defineComponent({
  name: 'AircraftOperatorInfoCard',
  props: {
    aircraftOperator: { type: Object as PropType<AircraftOperatorInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  async mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})