import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { AssistInterface } from '~/resources/scripts/interfaces/AssistInterface';
import AssistService from '~/resources/scripts/services/AssistService';
import { DateTime } from 'luxon';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeAssistInfoForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
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
    dateInvalid: false,
    startDateLimit: DateTime.local(1999, 12, 29).toJSDate(),
    localeToUse: 'en',
    drawerConfirmAssist: false
  }),
  watch: {
    'assist.assistPunchTime'(val: Date) {
      this.assistPunchTime = this.getDateFormatted(val)
      this.validateAssistPunchTime()
    },
  },
  computed: {
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    if (!myGeneralStore.isRoot) {
      this.getStartPeriodDay()
    }

    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    getStartPeriodDay() {
      const myGeneralStore = useMyGeneralStore()
      if (myGeneralStore.isRoot) {
        this.startDateLimit = DateTime.local(1999, 12, 29).toJSDate()
      } else {
        const { data } = useAuth()
        const authUser = data.value as unknown as UserInterface
        if (authUser.role) {
          if (authUser.role.roleManagementDays === null) {
            this.startDateLimit = DateTime.local(1999, 12, 29).setZone('UTC-6').toJSDate()
          } else if (typeof authUser.role.roleManagementDays === 'number') {
            const days = authUser.role.roleManagementDays
            const date = DateTime.now().setZone('UTC-6')
            this.startDateLimit = (days > 0 ? date.minus({ days }) : date).toJSDate()
          }
        }
      }
    },
    async onConfirmAssist() {
      this.submitted = true
      const assistService = new AssistService()
      if (!this.assist.assistEmpId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('employee_is_not_selected'),
          life: 5000,
        })
        return
      }
      if (!this.assist.assistPunchTime) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (this.dateInvalid) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('date_selected_is_invalid'),
          life: 5000,
        })
        return
      }
      this.drawerConfirmAssist = false
      const assistPunchTimeTemp = this.assist.assistPunchTime
      const formattedDate = DateTime.fromJSDate(new Date(this.assist.assistPunchTime)).set({ second: 0 }).toFormat('yyyy-MM-dd HH:mm:ss')
      this.assist.assistPunchTime = formattedDate
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let assistResponse = await assistService.store(this.assist)
      if (assistResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: this.t('employee_assist_created'),
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
          summary: this.t('employee_assist'),
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
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('MMMM dd, yyyy HH:mm')
    },
    handlerDisplayDate() {
      this.displayDateCalendar = true
    },
    getNextPayThursday() {
      const today = DateTime.now(); // Fecha actual
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      return nextPayDate.toJSDate()
    },
    async validateAssistPunchTime() {
      if (!this.assistPunchTime) {
        return
      }
      const selectedDate = DateTime.fromFormat(this.assistPunchTime, 'MMMM dd, yyyy HH:mm', { zone: 'utc' }).startOf('day')
      if (!selectedDate.isValid) {
        return
      }
      const datePay = this.getNextPayThursday()
      const monthPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))
      const payDate = DateTime.local(yearPeriod, monthPeriod, dayPeriod).setZone('utc').setLocale(this.localeToUse).startOf('day')
      const startOfWeek = payDate.minus({ days: payDate.weekday % 7 })
      const thursday = startOfWeek.plus({ days: 3 })
      const startLimit = thursday.minus({ days: 24 }).startOf('day')
      if (selectedDate < startLimit) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: `${this.t('the_selected_date_cannot_be_earlier_than_the_first_day_of_the_period_which_is')} ${startLimit
            .toFormat('MMMM dd, yyyy')}`,
          life: 5000,
        })
        this.dateInvalid = true
        return
      }
      this.dateInvalid = false
    },
    setSelectedDate() {
      this.displayDateCalendar = false
    },
    onSave() {
      if (!this.assist.assistEmpId) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('employee_is_not_selected'),
          life: 5000,
        })
        return
      }
      if (!this.assist.assistPunchTime) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }
      if (this.dateInvalid) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('date_selected_is_invalid'),
          life: 5000,
        })
        return
      }
      this.drawerConfirmAssist = true
    },
    onCancelAssist() {
      this.drawerConfirmAssist = false
    }
  }
})
