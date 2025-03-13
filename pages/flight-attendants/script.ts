import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { FlightAttendantInterface } from "~/resources/scripts/interfaces/FlightAttendantInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import FlightAttendantService from "~/resources/scripts/services/FlightAttendantService";
import { useMyGeneralStore } from "~/store/general";
export default defineComponent({
    name: 'FlightAttendants',
    props: {},
    data: () => ({
        search: '' as string,
        filteredFlightAttendants: [] as FlightAttendantInterface[],
        flightAttendant: null as FlightAttendantInterface | null,
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 50,
        drawerFlightAttendantForm: false,
        drawerFlightAttendantPhotoForm: false,
        drawerFlightAttendantDelete: false,
        drawerFlightAttendantSync: false,
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
        this.handlerSearchFlightAttendant();
    },
    methods: {
        async handlerSearchFlightAttendant() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new FlightAttendantService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.flightAttendants.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.flightAttendants.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.flightAttendants.meta.first_page : 0;
            this.filteredFlightAttendants = list;
            myGeneralStore.setFullLoader(false)
        },
        onPhoto(flightAttendant: FlightAttendantInterface) {
            this.flightAttendant = { ...flightAttendant };
            this.drawerFlightAttendantPhotoForm = true;
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchFlightAttendant();
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
              personDeletedAt: null,
              personEmail: null,
              personPhoneSecondary: null,
              personMaritalStatus: null,
              personPlaceOfBirthCountry: null,
              personPlaceOfBirthState: null,
              personPlaceOfBirthCity: null
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
              employeeBusinessEmail: null
            }
            const newFlightAttendant: FlightAttendantInterface = {
                flightAttendantId: null,
                flightAttendantPhoto: null,
                flightAttendantHireDate: null,
                employeeId: 0,
                employee: newEmployee,
                flightAttendantCreatedAt: new Date(),
                flightAttendantUpdatedAt: new Date(),
                flightAttendantDeletedAt: null
            }
            this.flightAttendant = newFlightAttendant
            this.drawerFlightAttendantForm = true
        },
        onEdit(flightAttendant: FlightAttendantInterface) {
            this.flightAttendant = { ...flightAttendant };
            this.drawerFlightAttendantForm = true;
        },
        onDelete(flightAttendant: FlightAttendantInterface) {
            this.flightAttendant = { ...flightAttendant };
            this.drawerFlightAttendantDelete = true;
        },
        async confirmDelete() {
            if (this.flightAttendant) {
                this.drawerFlightAttendantDelete = false;
                const flightAttendantService = new FlightAttendantService();
                const flightAttendantResponse = await flightAttendantService.delete(this.flightAttendant);
                if (flightAttendantResponse.status === 200) {
                    const index = this.filteredFlightAttendants.findIndex((flightAttendant: FlightAttendantInterface) => flightAttendant.flightAttendantId === this.flightAttendant?.flightAttendantId);
                    if (index !== -1) {
                        this.filteredFlightAttendants.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete flight attendant',
                        detail: flightAttendantResponse._data.message,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete light attendant',
                        detail: flightAttendantResponse._data.message,
                        life: 5000,
                    });
                }
            }
        },
        onSave(flightAttendant: FlightAttendantInterface) {
            this.flightAttendant = { ...flightAttendant };
            const index = this.filteredFlightAttendants.findIndex((s: FlightAttendantInterface) => s.flightAttendantId === this.flightAttendant?.flightAttendantId);
            if (index !== -1) {
                this.filteredFlightAttendants[index] = flightAttendant;
                this.$forceUpdate();
            } else {
                this.filteredFlightAttendants.push(flightAttendant);
                this.$forceUpdate();
            }
            this.drawerFlightAttendantForm = false;
            this.drawerFlightAttendantPhotoForm = false;
        },
    }
});
