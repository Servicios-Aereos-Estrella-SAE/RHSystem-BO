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
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
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
        submitted: false,
        customer: null as CustomerInterface | null,
        first: 0,
        last: 0,
        rowsPerPage: 50,
        drawerPilotForm: false,
        drawerPilotPhotoForm: false,
        drawerPilotDelete: false,
        drawerCustomerForm: false,
        drawerPilotSync: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
    }),
    computed: {
        formatContacts() {
            return this.customers.map((customer: CustomerInterface) => {
                return {
                    ...customer,
                    customerFullName: customer.person?.personFirstname + ' ' + customer.person?.personLastname
                } as CustomerInterface
            })
        },
        formatAircraft() {
            return this.aircraft.map((aircraft: AircraftInterface) => {
                return {
                    ...aircraft,
                    aircraftName:  aircraft.aircraftSerialNumber + ' - ' + aircraft.aircraftRegistrationNumber
                } as AircraftInterface
            })
        },
        formatPilots() {
            return this.pilots.map((pilot: PilotInterface) => {
                return {
                    ...pilot,
                    pilotName: pilot.employee?.employeeFirstName + ' ' + pilot.employee?.employeeLastName
                } as PilotInterface
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
    created() { },
    watch: {
        customerSelected: function (val: CustomerInterface | null) {
            if (val) {
                console.log('customerSelected', val)
                this.customer = val
            }
        },
        aircraftSelected: function (val: AircraftInterface | null) {
            if (val) {
                this.setPilotsDefaultSelected()
            }
        },
        
    },
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
        setPilotsDefaultSelected() {
            if (this.aircraftSelected) {
                this.pilotSelectedPic = this.formatPilots.find((s: PilotInterface) => s.pilotId === this.aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'pic')?.pilotId || null) ?? null;
                this.pilotSelectedSic = this.formatPilots.find((s: PilotInterface) => s.pilotId === this.aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'sic')?.pilotId || null) ?? null;
            }
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
        addNew() {
            const person: PeopleInterface = {
                personId: null,
                personFirstname: "Rogelio ",
                personLastname: "Rogelio ",
                personSecondLastname: "Rogelio ",
                personGender: "Male",
                personBirthday: new Date(),
                personCurp: 'SORA000915MDGRZNA5',
                personPhone: "8713854575",
                personRfc: 'JIGR960217H78',
                personImssNss: 'JIGR960217H78',
                personCreatedAt: new Date(),
                personUpdatedAt: new Date(),
                personDeletedAt: null
            }
            const newCustomer: CustomerInterface = {
                customerId: null,
                customerUuid: 'JIGR960217H78',
                personId: 0,
                person: person,
                customerCreatedAt: new Date(),
                customerUpdatedAt: new Date(),
                customerDeletedAt: null
            }
            this.customer = newCustomer
            this.drawerCustomerForm = true
        },
        onSave(customer: CustomerInterface) {
            this.customer = { ...customer };
            const index = this.customers.findIndex((s: CustomerInterface) => s.customerId === this.customer?.customerId);
            if (index !== -1) {
                this.customers[index] = customer;
                this.$forceUpdate();
            } else {
                this.customers.push(customer);
                this.$forceUpdate();
                // selected new customer from formatContacts
                this.customerSelected = this.formatContacts.find((s: CustomerInterface) => s.customerId === customer.customerId) ?? null;
                
            }
            this.drawerCustomerForm = false;
        },
    }
});
