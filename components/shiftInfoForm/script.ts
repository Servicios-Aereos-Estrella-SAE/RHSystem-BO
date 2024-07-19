import type { ShiftInterface } from "~/resources/scripts/interfaces/ShiftInterface";
import ShiftService from "~/resources/scripts/services/ShiftService";

export default defineComponent({
  
  name: 'ShiftInfoForm',
  props: {
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    
  },
  data: () => ({
    submitted: false,
    selectedCities: '',
    daysOfWeeks: [
      { name: 'Monday', value: 1 },
      { name: 'Tuesday', value: 2 },
      { name: 'Wednesday', value: 3 },
      { name: 'Thursday', value: 4 },
      { name: 'Friday', value: 5 },
      { name: 'Saturday', value: 6 },
      { name: 'Sunday', value: 7 },
    ],
    selectedRestDays: [] as any[],

  }),
  computed: {
    filteredDaysOfWeek() {
      return this.daysOfWeeks.filter(day => day.value !== this.shift.shiftDayStart);
    }
  },
  watch: {
    
    selectedRestDays(newValue) {
      const restDaysString = newValue.map((day: { value: any; }) => day.value).join(',');
      this.shift.shiftRestDays = restDaysString;
      console.log(this.selectedRestDays)
    },
  },
  mounted() {
    if (this.shift.shiftRestDays) {
      const restDayValues = this.shift.shiftRestDays.split(',').map(Number);
      this.selectedRestDays = this.daysOfWeeks.filter(day => restDayValues.includes(day.value));
    }
    console.log(this.selectedRestDays);
  },
  methods: {
    async onSave() {
      this.submitted = true;
      if (this.shift && this.shift.shiftName && this.shift.shiftDayStart && this.shift.shiftTimeStart && this.shift.shiftActiveHours && this.shift.shiftRestDays) {
        if (this.shift.shiftRestDays.includes(this.shift.shiftDayStart)) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Start day cannot be a rest day',
            life: 5000
          });
          return;
        }
        const shiftService = new ShiftService();
        const response = this.shift.shiftId ? await shiftService.update(this.shift) : await shiftService.create(this.shift);
        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Shift saved successfully',
            life: 5000
          });
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
    },
    updateRestDays() {
      console.log(this.selectedRestDays)
      this.shift.shiftRestDays = this.selectedRestDays.join(',');
    }
  }
});
