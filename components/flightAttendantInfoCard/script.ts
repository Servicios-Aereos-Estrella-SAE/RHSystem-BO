import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface'

export default defineComponent({
  name: 'FlightAttendantInfoCard',
  props: {
    flightAttendant: { type: Object as PropType<FlightAttendantInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null }
  },
  data: () => ({
  }),
  computed: {
    hireDate() {
      if (this.flightAttendant && this.flightAttendant.flightAttendantHireDate) {
        return DateTime.fromISO(this.flightAttendant.flightAttendantHireDate.toString()).toFormat('LLL dd, yyyy')
      }
      return ''
    }
  },
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