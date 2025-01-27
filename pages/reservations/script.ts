import AircraftService from "~/resources/scripts/services/AircraftService"
import CustomerService from "~/resources/scripts/services/CustomerService";
import FlightAttendantService from "~/resources/scripts/services/FlightAttendantService";
import { useMyGeneralStore } from "~/store/general";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import type { AircraftInterface } from "~/resources/scripts/interfaces/AircraftInterface";
import type { CustomerInterface } from "~/resources/scripts/interfaces/CustomerInterface";
import type { PilotInterface } from "~/resources/scripts/interfaces/PilotInterface";
import type { FlightAttendantInterface } from "~/resources/scripts/interfaces/FlightAttendantInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { ReservationNoteInterface } from "~/resources/scripts/interfaces/ReservationNoteInterface";
import type { ReservationLegInterface } from "~/resources/scripts/interfaces/ReservationLegInterface";
import type { ReservationInterface } from "~/resources/scripts/interfaces/ReservationInterface";
import { useRouter } from 'vue-router'
import ReservationService from "~/resources/scripts/services/ReservationService";
import ReservationLegService from "~/resources/scripts/services/ReservationLegService";
import ReservationNoteService from "~/resources/scripts/services/ReservationNoteService";
export default defineComponent({
    name: 'reservations',
    props: {},
    data: () => ({
        search: '' as string,
        aircraft: [] as AircraftInterface[],
        customers: [] as CustomerInterface[],
        router: useRouter(),
        pilots: [] as PilotInterface[],
        pilotSelectedSic: null as PilotInterface | null,
        pilotSelectedPic: null as PilotInterface | null,
        flightAttendants: [] as FlightAttendantInterface[],
        flightAttendantSelected: null as FlightAttendantInterface | null,
        customerSelected: null as CustomerInterface | null,
        aircraftSelected: null as AircraftInterface | null,
        reservationNotes: [] as ReservationNoteInterface[],
        reservationLegs: [] as ReservationLegInterface[],
        reservations: [] as ReservationInterface[],
        reservation: null as ReservationInterface | null,
        currentPage: 1,
        drawerReservationDelete: false,
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
        canDelete: false,
        showDetail: false,
        editMode: false,
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
    },
    created() { },
    watch: {
        customerSelected: function (val: CustomerInterface | null) {
            if (val) {
                console.log('customerSelected', val)
                this.customer = val
            }
        },
        'reservation.customerId': function (val: number | null) {
            if (val) {
                if (this.reservation) {
                    this.reservation.customer = this.customers.find((c: CustomerInterface) => c.customerId === val) ?? null
                }
            }
        },
        'reservation.pilotPicId': function (val: number | null) {
            if (val) {
                if (this.reservation) {
                    this.reservation.pilotPic = this.pilots.find((p: PilotInterface) => p.pilotId === val) ?? null
                }
            }
        },
        'reservation.pilotSicId': function (val: number | null) {
            if (val) {
                if (this.reservation) {
                    this.reservation.pilotSic = this.pilots.find((p: PilotInterface) => p.pilotId === val) ?? null
                }
            }
        },
        'reservation.flightAttendantId': function (val: number | null) {
            if (val) {
                if (this.reservation) {
                    this.reservation.flightAttendant = this.flightAttendants.find((f: FlightAttendantInterface) => f.flightAttendantId === val) ?? null
                }
            }
        },
        'reservation.reservationTaxFactor': function (val: number) {
            if (this.reservation) {
                this.reservation.reservationTotal = this.reservation.reservationSubtotal * (1 + val)   
                this.reservation.reservationTax = this.reservation.reservationSubtotal * val
            }
        },
        'reservation.reservationSubtotal': function (val: number) {
            if (this.reservation) {
                this.reservation.reservationTotal = val * (1 + this.reservation.reservationTax)
                this.reservation.reservationTax = val * (this.reservation.reservationTaxFactor ?? 0)
            }
        }
        
    },
    async mounted() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
        const permissions = await myGeneralStore.getAccess(systemModuleSlug)
        await this.handlerSearchCustomer();
        await this.handlerSearchAircraft();
        if (myGeneralStore.isRoot) {
            this.canCreate = true
            this.canUpdate = true
            this.canDelete = true
        } else {
            this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
            this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
            this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
        }
        await this.handlerSearchReservations()
        myGeneralStore.setFullLoader(false)
    },
    methods: {
        addNewNote() {
            if(this.reservation){
                this.reservation?.reservationNotes?.push({ reservationNoteId: 0, reservationNoteContent: '' } as ReservationNoteInterface)
            }
        },
        async handlerSearchReservations() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new ReservationService().getFilterList(this.search, this.currentPage, this.rowsPerPage);
            console.log('response', response)
            const list = response.status === 200 ? response._data.data.reservations.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.reservations.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.reservations.meta.first_page : 0;
            this.reservations = list;
            myGeneralStore.setFullLoader(false)
        },
        handlerSearch() {
            this.currentPage = 1
            this.handlerSearchReservations()
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchReservations()
        },  
        onCancelReservationDelete() {
            this.drawerReservationDelete = false
        },
        startReservation() {
            this.reservation = {
                reservationId: null,
                customerId: null,
                aircraftId: null,
                pilotSicId: null,
                pilotPicId: null,
                flightAttendantId: null,
                reservationSubtotal: 0,
                reservationTax: 0,
                reservationTaxFactor: 0,
                reservationTotal: 0,
                reservationCreatedAt: new Date(),
                reservationUpdatedAt: new Date(),
                reservationDeletedAt: null,
                reservationLegs: [] as ReservationLegInterface[],
                reservationNotes: [] as ReservationNoteInterface[]
            } as ReservationInterface
            this.addNewNote()
            this.reservationLegsAdd()
        },
        removeNote(index: number) {
            this.reservation?.reservationNotes?.splice(index, 1)
        },
        reservationLegsRemove(index: number) {
            this.reservation?.reservationLegs?.splice(index, 1)
        },
        reservationLegsAdd() {
            this.reservation?.reservationLegs?.push({
                reservationLegId: null,
                reservationLegArriveTime: null,
                reservationLegArriveDate: null,
                reservationLegDepartureTime: null,
                reservationLegDepartureLocation: '',
                reservationLegArrivalLocation: '',
                reservationLegCreatedAt: new Date(),
                reservationLegUpdatedAt: new Date(),
                reservationLegDeletedAt: null,
                reservationLegDepartureDate: null,
                reservationId: null,
                customerId: null,
                airportDestinationId: null,
                airportDepartureId: null,
                reservationLegPax: 0,
                reservationLegDistanceMn: 0,
                reservationLegTravelTime: null,
            } as ReservationLegInterface)
        },
        setReservationIdToLegs(id: number) {
            console.log('id', id)
            this.reservation?.reservationLegs?.forEach((leg: ReservationLegInterface) => {
                leg.reservationId = id
            })
        },
        getReservationNotesNotEmpty(): ReservationNoteInterface[] {
            if (this.reservation?.reservationNotes && this.reservation.reservationNotes.length > 0) {
                return this.reservation.reservationNotes.filter((note: ReservationNoteInterface) => note.reservationNoteContent !== '')
            }
            return this.reservation?.reservationNotes ?? []
        },
        async saveReservation() {
            const myGeneralStore = useMyGeneralStore()
            const reservationService = new ReservationService()
            this.submitted = true
            if (reservationService.isValidInformationReservation(this.reservation as ReservationInterface)) {
                myGeneralStore.setFullLoader(true)
                const response = await new ReservationService().store(this.reservation as ReservationInterface);
                if (response.status === 201) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Reservation created', life: 3000 });
                    console.log('response', response)
                    this.reservation!.reservationId = response._data.data.reservation.reservationId
                    console.log('reservation', response._data.data)
                    this.setReservationIdToLegs(this.reservation?.reservationId ?? 0)
                    console.log(this.reservation?.reservationLegs, 'reservationLegs')
                    this.reservation?.reservationLegs?.forEach(async reservationLeg => {
                        const responseLegs = await new ReservationLegService().store(reservationLeg);
                    });
                    const reservationNotes = this.getReservationNotesNotEmpty()
                    reservationNotes.forEach(async note => {
                        note.reservationId = this.reservation?.reservationId ?? 0
                        const responseNotes = await new ReservationNoteService().store(note);
                    });
                    // this.startReervation()
                    this.submitted = false
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Reservation not created', life: 3000 });
                }
                myGeneralStore.setFullLoader(false)
            }
        },
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
        async handlerSearchAircraft() {
            const response = await new AircraftService().getFilteredList('', 1, 999999999);
            const list = response.status === 200 ? response._data.data.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
            this.aircraft = list;
        },
        addNewReservation() {
            this.router.push({ path: '/reservations/create'})
        },
        showIndex() {
            this.showDetail = false
            this.reservation = null
            this.editMode = false
        },  
        addNew() {
            if (this.$config.public.ENVIRONMENT === 'production') {
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
            } else {
                const person: PeopleInterface = {
                    personId: null,
                    personFirstname: "",
                    personLastname: "",
                    personSecondLastname: "",
                    personGender: "",
                    personBirthday: null,
                    personCurp: '',
                    personPhone: "",
                    personRfc: '',
                    personImssNss: '',
                    personCreatedAt: new Date(),
                    personUpdatedAt: new Date(),
                    personDeletedAt: null
                }
                const newCustomer: CustomerInterface = {
                    customerId: null,
                    customerUuid: '',
                    personId: 0,
                    person: person,
                    customerCreatedAt: new Date(),
                    customerUpdatedAt: new Date(),
                    customerDeletedAt: null
                }
                this.customer = newCustomer
            }
            this.drawerCustomerForm = true
        },
        showDetails(reservation: ReservationInterface) {
            this.reservation = { ...reservation }
            this.showDetail = true
            this.editMode = false
            console.log('reservation', reservation)
        },
        onDelete(reservation: ReservationInterface) {
            this.reservation = {... reservation }
            this.drawerReservationDelete = true
        },
        async handlerDeleteReservation() {
            const myGeneralStore = useMyGeneralStore()
            myGeneralStore.setFullLoader(true)
            const response = await new ReservationService().delete(this.reservation?.reservationId ?? 0);
            if (response.status === 200) {
                this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Reservation deleted', life: 3000 });
                this.handlerSearchReservations()
                this.reservation = null
                this.drawerReservationDelete = false
            } else {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Reservation not deleted', life: 3000 });
            }
            myGeneralStore.setFullLoader(false)
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
                if (this.reservation) {
                    this.reservation.customerId = this.formatContacts.find((s: CustomerInterface) => s.customerId === customer.customerId)?.customerId ?? null;
                }
                
            }
            this.drawerCustomerForm = false;
        },
    }
});
