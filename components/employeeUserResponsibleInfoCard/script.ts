import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface'

export default defineComponent({
  name: 'employeeUserResponsibleInfoCard',
  props: {
    userResponsibleEmployee: { type: Object as PropType<UserResponsibleEmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canManageResponsibleEdit: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
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
      if (this.userResponsibleEmployee.user?.employee && this.userResponsibleEmployee.user.employee.employeePhoto) {
        return this.userResponsibleEmployee.user.employee.employeePhoto
      } else {
        return null
      }
    },
    getDepartment() {
      if (this.userResponsibleEmployee.user?.employee && this.userResponsibleEmployee.user.employee.department) {
        return this.userResponsibleEmployee.user.employee.department.departmentName
      } else {
        return null
      }
    },
    getPosition() {
      if (this.userResponsibleEmployee.user?.employee && this.userResponsibleEmployee.user.employee.position) {
        return this.userResponsibleEmployee.user.employee.position.positionName
      } else {
        return null
      }
    },
    getEmployeeNumber() {
      if (this.userResponsibleEmployee.user?.employee && this.userResponsibleEmployee.user.employee.position) {
        return this.userResponsibleEmployee.user.employee.employeeCode
      } else {
        return null
      }
    },
    employeeName() {
      if (!this.userResponsibleEmployee.user?.person) {
        return '---'
      }

      const name = `${this.userResponsibleEmployee.user.person.personFirstname || ''} ${this.userResponsibleEmployee.user.person.personLastname || ''} ${this.userResponsibleEmployee.user.person.personSecondLastname || ''}`
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