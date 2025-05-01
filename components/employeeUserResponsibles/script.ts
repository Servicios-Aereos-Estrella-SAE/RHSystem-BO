import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface';
import UserResponsibleEmployeeService from '~/resources/scripts/services/UserResponsibleEmployeeService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeUserResponsibles',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    userResponsibleEmployeesList: [] as UserResponsibleEmployeeInterface[],
    userResponsibleEmployee: null as UserResponsibleEmployeeInterface | null,
    drawerUserResponsibleEmployeeForm: false,
    drawerUserResponsibleEmployeeDelete: false,
    isDeleted: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    await this.getUserResponsibleEmployees()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getUserResponsibleEmployees() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.userResponsibleEmployeesList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
      const userResponsibleEmployeeResponse = await userResponsibleEmployeeService.getByEmployee(employeeId)
      this.userResponsibleEmployeesList = userResponsibleEmployeeResponse.data.data
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      if (this.employee.employeeId) {
        const newUserResponsibleEmployee: UserResponsibleEmployeeInterface = {
          userResponsibleEmployeeId: null,
          userId: null,
          employeeId: this.employee.employeeId,
        }
        this.userResponsibleEmployee = newUserResponsibleEmployee
        this.drawerUserResponsibleEmployeeForm = true
      }
    },
    async onSave(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.userResponsibleEmployee = { ...userResponsibleEmployee }

      const index = this.userResponsibleEmployeesList.findIndex((userResponsibleEmployee: UserResponsibleEmployeeInterface) => userResponsibleEmployee.userResponsibleEmployeeId === this.userResponsibleEmployee?.userResponsibleEmployeeId)
      if (index !== -1) {
        this.userResponsibleEmployeesList[index] = userResponsibleEmployee
        this.$forceUpdate()
      } else {
        this.userResponsibleEmployeesList.push(userResponsibleEmployee)
        this.$forceUpdate()
      }
      this.drawerUserResponsibleEmployeeForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
      this.userResponsibleEmployee = { ...userResponsibleEmployee }
      this.drawerUserResponsibleEmployeeForm = true
    },
    onDelete(userResponsibleEmployee: UserResponsibleEmployeeInterface) {
      this.userResponsibleEmployee = { ...userResponsibleEmployee }
      this.drawerUserResponsibleEmployeeDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.userResponsibleEmployee) {
        this.drawerUserResponsibleEmployeeDelete = false
        const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
        const userResponsibleEmployeeResponse = await userResponsibleEmployeeService.delete(this.userResponsibleEmployee)
        if (userResponsibleEmployeeResponse.status === 200) {
          const index = this.userResponsibleEmployeesList.findIndex((userResponsibleEmployee: UserResponsibleEmployeeInterface) => userResponsibleEmployee.userResponsibleEmployeeId === this.userResponsibleEmployee?.userResponsibleEmployeeId)
          if (index !== -1) {
            this.userResponsibleEmployeesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete user responsible employee',
            detail: userResponsibleEmployeeResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete user responsible employee',
            detail: userResponsibleEmployeeResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})