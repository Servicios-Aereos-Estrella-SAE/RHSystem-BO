import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { EmployeWorkScheduleInterface } from "~/resources/scripts/interfaces/EmployeeWorkScheduleInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import EmployeeService from "~/resources/scripts/services/EmployeeService";
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
        drawerEmployeePhotoForm: false,
        drawerEmployeeDelete: false,
        drawerEmployeeSync: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
    }),
    computed: {},
    created () {},
    async mounted() {
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
        myGeneralStore.setFullLoader(false)
        await this.getWorkSchedules()
        this.handlerSearchEmployee();
    },
    methods: {
        async handlerSearchEmployee() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const workSchedule = this.selectedWorkSchedule ? this.selectedWorkSchedule?.employeeWorkSchedule : null
            const response = await new EmployeeService().getFilteredList(this.search, null, null, workSchedule, this.currentPage, this.rowsPerPage);
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
                employeePhoto: null,
                employeeLastSynchronizationAt: new Date(),
                employeeCreatedAt: new Date(),
                employeeUpdatedAt: new Date(),
                person: person,
                businessUnitId: 1,
                employeeAssistDiscriminator: 0,
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
                this.filteredEmployees[index] = employee;
                this.$forceUpdate();
            } else {
                this.filteredEmployees.push(employee);
                this.$forceUpdate();
            }
            this.drawerEmployeeForm = false;
            this.drawerEmployeePhotoForm = false;
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
        }
    }
});
