import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftException',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true }
  },
  data: () => ({
    isReady: false,
    shiftExceptionsList: [] as ShiftExceptionInterface[],
    exceptionTypesList: [] as ExceptionTypeInterface[],
    selectedExceptionTypeId: null as number | null,
    selectedDateStart: '' as string,
    selectedDateEnd: '' as string,
    shiftException: null as ShiftExceptionInterface | null,
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
      const shiftExceptionResponse = await shiftExceptionService.getByEmployee(employeeId, this.selectedExceptionTypeId, this.selectedDateStart,this.selectedDateEnd)
      this.shiftExceptionsList = shiftExceptionResponse
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newShiftException: ShiftExceptionInterface = {
        shiftExceptionId: null,
        employeeId: this.employee.employeeId,
        exceptionTypeId: null,
        shiftExceptionsDescription: '',
        shiftExceptionsDate: '',
        shiftExceptionsCreatedAt: null,
        shiftExceptionsUpdatedAt: null,
        shiftExceptionsDeletedAt: null
      }
      this.shiftException = newShiftException
      this.drawerShiftExceptionForm = true
    },
    onSave(shiftException: ShiftExceptionInterface) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shiftException = {...shiftException}
      if (this.shiftException.shiftExceptionsDate) {
        const newDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('America/Mexico_City')
        this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
      }
      const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
      if (index !== -1) {
        this.shiftExceptionsList[index] = shiftException
        this.$forceUpdate()
      } else {
        this.shiftExceptionsList.push(shiftException)
        this.$forceUpdate()
      }
      this.$emit('save')
      this.drawerShiftExceptionForm = false
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEdit(shiftException: ShiftExceptionInterface) {
      this.shiftException = {...shiftException}
      this.drawerShiftExceptionForm = true
    },
    onDelete(shiftException: ShiftExceptionInterface) {
      this.shiftException = {...shiftException}
      this.selectedDateTimeDeleted = ''
      if (this.shiftException.shiftExceptionsDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString()).toHTTP()
      }
      this.drawerShiftExceptionDelete = true
    },
    
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.shiftException) {
        this.drawerShiftExceptionDelete = false
        const shiftExceptionService = new ShiftExceptionService()
        const shiftExceptionResponse = await shiftExceptionService.delete(this.shiftException)
        if (shiftExceptionResponse.status === 200) {
          const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
          if (index !== -1) {
            this.shiftExceptionsList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$emit('save')
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