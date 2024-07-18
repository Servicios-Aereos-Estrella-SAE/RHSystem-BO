import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import EmployeeService from "~/resources/scripts/services/EmployeeService";
export default defineComponent({
    name: 'Employees',
    props: {},
    data: () => ({
        search: '' as string,
        filteredEmployees: [] as EmployeeInterface[],
        employee: null as EmployeeInterface | null,
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 20,
        drawerEmployeeForm: false,
        drawerEmployeePhotoForm: false,
        drawerEmployeeDelete: false
    }),
    computed: {},
    created () {},
    async mounted() {
        this.handlerSearchEmployee();
    },
    methods: {
        async handlerSearchEmployee() {
            const response = await new EmployeeService().getFilteredList(this.search, null, null, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.employees.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.employees.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.employees.meta.first_page : 0;
            this.filteredEmployees = list;
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
                person: person
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
        }
    }
});
