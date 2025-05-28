
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import { useMyGeneralStore } from "~/store/general";
import PositionService from '~/resources/scripts/services/PositionService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import EmployeeService from "~/resources/scripts/services/EmployeeService";
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { ExceptionRequestInterface } from "~/resources/scripts/interfaces/ExceptionRequestInterface";
import { DateTime } from "luxon";
import ExceptionRequestService from "~/resources/scripts/services/ExceptionRequestService";

export default defineComponent({
  name: 'ExceptionRequests',
  props: {},
  data: () => ({
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    search: '' as string,
    filteredExceptionRequests: [] as ExceptionRequestInterface[],
    exceptionRequest: null as ExceptionRequestInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    rowsPerPage: 30,
    drawerExceptionRequestForm: false,
    drawerExceptionRequestDelete: false,
    drawerExceptionRequestDeletes: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    selectedDepartmentId: null as number | null,
    selectedPositionId: null as number | null,
    selectedStatus: '' as string,
    employeeName: '' as string,
    currentAction: '' as string,
    description: '' as string,
    statusOptions: [
      { label: 'All', value: 'all' },
      { label: 'Requested', value: 'requested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'Refused', value: 'refused' }
    ],
    filteredEmployees: [] as EmployeeInterface[],
    selectedEmployee: '' as string | null,
    selectedExceptionDate: new Date() as Date,
    employee: null as EmployeeInterface | null
  }),
  async mounted() {
    const myGeneralStore = useMyGeneralStore();
    myGeneralStore.setFullLoader(true);
    const systemModuleSlug = this.$route.path.replaceAll('/', '');
    const permissions = await myGeneralStore.getAccess(systemModuleSlug);
    if (myGeneralStore.isRoot) {
      this.canCreate = true;
      this.canUpdate = true;
      this.canDelete = true;
    } else {
      this.canCreate = !!permissions.find((p: RoleSystemPermissionInterface) => p.systemPermissions?.systemPermissionSlug === 'create');
      this.canUpdate = !!permissions.find((p: RoleSystemPermissionInterface) => p.systemPermissions?.systemPermissionSlug === 'update');
      this.canDelete = !!permissions.find((p: RoleSystemPermissionInterface) => p.systemPermissions?.systemPermissionSlug === 'delete');
    }

    myGeneralStore.setFullLoader(false);
    this.handlerSearchExceptionRequest();
    await Promise.all([
      this.getDepartments()
    ])
  },
  watch: {
    'selectedDepartmentId': function (newVal) {
      if (newVal) {
        this.getPositions(newVal);
      }
    },
  },
  methods: {
    async handlerSearchEmployee(event: any) {
      if (event.query.trim().length) {
        const response = await new EmployeeService().getFilteredList(event.query.trim(), null, null, null, 1, 30, false, null)
        const list = response.status === 200 ? response._data.data.employees.data : []
        this.filteredEmployees = list
      }
    },
    onEmployeeSelect(employee: any) {
      this.employeeName = employee.value.employeeId;
      this.handlerSearchExceptionRequest()

    },
    async handlerSearchExceptionRequest() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      const response = await new ExceptionRequestService().getFilteredList({
        search: this.search,
        departmentId: this.selectedDepartmentId,
        positionId: this.selectedPositionId,
        status: this.selectedStatus,
        employeeName: this.employeeName,
        page: this.currentPage,
        limit: this.rowsPerPage,
      })
      const list = response.data
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filteredExceptionRequests = list;
      myGeneralStore.setFullLoader(false);
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchExceptionRequest();
    },
    onEdit(exceptionRequest: ExceptionRequestInterface) {
      this.exceptionRequest = { ...exceptionRequest }
      if (this.exceptionRequest) {
        if (this.exceptionRequest.employee) {
          this.employee = this.exceptionRequest.employee
          this.selectedExceptionDate = DateTime.fromISO(`${this.exceptionRequest.requestedDate}T00:00:00.000-06:00`, { setZone: true }).setZone('UTC-6').toJSDate()
        }
      }
      this.drawerExceptionRequestForm = true
    },
    onExceptionRequestAccept() {
      this.drawerExceptionRequestForm = false
      this.drawerExceptionRequestDelete = true
      this.currentAction = "accept"
    },
    onExceptionRequestDecline() {
      this.drawerExceptionRequestForm = false
      this.drawerExceptionRequestDeletes = true
      this.currentAction = "refuse"
    },
    async confirmDelets() {
      if (!this.description.trim()) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Description is required for refuse',
          life: 3000,
        });
        return;
      }
    },
    async confirmDelete() {
      if (this.exceptionRequest) {
        const myGeneralStore = useMyGeneralStore()
        this.drawerExceptionRequestDelete = false
        myGeneralStore.setFullLoader(true)
        const response = await new ExceptionRequestService().updateStatus(this.exceptionRequest, 'refused', this.description.trim())
        if (response) {
          this.$toast.add({
            severity: 'info',
            summary: 'Change Status',
            detail: 'Refused',
            life: 5000,
          })
          this.exceptionRequest.exceptionRequestStatus = 'refused'
          const index = this.filteredExceptionRequests.findIndex(
            (item) => item.exceptionRequestId === this.exceptionRequest?.exceptionRequestId
          )
          if (index !== -1) {
            this.filteredExceptionRequests[index] = { ...this.exceptionRequest }
          }
          this.description = ''
          myGeneralStore.setFullLoader(false)
        } else {
          console.error('Error updating status');
        }
      }

    },
    async confirmAccept() {
      if (this.exceptionRequest) {
        const myGeneralStore = useMyGeneralStore()
        this.drawerExceptionRequestDelete = false
        myGeneralStore.setFullLoader(true)
        const response = await new ExceptionRequestService().updateStatus(this.exceptionRequest, 'accepted')
        if (response) {
          this.$toast.add({
            severity: 'info',
            summary: 'Change Status',
            detail: 'Accepted',
            life: 5000,
          });
          this.exceptionRequest.exceptionRequestStatus = 'accepted';
          const index = this.filteredExceptionRequests.findIndex(
            (item) => item.exceptionRequestId === this.exceptionRequest?.exceptionRequestId
          );
          if (index !== -1) {
            this.filteredExceptionRequests[index] = { ...this.exceptionRequest };
          }
          myGeneralStore.setFullLoader(false)
        } else {
          console.error('Error updating status');
        }
      }

    },
    async getPositions(departmentId: number) {
      const positionService = new PositionService()
      this.positions = [{
        positionId: 9999, positionName: 'All',
        positionSyncId: "",
        positionCode: "",
        positionAlias: "",
        positionIsDefault: 0,
        positionActive: 0,
        parentPositionId: null,
        parentPositionSyncId: "",
        companyId: null,
        businessUnitId: null,
        departmentId: null,
        positionLastSynchronizationAt: null,
        positionCreatedAt: null,
        positionUpdatedAt: null,
        positionDeletedAt: null,
        parentPosition: null,
      }, ... await positionService.getPositionsDepartment(departmentId)]
    },
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = [
        { departmentId: 9999, departmentName: 'All' },
        ...response._data.data.departments,
      ]
    },
    clearFilters() {
      this.selectedDepartmentId = null;
      this.selectedPositionId = null;
      this.selectedStatus = '';
      this.search = '';
      this.employeeName = ''
      this.selectedEmployee = null;
      this.handlerSearchExceptionRequest();
    }
  }
});
