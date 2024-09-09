import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'
import AirportService from '~/resources/scripts/services/AirportService'
import AircraftPropertiesService from '~/resources/scripts/services/AircraftPropertyService'
import AircraftService from '~/resources/scripts/services/AircraftService'

export default defineComponent({
  name: 'AircraftInfoForm',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    airportOptions: [],
    aircraftPropertiesOptions: [],
    drawerProceedingFiles: false,
  }),
  computed: {
    isAircraftActive: {
      get() {
        return this.aircraft.aircraftActive === 1;
      },
      set(newValue: boolean) {
        this.aircraft.aircraftActive = newValue ? 1 : 0;
      }
    }
  },
  mounted() {
    this.loadAirportOptions();
    this.loadAircraftPropertiesOptions();
  },
  methods: {
    getProceedingFiles() {
      this.drawerProceedingFiles = true
    },
    async loadAirportOptions() {
      try {
        const airportService = new AirportService();
        const response = await airportService.getFilteredList(''); 
        if (response.status === 200) {
          this.airportOptions = response._data.data.data.map((airport: any) => ({
            name: airport.airportIcaoCode,
            id: airport.airportId,
          }));
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading airport options.',
            life: 5000
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading airport options.',
          life: 5000
        });
      }
    },
    async loadAircraftPropertiesOptions() {
      try {
        const aircraftPropertiesService = new AircraftPropertiesService();
        const response = await aircraftPropertiesService.getFilteredList(''); 
        if (response.status === 200) {
          this.aircraftPropertiesOptions = response._data.data.data.map((property: any) => ({
            name: property.aircraftPropertiesName,
            id: property.aircraftPropertiesId,
          }));
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error loading aircraft properties options.',
            life: 5000
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading aircraft properties options.',
          life: 5000
        });
      }
    },
    async onSave() {
      this.submitted = true;
      if (
        this.aircraft &&
        this.aircraft.aircraftRegistrationNumber &&
        this.aircraft.aircraftSerialNumber &&
        this.aircraft.airportId &&
        this.aircraft.aircraftPropertiesId
      ) {
        try {
          const response = this.aircraft.aircraftId
            ? await this.updateAircraft()
            : await this.createAircraft();

          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Aircraft saved successfully',
              life: 5000
            });
            const aircraft = response._data.data.data;
            this.$emit('onAircraftSave', aircraft as AircraftInterface);
            this.$emit('save-success');
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error saving the aircraft: ' + response._data.data.sqlMessage,
              life: 10000
            });
            this.$emit('save-error');
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the aircraf12t' + error,
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    },
    async createAircraft() {
      const aircraftService = new AircraftService();
      return await aircraftService.store(this.aircraft);
    },
    async updateAircraft() {
      const aircraftService = new AircraftService();
      return await aircraftService.update(this.aircraft);
    }
  }
});
