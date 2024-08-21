import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface'

export default defineComponent({
  name: 'AirportInfoCard',
  props: {
    airport: { type: Object as PropType<AirportInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null }
  },
  data: () => ({}),
  computed: {
    truncatedAirportName() {
      const maxLength = 25
      if (this.airport.airportName.length > maxLength) {
        return this.airport.airportName.slice(0, maxLength) + '...'
      }
      return this.airport.airportName
    },
    showEditButton() {
      return !!this.clickOnEdit
    }
  },
  mounted() {},
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    }
  }
})
