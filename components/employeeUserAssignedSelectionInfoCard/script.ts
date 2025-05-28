import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'

export default defineComponent({
  name: 'employeeUserAssignedSelectionInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
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
    position: null as string | null,
    checked: false,
    userResponsibleEmployeeReadonly: false,
    userResponsibleEmployeeDirectBoss: false,
  }),
  watch: {
    'employee.userResponsibleEmployeeReadonly': function (newVal) {
      if (newVal) {
        this.employee.userResponsibleEmployeeDirectBoss = false
      }
    },
    'employee.userResponsibleEmployeeDirectBoss': function (newVal) {
      if (newVal) {
        this.employee.userResponsibleEmployeeReadonly = false
      }
    },
  },
  computed: {
    getPhoto() {
      if (this.employee && this.employee.employeePhoto) {
        return this.employee.employeePhoto
      } else {
        return null
      }
    },
    getDepartment() {
      if (this.employee && this.employee.department) {
        return this.employee.department.departmentName
      } else {
        return null
      }
    },
    getPosition() {
      if (this.employee && this.employee.position) {
        return this.employee.position.positionName
      } else {
        return null
      }
    },
    getEmployeeNumber() {
      if (this.employee && this.employee.position) {
        return this.employee.employeeCode
      } else {
        return null
      }
    },
    employeeName() {
      if (!this.employee?.person) {
        return '---'
      }

      const name = `${this.employee.person.personFirstname || ''} ${this.employee.person.personLastname || ''} ${this.employee.person.personSecondLastname || ''}`
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