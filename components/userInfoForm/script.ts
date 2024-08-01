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
import PersonService from '~/resources/scripts/services/PersonService'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'userInfoForm',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    roles: [] as RoleInterface[],
    employees: [] as EmployeeInterface[],
    submitted: false,
    currenUser: null as UserInterface | null,
    passwordConfirm: '',
    changePassword: false,
    hasEmployee: false,
    isNewUser: false,
    isReady: false,
    isEmailInvalid: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    let isActive: number = 1
    isActive = this.user.userActive
    this.activeSwicht = isActive === 1 ? true : false
    this.isNewUser = !this.user.userId ? true : false
    await this.getRoles()
    if (this.user.personId) {
      const personService = new PersonService()
      const personResponse = await personService.getEmployee(this.user.personId)
      if (personResponse) {
        if (personResponse._data.data.employee) {
         this.hasEmployee = true
        }
      }
    }
    await this.getEmployees()
    this.isReady = true
  },
  methods: {
    async getRoles() {
      const response = await new RoleService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.roles.data : []
      this.roles = list
    },
    async getEmployees() {
      let response = null
      if (this.isNewUser || !this.hasEmployee) {
        response = await new EmployeeService().getOnlyWithOutUser('',null,null)
      } else {
        response = await new EmployeeService().getFilteredList('',null, null, null)
      }
      const list = response.status === 200 ? response._data.data.employees.data : []
      for await (const employee of list) {
        employee.label = `${employee.employeeFirstName} ${employee.employeeLastName }`
      }
      this.employees = list
    },
    async onSave() {
      this.isEmailInvalid = false
      this.submitted = true
      const userService = new UserService()
      if (!userService.validateInfo(this.user)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      if (this.user.userEmail) {
        if (!userService.validateEmail(this.user.userEmail)) {
          this.isEmailInvalid = true
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'Email not valid',
              life: 5000,
          })
          return
        }
      }
    
      if ((!this.user.userId || this.changePassword) && !this.user.userPassword) {
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
        if (!userService.isValidPassword(this.user.userPassword)) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'Passwords not is valid',
              life: 5000,
          })
          return
        }
      }
      this.user.userActive = this.activeSwicht ? 1 : 0
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
       
        userResponse = await  userService.show(userResponse._data.data.user.userId)
        if (userResponse.status === 200) {
          const user = userResponse._data.data.user
          this.$emit('onUserSave', user as UserInterface)
        }
      } else {
        const msgError = userResponse._data.error ? userResponse._data.error : userResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `User ${this.user.userId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
    },
    onChangePassword() {
      this.changePassword = !this.changePassword
      this.user.userPassword = ''
      this.passwordConfirm = ''
    },
   async generatePassword() {
    const userService = new UserService()
    const password = userService.generatePassword()
    this.user.userPassword = password
    this.passwordConfirm = password
   }
  }
})