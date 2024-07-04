import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { RoleInterface } from '~/resources/scripts/interfaces/RoleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import UserService from '~/resources/scripts/services/UserService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'userInfoForm',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true }
  },
  data: () => ({
    activeSwicht: true,
    roles: [] as RoleInterface[],
    employees: [] as EmployeeInterface[],
    submitted: false,
    currenUser: null as UserInterface | null,
    passwordConfirm: '',
    changePassword: false
  }),
  computed: {
  },
  async mounted() {
    await this.getRoles()
    await this.getEmployees()
    let isActive: any = 1
    isActive = this.user.userActive
    if (isActive === 1) {
      isActive = true
    }
    this.activeSwicht = isActive
  },
  methods: {
    async getRoles() {
      const response = await new RoleService().getFilteredList('', 1, 30)
      const list = response.status === 200 ? response._data.data.roles.data : []
      this.roles = list
    },
    async getEmployees() {
      const response = await new EmployeeService().getFilteredList('', 1, 30)
      const list = response.status === 200 ? response._data.data.employees.data : []
      for await (const employee of list) {
        employee.label = `${employee.employeeFirstName} ${employee.employeeLastName }`
      }
      this.employees = list
    },
    async onSave() {
      this.submitted = true
      const userService = new UserService()
      this.user.userActive = this.activeSwicht ? 1 : 0
      if (!userService.validateInfo(this.user)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      if (!this.user.userId && !this.user.userPassword) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing password',
            life: 5000,
        })
        return
      }
      if (this.user.userPassword) {
      if (!userService.validateSamePass(this.user.userPassword, this.passwordConfirm)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Passwords do not match',
            life: 5000,
        })
        return
        }
      }
      let userResponse = null
      if (!this.user.userId) {
        userResponse = await userService.store(this.user)
      } else {
        userResponse = await userService.update(this.user)
      }
      if (userResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: `User ${this.user.userId ? 'updated' : 'created'}`,
          detail: userResponse._data.message,
            life: 5000,
        })
      } else {
        this.$toast.add({
          severity: 'error',
          summary: `User ${this.user.userId ? 'updated' : 'created'}`,
          detail: userResponse._data.message,
            life: 5000,
        })
      }
    },
    onChangePassword() {
      this.changePassword = !this.changePassword
    }
  }
})