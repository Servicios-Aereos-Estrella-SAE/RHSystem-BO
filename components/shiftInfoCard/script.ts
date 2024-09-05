import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'

export default defineComponent({
  name: 'shiftInfoCard',
  props: {
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    showEditButton: { type: Boolean, default: true },
    showDeleteButton: { type: Boolean, default: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    getRestDaysNames(restDays: string): string {
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let daysArray: number[];
      
      if (typeof restDays === 'string') {
        daysArray = restDays.split(',').map(Number);
      } else if (typeof restDays === 'number') {
        daysArray = [restDays];
      } else {
        return '';
      }

      return daysArray.map(day => dayNames[day - 1]).join(', ');
    },
  }
})