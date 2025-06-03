import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface';
import UserResponsibleEmployeeService from '~/resources/scripts/services/UserResponsibleEmployeeService';
import PersonService from '~/resources/scripts/services/PersonService';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface';
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import PositionService from '~/resources/scripts/services/PositionService';
import DepartmentService from '~/resources/scripts/services/DepartmentService';
import EmployeeService from '~/resources/scripts/services/EmployeeService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeUserAssigned',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canUpdate: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    isReady: false,
    userAssignedEmployeesList: [] as UserResponsibleEmployeeInterface[],
    userAssignedEmployee: null as UserResponsibleEmployeeInterface | null,
    drawerUserAssignedEmployeeForm: false,
    drawerUserAssignedEmployeeDelete: false,
    isDeleted: false,
    canManageAssignedEdit: false,
    canManageUserAssigned: false,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    departmentId: null as number | null,
    positionId: null as number | null,
    search: '' as string,
    drawerEmployeeSelection: false,
    canManageUserResponsible: false
  }),
  computed: {
  },
  watch: {
    'departmentId': function (newVal) {
      this.positionId = null
      this.positions = []
      this.getUserAssignedEmployees()
      if (newVal) {
        this.getPositions(newVal)
      }
    },
    'positionId': function () {
      this.getUserAssignedEmployees()
    },
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
    this.canManageAssignedEdit = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-assigned-edit')
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }

    await this.getDepartments()
    await this.getUserAssignedEmployees()
    myGeneralStore.setFullLoader(false)
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserAssigned = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    this.isReady = true
    this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    if (this.canManageUserResponsible && !this.canUpdate) {
      this.canManageUserResponsible = false
    }
  },
  methods: {
    async getPositions(departmentId: number) {
      const positionService = new PositionService()
      this.positions = await positionService.getPositionsDepartment(departmentId)
    },
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = response._data.data.departments
    },
    async getUserAssignedEmployees() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const personService = new PersonService()
      if (this.employee.person?.personId) {
        const personResponse = await personService.show(this.employee.person?.personId)
        if (personResponse.status === 200) {
          const user = personResponse._data.data.person.user
          this.userAssignedEmployeesList = []
          const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
          if (user && user.userId) {
            const userAssignedEmployeeResponse = await userResponsibleEmployeeService.getAssignedByEmployee(user.userId, this.search, this.departmentId, this.positionId, null)
            this.userAssignedEmployeesList = userAssignedEmployeeResponse._data.data.data.data
            this.setEmployeeInUsers()
          }
        }

      }
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      if (this.employee.employeeId) {

        this.drawerEmployeeSelection = true
      }
    },
    async onSave(userAssignedEmployee: UserResponsibleEmployeeInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.userAssignedEmployee = { ...userAssignedEmployee }

      const index = this.userAssignedEmployeesList.findIndex((userAssignedEmployee: UserResponsibleEmployeeInterface) => userAssignedEmployee.userResponsibleEmployeeId === this.userAssignedEmployee?.userResponsibleEmployeeId)
      if (index !== -1) {
        this.userAssignedEmployeesList[index] = userAssignedEmployee
        this.$forceUpdate()
      } else {
        this.userAssignedEmployeesList.push(userAssignedEmployee)
        this.$forceUpdate()
      }
      this.setEmployeeInUsers()
      this.drawerUserAssignedEmployeeForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(userAssignedEmployee: UserResponsibleEmployeeInterface) {
      this.userAssignedEmployee = { ...userAssignedEmployee }
      this.drawerUserAssignedEmployeeForm = true
    },
    onDelete(userAssignedEmployee: UserResponsibleEmployeeInterface) {
      this.userAssignedEmployee = { ...userAssignedEmployee }
      this.drawerUserAssignedEmployeeDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.userAssignedEmployee) {
        this.drawerUserAssignedEmployeeDelete = false
        const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
        const userAssignedEmployeeResponse = await userResponsibleEmployeeService.delete(this.userAssignedEmployee)
        if (userAssignedEmployeeResponse.status === 200) {
          const index = this.userAssignedEmployeesList.findIndex((userAssignedEmployee: UserResponsibleEmployeeInterface) => userAssignedEmployee.userResponsibleEmployeeId === this.userAssignedEmployee?.userResponsibleEmployeeId)
          if (index !== -1) {
            this.userAssignedEmployeesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee assigned',
            detail: userAssignedEmployeeResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete employee assigned employee',
            detail: userAssignedEmployeeResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    async setEmployeeInUsers() {
      const employeeService = new EmployeeService()
      const personService = new PersonService()
      for await (const userAssigned of this.userAssignedEmployeesList) {
        if (userAssigned.employeeId) {
          const employeeResponse = await employeeService.show(userAssigned.employeeId)
          if (employeeResponse) {
            if (employeeResponse._data.data.employee) {
              userAssigned.employeeAssigned = employeeResponse._data.data.employee
              if (userAssigned.employeeAssigned?.personId) {
                const personResponse = await personService.show(userAssigned.employeeAssigned?.personId)
                userAssigned.employeeAssigned.person = personResponse._data.data.person
              }
            }
          }
        }
      }
    },
    async onSaveSelection() {
      await this.getUserAssignedEmployees()
      this.drawerEmployeeSelection = false
    }
  }
})