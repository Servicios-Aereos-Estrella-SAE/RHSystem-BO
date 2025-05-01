import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import UserResponsibleEmployeeService from '~/resources/scripts/services/UserResponsibleEmployeeService';
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface';
import UserService from '~/resources/scripts/services/UserService';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'EmployeeUserResponsibleInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    usersAsigned: { type: Array as PropType<UserResponsibleEmployeeInterface[]>, required: true },
    userResponsibleEmployee: { type: Object as PropType<UserResponsibleEmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null }
  },
  data: () => ({
    usersList: [] as UserInterface[],
    submitted: false,
    isNewUserResponsibleEmployee: false,
    isReady: false,
    isDeleted: false,
    isValid: true,
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewUserResponsibleEmployee = !this.userResponsibleEmployee.userResponsibleEmployeeId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.usersList = await this.getUsers()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getUsers() {
      const response = await new UserService().getFilteredList('', null, 1, 9999999)
      let list: UserInterface[] = response.status === 200 ? response._data.data.users.data : []
      list = list.filter(a => a.personId != this.employee.personId && a.role?.roleSlug !== 'root' && a.role?.roleSlug !== 'admin')
      const filteredList = list.filter(user =>
        !this.usersAsigned.some(asigned => asigned.userId === user.userId)
      );
      return filteredList
    },
    async onSave() {
      this.submitted = true
      this.isValid = true
      const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
      this.isValid = userResponsibleEmployeeService.validateInfo(this.userResponsibleEmployee)
      if (!this.isValid) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let userResponsibleEmployeeResponse = null
      if (!this.userResponsibleEmployee.userResponsibleEmployeeId) {
        userResponsibleEmployeeResponse = await userResponsibleEmployeeService.store(this.userResponsibleEmployee)
      }

      if (userResponsibleEmployeeResponse.status === 201) {
        userResponsibleEmployeeResponse = await userResponsibleEmployeeService.show(userResponsibleEmployeeResponse._data.data.userResponsibleEmployee.userResponsibleEmployeeId)
        if (userResponsibleEmployeeResponse.status === 200) {
          const userResponsibleEmployee = userResponsibleEmployeeResponse._data.data.userResponsibleEmployee.userResponsibleEmployee
          this.$emit('onUserResponsibleEmployeeSave', userResponsibleEmployee as UserResponsibleEmployeeInterface)
        }
      } else {
        const msgError = userResponsibleEmployeeResponse._data.error ? userResponsibleEmployeeResponse._data.error : userResponsibleEmployeeResponse._data.message
        const severityType = userResponsibleEmployeeResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `User responsible employee ${this.userResponsibleEmployee.userResponsibleEmployeeId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
  }
})