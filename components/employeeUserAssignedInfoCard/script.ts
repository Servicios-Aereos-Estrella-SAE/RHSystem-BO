import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface'

export default defineComponent({
  name: 'employeeUserAssignedInfoCard',
  props: {
    userAssignedEmployee: { type: Object as PropType<UserResponsibleEmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canManageAssignedEdit: { type: Boolean, required: true },
    canManageUserAssigned: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    canManageCurrentPeriod: false,
    employeeNumber: null as string | null,
    photo: null as string | null,
    department: null as string | null,
    position: null as string | null
  }),
  computed: {
    getPhoto() {
      if (this.userAssignedEmployee.employeeAssigned && this.userAssignedEmployee.employeeAssigned.employeePhoto) {
        return this.userAssignedEmployee.employeeAssigned.employeePhoto
      } else {
        return null
      }
    },
    getDepartment() {
      if (this.userAssignedEmployee.employeeAssigned && this.userAssignedEmployee.employeeAssigned.department) {
        return this.userAssignedEmployee.employeeAssigned.department.departmentName
      } else {
        return null
      }
    },
    getPosition() {
      if (this.userAssignedEmployee.employeeAssigned && this.userAssignedEmployee.employeeAssigned.position) {
        return this.userAssignedEmployee.employeeAssigned.position.positionName
      } else {
        return null
      }
    },
    getEmployeeNumber() {
      if (this.userAssignedEmployee.employeeAssigned && this.userAssignedEmployee.employeeAssigned.position) {
        return this.userAssignedEmployee.employeeAssigned.employeeCode
      } else {
        return null
      }
    },
    employeeName() {
      if (!this.userAssignedEmployee.employeeAssigned?.person) {
        return '---'
      }

      const name = `${this.userAssignedEmployee.employeeAssigned.person.personFirstname || ''} ${this.userAssignedEmployee.employeeAssigned.person.personLastname || ''} ${this.userAssignedEmployee.employeeAssigned.person.personSecondLastname || ''}`
      return name
    },
    employeeInitial() {
      const name = this.employeeName
      const first = name.charAt(0)
      return first.toUpperCase()
    }
  },
  async mounted() {
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})