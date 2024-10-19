import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { AssistInterface } from '~/resources/scripts/interfaces/AssistInterface';
import AssistService from '~/resources/scripts/services/AssistService';
import { DateTime } from 'luxon';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeAssistInfoForm',
  props: {
    assist: { type: Object as PropType<AssistInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    isReady: false,
    assistPunchTime: '' as string,
    displayDateCalendar: false as boolean,
  }),
  watch: {
    'assist.assistPunchTime'(val: Date) {
      this.assistPunchTime = this.getDateFormatted(val)
    },
  },
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async onSave() {
      this.submitted = true
      const assistService = new AssistService()
      if (!this.assist.assistEmpId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Employee is not selected',
          life: 5000,
        })
        return
      }
      if (!this.assist.assistPunchTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      const assistPunchTimeTemp = this.assist.assistPunchTime
      const formattedDate = DateTime.fromJSDate(new Date(this.assist.assistPunchTime)).set({ second: 0 }).toFormat('yyyy-MM-dd HH:mm:ss')
      this.assist.assistPunchTime = formattedDate
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let assistResponse = await assistService.store(this.assist)
      if (assistResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: 'Employee assist created',
          detail: assistResponse._data.message,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
        this.$emit('onAssistSave')
      } else {
        let msgError = assistResponse._data.message
        const severityType = assistResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: 'Employee assist created',
          detail: msgError,
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
      }
      this.assist.assistPunchTime = assistPunchTimeTemp
    },
    getDateFormatted(date: Date) {
      if (!date) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('MMMM dd, yyyy HH:mm')
    },
    handlerDisplayDate() {
      this.displayDateCalendar = true
    },
  }
})