import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftClassInterface } from '~/resources/scripts/interfaces/AircraftClassInterface'
import AircraftClassService from '~/resources/scripts/services/AircraftClassService'

export default defineComponent({
  name: 'AircraftClassInfoForm',
  props: {
    aircraftClass: { type: Object as PropType<AircraftClassInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    photoForm: '',
  }),
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    
    onFileChange(event: { target: { files: any[]; }; }) {
      const file = event.target.files[0]
      if (file) {
          this.aircraftClass.aircraftClassBanner = file
          this.photoForm = URL.createObjectURL(file)
          this.$emit('file-selected', file)
      }
  },
    async onSave() {
      this.submitted = true;
      if (this.aircraftClass && this.aircraftClass.aircraftClassName && this.aircraftClass.aircraftClassShortDescription && this.aircraftClass.aircraftClassLongDescription && this.aircraftClass.aircraftClassBanner && this.aircraftClass.aircraftClassStatus !== undefined) {
        try {
          const aircraftClassService = new AircraftClassService();
          const response = this.aircraftClass.aircraftClassId ? await aircraftClassService.update(this.aircraftClass) : await aircraftClassService.create(this.aircraftClass);
          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Aircraft class saved successfully',
              life: 5000
            });
            const aircraftClass = response._data.data.data
            this.$emit('onAircraftClassSave', aircraftClass as AircraftClassInterface)
            this.$emit('save-success');
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error saving the aircraft class',
              life: 5000
            });
            this.$emit('save-error');
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the aircraft class',
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    },
  }
});
