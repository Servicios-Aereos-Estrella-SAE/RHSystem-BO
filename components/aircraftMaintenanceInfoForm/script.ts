import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import ShiftService from '~/resources/scripts/services/ShiftService';
import AssistService from '~/resources/scripts/services/AssistService';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { ExceptionRequestErrorInterface } from '~/resources/scripts/interfaces/ExceptionRequestErrorInterface';
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService';
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';
import type { MaintenanceTypeInterface } from '~/resources/scripts/interfaces/MaintenanceTypeInterface';
import MaintenanceTypeService from '~/resources/scripts/services/MaintenanceTypeService';
import MaintenanceUrgencyLevelService from '~/resources/scripts/services/MaintenanceUrgencyLevelService';
import type { AircraftMaintenanceStatusInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceStatusInterface';
import AircraftMaintenanceStatusService from '~/resources/scripts/services/AircraftMaintenanceStatusService';
import AircraftMaintenanceService from '~/resources/scripts/services/AircraftMaintenanceService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'aircraftMaintenanceInfoForm',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    aircraftMaintenance: { type: Object as PropType<AircraftMaintenanceInterface>, required: false },
  },
  data: () => ({
    isReady: false,
    submitted: false,
    employeeCalendar: [] as AssistDayInterface[],
    inputSelectedDate: new Date(),
    selectedDate: DateTime.now() as DateTime,
    displayInputCalendar: false as boolean,
    maintenanceTypes: [] as MaintenanceTypeInterface[],
    maintenanceUrgencyLevels: [] as MaintenanceTypeInterface[],
    aircraftMaintenanceStatuses: [] as AircraftMaintenanceStatusInterface[],
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

    const { getSession } = useAuth()
    await this.fetchMaintenanceTypes()
    await this.fetchMaintenanceUrgencyLevels()
    await this.fetchAircraftMaintenanceStatuses()
    const session: unknown = await getSession()
    const authUser = session as UserInterface
    myGeneralStore.setFullLoader(false)
    if (this.aircraftMaintenance?.aircraftMaintenanceId) {
      if (this.aircraftMaintenance?.aircraftMaintenanceStartDate && this.aircraftMaintenance?.aircraftMaintenanceEndDate) {
        const startDateString = DateTime
          .fromISO(this.aircraftMaintenance?.aircraftMaintenanceStartDate as string, { setZone: true, zone: 'utc' })
          .toISODate(); // "2025-02-26"

        const endDateString = DateTime
          .fromISO(this.aircraftMaintenance?.aircraftMaintenanceEndDate as string, { zone: 'utc' })
          .toISODate(); // "2025-02-26"

        console.log('startDateString', startDateString);
        console.log('endDateString', endDateString);

        // Asigna el string al modelo que usa el input calendar
        this.aircraftMaintenance.aircraftMaintenanceStartDate = startDateString as string;
        this.aircraftMaintenance.aircraftMaintenanceEndDate = endDateString as string;
      }
    }
    this.isReady = true

  },
  watch: {
    inputSelectedDate() {
      this.handlerCalendarChange()
    }
  },
  methods: {
    async onSuccessShiftAssigned(employeeShiftResponse: any) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)


      this.$toast.add({
        severity: 'success',
        summary: 'Employee shift assigned',
        detail: employeeShiftResponse._data.message,
        life: 5000,
      })

      myGeneralStore.setFullLoader(false)
    },
    onClickAddMaintenance() {
      this.$emit('addMaintenance', this.aircraft)
    },
    async fetchMaintenanceTypes() {
      const maintenanceTypeService = new MaintenanceTypeService()
      console.log('maintenanceTypeServiceResponse service', maintenanceTypeService)
      const maintenanceTypeServiceResponse = await maintenanceTypeService.getFilteredList('', 1, 99999)
      console.log(maintenanceTypeServiceResponse, 'maintenanceTypeServiceResponse')
      this.maintenanceTypes = maintenanceTypeServiceResponse.data
      console.log('maintenanceTypes', this.maintenanceTypes)
    },
    async fetchMaintenanceUrgencyLevels() {
      const maintenanceUrgencyLevelService = new MaintenanceUrgencyLevelService()
      const maintenanceUrgencyLevelServiceResponse = await maintenanceUrgencyLevelService.getFilteredList('', 1, 99999)
      this.maintenanceUrgencyLevels = maintenanceUrgencyLevelServiceResponse.data
    },
    async fetchAircraftMaintenanceStatuses() {
      const aircraftMaintenanceStatusService = new AircraftMaintenanceStatusService()
      const aircraftMaintenanceStatusServiceResponse = await aircraftMaintenanceStatusService.getFilteredList('', 1, 99999)
      console.log('aircraftMaintenanceStatusServiceResponse', aircraftMaintenanceStatusServiceResponse)
      this.aircraftMaintenanceStatuses = aircraftMaintenanceStatusServiceResponse.data
    },
    async onSave() {
      this.submitted = true

      const aircraftMaintenanceService = new AircraftMaintenanceService()
      if (aircraftMaintenanceService.validateInformation(this.aircraftMaintenance!, this.$toast)) {
        const response = (this.aircraftMaintenance!.aircraftMaintenanceId ?
          await aircraftMaintenanceService.update(this.aircraftMaintenance!) :
          await aircraftMaintenanceService.store(this.aircraftMaintenance!))
        if (response.status === 201 || response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: 'Save aircraft maintenance',
            detail: response._data.message,
            life: 5000,
          })
          this.$emit('onSave', this.aircraftMaintenance)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error saving aircraft maintenance',
            detail: response._data.message,
            life: 5000,
          })
        }
      }
      // const myGeneralStore = useMyGeneralStore()
      // myGeneralStore.setFullLoader(true)
    },
    async handlerLastMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: -1 }).setZone('America/Mexico_City').setLocale('en')
      // await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
    },
    async handlerNextMonth() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.selectedDate = this.selectedDate.plus({ month: 1 }).setZone('America/Mexico_City').setLocale('en')
      // await this.getEmployeeCalendar()
      myGeneralStore.setFullLoader(false)
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
  }
})