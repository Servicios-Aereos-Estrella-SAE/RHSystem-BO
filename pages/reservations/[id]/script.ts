// start vue ts file

import PilotService from '~/resources/scripts/services/PilotService'
import FlightAttendantService from '~/resources/scripts/services/FlightAttendantService'
import { useMyGeneralStore } from '~/store/general'
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'
import type { CustomerInterface } from '~/resources/scripts/interfaces/CustomerInterface'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface'
import type { ReservationNoteInterface } from '~/resources/scripts/interfaces/ReservationNoteInterface'
import type { ReservationLegInterface } from '~/resources/scripts/interfaces/ReservationLegInterface'
import type { ReservationInterface } from '~/resources/scripts/interfaces/ReservationInterface'
import ReservationService from '~/resources/scripts/services/ReservationService'
import ReservationLegService from '~/resources/scripts/services/ReservationLegService'
import ReservationNoteService from '~/resources/scripts/services/ReservationNoteService'

export default defineComponent({
  name: 'reservationCreate',
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
    reservationLegsToDelete: [] as ReservationLegInterface[],
    reservationNotesToDelete: [] as ReservationNoteInterface[],
    aircraftSelected: null as AircraftInterface | null,
    reservations: [] as ReservationInterface[],
    reservation: null as ReservationInterface | null,
    taxFactors: [{ taxFactor: 0.00 }, { taxFactor: 0.04 }, { taxFactor: 0.16 }] as { taxFactor: number }[],
    currentPage: 1,
    drawerReservationDelete: false,
    totalRecords: 0,
    submitted: false,
    customer: null as CustomerInterface | null,
    rowsPerPage: 50,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canRead: true,
    showDetail: false,
    editMode: true,
  }),
  computed: {
    formatPilots() {
      return this.pilots.map((pilot: PilotInterface) => {
        return {
          ...pilot,
          pilotName: `${pilot.employee?.person?.personFirstname} ${pilot.employee?.person?.personLastname} ${pilot.employee?.person?.personSecondLastname}`
        } as PilotInterface
      })
    },
    formatFlightAttendants() {
      return this.flightAttendants.map((flightAttendant: FlightAttendantInterface) => {
        return {
          flightAttendantId: flightAttendant.flightAttendantId,
          flightAttendantName: `${flightAttendant.employee?.person?.personFirstname} ${flightAttendant.employee?.person?.personLastname} ${flightAttendant.employee?.person?.personSecondLastname}`
        }
      })
    }
  },
  created() {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    const systemModuleSlug = this.$route.path.replace(`/${this.$i18n.locale}/`, "/").split('/')[1]
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)

    if (myGeneralStore.isRoot) {
      this.canCreate = true
      this.canUpdate = true
      this.canDelete = true
    } else {
      this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
      this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
      this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
      this.canRead = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
    }

    if (!this.canRead) {
      throw showError({
        statusCode: 404,
        fatal: true,
        message: 'You don´t have access to reservations'
      })
    }

    const reservationId = this.$route.params.id

    if (reservationId === 'create') {
      this.addNewReservation()
    } else {
      const reservationFind = await new ReservationService().show(parseInt(reservationId as string))
      if (reservationFind.status !== 200) {
        throw showError({
          statusCode: 404,
          fatal: true,
          message: 'Reservation not found'
        })
      }
      this.reservation = reservationFind.status === 200 ? reservationFind._data.data.reservation : null
    }
  },
  methods: {
    addNewNote() {
      if (this.reservation) {
        this.reservation?.reservationNotes?.push({ reservationNoteId: 0, reservationNoteContent: '' } as ReservationNoteInterface)
      }
    },
    async handlerSearchReservations() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new ReservationService().getFilterList(this.search, this.currentPage, this.rowsPerPage)
      const list = response.status === 200 ? response._data.data.reservations.data : []
      this.totalRecords = response.status === 200 ? response._data.data.reservations.meta.total : 0
      this.reservations = list
      myGeneralStore.setFullLoader(false)
    },
    confirmDelete() {

    },
    handlerSearch() {
      this.currentPage = 1
      this.handlerSearchReservations()
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows
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
    },
    removeNote(index: number) {
      this.reservation?.reservationNotes?.splice(index, 1)
    },
    setReservationIdToLegs(id: number) {
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
      if (await reservationService.isValidInformationReservation(this.reservation as ReservationInterface, this.$toast)) {
        myGeneralStore.setFullLoader(true)
        const reservationService = new ReservationService()
        const reservationLegService = new ReservationLegService()
        const reservationNoteService = new ReservationNoteService()
        const response = await (
          this.reservation?.reservationId ?
            reservationService.update(this.reservation as ReservationInterface) :
            reservationService.store(this.reservation as ReservationInterface)
        )
        if (response.status === 201 || response.status === 200) {
          this.reservation!.reservationId = response._data.data.reservation.reservationId
          this.setReservationIdToLegs(this.reservation?.reservationId ?? 0)
          this.reservation?.reservationLegs?.forEach(async reservationLeg => {
            await (reservationLeg.reservationLegId ? reservationLegService.update(reservationLeg) : reservationLegService.store(reservationLeg))
          })
          const reservationNotes = this.getReservationNotesNotEmpty()
          reservationNotes.forEach(async note => {
            note.reservationId = this.reservation?.reservationId ?? 0
            await (note.reservationNoteId ? reservationNoteService.update(note) : reservationNoteService.store(note))
          })
          this.reservationNotesToDelete.forEach(async note => {
            await reservationNoteService.delete(note.reservationNoteId ?? 0)
          })
          this.reservationLegsToDelete.forEach(async leg => {
            await reservationLegService.delete(leg.reservationLegId ?? 0)
          })
          this.submitted = false
          this.$router.push({ name: 'reservations' })
        } else {
          this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Reservation not created', life: 3000 })
        }
        myGeneralStore.setFullLoader(false)
      }
    },
    deleteReservationLeg(leg: ReservationLegInterface) {
      if (leg.reservationLegId) {
        this.reservationLegsToDelete.push(leg)
      }
    },
    deleteReservationNote(reservationNote: ReservationNoteInterface) {
      if (reservationNote.reservationNoteId) {
        this.reservationNotesToDelete.push(reservationNote)
      }
    },
    setPilotsDefaultSelected() {
      const aircraftSelected = this.aircraft.find((a: AircraftInterface) => a.aircraftId === this.reservation?.aircraftId) ?? null
      if (aircraftSelected && this.reservation) {
        this.reservation.pilotPicId = this.formatPilots.find((s: PilotInterface) => s.pilotId === aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'pic')?.pilotId || null)?.pilotId ?? null
        this.reservation.pilotSicId = this.formatPilots.find((s: PilotInterface) => s.pilotId === aircraftSelected?.pilots.find((pilot: PilotInterface) => pilot.aircraftPilotRole === 'sic')?.pilotId || null)?.pilotId ?? null
      }
    },
    async handlerSearchFlightAttendant() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new FlightAttendantService().getFilteredList('', 1, 999999999)
      const list = response.status === 200 ? response._data.data.flightAttendants.data : []
      this.totalRecords = response.status === 200 ? response._data.data.flightAttendants.meta.total : 0
      this.flightAttendants = list
      myGeneralStore.setFullLoader(false)
    },
    async handlerSearchPilot() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new PilotService().getFilteredList('', 1, 999999999)
      const list = response.status === 200 ? response._data.data.pilots.data : []
      this.totalRecords = response.status === 200 ? response._data.data.pilots.meta.total : 0
      this.pilots = list
      myGeneralStore.setFullLoader(false)
    },
    addNewReservation() {
      this.startReservation()
      this.showDetail = true
      this.editMode = true
    },
    showIndex() {
      this.showDetail = false
      this.reservation = null
      this.editMode = false
    },
    showDetails(reservation: ReservationInterface) {
      this.reservation = { ...reservation }
      this.showDetail = true
      this.editMode = false
    },
    onDelete(reservation: ReservationInterface) {
      this.reservation = { ...reservation }
      this.drawerReservationDelete = true
    },
    async handlerDeleteReservation() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new ReservationService().delete(this.reservation?.reservationId ?? 0)
      if (response.status === 200) {
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Reservation deleted', life: 3000 })
        this.handlerSearchReservations()
        this.reservation = null
        this.drawerReservationDelete = false
      } else {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Reservation not deleted', life: 3000 })
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})
