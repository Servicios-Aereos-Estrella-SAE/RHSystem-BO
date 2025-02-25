import { defineComponent } from 'vue'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import type { ReservationInterface } from '~/resources/scripts/interfaces/ReservationInterface'
import { DateTime } from 'luxon'

export default defineComponent({
  props: {
    reservation: { type: Object as () => ReservationInterface, required: true },
    canUpdate: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
  components: {
    Toast,
    ToastService,
  },
  name: 'reservationDetailsCard',
  data: () => ({
    isSubmitted: false,
  }),
  watch: {
  'reservation.aircraft': {
      handler() {
        console.log('Aircraft changed', this.reservation.aircraft)
      },
      deep: true,
    },
  },
  methods: {
    legDateFormat (date: Date, time: string) {
      const zoneName = DateTime.now().zoneName
      const legDateTime = `${date.toString()}T${time}.000-06:00`
      const dateFormatted = DateTime.fromISO(legDateTime, { zone: zoneName })

      return dateFormatted.setLocale('en').toFormat('ff')
    },
    handlerClickOnSave() {
      this.$emit('onSave')
    },
    currencyFormat (value: number | string) {
      const val = parseFloat(`${value}`)
      const amount = new Intl.NumberFormat().format(val)
      return amount
    },
    taxFormat (value: number | string) {
      const val = parseFloat(`${value}`) * 100
      const amount = `${parseFloat(val.toString()).toFixed(0)}%`
      return amount
    }
  },
})
