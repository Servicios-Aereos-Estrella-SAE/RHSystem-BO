import { defineComponent } from 'vue'
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
import type { MaintenanceExpenseInterface } from '~/resources/scripts/interfaces/MaintenanceExpenseInterface';
import type { MaintenanceExpenseCategoryInterface } from '~/resources/scripts/interfaces/MaintenanceExpenseCategoryInterface';
import MaintenanceExpenseCategoryService from '~/resources/scripts/services/MaintenanceExpenseCategoryService';
import MaintenanceExpenseService from '~/resources/scripts/services/MaintenanceExpenseService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'maintenanceExpenseInfoForm',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    maintenanceExpense: { type: Object as PropType<MaintenanceExpenseInterface>, required: false },
  },
  data: () => ({
    isReady: false,
    isEdit: false,
    submitted: false,
    files: [] as Array<any>,
    employeeCalendar: [] as AssistDayInterface[],
    inputSelectedDate: new Date(),
    selectedDate: DateTime.now() as DateTime,
    displayInputCalendar: false as boolean,
    maintenanceExpenseCategories: [] as MaintenanceExpenseCategoryInterface[],
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
  },
  created() {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    const { getSession } = useAuth()
    await this.fetchMaintenanceExpenseCategories()
    const session: unknown = await getSession()
    const authUser = session as UserInterface
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    onClickAddMaintenance() {
      this.$emit('addMaintenance', this.aircraft)
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    async fetchMaintenanceExpenseCategories() {
      const maintenanceExpenseCategoriesService = new MaintenanceExpenseCategoryService()
      const maintenanceTypeServiceResponse = await maintenanceExpenseCategoriesService.getFilteredList('', 1, 99999)
      console.log(maintenanceTypeServiceResponse, 'maintenanceTypeServiceResponse')
      this.maintenanceExpenseCategories = maintenanceTypeServiceResponse.data
      console.log('maintenance categories', this.maintenanceExpenseCategories)
    },
    async onSave() {
      this.submitted = true
      const aircraftMaintenanceService = new MaintenanceExpenseService()
      if (aircraftMaintenanceService.validateInformation(this.maintenanceExpense!, this.$toast)) {
        debugger
        const image = this.files.length > 0 ? this.files[0] : null
        const response = (this.maintenanceExpense!.maintenanceExpenseId ?
          await aircraftMaintenanceService.update(this.maintenanceExpense!, image) :
          await aircraftMaintenanceService.store(this.maintenanceExpense!, image))
        if (response.status === 201 || response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: 'Save aircraft maintenance',
            detail: response._data.message,
            life: 5000,
          })
          this.$emit('onSave', this.maintenanceExpense)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Error saving aircraft maintenance',
            detail: response._data.message,
            life: 5000,
          })
        }
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'Error saving aircraft maintenance',
          detail: 'Please fill all the fields',
          life: 5000,
        })
      }
      // const myGeneralStore = useMyGeneralStore()
      // myGeneralStore.setFullLoader(true)
    },
  }
})
