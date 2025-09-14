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
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
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
      const list = (response.status === 200 ? response._data.data.roles.data : []) as RoleInterface[]
      this.roles = list.filter((rol: RoleInterface) => rol.roleSlug !== 'root')
    },
    async getEmployees() {
      let response = null
      if (this.isNewUser || !this.hasEmployee) {
        response = await new EmployeeService().getOnlyWithOutUser('', null, null)
      } else {
        response = await new EmployeeService().getFilteredList('', null, null, null, 1, 9999999, false, null)
      }
      const list = response.status === 200 ? response._data.data.employees.data : []
      for await (const employee of list) {
        employee.label = `${employee.person?.personFirstname} ${employee.person?.personLastname} ${employee.person?.personSecondLastname}`
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
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (this.user.userEmail) {
        if (!userService.validateEmail(this.user.userEmail)) {
          this.isEmailInvalid = true
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: `${this.t('email')} ${this.t('is_not_valid')}`,
            life: 5000,
          })
          return
        }
      }

      if ((!this.user.userId || this.changePassword) && !this.user.userPassword) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_password'),
          life: 5000,
        })
        return
      }
      if (this.user.userPassword) {
        if (!userService.validateSamePass(this.user.userPassword, this.passwordConfirm)) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('passwords_do_not_match'),
            life: 5000,
          })
          return
        }
        if (!userService.isValidPassword(this.user.userPassword)) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('passwords_not_is_valid'),
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
          summary: `${this.t('user')} ${this.user.userId ? this.t('updated') : this.t('created')}`,
          detail: userResponse._data.message,
          life: 5000,
        })

        userResponse = await userService.show(userResponse._data.data.user.userId)
        if (userResponse.status === 200) {
          const user = userResponse._data.data.user
          this.$emit('onUserSave', user as UserInterface)
        }
      } else {
        const msgError = userResponse._data.error ? userResponse._data.error : userResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `${this.t('user')} ${this.user.userId ? this.t('updated') : this.t('created')}`,
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
    },
    onEmployeeSelect() {
      if (this.user.personId) {
        const employee = this.employees.find(emp => emp.personId === this.user.personId)
        this.user.userEmail = employee ? employee.employeeBusinessEmail : ''
      }
    }
  }
})
