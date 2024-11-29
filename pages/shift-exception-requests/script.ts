import type { ShiftExceptionRequestInterface } from "~/resources/scripts/interfaces/ShiftExceptionRequestInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import ShiftExceptionRequestService from "~/resources/scripts/services/ShiftExceptionService";
import { useMyGeneralStore } from "~/store/general";
import PositionService from '~/resources/scripts/services/PositionService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import { ConfirmDelete } from "#build/components";

export default defineComponent({
  name: 'ShiftExceptionRequest',
  props: {},
  data: () => ({
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    search: '' as string,
    filteredShiftExceptionRequests: [] as ShiftExceptionRequestInterface[],
    shiftExceptionRequest: null as ShiftExceptionRequestInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    rowsPerPage: 30,
    drawerShiftExceptionForm: false,
    drawerShiftExceptionDelete: false,
    drawerShiftExceptionDeletes: false,
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
        { label: 'Requested', value: 'requested' },
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Refused', value: 'refused' }
      ],
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
    this.handlerSearchShiftException();
    await Promise.all([
        this.getDepartments()
      ])
  },
  watch:{
    'selectedDepartmentId': function(newVal) {
        if (newVal) {
          this.getPositions(newVal);
        }
      },
  },
  methods: {
    async handlerSearchShiftException() {
      const myGeneralStore = useMyGeneralStore();
      myGeneralStore.setFullLoader(true);
      const response = await new ShiftExceptionRequestService().getFilteredList({
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
      console.log(list)
      this.filteredShiftExceptionRequests = list;
      myGeneralStore.setFullLoader(false);
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchShiftException();
    },
    async onEdit(shiftExceptionRequest: ShiftExceptionRequestInterface) {
      const myGeneralStore = useMyGeneralStore()
      this.shiftExceptionRequest = { ...shiftExceptionRequest };
      this.drawerShiftExceptionDelete = true
      this.currentAction = "accept"
    },
    async onDelete(shiftExceptionRequest: ShiftExceptionRequestInterface){
      const myGeneralStore = useMyGeneralStore()
      this.shiftExceptionRequest = { ...shiftExceptionRequest };
      this.drawerShiftExceptionDeletes = true
      this.currentAction = "refuse"
    },
    async confirmDelets(){

      if (!this.description.trim()) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Description is required for refusal',
          life: 3000,
        });
        return;
      }
    },
    async confirmDelete(){
      const myGeneralStore = useMyGeneralStore()
      this.drawerShiftExceptionDelete = false
      myGeneralStore.setFullLoader(true)
      const response = await new ShiftExceptionRequestService().updateStatus( this.shiftExceptionRequest ,'refused', this.description.trim())
      if (response) {
        this.$toast.add({
          severity: 'success',
          summary: 'Change Status',
          detail: 'Refused',
          life: 5000,
      });
        this.shiftExceptionRequest.exceptionRequestStatus = 'refused';
        const index = this.filteredShiftExceptionRequests.findIndex(
          (item) => item.exceptionRequestId === this.shiftExceptionRequest.exceptionRequestId
        );
        if (index !== -1) {
          this.filteredShiftExceptionRequests[index] = { ...this.shiftExceptionRequest };
        }
        this.description = '';
        myGeneralStore.setFullLoader(false)
      } else {
        console.error('Error updating status');
      }
    },
    async confirmAccept(){
      const myGeneralStore = useMyGeneralStore()
      this.drawerShiftExceptionDelete = false
      myGeneralStore.setFullLoader(true)
      const response = await new ShiftExceptionRequestService().updateStatus( this.shiftExceptionRequest ,'accepted')
      if (response) {
        this.$toast.add({
          severity: 'success',
          summary: 'Change Status',
          detail: 'Accepted',
          life: 5000,
      });
        this.shiftExceptionRequest.exceptionRequestStatus = 'accepted';
        const index = this.filteredShiftExceptionRequests.findIndex(
          (item) => item.exceptionRequestId === this.shiftExceptionRequest.exceptionRequestId
        );
        if (index !== -1) {
          this.filteredShiftExceptionRequests[index] = { ...this.shiftExceptionRequest };
        }
        myGeneralStore.setFullLoader(false)
      } else {
        console.error('Error updating status');
      }
    },
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
      clearFilters() {
        this.selectedDepartmentId = null;
        this.selectedPositionId = null;
        this.selectedStatus = '';
        this.search = '';
        this.handlerSearchShiftException(); 
      }
  }
});
