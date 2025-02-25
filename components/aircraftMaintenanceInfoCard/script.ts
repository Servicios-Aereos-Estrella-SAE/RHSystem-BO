import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'aircraftMaintenanceInfoCard',
  props: {
    aircraftMaintenance: { type: Object as PropType<AircraftMaintenanceInterface>, required: true },
    canUpdate: { type: Boolean as PropType<Boolean>, required: true },
    canDelete: { type: Boolean as PropType<Boolean>, required: true },
  },
  data: () => ({
    isReady: false,
    inputSelectedDate: new Date(),
    selectedDate: DateTime.now() as DateTime,
    displayInputCalendar: false as boolean,
  }),
  setup() {
    const router = useRouter()
    return { router }
  },
  computed: {
    formattedEndDate() {
      // formated aircraftMaintenance.aircraftMaintenanceEndDate with Luxon
      const date = this.aircraftMaintenance.aircraftMaintenanceEndDate;
      if (date) {
        console.log('date', date) // date 2025-02-26T00:00:00.000Z
        const dateTime = DateTime.fromISO(date as string, { zone: 'utc' })
        return dateTime.toFormat('cccc, LLLL dd, yyyy')
      }
    },
    formattedStartDate() {
      // formated aircraftMaintenance.aircraftMaintenanceStartDate with Luxon
      const date = this.aircraftMaintenance.aircraftMaintenanceStartDate;
      if (date) {
        // parse date to Luxon DateTime
        const dateTime = DateTime.fromISO(date as string, { zone: 'utc' })
        // format date with name of day, name of month, day, year
        return dateTime.toFormat('cccc, LLLL dd, yyyy')
      }
    },
  },
  created() {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const { getSession } = useAuth()
    const session: unknown = await getSession()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  watch: {
  },
  methods: {
    handlerClickOnEdit() {
      this.$emit('clickOnEdit', this.aircraftMaintenance)
    },
    handlerClickOnDelete() {
      this.$emit('clickOnDelete', this.aircraftMaintenance)
    },
  }
})