import type { ShiftInterface } from "~/resources/scripts/interfaces/ShiftInterface";
import ShiftService from "~/resources/scripts/services/ShiftService";

export default defineComponent({
  name: 'ShiftInfoForm',
  props: {
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false
  }),
  methods: {
    async onSave() {
      this.submitted = true;
      if (this.shift && this.shift.shiftName && this.shift.shiftDayStart && this.shift.shiftTimeStart && this.shift.shiftActiveHours && this.shift.shiftRestDays) {
        const shiftService = new ShiftService();
        const response = this.shift.shiftId ? await shiftService.update(this.shift) : await shiftService.create(this.shift);
        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Shift saved successfully',
            life: 5000
          });
          console.log(response._data.data);
          const shift = response._data.data
          this.$emit('onShiftSave', shift as ShiftInterface)
          this.$emit('save-success');
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the shift',
            life: 5000
          });
          this.$emit('save-error');
        }
      }
    }
  }
});
