import { defineComponent } from 'vue';
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';
import type { MaintenanceTypeInterface } from '~/resources/scripts/interfaces/MaintenanceTypeInterface';
import MaintenanceTypeService from '~/resources/scripts/services/MaintenanceTypeService';
import MaintenanceUrgencyLevelService from '~/resources/scripts/services/MaintenanceUrgencyLevelService';
import type { AircraftMaintenanceStatusInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceStatusInterface';
import AircraftMaintenanceStatusService from '~/resources/scripts/services/AircraftMaintenanceStatusService';
import AircraftMaintenanceService from '~/resources/scripts/services/AircraftMaintenanceService';
import MaintenanceExpenseService from '~/resources/scripts/services/MaintenanceExpenseService';
import type { MaintenanceExpenseInterface } from '~/resources/scripts/interfaces/MaintenanceExpenseInterface';

export default defineComponent({
  emits: ['addMaintenance', 'addMaintenanceExpense', 'onSave', 'editMaintenanceExpense'],
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'aircraftMaintenanceInfoForm',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    aircraftMaintenance: { type: Object as PropType<AircraftMaintenanceInterface>, required: false },
    rand: { type: Number, required: true }
  },
  data: () => ({
    isReady: false,
    isEdit: false,
    submitted: false,
    employeeCalendar: [] as AssistDayInterface[],
    inputSelectedDate: new Date(),
    selectedDate: DateTime.now() as DateTime,
    displayInputCalendar: false as boolean,
    drawerMaintenanceDelete: false as boolean,
    maintenanceExpense: null as MaintenanceExpenseInterface | null,
    maintenanceTypes: [] as MaintenanceTypeInterface[],
    maintenanceExpenses: [] as MaintenanceExpenseInterface[],
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
    IdStatusCompleted() {
      const statusCompleted = this.aircraftMaintenanceStatuses.find((status) => status.aircraftMaintenanceStatusName === 'Completed')
      return statusCompleted?.aircraftMaintenanceStatusId
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
          .fromISO(this.aircraftMaintenance?.aircraftMaintenanceStartDate as string, { setZone: true, zone: 'utc' }).toJSDate()

        const endDateString = DateTime
          .fromISO(this.aircraftMaintenance?.aircraftMaintenanceEndDate as string, { zone: 'utc' }).toJSDate()
        // Asigna el string al modelo que usa el input calendar
        this.aircraftMaintenance.aircraftMaintenanceStartDate = startDateString
        this.aircraftMaintenance.aircraftMaintenanceEndDate = endDateString
        this.isEdit = true
      }
      await this.fetchMaintenanceExpense();
    } else {
      this.isEdit = false
      // set default this.aircraftMaintenance.aircraftMaintenanceStatusId = find status 'In Progress'
      const aircraftMaintenanceStatusInProgress = this.aircraftMaintenanceStatuses.find((status) => status.aircraftMaintenanceStatusName === 'In Progress')
      if (aircraftMaintenanceStatusInProgress && this.aircraftMaintenance) {
        this.aircraftMaintenance.aircraftMaintenanceStatusId = aircraftMaintenanceStatusInProgress.aircraftMaintenanceStatusId!
      }
    }
    this.isReady = true

  },
  watch: {
    inputSelectedDate() {
      this.handlerCalendarChange()
    },
    'aircraftMaintenance.aircraftMaintenanceId'() {
      if (this.aircraftMaintenance?.aircraftMaintenanceId) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
    },
    rand() {
      this.fetchMaintenanceExpense()
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
    onEditMaintenanceExpense(maintenanceExpense: MaintenanceExpenseInterface) {
      this.$emit('editMaintenanceExpense', maintenanceExpense)
    },
    onDeleteMaintenanceExpense(maintenanceExpense: MaintenanceExpenseInterface) {
      this.maintenanceExpense = maintenanceExpense
      this.drawerMaintenanceDelete = true
    },
    deleteMaintenanceExpense() {
      const maintenanceExpenseService = new MaintenanceExpenseService()
      maintenanceExpenseService.delete(this.maintenanceExpense!)
      // find by id and remove from array
      const index = this.maintenanceExpenses.findIndex((maintenance) => maintenance.maintenanceExpenseId === this.maintenanceExpense?.maintenanceExpenseId)
      if (index > -1) {
        this.maintenanceExpenses.splice(index, 1)
      }
      this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Maintenance expense deleted', life: 3000 });
      this.drawerMaintenanceDelete = false
      this.maintenanceExpense = null
    },
    async fetchMaintenanceExpense() {
      const maintenanceExpenseService = new MaintenanceExpenseService()
      const maintenanceExpenseServiceResponse = await maintenanceExpenseService.getFilteredList(this.aircraftMaintenance?.aircraftMaintenanceId as number, '', 1, 99999)
      this.maintenanceExpenses = maintenanceExpenseServiceResponse.data
    },
    hnadleAddNewMaintenanceExpense() {
      this.$emit('addMaintenanceExpense', this.aircraftMaintenance)
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
      if (aircraftMaintenanceService.validateInformation(this.aircraftMaintenance!, this.$toast, this.IdStatusCompleted)) {
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