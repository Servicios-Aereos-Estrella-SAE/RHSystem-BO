import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ReservationInterface } from '~/resources/scripts/interfaces/ReservationInterface'
import type { ReservationLegInterface } from '~/resources/scripts/interfaces/ReservationLegInterface'

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
      if (!this.reservation.reservationLegs) {
        return null
      }

      return this.reservation.reservationLegs.length > 0 ? this.reservation.reservationLegs[0] : null
    },
    lastLeg() {
      if (!this.reservation.reservationLegs) {
        return null
      }

      const leg = this.reservation.reservationLegs.length > 0 ? this.reservation.reservationLegs[this.reservation.reservationLegs.length - 1] : null

      if ((this.firstLeg && leg) && (this.firstLeg.reservationLegId === leg.reservationLegId)) {
        return null
      }

      return leg
    },
    customerName() {
      return this.reservation.customer?.person?.personFirstname ?? '' + ' ' + this.reservation.customer?.person?.personLastname ?? '' + ' ' + this.reservation.customer?.person?.personSecondLastname ?? ''
    },
    picName () {
      const name = `${this.reservation.pilotPic?.employee?.person?.personFirstname ?? ''} ${this.reservation.pilotPic?.employee?.person?.personLastname ?? ''} ${this.reservation.pilotPic?.employee?.person?.personSecondLastname ?? ''}`
      return name
    },
    sicName () {
      const name = `${this.reservation.pilotSic?.employee?.person?.personFirstname ?? ''} ${this.reservation.pilotSic?.employee?.person?.personLastname ?? ''} ${this.reservation.pilotSic?.employee?.person?.personSecondLastname ?? ''}`
      return name
    },
    subtotal () {
      const val = parseFloat(`${this.reservation.reservationTotal}`)
      const amount = new Intl.NumberFormat().format(val)
      return amount
    },
    tax () {
      const val = parseFloat(`${this.reservation.reservationTax}`)
      const amount = new Intl.NumberFormat().format(val)
      return amount
    },
    total () {
      const val = parseFloat(`${this.reservation.reservationSubtotal}`)
      const amount = new Intl.NumberFormat().format(val)
      return amount
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
    legDateFormat (leg: ReservationLegInterface) {
      const zoneName = DateTime.now().zoneName
      const legDateTime = `${leg.reservationLegDepartureDate?.toString()}T${leg.reservationLegDepartureTime}.000-06:00`
      const date = DateTime.fromISO(legDateTime, { zone: zoneName })

      return date.setLocale('en').toFormat('ff')
    }
  }
})
