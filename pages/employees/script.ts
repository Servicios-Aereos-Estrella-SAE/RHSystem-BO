import { defineComponent } from 'vue'
import type { AddressInterface } from '~/resources/scripts/interfaces/AddressInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface"
import type { EmployeWorkScheduleInterface } from "~/resources/scripts/interfaces/EmployeeWorkScheduleInterface"
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface"
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface"
import AddressTypeService from '~/resources/scripts/services/AddressTypeService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import EmployeeService from "~/resources/scripts/services/EmployeeService"
import PositionService from '~/resources/scripts/services/PositionService'
import { useMyGeneralStore } from "~/store/general"
import EmployeeAddressService from '~/resources/scripts/services/EmployeeAddressService'
import type { EmployeeAddressInterface } from '~/resources/scripts/interfaces/EmployeeAddressInterface'
import type { EmployeeContractInterface } from '~/resources/scripts/interfaces/EmployeeContractInterface'
import PersonService from '~/resources/scripts/services/PersonService'
import type { EmployeeSyncInterface } from '~/resources/scripts/interfaces/EmployeeSyncInterface'

export default defineComponent({
  name: 'Employees',
  setup() {
    const { t } = useI18n()
    return {
      t,
      paginationOptions: [
        { label: '50', value: 50 },
        { label: '100', value: 100 },
        { label: '150', value: 150 },
        { label: t('all_records'), value: -1 }
      ],
    }
  },
  props: {},
  data: () => ({
    search: '' as string,
    workSchedules: [] as EmployeWorkScheduleInterface[],
    filteredEmployees: [] as EmployeeInterface[],
    employee: null as EmployeeInterface | null,
    address: null as AddressInterface | null,
    selectedWorkSchedule: null as EmployeWorkScheduleInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 50,
    drawerEmployeeForm: false as boolean,
    drawerEmployeePersonForm: false as boolean,
    drawerAddressForm: false as boolean,
    drawerRecords: false as boolean,
    drawerBanks: false as boolean,
    drawerResponsible: false as boolean,
    drawerAssigned: false as boolean,
    drawerEmployeePhotoForm: false as boolean,
    drawerEmployeeDelete: false as boolean,
    drawerEmployeeSync: false as boolean,
    canCreate: false as boolean,
    canUpdate: false as boolean,
    canUpdateInformation: false as boolean,
    canDelete: false as boolean,
    canManageVacation: false as boolean,
    canManageExceptionRequest: false as boolean,
    canReadOnlyFiles: false as boolean,
    canManageFiles: false as boolean,
    canReadOnlyWorkDisabilities: false as boolean,
    canManageWorkDisabilities: false as boolean,
    canReadTerminatedEmployees: false as boolean,
    drawerShifts: false as boolean,
    drawerProceedingFiles: false as boolean,
    hasAccessToManageShifts: false as boolean,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    departmentId: null as number | null,
    positionId: null as number | null,
    optionsActive: ref(['Active', 'Terminated']),
    status: 'Active',
    employeeTypeId: null as number | null,
    activeButton: 'employee',
    canManageResponsibleRead: false,
    canManageBiotime: false,
    canManageAssignedRead: false,
    currentEmployeeIsUser: false,
    employeesSync: [] as EmployeeSyncInterface[],
    sortBy: 'name' as string,
    sortOrder: 'ascend' as string,
    sortOptions: ref(['name', 'number']),
    sortOrderOptions: ref(['ascend', 'descend']),
  }),
  computed: {
    getStatus() {
      return this.optionsActive.map(status =>
        this.$t(`${status.toLowerCase()}`)
      )
    },
    getSortOptions() {
      return this.sortOptions.map(option =>
        this.$t(option)
      )
    },
    getSortOrderOptions() {
      return this.sortOrderOptions.map(option =>
        this.$t(option)
      )
    },
    getSortOptionsWithValues() {
      return this.sortOptions.map(option => ({
        label: this.$t(option),
        value: option
      }))
    },
    isRootUser() {
      const myGeneralStore = useMyGeneralStore()
      const flag = myGeneralStore.isRoot
      return flag
    },
    displayResponsibleSection() {
      if (this.isRootUser || this.canManageResponsibleRead) {
        return true
      }

      return false
    },
    displayAssignedSection() {
      if (this.isRootUser || this.canManageAssignedRead) {
        return true
      }

      return false
    }
  },
  created() { },
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
    'status': function () {
      this.handlerSearchEmployee()
    },
    'employeeTypeId': function () {
      this.handlerSearchEmployee()
    },
    'sortBy': function () {
      this.saveSortingPreferences()
      this.handlerSearchEmployee()
    },
    'sortOrder': function () {
      this.saveSortingPreferences()
      this.handlerSearchEmployee()
    },
    'rowsPerPage': function () {
      this.savePaginationPreferences()
      this.handlerSearchEmployee()
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.status = this.capitalizeFirstLetter(this.t('active'))

    // Cargar preferencias desde localStorage
    this.loadSortingPreferences()
    this.loadPaginationPreferences()
    // const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
    const systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").toString().replaceAll('/', '')
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)
    if (myGeneralStore.isRoot) {
      this.canCreate = true
      this.canUpdate = true
      this.canUpdateInformation = true
      this.canDelete = true
      this.canManageVacation = true
      this.canManageExceptionRequest = true
      this.canReadOnlyFiles = true
      this.canManageFiles = true
      this.canReadOnlyWorkDisabilities = true
      this.canManageWorkDisabilities = true
      this.canManageResponsibleRead = true
      this.canManageBiotime = true
      this.canManageAssignedRead = true
      this.canReadTerminatedEmployees = true
    } else {
      this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
      this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
      this.canUpdateInformation = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update-information') ? true : false
      this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
      this.canManageVacation = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-vacation') ? true : false
      this.canManageExceptionRequest = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'exception-request') ? true : false
      this.canReadOnlyFiles = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read-only-files') ? true : false
      this.canManageFiles = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-files') ? true : false
      this.canReadOnlyWorkDisabilities = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read-work-disabilities') ? true : false
      this.canManageWorkDisabilities = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-work-disabilities') ? true : false
      this.canManageResponsibleRead = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-responsible-read')
      this.canManageBiotime = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-biotime')
      this.canManageAssignedRead = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-assigned-read')
      this.canReadTerminatedEmployees = await myGeneralStore.hasAccess(systemModuleSlug, 'read-terminated-employees')
    }
    myGeneralStore.setFullLoader(false)
    await this.getWorkSchedules()
    await this.handlerSearchEmployee()
    await this.getDepartments()
    this.hasAccessToManageShifts = await myGeneralStore.hasAccess(systemModuleSlug, 'manage-shift')
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
    async handlerSearchEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const workSchedule = this.selectedWorkSchedule ? this.selectedWorkSchedule?.employeeWorkSchedule : null
      this.capitalizeFirstLetter(this.t('active'))
      const onlyInactive = this.status === this.capitalizeFirstLetter(this.t('terminated')) ? true : false

      // Si rowsPerPage es -1 (Todos), usar un número muy grande para obtener todos los registros
      const pageSize = this.rowsPerPage === -1 ? 999999 : this.rowsPerPage

      const response = await new EmployeeService().getFilteredList(
        this.search,
        this.departmentId,
        this.positionId,
        workSchedule,
        this.currentPage,
        pageSize,
        onlyInactive,
        this.employeeTypeId,
        this.sortBy,
        this.sortOrder
      )
      const list = response.status === 200 ? response._data.data.employees.data : []
      this.totalRecords = response.status === 200 ? response._data.data.employees.meta.total : 0
      this.first = response.status === 200 ? response._data.data.employees.meta.first_page : 0
      this.filteredEmployees = list

      myGeneralStore.setFullLoader(false)
    },
    async getWorkSchedules() {
      const response = await new EmployeeService().getWorkSchedules()
      this.workSchedules = response.status === 200 ? response._data.data.employeeWorkSchedules : []
    },
    onPhoto(employee: EmployeeInterface) {
      this.employee = { ...employee }
      this.drawerEmployeePhotoForm = true
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
      this.handlerSearchEmployee()
    },
    addNew() {
      const person: PeopleInterface = {
        personId: null,
        personFirstname: "",
        personLastname: "",
        personSecondLastname: "",
        personGender: "",
        personBirthday: null,
        personCurp: null,
        personEmail: null,
        personPhone: "",
        personRfc: null,
        personImssNss: null,
        personPhoneSecondary: null,
        personMaritalStatus: null,
        personPlaceOfBirthCountry: null,
        personPlaceOfBirthState: null,
        personPlaceOfBirthCity: null,
        personCreatedAt: new Date(),
        personUpdatedAt: new Date(),
        personDeletedAt: null
      }
      const newEmployee: EmployeeInterface = {
        employeeId: null,
        employeeFirstName: "",
        employeeSyncId: "",
        employeeCode: "",
        employeeLastName: "",
        employeePayrollNum: "",
        departmentSyncId: "",
        positionSyncId: "",
        employeeDeletedAt: null,
        employeeHireDate: null,
        companyId: 1,
        departmentId: 0,
        positionId: 0,
        employeeWorkSchedule: "Onsite",
        personId: 0,
        employeeTypeId: 0,
        employeeBusinessEmail: null,
        employeePhoto: null,
        employeeLastSynchronizationAt: new Date(),
        employeeCreatedAt: new Date(),
        employeeUpdatedAt: new Date(),
        person: person,
        businessUnitId: 1,
        payrollBusinessUnitId: 1,
        employeeAssistDiscriminator: 0,
        employeeTypeOfContract: "Internal",
        employeeTerminatedDate: new Date(),
        employeeSecondLastName: '',
        dailySalary: 0,
        employeeIgnoreConsecutiveAbsences: 0,
        userResponsibleEmployeeDirectBoss: false
      }
      this.employee = newEmployee
      this.drawerEmployeeForm = true
      this.activeButton = 'employee'
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.onEditEmployee()
    },
    onEdit(employee: EmployeeInterface) {
      this.employee = { ...employee }
      this.drawerEmployeeForm = true
      this.activeButton = 'employee'
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.onEditEmployee()
    },
    onDelete(employee: EmployeeInterface) {
      this.employee = { ...employee }
      this.drawerEmployeeDelete = true
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
    },
    async confirmDelete() {
      if (this.employee) {
        this.drawerEmployeeDelete = false
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.delete(this.employee)

        if (employeeResponse.status === 201) {
          const index = this.filteredEmployees.findIndex((employee: EmployeeInterface) => employee.employeeId === this.employee?.employeeId)
          if (index !== -1) {
            this.filteredEmployees.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_employee'),
            detail: employeeResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('delete_employee'),
            detail: employeeResponse._data.message,
            life: 5000,
          })
        }
      }
    },
    onSave(employee: EmployeeInterface) {
      this.employee = { ...employee }
      const index = this.filteredEmployees.findIndex((s: EmployeeInterface) => s.employeeId === this.employee?.employeeId)
      if (index !== -1) {
        if (this.status === 'Terminated' && !this.employee.deletedAt) {
          this.filteredEmployees.splice(index, 1)
        } else {
          this.filteredEmployees[index] = employee
        }
        this.$forceUpdate()
      } else {
        this.filteredEmployees.push(employee)
        this.$forceUpdate()
      }
      this.drawerEmployeeForm = false
      this.drawerEmployeePhotoForm = false
    },
    async syncEmployees() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const employeeService = new EmployeeService()
      const employeeResponse = await employeeService.getBiometrics()
      this.employeesSync = []
      if (employeeResponse.status === 200) {
        this.employeesSync = employeeResponse._data.data.employeesSync
        this.drawerEmployeeSync = true
      }
      myGeneralStore.setFullLoader(false)
    },
    handlerOpenShifts(employee: EmployeeInterface) {
      this.employee = employee
      this.drawerShifts = true
    },
    onProceedingFiles(employee: EmployeeInterface) {
      this.employee = employee
      this.drawerProceedingFiles = true
    },
    onCancelEmployeeDelete() {
      this.drawerEmployeeDelete = false
    },
    async getExcel() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const filterStartDate = `2000-01-01`
      const filterEndDate = new Date().toISOString().split('T')[0]
      const onlyInactive = this.status === 'Terminated' ? true : false
      try {
        const employeeService = new EmployeeService()
        const workSchedule = this.selectedWorkSchedule ? this.selectedWorkSchedule?.employeeWorkSchedule : null
        const assistResponse = await employeeService.getExcelAll(this.search, this.departmentId, this.positionId, filterStartDate, filterEndDate, onlyInactive, this.employeeTypeId, workSchedule, this.currentPage, this.rowsPerPage)

        if (assistResponse) {
          const reportDesc = onlyInactive ? '_terminated' : ''
          const blob = await assistResponse._data
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${this.t('employee_report')} ${reportDesc}.xlsx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          this.$toast.add({
            severity: 'success',
            summary: this.t('excel_report'),
            detail: this.t('excel_file_created_successfully'),
            life: 5000,
          })
        } else {
          const msgError = assistResponse?._data?.error || assistResponse?._data?.message || 'Unknown error'
          this.$toast.add({
            severity: 'error',
            summary: this.t('excel_report'),
            detail: msgError,
            life: 5000,
          })
        }
      } catch (error) {
        console.error(this.t('error_generating_excel_file'), error)
        this.$toast.add({
          severity: 'error',
          summary: this.t('excel_report'),
          detail: this.t('error_generating_excel_file'),
          life: 5000,
        })
      } finally {
        myGeneralStore.setFullLoader(false)
      }
    },
    async onEditEmployee() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerRecords = false
      this.drawerBanks = false
      this.drawerResponsible = false
      this.drawerAssigned = false
      this.activeButton = 'employee'
      this.currentEmployeeIsUser = await this.isCurrentEmployeeIsUser()
    },
    onEditPerson() {
      this.drawerEmployeePersonForm = true
      this.drawerAddressForm = false
      this.drawerRecords = false
      this.drawerBanks = false
      this.drawerResponsible = false
      this.drawerAssigned = false
      this.activeButton = 'person'
    },
    onEditRecords() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerBanks = false
      this.drawerResponsible = false
      this.drawerAssigned = false
      this.drawerRecords = true
      this.activeButton = 'records'
    },
    onEditBanks() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerRecords = false
      this.drawerBanks = true
      this.drawerResponsible = false
      this.drawerAssigned = false
      this.activeButton = 'banks'
    },
    onEditResponsible() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerRecords = false
      this.drawerBanks = false
      this.drawerResponsible = true
      this.drawerAssigned = false
      this.activeButton = 'responsible'
    },
    onEditAssigned() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerRecords = false
      this.drawerBanks = false
      this.drawerResponsible = false
      this.drawerAssigned = true
      this.activeButton = 'assigned'
    },
    onClosePerson() {
      this.drawerEmployeePersonForm = false
    },
    async onEditAddress() {
      this.address = null
      let response = null
      const addressTypeService = new AddressTypeService()
      response = await addressTypeService.getFilteredList('residential')
      const addressTypes = response._data.data.addressTypes.data
      let addressTypeId = null
      if (addressTypes.length > 0) {
        addressTypeId = addressTypes[0].addressTypeId
      }
      if (!addressTypeId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data_address_type_id_residential'),
          life: 5000,
        })
        return
      }
      const existEmployeeAddress = this.employee?.address?.find(a => a.employeeId === this.employee?.employeeId)
      if (existEmployeeAddress) {
        if (existEmployeeAddress.address) {
          this.address = existEmployeeAddress.address
          if (this.address.addressZipcode) {
            this.address.addressZipcode = parseInt(this.address.addressZipcode.toString())
          }
        }

      }
      if (!this.address) {
        const newAddress: AddressInterface = {
          addressId: null,
          addressZipcode: null,
          addressCountry: '',
          addressState: '',
          addressTownship: '',
          addressCity: '',
          addressSettlement: '',
          addressSettlementType: '',
          addressStreet: '',
          addressInternalNumber: '',
          addressExternalNumber: '',
          addressBetweenStreet1: '',
          addressBetweenStreet2: '',
          addressTypeId: addressTypeId,
          addressCreatedAt: null,
          addressUpdatedAt: null,
          deletedAt: null
        }
        this.address = newAddress
      }

      this.drawerAddressForm = true
      this.activeButton = 'address'
      this.drawerEmployeePersonForm = false
      this.drawerRecords = false
      this.drawerBanks = false
      this.drawerResponsible = false
      this.drawerAssigned = false
    },
    onCloseAddress() {
      this.drawerAddressForm = false
    },
    async onSaveAddress(address: AddressInterface) {
      this.address = address
      this.drawerAddressForm = false
      this.activeButton = 'employee'
      if (this.employee?.employeeId) {
        const existEmployeeAddress = this.employee?.address?.find(a => a.addressId === this.address?.addressId)
        if (!existEmployeeAddress) {
          const employeeAddress: EmployeeAddressInterface = {
            employeeId: this.employee?.employeeId,
            addressId: this.address.addressId
          }
          const employeeAddressService = new EmployeeAddressService()
          const employeeAddressResponse = await employeeAddressService.create(employeeAddress)

          if (employeeAddressResponse.status !== 201) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail: this.t('there_was_an_error_saving_the_relation_employee_address'),
              life: 5000
            })
          } else {
            this.employee.address?.push(employeeAddressResponse._data.data.employeeAddress)
          }
        } else {
          existEmployeeAddress.address = this.address
        }
      }
    },
    isActive(button: string) {
      return this.activeButton === button
    },
    onSidebarInfoHide() {
      this.drawerEmployeePersonForm = false
      this.drawerAddressForm = false
      this.drawerRecords = false
    },
    async onEmployeeContractSave(employeeContract: EmployeeContractInterface) {
      const employeeService = new EmployeeService()
      if (employeeContract.employeeId) {
        const employeeResponse = await employeeService.show(employeeContract.employeeId)
        if (employeeResponse?.status === 200) {
          this.employee = employeeResponse._data.data.employee
          const index = this.filteredEmployees.findIndex((s: EmployeeInterface) => s.employeeId === this.employee?.employeeId)
          if (index !== -1) {
            this.filteredEmployees[index] = employeeResponse._data.data.employee
            this.$forceUpdate()
          }
        }
      }
    },
    async isCurrentEmployeeIsUser() {
      if (this.employee?.personId) {
        const personService = new PersonService()
        const personResponse = await personService.show(this.employee?.personId)
        const person = personResponse._data.data.person
        if (person && person.user) {
          return true
        }
      }
      return false
    },
    onSaveSync() {
      this.drawerEmployeeSync = false
    },
    capitalizeFirstLetter(text: string) {
      if (!text) return ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
    // Métodos para localStorage
    saveSortingPreferences() {
      if (process.client) {
        localStorage.setItem('employees_sortBy', this.sortBy)
        localStorage.setItem('employees_sortOrder', this.sortOrder)
      }
    },
    loadSortingPreferences() {
      if (process.client) {
        const savedSortBy = localStorage.getItem('employees_sortBy') || 'name'
        const savedSortOrder = localStorage.getItem('employees_sortOrder') || 'ascend'

        // Valores predeterminados: orden ascendente por nombre
        this.sortBy = savedSortBy || 'name'
        this.sortOrder = savedSortOrder || 'ascend'
      }
    },
    savePaginationPreferences() {
      if (process.client) {
        localStorage.setItem('employees_rowsPerPage', this.rowsPerPage.toString())
      }
    },
    loadPaginationPreferences() {
      if (process.client) {
        const savedRowsPerPage = localStorage.getItem('employees_rowsPerPage')
        // Valor predeterminado: 50 registros por página
        this.rowsPerPage = savedRowsPerPage ? parseInt(savedRowsPerPage) : 50
      }
    }
  },
})

