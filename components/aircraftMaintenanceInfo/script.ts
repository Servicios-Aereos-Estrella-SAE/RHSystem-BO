import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import AircraftMaintenanceService from '~/resources/scripts/services/AircraftMaintenanceService';
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';

export default defineComponent({
  emits: ['editMaintenance', 'addMaintenance'],
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'aircraftMaintenanceInfo',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    rand: { type: Number, required: true }
  },
  data: () => ({
    isReady: false,
    drawerAircraftDelete: false as boolean,
    aircraftMaintenances: [] as AircraftMaintenanceInterface[],
    aircraftMaintenanceSelected: null as AircraftMaintenanceInterface | null,
    inputSelectedDate: new Date(),
    selectedDate: DateTime.now() as DateTime,
    displayInputCalendar: false as boolean,
  }),
  setup() {
    const router = useRouter()
    return { router }
  },
  computed: {
    isRoot() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.isRoot
    },
    monthName() {
      const calendarDate = this.selectedDate.setZone('America/Mexico_City').setLocale('en')
      return calendarDate.toFormat('LLLL, y')
    },
    period() {
      const daysList = []

      const start = this.selectedDate.startOf('month')
      const daysInMonth = (start.daysInMonth || 0)

      for (let index = 0; index < daysInMonth; index++) {
        const currentDay = start.plus({ days: index })
        const year = parseInt(currentDay.toFormat('yyyy'))
        const month = parseInt(currentDay.toFormat('LL'))
        const day = parseInt(currentDay.toFormat('dd'))

        daysList.push({
          year,
          month,
          day
        })
      }

      return daysList
    },
    statusForm() {
      const myGeneralStore = useMyGeneralStore()
      return myGeneralStore.userVacationFormClosed
    }
  },
  created() {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.fetchMaintenanceAircraft()
    const { getSession } = useAuth()
    const session: unknown = await getSession()
    const authUser = session as UserInterface
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  watch: {
    inputSelectedDate() {
      this.handlerCalendarChange()
    },
    rand() {
      this.updatedFetchMaintenanceAircraft()
    }
  },
  methods: {
    async fetchMaintenanceAircraft() {
      const aircraftId = this.aircraft.aircraftId!
      const date = this.selectedDate.toFormat('yyyy-LL-dd')
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      const aircraftMaintenanceResponse = await aircraftMaintenanceService.getFilteredList(aircraftId, date, '', 1, 10000)
      console.log(aircraftMaintenanceResponse)
      this.aircraftMaintenances = aircraftMaintenanceResponse.data
    },
    onClickAddMaintenance() {
      this.$emit('addMaintenance', this.aircraft)
    },
    onDelete(aircraftMaintenance: AircraftMaintenanceInterface) {
      this.aircraftMaintenanceSelected = { ...aircraftMaintenance }
      this.drawerAircraftDelete = true;
    },
    async deleteMaintenance() {
      const aircraftMaintenanceService = new AircraftMaintenanceService()
      await aircraftMaintenanceService.delete(this.aircraftMaintenanceSelected!)
      // find by id and remove from array
      const index = this.aircraftMaintenances.findIndex((maintenance) => maintenance.aircraftMaintenanceId === this.aircraftMaintenanceSelected?.aircraftMaintenanceId)
      if (index > -1) {
        this.aircraftMaintenances.splice(index, 1)
      }
      this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Maintenance deleted', life: 3000 });
      this.drawerAircraftDelete = false
      this.aircraftMaintenanceSelected = null
    },

    onEdit(aircraftMaintenance: AircraftMaintenanceInterface) {
      console.log('onEdit', aircraftMaintenance)
      this.$emit('editMaintenance', aircraftMaintenance)
    },
    async handlerLastMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: -1 }).setZone('America/Mexico_City').setLocale('en')
      await this.updatedFetchMaintenanceAircraft()
      myGeneralStore.setFullLoader(false)
    },
    async handlerNextMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: 1 }).setZone('America/Mexico_City').setLocale('en')
      await this.updatedFetchMaintenanceAircraft()
      myGeneralStore.setFullLoader(false)
    },
    async updatedFetchMaintenanceAircraft() {
      await this.fetchMaintenanceAircraft()
    },
    async handlerCalendarChange() {
      const calendarDate = DateTime.fromJSDate(this.inputSelectedDate).setZone('America/Mexico_City').setLocale('en')

      if (calendarDate.toFormat('LLLL').toLocaleLowerCase() !== this.selectedDate.toFormat('LLLL').toLocaleLowerCase()) {
        this.selectedDate = calendarDate
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        this.displayInputCalendar = false
        // await this.getEmployeeCalendar()
        myGeneralStore.setFullLoader(false)
      }
    },
    getFakeEmployeeCalendar() {
      const assistCalendar: AssistDayInterface[] = []

      this.period.forEach((periodDay) => {
        const assistDay: AssistDayInterface = {
          day: `${periodDay.year}-${`${periodDay.month}`.padStart(2, '0')}-${`${periodDay.day}`.padStart(2, '0')}`,
          assist: {
            checkIn: null,
            checkOut: null,
            checkEatIn: null,
            checkEatOut: null,
            dateShift: null,
            dateShiftApplySince: '',
            shiftCalculateFlag: '',
            checkInDateTime: '',
            checkOutDateTime: '',
            checkInStatus: '',
            checkOutStatus: '',
            isFutureDay: false,
            isSundayBonus: false,
            isRestDay: false,
            isVacationDate: false,
            isWorkDisabilityDate: false,
            isHoliday: false,
            holiday: null,
            hasExceptions: false,
            exceptions: [],
            assitFlatList: []
          }
        }

        assistCalendar.push(assistDay)
      })

      return assistCalendar
    },
    async onSave(shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      // await this.getShifts()
      // await this.getEmployeeCalendar()
      // if (shiftExceptionsError.length > 0) {
      //   this.shiftExceptionsError = shiftExceptionsError
      //   this.drawershiftExceptionsError = true
      //   this.drawerShiftExceptions = false
      //   this.displaySidebarVacationsManager = false
      //   this.displaySidebarVacations = false
      //   this.displaySidebarWorkDisabilities = false
      // }
      // myGeneralStore.setFullLoader(false)

      this.isReady = true
    },
  }
})