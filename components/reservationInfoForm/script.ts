import PilotService from "~/resources/scripts/services/PilotService";
import FlightAttendantService from "~/resources/scripts/services/FlightAttendantService";
import { useMyGeneralStore } from "~/store/general";
import type { PilotInterface } from "~/resources/scripts/interfaces/PilotInterface";
import type { FlightAttendantInterface } from "~/resources/scripts/interfaces/FlightAttendantInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { ReservationNoteInterface } from "~/resources/scripts/interfaces/ReservationNoteInterface";
import type { ReservationLegInterface } from "~/resources/scripts/interfaces/ReservationLegInterface";
import type { ReservationInterface } from "~/resources/scripts/interfaces/ReservationInterface";
import type { AircraftInterface } from "~/resources/scripts/interfaces/AircraftInterface";
import type { CustomerInterface } from "~/resources/scripts/interfaces/CustomerInterface";
import CustomerService from "~/resources/scripts/services/CustomerService";
import AircraftService from "~/resources/scripts/services/AircraftService";
export default defineComponent({
  name: 'reservationInfoForm',
  props: {
    reservation: { type: Object as PropType<ReservationInterface>, required: true },
    editMode: { type: Boolean, default: false },
    canUpdate: { type: Boolean, default: false },
    submitted: { type: Boolean, default: false },
  },
  data: () => ({
    flightAttendants: [] as FlightAttendantInterface[],
    pilots: [] as PilotInterface[],
    aircraft: [] as AircraftInterface[],
    customers: [] as CustomerInterface[],
    customer: null as CustomerInterface | null,
    drawerCustomerForm: false,
    taxFactors: [{ taxFactor: 0.00 }, { taxFactor: 0.04 }, { taxFactor: 0.16 }] as { taxFactor: number }[],
  }),
  computed: {
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
      },
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
  watch: {
    customerSelected: function (val: CustomerInterface | null) {
        if (val) {
            this.customer = val
        }
    },
    'reservation.reservationTaxFactor': function (val: number) {
        if (this.reservation && val) {
            // parse val to number
            val = Number(val);
            // Calcula el impuesto
            const newTax = this.reservation.reservationSubtotal * val;
            // Asigna con redondeo/control de decimales (ej: 2 decimales)
            this.reservation.reservationTax = Number(newTax.toFixed(2));
            
            // El total es el subtotal + el impuesto calculado
            const newTotal = Number(this.reservation.reservationSubtotal) + this.reservation.reservationTax;
            this.reservation.reservationTotal = Number(newTotal.toFixed(2));
          }
      },
      'reservation.reservationSubtotal': function (val: number) {
          if (this.reservation && val) {
            // parse val to number
            val = Number(val);
            // Calcula el impuesto con el factor actual
            const newTax = val * (this.reservation.reservationTaxFactor ?? 0);
            
            // Asigna con redondeo/control de decimales
            this.reservation.reservationTax = Number(newTax.toFixed(2));
            
            // El total es el subtotal + el impuesto
            const newTotal = val + this.reservation.reservationTax;
            this.reservation.reservationTotal = Number(newTotal.toFixed(2));
          }
      },
    'reservation.aircraftId': function (val: number | null) {
          if (val) {
              this.setPilotsDefaultSelected()
              if (this.reservation) {
                  this.reservation.aircraft = this.aircraft.find((a: AircraftInterface) => a.aircraftId === val) ?? null
              }
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
  },
  async mounted() {
    await this.handlerSearchPilot()
    await this.handlerSearchFlightAttendant()
    await this.handlerSearchCustomer();
    await this.handlerSearchAircraft();
    if (this.reservation?.reservationLegs?.length === 0) {
        this.reservationLegsAdd()
    }
    if (this.reservation?.reservationNotes?.length === 0) {
        this.addNewNote()
    }
  },
  methods: {
      async handlerSearchCustomer() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const response = await new CustomerService().getFilteredList('', 1, 999999999);
        const list = response.status === 200 ? response._data.data.customers.data : [];
        this.customers = list;
        myGeneralStore.setFullLoader(false)
    },
    setPilotsDefaultSelected() {
        const aircraftSelected = this.aircraft.find((a: AircraftInterface) => a.aircraftId === this.reservation?.aircraftId) ?? null;
        if (aircraftSelected && this.reservation) {
            this.reservation.pilotPicId = this.formatPilots.find((s: PilotInterface) => s.pilotId === aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'pic')?.pilotId || null)?.pilotId ?? null;
            this.reservation.pilotSicId = this.formatPilots.find((s: PilotInterface) => s.pilotId === aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'sic')?.pilotId || null)?.pilotId ?? null;
        }
    },
    onSave(customer: CustomerInterface) {
          const index = this.customers.findIndex((s: CustomerInterface) => s.customerId === customer?.customerId);
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
    addNew() {
      if (this.$config.public.ENVIRONMENT !== 'production') {
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
     async handlerSearchAircraft() {
        const response = await new AircraftService().getFilteredList('', 1, 999999999);
        const list = response.status === 200 ? response._data.data.data : [];
        this.aircraft = list;
      },
      async handlerSearchPilot() {
          const myGeneralStore = useMyGeneralStore()
          myGeneralStore.setFullLoader(true)
          const response = await new PilotService().getFilteredList('', 1, 999999999);
          const list = response.status === 200 ? response._data.data.pilots.data : [];
          this.pilots = list;
          myGeneralStore.setFullLoader(false)
    },
    reservationLegsRemove(reservationLeg: ReservationLegInterface, index: number) {
        this.reservation?.reservationLegs?.splice(index, 1)
        if (reservationLeg.reservationLegId) {
            this.$emit('deleteReservationLeg', reservationLeg)
        }
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
    async handlerSearchFlightAttendant() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const response = await new FlightAttendantService().getFilteredList('', 1, 999999999);
        const list = response.status === 200 ? response._data.data.flightAttendants.data : [];
        this.flightAttendants = list;
        myGeneralStore.setFullLoader(false)
    },
    addNewNote() {
        if(this.reservation){
            this.reservation?.reservationNotes?.push({ reservationNoteId: 0, reservationNoteContent: '' } as ReservationNoteInterface)
        }
    },
    removeNote(reservationNote: ReservationNoteInterface, index: number) {
        this.reservation?.reservationNotes?.splice(index, 1)
        if(reservationNote.reservationNoteId){
            this.$emit('deleteReservationNote', reservationNote)
        }
    },
  },
});