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
  name: 'employeeUserAssignedSelection',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    filteredEmployees: [] as EmployeeInterface[],
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
    selectAllChecked: false,
  }),
  computed: {
    selectAllLabel() {
      return this.selectAllChecked ? 'Deselect All' : 'Select All'
    }
  },
  watch: {
    'departmentId': function (newVal) {
      this.positionId = null
      this.positions = []
      this.handlerSearchEmployee()
      if (newVal) {
        this.getPositions(newVal)
      }
    },
    'positionId': function () {
      this.handlerSearchEmployee()
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
    await this.handlerSearchEmployee()
    myGeneralStore.setFullLoader(false)
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserAssigned = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    this.isReady = true

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
            const userAssignedEmployeeResponse = await userResponsibleEmployeeService.getAssignedByEmployee(user.userId, '', null, null, null)
            this.userAssignedEmployeesList = userAssignedEmployeeResponse._data.data.data.data
          }
        }

      }
      myGeneralStore.setFullLoader(false)
    },
    async handlerSearchEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.filteredEmployees = []
      const response = await new EmployeeService().getFilteredList(this.search, this.departmentId, this.positionId, null, 1, 99999999, false, null)
      const list = response.status === 200 ? response._data.data.employees.data : []
      for await (const employee of list) {
        const isAssigned = this.userAssignedEmployeesList.find(a => a.employeeId === employee.employeeId)

        if (!isAssigned && this.employee.employeeId !== employee.employeeId) {
          this.filteredEmployees.push(employee)
        }
      }

      myGeneralStore.setFullLoader(false)
    },
    async onSaveSelection() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let userId = null
      const personService = new PersonService()

      if (this.employee.person?.personId) {
        const personResponse = await personService.show(this.employee.person.personId)
        if (personResponse.status === 200) {
          const user = personResponse._data.data.person.user
          userId = user.userId
        }
      }

      if (userId && userId > 0) {
        const userResponsibleEmployeeService = new UserResponsibleEmployeeService()

        const promises = this.filteredEmployees
          .filter(employee => employee.userResponsibleEmployeeChecked)
          .map(employee => {
            if (employee.employeeId) {
              const userResponsibleEmployee = {
                userId: userId!,
                employeeId: employee.employeeId,
                userResponsibleEmployeeDirectBoss: employee.userResponsibleEmployeeDirectBoss ? 1 : 0,
                userResponsibleEmployeeReadonly: employee.userResponsibleEmployeeReadonly ? 1 : 0,
              } as UserResponsibleEmployeeInterface

              return userResponsibleEmployeeService.store(userResponsibleEmployee)
                .then(response => ({
                  status: response.status,
                  error: response._data?.error || response._data?.message || null
                }))
                .catch(error => ({
                  status: 500,
                  error: error.message || 'Unknown error'
                }))

            }

          })
        if (promises.length === 0) {
          myGeneralStore.setFullLoader(false)
          return this.$toast.add({
            severity: 'warn',
            summary: 'Employees',
            detail: 'No employees selected.',
            life: 7000,
          })
        }
        const results = await Promise.all(promises)

        const successCount = results.filter(res => res && res.status === 200 || res && res.status === 201).length
        const errorMessages = results
          .filter(res => res && res.status !== 200 && res.status !== 201)
          .map(res => res && res.error)

        if (successCount > 0) {
          this.$emit('onUserAssignedEmployeeSave')
          this.$toast.add({
            severity: 'success',
            summary: 'Employees assigned successfully',
            detail: `${successCount} employees assigned`,
            life: 5000,
          })
        }

        if (errorMessages.length > 0) {
          this.$toast.add({
            severity: 'warn',
            summary: 'error',
            detail: errorMessages.join('; '),
            life: 7000,
          })
        }
      }

      myGeneralStore.setFullLoader(false)
    },
    toggleSelectAll() {
      for (const employee of this.filteredEmployees) {
        employee.userResponsibleEmployeeChecked = this.selectAllChecked
      }
    },
  }
})