import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeException',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true }
  },
  data: () => ({
    isReady: false,
    shiftExceptionsList: [] as ExceptionRequestInterface[],
    exceptionTypesList: [] as ExceptionRequestInterface[],
    selectedExceptionTypeId: null as number | null,
    selectedDateStart: '' as string,
    selectedDateEnd: '' as string,
    shiftException: null as ExceptionRequestInterface | null,
    drawerShiftExceptionForm: false,
    drawerShiftExceptionDelete: false,
    selectedDateTimeDeleted: '' as string | null,
    isDeleted: false,
  }),
  computed: {
    selectedExceptionDate () {
      const day = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').setLocale('en').toFormat('DDDD')
      return day
    }
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)

    this.selectedDateStart = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').setLocale('en').toFormat('yyyy-LL-dd')
    this.selectedDateEnd = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').setLocale('en').toFormat('yyyy-LL-dd')

    await this.getShiftEmployee()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getShiftEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftExceptionsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await shiftExceptionService.getByEmployeeException(employeeId)
      this.shiftExceptionsList = shiftExceptionResponse
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newShiftException: ExceptionRequestInterface = {
        exceptionRequestId: null,
        employeeId: this.employee.employeeId,
        exceptionRequestDescription: '',
        requestedDate: '',
        exceptionRequestCreatedAt: null,
        exceptionRequestUpdatedAt: null,
        exceptionTypeId: null,
        exceptionRequestStatus: 'pending'
      }
      this.shiftException = newShiftException
      this.drawerShiftExceptionForm = true
    },
    onSave(shiftException: ExceptionRequestInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftException = {...shiftException}
      if (this.shiftException.requestedDate) {
        const newDate = DateTime.fromISO(this.shiftException.requestedDate.toString(), { setZone: true }).setZone('America/Mexico_City')
        this.shiftException.requestedDate = newDate ? newDate.toString() : ''
      }
      const index = this.shiftExceptionsList.findIndex((shiftException: ExceptionRequestInterface) => shiftException.exceptionRequestId === this.shiftException?.exceptionRequestId)
      if (index !== -1) {
        this.shiftExceptionsList[index] = shiftException
        this.$forceUpdate()
      } else {
        this.shiftExceptionsList.push(shiftException)
        this.$forceUpdate()
      }
      this.drawerShiftExceptionForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(shiftException: ExceptionRequestInterface) {
      this.shiftException = {...shiftException}
      this.drawerShiftExceptionForm = true
    },
    onDelete(shiftException: ExceptionRequestInterface) {
      this.shiftException = {...shiftException}
      this.selectedDateTimeDeleted = ''
      if (this.shiftException.requestedDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.shiftException.requestedDate.toString()).toHTTP()
      }
      this.drawerShiftExceptionDelete = true
    },
    
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.shiftException) {
        this.drawerShiftExceptionDelete = false
        const shiftExceptionService = new ShiftExceptionService()
        const shiftExceptionResponse = await shiftExceptionService.deleteException(this.shiftException)
        if (shiftExceptionResponse.status === 200) {
          const index = this.shiftExceptionsList.findIndex((shiftException: ExceptionRequestInterface) => shiftException.exceptionRequestId === this.shiftException?.exceptionRequestId)
          if (index !== -1) {
            this.shiftExceptionsList.splice(index, 1)
            this.$forceUpdate()
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift exception',
            detail: shiftExceptionResponse._data.message,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    }
  }
})