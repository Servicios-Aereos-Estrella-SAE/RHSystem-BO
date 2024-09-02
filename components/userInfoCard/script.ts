import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import PersonService from '~/resources/scripts/services/PersonService'

export default defineComponent({
  name: 'userInfoCard',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
  },
  data: () => ({
    employeeNumber: null as string | null,
    photo: null as string | null,
    department: null as string | null,
    position: null as string | null,
  }),
  computed: {
    getPhoto() {
      if (this.user.employee && this.user.employee.employeePhoto) {
        return this.user.employee.employeePhoto
      } else {
        return null
      }
    },
    getDepartment() {
      if (this.user.employee && this.user.employee.department) {
        return this.user.employee.department.departmentName
      } else {
        return null
      }
    },
    getPosition() {
      if (this.user.employee && this.user.employee.position) {
        return this.user.employee.position.positionName
      } else {
        return null
      }
    },
    getEmployeeNumber() {
      if (this.user.employee && this.user.employee.position) {
        return this.user.employee.employeeCode
      } else {
        return null
      }
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
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})