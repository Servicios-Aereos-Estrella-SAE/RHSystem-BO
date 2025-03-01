import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';
import type { MaintenanceExpenseInterface } from '~/resources/scripts/interfaces/MaintenanceExpenseInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'maintenanceExpenseInfoCard',
  props: {
    maintenanceExpense: { type: Object as PropType<MaintenanceExpenseInterface>, required: true },
    canUpdate: { type: Boolean as PropType<Boolean>, required: true },
    canDelete: { type: Boolean as PropType<Boolean>, required: true },
  },
  data: () => ({
    isReady: false,
  }),
  setup() {
    const router = useRouter()
    return { router }
  },
  computed: {
    formattedAmount() {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.maintenanceExpense.maintenanceExpenseAmount) + 'USD'
    }
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
      this.$emit('clickOnEdit', this.maintenanceExpense)
    },
    handlerClickOnDelete() {
      this.$emit('clickOnDelete', this.maintenanceExpense)
    },
  }
})