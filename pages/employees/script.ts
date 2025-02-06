import { DateTime } from 'luxon';
import { defineComponent } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface';
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { EmployeWorkScheduleInterface } from "~/resources/scripts/interfaces/EmployeeWorkScheduleInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface';
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import DepartmentService from '~/resources/scripts/services/DepartmentService';
import EmployeeService from "~/resources/scripts/services/EmployeeService";
import EmployeeTypeService from '~/resources/scripts/services/EmployeeTypeService';
import PositionService from '~/resources/scripts/services/PositionService';
import { useMyGeneralStore } from "~/store/general";

export default defineComponent({
    name: 'Employees',
    props: {},
    data: () => ({
        search: '' as string,
        workSchedules: [] as EmployeWorkScheduleInterface[],
        filteredEmployees: [] as EmployeeInterface[],
        employee: null as EmployeeInterface | null,
        selectedWorkSchedule: null as EmployeWorkScheduleInterface | null,
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 50,
        drawerEmployeeForm: false,
        drawerEmployeePersonForm: false,
        drawerEmployeePhotoForm: false,
        drawerEmployeeDelete: false,
        drawerEmployeeSync: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canManageVacation: false,
        canManageExceptionRequest: false,
        canReadOnlyFiles: false,
        canManageFiles: false,
        canReadOnlyWorkDisabilities: false,
        canManageWorkDisabilities: false,
        drawerShifts: false,
        drawerProceedingFiles: false,
        hasAccessToManageShifts: false,
        positions: [] as PositionInterface[],
        departments: [] as DepartmentInterface[],
        departmentId: null as number | null,
        positionId: null as number | null,
        optionsActive: ref(['Active', 'Terminated']),
        status: 'Active',
        employeeTypes: [] as EmployeeTypeService[],
        employeeTypeId: null as number | null,
    }),
    computed: {
    },
    created() { },
    watch: {
        'departmentId': function(newVal) {
            this.positionId = null
            this.positions = []
            this.handlerSearchEmployee()
          if (newVal) {
            this.getPositions(newVal);
          }
        },
        'positionId': function() {
         this.handlerSearchEmployee()
        },
        'status': function() {
         this.handlerSearchEmployee()
        },
        'employeeTypeId': function() {
         this.handlerSearchEmployee()
        }
    }, 
    async mounted() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
        const permissions = await myGeneralStore.getAccess(systemModuleSlug)
        if (myGeneralStore.isRoot) {
            this.canCreate = true
            this.canUpdate = true
            this.canDelete = true
            this.canManageVacation = true
            this.canManageExceptionRequest = true
            this.canReadOnlyFiles = true
            this.canManageFiles = true
            this.canReadOnlyWorkDisabilities = true
            this.canManageWorkDisabilities = true
        } else {
            this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
            this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
            this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
            this.canManageVacation = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-vacation') ? true : false
            this.canManageExceptionRequest = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'exception-request') ? true : false
            this.canReadOnlyFiles = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read-only-files') ? true : false
            this.canManageFiles = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-files') ? true : false
            this.canReadOnlyWorkDisabilities = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read-work-disabilities') ? true : false
            this.canManageWorkDisabilities = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'manage-work-disabilities') ? true : false
        }
        myGeneralStore.setFullLoader(false)
        await this.getWorkSchedules()
        await this.handlerSearchEmployee()
        await  this.getDepartments()
        await this.getEmployeeTypes()
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
          async getEmployeeTypes() {
            let response = null
            const employeeTypeService = new EmployeeTypeService()
            response = await employeeTypeService.getFilteredList('')
            this.employeeTypes = response._data.data.employeeTypes.data
          },
        async handlerSearchEmployee() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const workSchedule = this.selectedWorkSchedule ? this.selectedWorkSchedule?.employeeWorkSchedule : null
            const onlyInactive = this.status === 'Terminated' ? true : false
            const response = await new EmployeeService().getFilteredList(this.search, this.departmentId, this.positionId, workSchedule, this.currentPage, this.rowsPerPage, onlyInactive, this.employeeTypeId);
            const list = response.status === 200 ? response._data.data.employees.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.employees.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.employees.meta.first_page : 0;
            this.filteredEmployees = list;
            myGeneralStore.setFullLoader(false)
        },
        async getWorkSchedules() {
            const response = await new EmployeeService().getWorkSchedules()
            this.workSchedules = response.status === 200 ? response._data.data.employeeWorkSchedules : []
        },
        onPhoto(employee: EmployeeInterface) {
            this.employee = { ...employee };
            this.drawerEmployeePhotoForm = true;
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchEmployee();
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
                personPhone: "",
                personRfc: null,
                personImssNss: null,
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
                employeeHireDate: new Date(),
                companyId: 1,
                departmentId: 0,
                positionId: 0,
                employeeWorkSchedule: "Onsite",
                personId: 0,
                employeeTypeId: 0,
                employeePhoto: null,
                employeeLastSynchronizationAt: new Date(),
                employeeCreatedAt: new Date(),
                employeeUpdatedAt: new Date(),
                person: person,
                businessUnitId: 1,
                employeeAssistDiscriminator: 0,
                employeeTypeOfContract: "Internal",
                employeeTerminatedDate: new Date(),
            }
            this.employee = newEmployee
            this.drawerEmployeeForm = true
        },
        onEdit(employee: EmployeeInterface) {
            this.employee = { ...employee };
            this.drawerEmployeeForm = true;
        },
        onDelete(employee: EmployeeInterface) {
            this.employee = { ...employee };
            this.drawerEmployeeDelete = true;
        },
        async confirmDelete() {
            if (this.employee) {
                this.drawerEmployeeDelete = false;
                const employeeService = new EmployeeService();
                const employeeResponse = await employeeService.delete(this.employee);

                if (employeeResponse.status === 201) {
                    const index = this.filteredEmployees.findIndex((employee: EmployeeInterface) => employee.employeeId === this.employee?.employeeId);
                    if (index !== -1) {
                        this.filteredEmployees.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete employee',
                        detail: employeeResponse._data.message,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete employee',
                        detail: employeeResponse._data.message,
                        life: 5000,
                    });
                }
            }
        },
        onSave(employee: EmployeeInterface) {
            this.employee = { ...employee };
            const index = this.filteredEmployees.findIndex((s: EmployeeInterface) => s.employeeId === this.employee?.employeeId);
            if (index !== -1) {
                if (this.status === 'Terminated' && !this.employee.deletedAt) {
                    this.filteredEmployees.splice(index, 1)
                } else {
                    this.filteredEmployees[index] = employee;
                }
                this.$forceUpdate();
            } else {
                this.filteredEmployees.push(employee);
                this.$forceUpdate();
            }
            this.drawerEmployeeForm = false;
            this.drawerEmployeePhotoForm = false;
        },
        onEditPerson(employee: EmployeeInterface) {
            this.employee = { ...employee };
            this.drawerEmployeePersonForm = true;
        },
        async syncEmployees() {
            this.drawerEmployeeSync = true
        },
        async confirmSync() {
            this.drawerEmployeeSync = false
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const employeeService = new EmployeeService()
            const employeeResponse = await employeeService.synchronization()
            if (employeeResponse.status === 201) {
                this.$toast.add({
                    severity: 'success',
                    summary: 'Synchronization employees',
                    detail: employeeResponse._data.message,
                    life: 5000,
                })
                await this.handlerSearchEmployee();
            } else {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Synchronization employees',
                    detail: employeeResponse._data.message,
                    life: 5000,
                })
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
            const myGeneralStore = useMyGeneralStore();
            myGeneralStore.setFullLoader(true);
            const filterStartDate = `2000-01-01`;
            const filterEndDate = new Date().toISOString().split('T')[0];
            const onlyInactive = this.status === 'Terminated' ? true : false
            try {
              const employeeService = new EmployeeService();
              const workSchedule = this.selectedWorkSchedule ? this.selectedWorkSchedule?.employeeWorkSchedule : null
              const assistResponse = await employeeService.getExcelAll(this.search, this.departmentId, this.positionId, filterStartDate, filterEndDate, onlyInactive, this.employeeTypeId, workSchedule, this.currentPage, this.rowsPerPage);
              
              if (assistResponse) {
                const reportDesc = onlyInactive ? '_terminated' : ''
                const blob = await assistResponse._data; 
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Employee_Report${reportDesc}.xlsx`); 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.$toast.add({
                  severity: 'success',
                  summary: 'Excel Report',
                  detail: 'Excel file created successfully',
                  life: 5000,
                });
              } else {
                const msgError = assistResponse?._data?.error || assistResponse?._data?.message || 'Unknown error';
                this.$toast.add({
                  severity: 'error',
                  summary: 'Excel Report',
                  detail: msgError,
                  life: 5000,
                });
              }
            } catch (error) {
              console.error('Error generating Excel file:', error);
              this.$toast.add({
                severity: 'error',
                summary: 'Excel Report',
                detail: 'Error generating Excel file',
                life: 5000,
              });
            } finally {
              myGeneralStore.setFullLoader(false);
            }
          },
          async getVacationExcel() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const dateNow = new Date()
            const dateNowFormat = DateTime.fromJSDate(dateNow).plus({ years: 1 }).toFormat('yyyy-MM-dd')
            const assistService = new EmployeeService()
            const onlyInactive = this.status === 'Terminated' ? true : false
            const assistResponse = await assistService.getVacationExcel(this.search, this.departmentId, this.positionId, '2022-01-01', dateNowFormat, onlyInactive)
            if (assistResponse.status === 201) {
              const reportDesc = onlyInactive ? '_terminated' : ''
              const blob = await assistResponse._data
              const url = window.URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', `All Employees Vacation Report${reportDesc}.xlsx`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              this.$toast.add({
                severity: 'success',
                summary: 'Excel vacation',
                detail: 'Excel was created successfully',
                  life: 5000,
              })
              myGeneralStore.setFullLoader(false)
            } else {
              const msgError = assistResponse._data.error ? assistResponse._data.error : assistResponse._data.message
              this.$toast.add({
                severity: 'error',
                summary: 'Excel vacation',
                detail: msgError,
                  life: 5000,
              })
              myGeneralStore.setFullLoader(false)
            }
          },
          onClosePerson() {
            this.drawerEmployeePersonForm = false
          }
    }
});
