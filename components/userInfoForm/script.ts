import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { RoleInterface } from '~/resources/scripts/interfaces/RoleInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import Dropdown from 'primevue/dropdown'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'

export default defineComponent({
  name: 'userInfoForm',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true }
  },
  data: () => ({
    activeSwicht: true,
    roles: [] as RoleInterface[],
    employees: [] as EmployeeInterface[],
    submitted: false
  }),
  computed: {
  },
  mounted() {
    this.getRoles()
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
      this.employees = list
    },
  }
})