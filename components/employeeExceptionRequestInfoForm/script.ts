import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import { DateTime } from 'luxon';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface';
import ExceptionRequestService from '~/resources/scripts/services/ExceptionRequestService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'ExceptionRequestForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    exceptionRequest: { type: Object as PropType<ExceptionRequestInterface>, required: true },
    changeStatus: { type: Boolean },
    clickOnSave: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false }
  },
  data: () => ({
    exceptionTypeList: [] as ExceptionTypeInterface[],
    submitted: false,
    currentExceptionRequest: null as ExceptionRequestInterface | null,
    isNewExceptionRequest: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
    hasCompletedYear: false,
    minDate: DateTime.fromISO('2000-10-10').toJSDate(),
    statusOptions: [
      { label: 'Requested', value: 'requested' },
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'Refused', value: 'refused' },
    ],
    authUser: null as UserInterface | null,
    needCheckInTime: false,
    needCheckOutTime: false,
    formattedExceptionRequestInTime: '' as string | null,
    formattedExceptionRequestOutTime: '' as string | null,
    drawerExceptionRequestDelete: false,
    drawerExceptionRequestDeletes: false,
    currentAction: '' as string,
    //exceptionRequest: null as ExceptionRequestInterface | null,
    description: '' as string,
  }),

  computed: {
  },
  watch: {
    // Convierte automáticamente el objeto Date a una cadena de hora cuando cambia
    "exceptionRequest.exceptionRequestCheckInTime"(newValue) {
      this.formattedExceptionRequestInTime = newValue
        ? DateTime.fromJSDate(newValue).toFormat("HH:mm")
        : null
    },
    "exceptionRequest.exceptionRequestCheckOutTime"(newValue) {
      this.formattedExceptionRequestOutTime = newValue
        ? DateTime.fromJSDate(newValue).toFormat("HH:mm")
        : null
    },
  },
  async mounted() {
    const { getSession } = useAuth()

    const session: unknown = await getSession()
    this.authUser = session as UserInterface

    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewExceptionRequest = !this.exceptionRequest.exceptionRequestId ? true : false
    if (this.exceptionRequest.exceptionRequestId) {
      const exceptionRequestService = new ExceptionRequestService()
      const exceptionRequestResponse = await exceptionRequestService.show(this.exceptionRequest.exceptionRequestId)

      if (exceptionRequestResponse.status === 200) {
        this.currentExceptionRequest = exceptionRequestResponse._data.data.exceptionRequest.data
      }

      if (this.currentExceptionRequest && this.currentExceptionRequest.requestedDate) {
        const isoDate = this.currentExceptionRequest.requestedDate.toString();
        const newDate = DateTime.fromISO(isoDate).toUTC().toFormat('yyyy-MM-dd')

        if (newDate) {
          this.exceptionRequest.requestedDate = newDate;
        } else {
          this.exceptionRequest.requestedDate = '';
        }
      }
    } else {
      this.exceptionRequest.requestedDate = this.date
      this.currentDate = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').toISO()

    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    const exceptionType = hasAccess ? '' : 'rest-day'
    await this.getExceptionTypes(exceptionType)

    let isVacation = false
    const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.exceptionRequest.exceptionTypeId)

    if (index >= 0) {
      if (this.exceptionTypeList[index].exceptionTypeSlug === 'vacation') {
        isVacation = true
      }
    }

    this.setMinDate(isVacation)
    myGeneralStore.setFullLoader(false)
    this.isReady = true
    if (this.exceptionRequest.exceptionRequestId) {
      this.handleTypeChange()
    }
  },
  methods: {
    async getExceptionTypes(search: string) {
      const response = await new ExceptionTypeService().getFilteredList(search, 1, 100)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      this.exceptionTypeList = list.filter(item => item.exceptionTypeSlug !== 'vacation')
    },
    async onSave() {
      this.submitted = true
      const exceptionRequestService = new ExceptionRequestService()
      if (!exceptionRequestService.validateInfo(this.exceptionRequest)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.needCheckInTime && !this.exceptionRequest.exceptionRequestCheckInTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.needCheckOutTime && !this.exceptionRequest.exceptionRequestCheckOutTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let exceptionRequestResponse = null
      const exceptionRequestDateTemp = this.exceptionRequest.requestedDate
      const exceptionRequestCheckInTimeTemp = this.exceptionRequest.exceptionRequestCheckInTime
      const exceptionRequestCheckOutTimeTemp = this.exceptionRequest.exceptionRequestCheckOutTime
      this.exceptionRequest.exceptionRequestCheckInTime = this.formattedExceptionRequestInTime
      this.exceptionRequest.exceptionRequestCheckOutTime = this.formattedExceptionRequestOutTime
      if (!this.needCheckInTime) {
        this.exceptionRequest.exceptionRequestCheckInTime = null
      }
      if (!this.needCheckOutTime) {
        this.exceptionRequest.exceptionRequestCheckOutTime = null
      }
      if (this.exceptionRequest.requestedDate) {
        this.exceptionRequest.requestedDate = DateTime.fromJSDate(new Date(this.exceptionRequest.requestedDate))
          .toFormat('yyyy-MM-dd');
      }

      if (!this.exceptionRequest.exceptionRequestId) {
        exceptionRequestResponse = await exceptionRequestService.store(this.exceptionRequest, this.authUser)
      } else {
        exceptionRequestResponse = await exceptionRequestService.update(this.exceptionRequest, this.authUser)
      }

      if (exceptionRequestResponse.status === 201 || exceptionRequestResponse.status === 200) {
        const exceptionRequest = exceptionRequestResponse._data.data.data
        this.$emit('onExceptionRequestSave', exceptionRequest as ExceptionRequestInterface)

      } else {
        const msgError = exceptionRequestResponse._data.error ? exceptionRequestResponse._data.error : exceptionRequestResponse._data.message
        const severityType = exceptionRequestResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Exception Request ${this.exceptionRequest.exceptionRequestId ? 'updated' : 'created'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.exceptionRequest.exceptionRequestCheckInTime = exceptionRequestCheckInTimeTemp
      this.exceptionRequest.exceptionRequestCheckOutTime = exceptionRequestCheckOutTimeTemp
      this.exceptionRequest.requestedDate = exceptionRequestDateTemp
      myGeneralStore.setFullLoader(false)
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    },

    handleTypeChange() {
      if (this.isReady) {
        let isVacation = false
        this.needCheckInTime = false
        this.needCheckOutTime = false
        const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.exceptionRequest.exceptionTypeId)
        if (index >= 0) {
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckInTime) {
            this.needCheckInTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckOutTime) {
            this.needCheckOutTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeSlug === 'vacation') {
            isVacation = true
            if (this.employee.employeeHireDate && this.exceptionRequest.requestedDate) {
              const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
              const dateOrigin = new Date(this.exceptionRequest.requestedDate.toString())
              const dateNew = DateTime.fromJSDate(dateOrigin)
              const dateFormated = dateNew.toFormat('yyyy-MM-dd')
              const dateSelected = DateTime.fromISO(dateFormated)
              if (dateSelected < dateFirstYear) {
                this.exceptionRequest.requestedDate = null
                this.$toast.add({
                  severity: 'warn',
                  summary: 'Date invalid',
                  detail: `When on vacation, the selected date cannot be earlier than ${dateNew.toFormat('DD')}`,
                  life: 5000,
                })
              }
            }
          }
        }
        this.setMinDate(isVacation)
      }
    },
    setMinDate(isVacation: boolean) {
      this.minDate = DateTime.fromISO('2000-10-10').toJSDate()
      if (this.employee.employeeHireDate && isVacation) {
        const now = DateTime.now();
        this.hasCompletedYear = now.diff(DateTime.fromISO(this.employee.employeeHireDate.toString()), 'years').years >= 1
        const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
        if (dateFirstYear) {
          const dateMin = dateFirstYear.toISODate() ? dateFirstYear.toISODate() : ''
          this.minDate = DateTime.fromISO(dateMin ? dateMin : '').toJSDate()
        }
      }
    },
    async handlerClickOnEdit() {
      this.$emit('onExceptionRequestAccept')
    },
    async handlerClickOnDecline() {
      this.$emit('onExceptionRequestDecline')
    },
  }
})