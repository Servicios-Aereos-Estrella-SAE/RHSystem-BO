import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'

export default defineComponent({
  name: 'AircraftInfoCard',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({}),
  // computed: {
  //   truncatedAircraftRegistrationNumber() {
  //     const maxLength = 20
  //     if (this.aircraft.aircraftRegistrationNumber.length > maxLength) {
  //       return this.aircraft.aircraftRegistrationNumber.slice(0, maxLength) + '...'
  //     }
  //     return this.aircraft.aircraftRegistrationNumber
  //   },
  //   showEditButton() {
  //     return !!this.clickOnEdit
  //   }
  // },
  mounted() {},
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit(this.aircraft)
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete(this.aircraft)
      }
    }
  }
})
