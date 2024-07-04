import type { RoleInterface } from "~/resources/scripts/interfaces/RoleInterface";
import type { UserInterface } from "~/resources/scripts/interfaces/UserInterface";
import RoleService from "~/resources/scripts/services/RoleService";
import UserService from "~/resources/scripts/services/UserService";
import Toast from 'primevue/toast';

export default defineComponent({
  components: {
    Toast,
  },
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
    drawerUserForm: false,
    drawerUserDelete: false
  }),
  computed: {
  },
  created () {
  },
  async mounted() {
    await this.handlerSearchUser()
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
    addNew() {
      const newUser: UserInterface = {
        userId: null,
        userEmail: null,
        userActive: 1,
        personId: null,
        roleId: null,
      }
      this.user = newUser
      this.drawerUserForm = true
    },
    onEdit(user: UserInterface) {
      this.user = {...user}
      this.drawerUserForm = true
    },
    onDelete(user: UserInterface) {
      this.user = {...user}
      console.log(this.user)
      this.drawerUserDelete = true
    },
    async confirmDelete() {
      if (this.user) {
        this.drawerUserDelete = false
        const userService = new UserService()
        const userResponse = await userService.delete(this.user)
        console.log(userResponse)
        if (userResponse.status === 201) {
          const index = this.filteredUsers.findIndex((user: UserInterface) => user.userId === this.user?.userId);
          console.log(index)
          if (index !== -1) {
            this.filteredUsers.splice(index, 1);
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete user',
            detail: userResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete user',
            detail: userResponse._data.message,
              life: 5000,
          })
        }
        console.log(userResponse._data.message)
      }
    }
  }
})