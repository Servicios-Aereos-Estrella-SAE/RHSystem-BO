import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftClassInterface } from '~/resources/scripts/interfaces/AircraftClassInterface';
import type { AircraftPropertyInterface } from '~/resources/scripts/interfaces/AircraftPropertyInterface'
import AircraftClassService from '~/resources/scripts/services/AircraftClassService';
import AircraftPropertyService from '~/resources/scripts/services/AircraftPropertyService'

export default defineComponent({
  name: 'AircraftPropertyInfoForm',
  props: {
    aircraftProperty: { type: Object as PropType<AircraftPropertyInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    photoForm: '',
    aircraftClasses: [] as AircraftClassInterface[],
    selectedAircraftClassId: null as number | null,  
}),
  computed: {},
  watch: {},
  mounted() {
    this.fetchAircraftClasses()
  },
  methods: {

    async fetchAircraftClasses() {
        try {
          const aircraftClassService = new AircraftClassService()
          const response = await aircraftClassService.getFilteredList('',1,100) 
          this.aircraftClasses = response._data.data.data 
          
          // if (this.aircraftProperty && this.aircraftProperty.aircraftClassId) {
          //   const selectedClass = this.aircraftClasses.find(
          //     (ac) => ac.aircraftClassId === this.aircraftProperty.aircraftClassId
          //   );

          //   if (selectedClass) {
          //       this.selectedAircraftClassId = selectedClass.aircraftClassId;
          //       this.photoForm = selectedClass.aircraftClassBanner;
          //   }
          // }
          if (this.aircraftProperty && this.aircraftProperty.aircraftPropertiesBanner) {
            // Asigna directamente el id de clase de aeronave y la imagen
            this.selectedAircraftClassId = this.aircraftProperty.aircraftClassId;
            this.photoForm = this.aircraftProperty.aircraftPropertiesBanner;
        }
        } catch (error) {
          console.error('Error fetching aircraft classes:', error)
        }
      },
      async onAircraftClassChange(event: any) {
        const selectedId = event.value;
        this.aircraftProperty.aircraftClassId = selectedId;
        if (selectedId) {
          const selectedClass = this.aircraftClasses.find(ac => ac.aircraftClassId === selectedId);
          if (selectedClass) {
            this.photoForm = selectedClass.aircraftClassBanner;
          } else {
            this.photoForm = '';
          }
        } else {
          this.photoForm = '';
        }
      },
  
    onFileChange(event: { target: { files: any[]; }; }) {
      const file = event.target.files[0]
      if (file) {
        this.aircraftProperty.aircraftPropertyBanner = file 
        this.photoForm = URL.createObjectURL(file)
        this.$emit('file-selected', file)
      }
    },
    async onSave() {
      this.submitted = true;
      if (
        this.aircraftProperty &&
        this.aircraftProperty.aircraftPropertiesName &&
        this.aircraftProperty.aircraftClassId !== undefined && 
        this.aircraftProperty.aircraftPropertiesPax !== undefined &&
        this.aircraftProperty.aircraftPropertiesSpeed !== undefined &&
        this.aircraftProperty.aircraftPropertiesMaxKg !== undefined &&
        this.aircraftProperty.aircraftPropertiesAutonomy !== undefined &&
        this.aircraftProperty.aircraftPropertiesAutonomyHours !== undefined &&
        this.aircraftProperty.aircraftPropertiesLandingCostNational !== undefined &&
        this.aircraftProperty.aircraftPropertiesOvernightStayInternational !== undefined
        
      ) {
        try {
          const aircraftPropertyService = new AircraftPropertyService();
          const response = this.aircraftProperty.aircraftPropertiesId
            ? await aircraftPropertyService.update(this.aircraftProperty) 
            : await aircraftPropertyService.create(this.aircraftProperty);
          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Aircraft property saved successfully',
              life: 5000
            });
            const aircraftProperty = response._data.data.data
            this.$emit('onAircraftPropertySave', aircraftProperty as AircraftPropertyInterface)
            this.$emit('save-success');
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error saving the aircraft property',
              life: 5000
            });
            this.$emit('save-error');
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the aircraft property',
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    },
  }
});
