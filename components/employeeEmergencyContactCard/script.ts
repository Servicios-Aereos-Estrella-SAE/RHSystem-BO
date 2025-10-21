import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeEmergencyContactInterface } from '~/resources/scripts/interfaces/EmployeeEmergencyContactInterface'

export default defineComponent({
  name: 'employeeEmergencyContactCard',
  props: {
    employeeEmergencyContact: {
      type: Object as PropType<EmployeeEmergencyContactInterface>,
      required: true
    },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    clickOnEdit: { type: Function, required: true },
    clickOnDelete: { type: Function, required: true }
  },
  computed: {
    getFullName() {
      const {
        employeeEmergencyContactFirstname,
        employeeEmergencyContactLastname,
        employeeEmergencyContactSecondLastname
      } = this.employeeEmergencyContact

      return `${employeeEmergencyContactFirstname} ${employeeEmergencyContactLastname} ${employeeEmergencyContactSecondLastname}`.trim()
    }
  }
})
