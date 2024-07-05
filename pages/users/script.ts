import type { RoleInterface } from "~/resources/scripts/interfaces/RoleInterface";
import type { UserInterface } from "~/resources/scripts/interfaces/UserInterface";
import RoleService from "~/resources/scripts/services/RoleService";
import UserService from "~/resources/scripts/services/UserService";

export default defineComponent({
  name: 'Users',
  props: {
  },
  data: () => ({
    search: '' as string,
    roleList: [] as RoleInterface[],
    selectedRole: null as RoleInterface | null,
    filteredRoles: [] as RoleInterface[],
    filteredUsers: [] as UserInterface[],
    user: null as UserInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 30,
    drawerUserForm: false
  }),
  computed: {
  },
  created () {
  },
  async mounted() {
    this.handlerSearchUser()
  },
  methods: {
    async handlerSearchRole(event: any) {
      if (event.query.trim().length) {
        const response = await new RoleService().getFilteredList(event.query.trim(), 1, 30)
        const list = response.status === 200 ? response._data.data.roles.data : []
        this.filteredRoles = list
      }
    },
    async handlerSearchUser() {
      /* if (this.search || this.selectedRole) {
        this.currentPage = 0
      } */
      const roleId = this.selectedRole ? this.selectedRole.roleId : null
      const response = await new UserService().getFilteredList(this.search, roleId, this.currentPage, this.rowsPerPage)
      const list = response.status === 200 ? response._data.data.users.data : []
      this.totalRecords = response.status === 200 ? response._data.data.users.meta.total : 0
      this.first = response.status === 200 ? response._data.data.users.meta.first : 0
      this.last = response.status === 200 ? response._data.data.users.meta.last : 0
      this.filteredUsers = list
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
      this.handlerSearchUser()
    },
    onEdit(user: UserInterface) {
      this.user = {...user}
      this.drawerUserForm = true
    },
    onDelete(user: UserInterface) {
      this.user = {...user}
      this.drawerUserForm = true
    }
  }
})