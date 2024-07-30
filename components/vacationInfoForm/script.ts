import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { VacationInterface } from '~/resources/scripts/interfaces/VacationInterface'
import VacationService from '~/resources/scripts/services/VacationService'

export default defineComponent({
  name: 'VacationInfoForm',
  props: {
    vacation: { type: Object as PropType<VacationInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
  }),
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    async onSave() {
      this.submitted = true;
      if (this.vacation && this.vacation.yearsOfService && this.vacation.vacationDays) {
        try {
          const vacationService = new VacationService();
          const response = this.vacation.id ? await vacationService.update(this.vacation) : await vacationService.create(this.vacation);
          if (response.status === 200 || response.status === 201) {
            this.$toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Vacation setting saved successfully',
              life: 5000
            });
            const vacation = response._data.data.data
            this.$emit('onVacationSave', vacation as VacationInterface)
            this.$emit('save-success');
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'There was an error saving the vacation setting',
              life: 5000
            });
            this.$emit('save-error');
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the vacation setting',
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    },
  }
});
