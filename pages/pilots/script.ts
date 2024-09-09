import type { PilotInterface } from "~/resources/scripts/interfaces/PilotInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import PilotService from "~/resources/scripts/services/PilotService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
export default defineComponent({
    name: 'Pilots',
    props: {},
    data: () => ({
        search: '' as string,
        filteredPilots: [] as PilotInterface[],
        pilot: null as PilotInterface | null,
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
        this.handlerSearchPilot();
    },
    methods: {
        async handlerSearchPilot() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new PilotService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.pilots.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.pilots.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.pilots.meta.first_page : 0;
            this.filteredPilots = list;
            myGeneralStore.setFullLoader(false)
        },
        onPhoto(pilot: PilotInterface) {
            this.pilot = { ...pilot };
            this.drawerPilotPhotoForm = true;
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchPilot();
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
            const newPilot: PilotInterface = {
                pilotId: null,
                pilotPhoto: null,
                pilotHireDate: null,
                personId: 0,
                person: person,
                pilotCreatedAt: new Date(),
                pilotUpdatedAt: new Date(),
                pilotDeletedAt: null
            }
            this.pilot = newPilot
            this.drawerPilotForm = true
        },
        onEdit(pilot: PilotInterface) {
            this.pilot = { ...pilot };
            this.drawerPilotForm = true;
        },
        onDelete(pilot: PilotInterface) {
            this.pilot = { ...pilot };
            this.drawerPilotDelete = true;
        },
        async confirmDelete() {
            if (this.pilot) {
                this.drawerPilotDelete = false;
                const pilotService = new PilotService();
                const pilotResponse = await pilotService.delete(this.pilot);
                if (pilotResponse.status === 200) {
                    const index = this.filteredPilots.findIndex((pilot: PilotInterface) => pilot.pilotId === this.pilot?.pilotId);
                    if (index !== -1) {
                        this.filteredPilots.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete pilot',
                        detail: pilotResponse._data.message,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete pilot',
                        detail: pilotResponse._data.message,
                        life: 5000,
                    });
                }
            }
        },
        onSave(pilot: PilotInterface) {
            this.pilot = { ...pilot };
            const index = this.filteredPilots.findIndex((s: PilotInterface) => s.pilotId === this.pilot?.pilotId);
            if (index !== -1) {
                this.filteredPilots[index] = pilot;
                this.$forceUpdate();
            } else {
                this.filteredPilots.push(pilot);
                this.$forceUpdate();
            }
            this.drawerPilotForm = false;
            this.drawerPilotPhotoForm = false;
        },
    }
});
