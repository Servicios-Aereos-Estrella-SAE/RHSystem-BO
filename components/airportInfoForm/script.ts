
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface'
import AirportService from '~/resources/scripts/services/AirportService'

export default defineComponent({
  name: 'AirportInfoForm',
  props: {
    airport: { type: Object as PropType<AirportInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    cities: [
      { name: 'Heliport', value: 'heliport' },
      { name: 'Small Airport', value: 'small_airport' },
      { name: 'Seaplane Base', value: 'seaplane_base' },
      { name: 'Ballonport', value: 'balloonport' },
      { name: 'Medium Airport', value: 'medium_airport' },
      { name: 'Large Airport', value: 'large_airport' },
      
    ],
  }),
  computed: {
    isAirportActive: {
      get() {
        return this.airport.airportActive === 1;
      },
      set(newValue: boolean) {
        this.airport.airportActive = newValue ? 1 : 0;
      }
    }
  },
  methods: {
    async onSave() {
      this.submitted = true;
      if (
        this.airport &&
        this.airport.airportName &&
        this.airport.airportType &&
        this.airport.airportIcaoCode &&
        this.airport.airportIataCode &&
        this.airport.airportLatitudeDeg !== undefined &&
        this.airport.airportLongitudeDeg !== undefined &&
        this.airport.airportElevationFt !== undefined &&
        this.airport.airportDisplayLocationName &&
        this.airport.airportIsoCountry &&
        this.airport.airportIsoRegion
      ) {
        try {
          const airportService = new AirportService();
          const response = this.airport.airportId
            ? await airportService.update(this.airport)
            : await airportService.store(this.airport);

          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Airport saved successfully',
              life: 5000
            });
            const airport = response._data.data.data;
            this.$emit('onAirportSave', airport as AirportInterface);
            this.$emit('save-success');
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error saving the airport:'+ response._data.data.data.sqlMessage,
              life: 10000
            });
            this.$emit('save-error');
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the airport2',
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    }
  }
});
