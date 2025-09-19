import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ExceptionRequestService from '~/resources/scripts/services/ExceptionRequestService'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { ExceptionRequestErrorInterface } from '~/resources/scripts/interfaces/ExceptionRequestErrorInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeExceptionRequest',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    canManageException: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false,
    exceptionRequestsList: [] as ExceptionRequestInterface[],
    exceptionTypesList: [] as ExceptionRequestInterface[],
    selectedExceptionTypeId: null as number | null,
    selectedDateStart: '' as string,
    selectedDateEnd: '' as string,
    exceptionRequest: null as ExceptionRequestInterface | null,
    drawerExceptionRequestForm: false,
    drawerExceptionRequestDelete: false,
    selectedDateTimeDeleted: '' as string | null,
    isDeleted: false,
    startDateLimit: DateTime.local(1999, 12, 29).toJSDate(),
    localeToUse: 'en',
  }),
  computed: {
    selectedExceptionDate() {
      const day = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('DDDD')
      return day
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    this.selectedDateStart = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('yyyy-LL-dd')
    this.selectedDateEnd = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('yyyy-LL-dd')

    await this.getExceptionRequestEmployee()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.getStartPeriodDay()
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
            this.withOutLimitDays = true
          } else if (typeof authUser.role.roleManagementDays === 'number') {
            const days = authUser.role.roleManagementDays
            const date = DateTime.now().setZone('UTC-6')
            this.startDateLimit = (days > 0 ? date.minus({ days }) : date).toJSDate()
          }
        }
      }
    },
    async getExceptionRequestEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.exceptionRequestsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const exceptionRequestService = new ExceptionRequestService()
      const exceptionRequestResponse = await exceptionRequestService.getByEmployeeException(employeeId)
      this.exceptionRequestsList = exceptionRequestResponse
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newExceptionRequest: ExceptionRequestInterface = {
        exceptionRequestId: null,
        employeeId: this.employee.employeeId,
        exceptionRequestDescription: '',
        requestedDate: '',
        exceptionRequestCreatedAt: null,
        exceptionRequestUpdatedAt: null,
        exceptionTypeId: null,
        exceptionRequestStatus: 'pending',
        exceptionRequestCheckInTime: null,
        exceptionRequestCheckOutTime: null,
        daysToApply: 0
      }
      this.exceptionRequest = newExceptionRequest
      this.drawerExceptionRequestForm = true
    },
    onSave(exceptionRequest: ExceptionRequestInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.exceptionRequest = { ...exceptionRequest }
      if (this.exceptionRequest.requestedDate) {
        const newDate = DateTime.fromISO(this.exceptionRequest.requestedDate.toString(), { setZone: true }).setZone('UTC-6')
        this.exceptionRequest.requestedDate = newDate ? newDate.toString() : ''
      }
      const index = this.exceptionRequestsList.findIndex((exceptionRequest: ExceptionRequestInterface) => exceptionRequest.exceptionRequestId === this.exceptionRequest?.exceptionRequestId)
      if (index !== -1) {
        this.exceptionRequestsList[index] = exceptionRequest
        this.$forceUpdate()
      } else {
        this.exceptionRequestsList.push(exceptionRequest)
        this.$forceUpdate()
      }
      this.drawerExceptionRequestForm = false
      myGeneralStore.setFullLoader(false)
    },
    async onSaveAll(exceptionRequests: Array<ExceptionRequestInterface>, exceptionRequestsError: Array<ExceptionRequestErrorInterface>) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      for await (const exceptionRequest of exceptionRequests) {
        this.exceptionRequest = { ...exceptionRequest }
        if (this.exceptionRequest.requestedDate) {
          const newDate = DateTime.fromISO(this.exceptionRequest.requestedDate.toString(), { setZone: true }).setZone('UTC-6')
          this.exceptionRequest.requestedDate = newDate ? newDate.toString() : ''
        }
        const index = this.exceptionRequestsList.findIndex((exceptionRequest: ExceptionRequestInterface) => exceptionRequest.exceptionRequestId === this.exceptionRequest?.exceptionRequestId)
        if (index !== -1) {
          this.exceptionRequestsList[index] = exceptionRequest
          this.$forceUpdate()
        } else {
          this.exceptionRequestsList.push(exceptionRequest)
          this.$forceUpdate()
        }
      }
      this.$emit('saveExceptionRequest', exceptionRequestsError)
      this.drawerExceptionRequestForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(exceptionRequest: ExceptionRequestInterface) {
      this.exceptionRequest = { ...exceptionRequest }
      this.drawerExceptionRequestForm = true
    },
    onDelete(exceptionRequest: ExceptionRequestInterface) {
      this.exceptionRequest = { ...exceptionRequest }
      this.selectedDateTimeDeleted = ''
      if (this.exceptionRequest.requestedDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.exceptionRequest.requestedDate.toString()).toHTTP()
      }
      this.drawerExceptionRequestDelete = true
    },

    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.exceptionRequest) {
        this.drawerExceptionRequestDelete = false
        const exceptionRequestService = new ExceptionRequestService()
        const exceptionRequestResponse = await exceptionRequestService.delete(this.exceptionRequest)
        if (exceptionRequestResponse.status === 200) {
          const index = this.exceptionRequestsList.findIndex((exceptionRequest: ExceptionRequestInterface) => exceptionRequest.exceptionRequestId === this.exceptionRequest?.exceptionRequestId)
          if (index !== -1) {
            this.exceptionRequestsList.splice(index, 1)
            this.$forceUpdate()
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete exception request',
            detail: exceptionRequestResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})
