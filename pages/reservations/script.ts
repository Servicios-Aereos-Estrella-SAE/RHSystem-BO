import AircraftService from "~/resources/scripts/services/AircraftService"
import CustomerService from "~/resources/scripts/services/CustomerService";
import PilotService from "~/resources/scripts/services/PilotService";
import FlightAttendantService from "~/resources/scripts/services/FlightAttendantService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import type { AircraftOperatorInterface } from "~/resources/scripts/interfaces/AircraftOperatorInterface";
import type { AircraftInterface } from "~/resources/scripts/interfaces/AircraftInterface";
import type { CustomerInterface } from "~/resources/scripts/interfaces/CustomerInterface";
import { format } from "date-fns";
import type { PilotInterface } from "~/resources/scripts/interfaces/PilotInterface";
import type { FlightAttendantInterface } from "~/resources/scripts/interfaces/FlightAttendantInterface";
export default defineComponent({
    name: 'AircraftOperators',
    props: {},
    data: () => ({
        search: '' as string,
        aircraft: [] as AircraftInterface[],
        customers: [] as CustomerInterface[],
        pilots: [] as PilotInterface[],
        pilotSelectedSic: null as PilotInterface | null,
        pilotSelectedPic: null as PilotInterface | null,
        flightAttendants: [] as FlightAttendantInterface[],
        flightAttendantSelected: null as FlightAttendantInterface | null,
        customerSelected: null as CustomerInterface | null,
        aircraftSelected: null as AircraftInterface | null,
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
    computed: {
        formatContacts() {
            return this.customers.map((customer: CustomerInterface) => {
                return {
                    customerId: customer.customerId,
                    customerName: customer.person?.personFirstname + ' ' + customer.person?.personLastname
                }
            })
        },
        formatAircraft() {
            return this.aircraft.map((aircraft: AircraftInterface) => {
                return {
                    aircraftId: aircraft.aircraftId,
                    aircraftName:  aircraft.aircraftSerialNumber + ' - ' + aircraft.aircraftRegistrationNumber
                }
            })
        },
        formatPilots() {
            return this.pilots.map((pilot: PilotInterface) => {
                return {
                    pilotId: pilot.pilotId,
                    pilotName: pilot.employee?.employeeFirstName + ' ' + pilot.person?.employeeLastName
                }
            })
        },
        formatFlightAttendants() {
            return this.flightAttendants.map((flightAttendant: FlightAttendantInterface) => {
                return {
                    flightAttendantId: flightAttendant.flightAttendantId,
                    flightAttendantName: flightAttendant.employee?.employeeFirstName + ' ' + flightAttendant.employee?.employeeLastName
                }
            })
        }
    },
    created() {},
    async mounted() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
        const permissions = await myGeneralStore.getAccess(systemModuleSlug)
        await this.handlerSearchCustomer();
        await this.handlerSearchAircraft();
        await this.handlerSearchPilot();
        await this.handlerSearchFlightAttendant();
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
    },
    methods: {
        async handlerSearchCustomer() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new CustomerService().getFilteredList('', 1, 999999999);
            const list = response.status === 200 ? response._data.data.customers.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.customers.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.customers.meta.first_page : 0;
            this.customers = list;
            myGeneralStore.setFullLoader(false)
        },
        async handlerSearchFlightAttendant() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new FlightAttendantService().getFilteredList('', 1, 999999999);
            const list = response.status === 200 ? response._data.data.flightAttendants.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.flightAttendants.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.flightAttendants.meta.first_page : 0;
            this.flightAttendants = list;
            myGeneralStore.setFullLoader(false)
        },
        async handlerSearchPilot() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new PilotService().getFilteredList('', 1, 999999999);
            const list = response.status === 200 ? response._data.data.pilots.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.pilots.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.pilots.meta.first_page : 0;
            this.pilots = list;
            myGeneralStore.setFullLoader(false)
        },
        async handlerSearchAircraft() {
            const response = await new AircraftService().getFilteredList('', 1, 999999999);
            const list = response.status === 200 ? response._data.data.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
            this.aircraft = list;
        },
    }
});
