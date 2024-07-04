import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { RoleInterface } from '~/resources/scripts/interfaces/RoleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import UserService from '~/resources/scripts/services/UserService'
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

export default defineComponent({
  components: {
    Toast,
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
    const toast = useToast()
    /* const userService = new UserService()
    const userResponse = await userService.show(this.user.userId)
    console.log(userResponse)
    if (userResponse.status === 200) {
      this.currenUser = userResponse._data.data.user
      console.log(this.currenUser)
    } */
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', group: 'tl', life: 3000 })
    // this.changePassword = this.user.userId ? false : true
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
        // console.log('Debe ingresar todos los datos')
        return
      }
      if (!this.user.userId && !this.user.userPassword) {
        // console.log('Debe ingresar la contraseña')
        return
      }
      if (this.user.userPassword) {
        if (!userService.validateStrongPass(this.user.userPassword, this.passwordConfirm)) {
          // console.log('La contraseña debe cumplir con lo siguiente')
          return
          /*  return this.$notify({
            type: 'info',
            title: 'Problemas con el usuario',
            dangerouslyUseHTMLString: true,
            message: `La contraseña debe cumplir con lo siguiente: <br/>
            <ul>
              <li>Entre 6 y 40 caracteres</li>
              <li>Al menos una minúscula</li>
              <li>Al menos una mayúscula</li>
              <li>Al menos un número</li>
              <li>Al menos un caracter especial</li>
            </ul>`
          }) */
        }

      if (!userService.validateSamePass(this.user.userPassword, this.passwordConfirm)) {
        // console.log('Las contraseñas no coinciden')
        return
          /* return this.$notify({
            type: 'info',
            title: 'Problemas con el usuario',
            message: 'Las contraseñas no coinciden'
          }) */
        }
      }
      let userResponse = null
      if (!this.user.userId) {
        userResponse = await userService.store(this.user)
      } else {
        userResponse = await userService.update(this.user)
      }
      // console.log(userResponse)
    },
    onChangePassword() {
      this.changePassword = !this.changePassword
    },
    onCancel() {

    }
  }
})