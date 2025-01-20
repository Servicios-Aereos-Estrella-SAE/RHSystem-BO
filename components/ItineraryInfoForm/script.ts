import { defineComponent } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { ReservationLegInterface } from "~/resources/scripts/interfaces/ReservationLegInterface";
import AirportService from '../../resources/scripts/services/AirportService';
import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface';
export default defineComponent({
  name: 'itineraryInfoForm',
  props: {
    reservationLeg: { type: Object as () => ReservationLegInterface, required: true },
    index: { type: Number, required: true },
    addLeg: { type: Function, required: true },
    removeLeg: { type: Function, required: true },
    isLast: { type: Boolean, required: true },
    isSubmitted: { type: Boolean, required: true },
  },
  components: {
    Toast,
    ToastService,
  },
  computed: {
    formatAirports() {
      return this.airports.map((airport: AirportInterface) => ({
        ...airport,
        customName: `${airport.airportDisplayLocationName} (${airport.airportIcaoCode})`,
      }));
    }
  },
  data: () => ({
    departureAirport: null as AirportInterface | null,
    arrivalAirport: null as AirportInterface | null,
    airports: [] as AirportInterface[],
    airportService: new AirportService(),
  }),
  async mounted() {
    await this.handlerSearchAirport();
  },
  methods: {
    async handlerSearchAirport() {
      const response = await this.airportService.getFilteredList('', 1, 999999999);
      const list = response.status === 200 ? response._data.data.data : [];
      this.airports = list;
    },
  },
})