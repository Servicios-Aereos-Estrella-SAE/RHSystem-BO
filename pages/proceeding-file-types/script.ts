import type { ProceedingFileTypeInterface } from "~/resources/scripts/interfaces/ProceedingFileTypeInterface";
import ProceedingFileTypeService from "~/resources/scripts/services/ProceedingFileTypeService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
export default defineComponent({
    name: 'ProceedingFileTypes',
    props: {},
    data: () => ({
        search: '' as string,
        filteredProceedingFileTypes: [] as ProceedingFileTypeInterface[],
        proceedingFileType: null as ProceedingFileTypeInterface | null,
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 50,
        drawerProceedingFileTypeForm: false,
        drawerProceedingFileTypePhotoForm: false,
        drawerProceedingFileTypeDelete: false,
        drawerProceedingFileTypeSync: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
    }),
    computed: {},
    created() { },
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
        this.handlerSearchProceedingFileType();
    },
    methods: {
        async handlerSearchProceedingFileType() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new ProceedingFileTypeService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.proceedingFileTypes.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.proceedingFileTypes.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.proceedingFileTypes.meta.first_page : 0;
            this.filteredProceedingFileTypes = list;
            myGeneralStore.setFullLoader(false)
        },
        onPhoto(proceedingFileType: ProceedingFileTypeInterface) {
            this.proceedingFileType = { ...proceedingFileType };
            this.drawerProceedingFileTypePhotoForm = true;
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchProceedingFileType();
        },
        addNew() {
            const newProceedingFileType: ProceedingFileTypeInterface = {
                proceedingFileTypeId: null,
                proceedingFileTypeName: '',
                proceedingFileTypeSlug: '',
                proceedingFileTypeIcon: '',
                proceedingFileTypeAreaToUse: '',
                proceedingFileTypeActive: 1
            }
            this.proceedingFileType = newProceedingFileType
            this.drawerProceedingFileTypeForm = true
        },
        onEdit(proceedingFileType: ProceedingFileTypeInterface) {
            this.proceedingFileType = { ...proceedingFileType };
            this.drawerProceedingFileTypeForm = true;
        },
        onDelete(proceedingFileType: ProceedingFileTypeInterface) {
            this.proceedingFileType = { ...proceedingFileType };
            this.drawerProceedingFileTypeDelete = true;
        },
        async confirmDelete() {
            if (this.proceedingFileType) {
                this.drawerProceedingFileTypeDelete = false;
                const proceedingFileTypeService = new ProceedingFileTypeService();
                const proceedingFileTypeResponse = await proceedingFileTypeService.delete(this.proceedingFileType);
                if (proceedingFileTypeResponse.status === 200) {
                    const index = this.filteredProceedingFileTypes.findIndex((proceedingFileType: ProceedingFileTypeInterface) => proceedingFileType.proceedingFileTypeId === this.proceedingFileType?.proceedingFileTypeId);
                    if (index !== -1) {
                        this.filteredProceedingFileTypes.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete proceeding file type',
                        detail: proceedingFileTypeResponse._data.message,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete proceeding file type',
                        detail: proceedingFileTypeResponse._data.message,
                        life: 5000,
                    });
                }
            }
        },
        onSave(proceedingFileType: ProceedingFileTypeInterface) {
            this.proceedingFileType = { ...proceedingFileType };
            const index = this.filteredProceedingFileTypes.findIndex((s: ProceedingFileTypeInterface) => s.proceedingFileTypeId === this.proceedingFileType?.proceedingFileTypeId);
            if (index !== -1) {
                this.filteredProceedingFileTypes[index] = proceedingFileType;
                this.$forceUpdate();
            } else {
                this.filteredProceedingFileTypes.push(proceedingFileType);
                this.$forceUpdate();
            }
            this.drawerProceedingFileTypeForm = false;
            this.drawerProceedingFileTypePhotoForm = false;
        },
    }
});
