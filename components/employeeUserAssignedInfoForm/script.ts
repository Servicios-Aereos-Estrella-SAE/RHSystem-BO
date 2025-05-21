import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import UserResponsibleService from '~/resources/scripts/services/UserResponsibleEmployeeService';
import UserService from '~/resources/scripts/services/UserService';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeeUserAssignedInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    usersAsigned: { type: Array as PropType<UserResponsibleEmployeeInterface[]>, required: true },
    userAssignedEmployee: { type: Object as PropType<UserResponsibleEmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null }
  },
  data: () => ({
    usersList: [] as UserInterface[],
    submitted: false,
    isNewUserAssignedEmployee: false,
    isReady: false,
    isDeleted: false,
    isValid: true,
    readonlySwicht: true,
    directBossSwicht: true,
    canManageUserAssigned: false
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewUserAssignedEmployee = !this.userAssignedEmployee.userResponsibleEmployeeId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.usersList = await this.getUsers()
    this.readonlySwicht = this.userAssignedEmployee.userResponsibleEmployeeReadonly === 1 ? true : false
    this.directBossSwicht = this.userAssignedEmployee.userResponsibleEmployeeDirectBoss === 1 ? true : false
    myGeneralStore.setFullLoader(false)
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserAssigned = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    this.isReady = true
  },
  methods: {
    async getUsers() {
      const response = await new UserService().getFilteredList('', null, 1, 9999999)
      let list: UserInterface[] = response.status === 200 ? response._data.data.users.data : []
      list = list.filter(a => a.personId != this.employee.personId && a.role?.roleSlug !== 'root' && a.role?.roleSlug !== 'admin')
      let filteredList = []
      if (this.isNewUserAssignedEmployee) {
        filteredList = list.filter(user =>
          !this.usersAsigned.some(asigned => asigned.userId === user.userId)
        );
      }
      else {
        filteredList = list
      }
      return filteredList
    },
    async onSave() {
      this.submitted = true
      this.isValid = true
      const userAssignedEmployeeService = new UserResponsibleService()
      this.isValid = userAssignedEmployeeService.validateInfo(this.userAssignedEmployee)
      if (!this.isValid) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      if (this.readonlySwicht && this.directBossSwicht) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Readonly and direct boss cannot be assigned at the same time.',
          life: 5000,
        })
        return
      }
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let userAssignedEmployeeResponse = null
      this.userAssignedEmployee.userResponsibleEmployeeReadonly = this.readonlySwicht ? 1 : 0
      this.userAssignedEmployee.userResponsibleEmployeeDirectBoss = this.directBossSwicht ? 1 : 0
      if (!this.userAssignedEmployee.userResponsibleEmployeeId) {
        userAssignedEmployeeResponse = await userAssignedEmployeeService.store(this.userAssignedEmployee)
      } else {
        userAssignedEmployeeResponse = await userAssignedEmployeeService.update(this.userAssignedEmployee)
      }

      if (userAssignedEmployeeResponse.status === 201 || userAssignedEmployeeResponse.status === 200) {
        userAssignedEmployeeResponse = await userAssignedEmployeeService.show(userAssignedEmployeeResponse._data.data.userResponsibleEmployee.userResponsibleEmployeeId)
        if (userAssignedEmployeeResponse.status === 200) {
          const userResponsibleEmployee = userAssignedEmployeeResponse._data.data.userResponsibleEmployee.userResponsibleEmployee
          this.$emit('onUserAssignedEmployeeSave', userResponsibleEmployee as UserResponsibleEmployeeInterface)
        }
      } else {
        const msgError = userAssignedEmployeeResponse._data.error ? userAssignedEmployeeResponse._data.error : userAssignedEmployeeResponse._data.message
        const severityType = userAssignedEmployeeResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `User assigned employee ${this.userAssignedEmployee.userResponsibleEmployeeId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
  }
})