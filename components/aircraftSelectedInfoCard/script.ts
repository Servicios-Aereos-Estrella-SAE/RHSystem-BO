import { defineComponent } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { ReservationInterface } from '~/resources/scripts/interfaces/ReservationInterface';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import { DateTime } from 'luxon';

export default defineComponent({
  props: {
    clickOnSave: { type: Function, required: true },
    reservation: { type: Object as () => ReservationInterface, required: true },
    clickOnCancel: { type: Function, required: true },
    editMode: { type: Boolean, required: true },
  },
  components: {
    Toast,
    ToastService,
  },
  name: 'aircraftSelectedInfoCard',
  data: () => ({
    isSubmitted: false,
  }),
  watch: {
  'reservation.aircraft': {
      handler() {
        console.log('Aircraft changed', this.reservation.aircraft);
      },
      deep: true,
    },
  },
  methods: {
     formatDate(date: Date): string {
      // Conviertes un objeto Date de JS a un DateTime de Luxon 
      // y luego lo formateas como necesites
      return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    }
  },
})