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
    filteredRoles: [] as RoleInterface[],
    filteredUsers: [] as UserInterface[],
    user: null as UserInterface | null,
    selectedRoleId: null as number | null,
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
    await this.handlerSearchRole()
  },
  methods: {
    async handlerSearchRole() {
        const response = await new RoleService().getFilteredList('',1, 100)
        const list = response.status === 200 ? response._data.data.roles.data : []
        this.filteredRoles = list
    },
    async handlerSearchUser() {
      /* if (this.search || this.selectedRole) {
        this.currentPage = 0
      } */
      const response = await new UserService().getFilteredList(this.search, this.selectedRoleId, this.currentPage, this.rowsPerPage)
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
    onSave(user: UserInterface) {
      this.user = {...user}
      const index = this.filteredUsers.findIndex((user: UserInterface) => user.userId === this.user?.userId)
      if (index !== -1) {
        this.filteredUsers[index] = user
        this.$forceUpdate()
      } else {
        this.filteredUsers.push(user)
        this.$forceUpdate()
      }
      this.drawerUserForm = false
    },
    onEdit(user: UserInterface) {
      this.user = {...user}
      this.drawerUserForm = true
    },
    onDelete(user: UserInterface) {
      this.user = {...user}
      this.drawerUserDelete = true
    },
    
    async confirmDelete() {
      if (this.user) {
        this.drawerUserDelete = false
        const userService = new UserService()
        const userResponse = await userService.delete(this.user)
        if (userResponse.status === 201) {
          const index = this.filteredUsers.findIndex((user: UserInterface) => user.userId === this.user?.userId)
          if (index !== -1) {
            this.filteredUsers.splice(index, 1)
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
      }
    }
  }
})