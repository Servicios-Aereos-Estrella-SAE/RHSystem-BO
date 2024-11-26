import type { DepartmentInterface } from "~/resources/scripts/interfaces/DepartmentInterface"
import DepartmentService from "~/resources/scripts/services/DepartmentService"
import { useMyGeneralStore } from "~/store/general"
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface"

export default defineComponent({
  name: 'Departments',
  data: () => ({
    search: '' as string,
    filteredDepartments: [] as DepartmentInterface[],
    department: null as DepartmentInterface | null,
    departmentService: new DepartmentService(),
    currentPage: 1 as number,
    totalRecords: 0 as number,
    first: 0 as number,
    last: 0 as number,
    rowsPerPage: 30 as number,
    drawerDepartmentDetail: false as boolean,
    drawerDepartmentDelete: false as boolean,
    drawerDepartmentForceDelete: false as boolean,
    canCreate: false as boolean,
    canUpdate: false as boolean,
    canDelete: false as boolean
  }),
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    await this.setPrivileges()
    await this.handlerSearchDepartment()

    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async setPrivileges () {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
      const permissions = await myGeneralStore.getAccess(systemModuleSlug)

      if (myGeneralStore.isRoot) {
        this.canCreate = true
        this.canUpdate = true
        this.canDelete = true
      } else {
        this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
        this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
        this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
      }
    },
    async handlerSearchDepartment() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      const response = await new DepartmentService().getAllDepartmentList({
        'department-name': this.search,
        'only-parents': true
      })

      this.filteredDepartments = response.status === 200 ? response._data.data.departments : []
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newDepartment: DepartmentInterface = {
        departmentId: null,
        departmentCode: "",
        departmentName: "",
        departmentAlias: "",
        departmentIsDefault: "",
        departmentDeletedAt: null,
        parentDepartmentId: null,
        businessUnitId: 1,
        departmentLastSynchronizationAt: null,
        departmentActive: "1",
        departmentSyncId: "",
        parentDepartmentSyncId: "",
        companyId: 1,
        departmentCreatedAt: new Date(),
        departmentUpdatedAt: new Date(),
      }
      this.department = newDepartment
      this.drawerDepartmentDetail = true
    },
    onEdit(department: DepartmentInterface) {
      this.department = { ...department }
      this.drawerDepartmentDetail = true
    },
    onDelete(department: DepartmentInterface) {
      this.department = { ...department }
      this.drawerDepartmentDelete = true
    },
    onSave(department: DepartmentInterface) {
      this.department = { ...department }
      const index = this.filteredDepartments.findIndex((s: DepartmentInterface) => s.departmentId === this.department?.departmentId)
      if (index !== -1) {
        this.filteredDepartments[index] = department
        this.$forceUpdate()
      } else {
        this.filteredDepartments.push(department)
        this.$forceUpdate()
      }
      this.drawerDepartmentDetail = false
    },
    async confirmDelete() {
      if (this.department) {
        console.log(this.department)
        this.drawerDepartmentDelete = false 
        const departmentResponse = await this.departmentService.delete(this.department) 
    
        if (departmentResponse.status === 201 || departmentResponse.status === 200) {
          const index = this.filteredDepartments.findIndex((department: DepartmentInterface) => department.departmentId === this.department?.departmentId)
          if (index !== -1) {
            this.filteredDepartments.splice(index, 1)
            this.$forceUpdate() 
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete department',
            detail: departmentResponse._data.message, 
            life: 5000,
          })
        } 
        else if (departmentResponse.status === 206) {
          // Mostrar la alerta de confirmación cuando haya empleados relacionados
          this.drawerDepartmentForceDelete = true
        } 
        else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete department',
            detail: departmentResponse._data.message, 
            life: 5000,
          })
        }
      }
    },
    async confirmForceDelete() {
      if (this.department) {
        const forceDeleteResponse = await this.departmentService.forceDelete(this.department)
        if (forceDeleteResponse.status === 201 || forceDeleteResponse.status === 200) {
          // Eliminar el departamento de la lista
          this.removeDepartmentFromList()
          this.$toast.add({
            severity: 'success',
            summary: 'Department Force Deleted',
            detail: forceDeleteResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error Force Deleting Department',
            detail: forceDeleteResponse._data.message,
            life: 5000,
          })
        }
        this.drawerDepartmentForceDelete = false // Cerrar el diálogo de eliminación forzada
      }
    },
    removeDepartmentFromList() {
      const index = this.filteredDepartments.findIndex(
        (department: DepartmentInterface) => department.departmentId === this.department?.departmentId
      )
      if (index !== -1) {
        this.filteredDepartments.splice(index, 1)
        this.$forceUpdate() // Forzar actualización de la lista
      }
    },
  }
})
