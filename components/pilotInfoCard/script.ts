import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'

export default defineComponent({
  name: 'PilotInfoCard',
  props: {
    pilot: { type: Object as PropType<PilotInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({
  }),
  computed: {
    hireDate() {
      if (this.pilot && this.pilot.employee?.employeeHireDate) {
        return DateTime.fromISO(this.pilot.employee.employeeHireDate.toString()).toFormat('LLL dd, yyyy')
      }
      return ''
    }
  },
  async mounted() {
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    formatName(name: string | null | undefined) {
      if (!name) return '';
    
      return name
        .split(' ')
        .map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})