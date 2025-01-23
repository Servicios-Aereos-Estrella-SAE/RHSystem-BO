import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ReservationInterface } from '~/resources/scripts/interfaces/ReservationInterface'

export default defineComponent({
  name: 'reservationInfoCard',
  props: {
    reservation: { type: Object as PropType<ReservationInterface>, required: true },
    clickOnDetail: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
    firstLeg() {
      return this.reservation.reservationLegs?.length ? this.reservation.reservationLegs[0] : null
    },
    customerName() {
      // get full name from reservation.customer.person
      return this.reservation.customer?.person?.personFirstname ?? '' + ' ' + this.reservation.customer?.person?.personLastname ?? '' + ' ' + this.reservation.customer?.person?.personSecondLastname ?? ''
    }
  },
  mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnDetail) {
        this.clickOnDetail()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})