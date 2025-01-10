import AircraftOperatorService from "~/resources/scripts/services/AircraftOperatorService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import type { AircraftOperatorInterface } from "~/resources/scripts/interfaces/AircraftOperatorInterface";
export default defineComponent({
    name: 'AircraftOperators',
    props: {},
    data: () => ({
        search: '' as string,
        filteredAircraftOperators: [] as AircraftOperatorInterface[],
        aircraftOperator: null as AircraftOperatorInterface | null,
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 50,
        drawerPilotForm: false,
        drawerPilotPhotoForm: false,
        drawerPilotDelete: false,
        drawerPilotSync: false,
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
        await this.handlerSearchAircraftOperator();
    },
    methods: {
        async handlerSearchAircraftOperator() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new AircraftOperatorService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.operators.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.operators.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.operators.meta.first_page : 0;
            this.filteredAircraftOperators = list;
            myGeneralStore.setFullLoader(false)
        },
        onPhoto(aircraftOperator: AircraftOperatorInterface) {
            this.aircraftOperator = { ...aircraftOperator };
            this.drawerPilotPhotoForm = true;
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchAircraftOperator();
        },
        addNew() {
            const newAircraftOperator: AircraftOperatorInterface = {
                aircraftOperatorId: null,
                aircraftOperatorName: '',
                aircraftOperatorFiscalName: '',
                aircraftOperatorSlug: '',
                aircraftOperatorCreatedAt: new Date(),
                aircraftOperatorUpdatedAt: new Date(),
                aircraftOperatorDeletedAt: null,
                aircraftOperatorImage: null,
                aircraftOperatorActive: 1
            }
            this.aircraftOperator = newAircraftOperator
            this.drawerPilotForm = true
        },
        onEdit(aircraftOperator: AircraftOperatorInterface) {
            this.aircraftOperator = { ...aircraftOperator };
            this.drawerPilotForm = true;
        },
        onDelete(aircraftOperator: AircraftOperatorInterface) {
            this.aircraftOperator = { ...aircraftOperator };
            this.drawerPilotDelete = true;
        },
        async confirmDelete() {
            if (this.aircraftOperator) {
                this.drawerPilotDelete = false;
                const aircraftOperatorService = new AircraftOperatorService();
                const aircraftOperatorResponse = await aircraftOperatorService.delete(this.aircraftOperator);
                if (aircraftOperatorResponse.status === 200) {
                    const index = this.filteredAircraftOperators.findIndex((aircraftOperator: AircraftOperatorInterface) => aircraftOperator.aircraftOperatorId === this.aircraftOperator?.aircraftOperatorId);
                    if (index !== -1) {
                        this.filteredAircraftOperators.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete Aircraft Operator',
                        detail: aircraftOperatorResponse._data.message,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete pilot',
                        detail: aircraftOperatorResponse._data.message,
                        life: 5000,
                    });
                }
            }
        },
        onSave(aircraftOperator: AircraftOperatorInterface) {
            this.aircraftOperator = { ...aircraftOperator };
            const index = this.filteredAircraftOperators.findIndex((s: AircraftOperatorInterface) => s.aircraftOperatorId === this.aircraftOperator?.aircraftOperatorId);
            if (index !== -1) {
                this.filteredAircraftOperators[index] = aircraftOperator;
                this.$forceUpdate();
            } else {
                this.filteredAircraftOperators.push(aircraftOperator);
                this.$forceUpdate();
            }
            this.drawerPilotForm = false;
            this.drawerPilotPhotoForm = false;
        },
    }
});
