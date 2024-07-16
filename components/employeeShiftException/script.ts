import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftException',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    activeSwicht: true,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    submitted: false,
    genders: [
        { label: 'Male', value: 'Hombre' },
        { label: 'Female', value: 'Mujer' },
        { label: 'Other', value: 'Otro' }
    ],
    currenEmployee: null as EmployeeInterface | null,
    passwordConfirm: '',
    changePassword: false,
    isNewUser: false,
    isReady: false,
    isEmailInvalid: false,
    shiftExceptionsList: [] as ShiftExceptionInterface[],
    exceptionTypesList: [] as ExceptionTypeInterface[],
    selectedExceptionTypeId: null as number | null,
    selectedDateRange: ref(null),
    selectedDateStart: '' as string | null,
    selectedDateEnd: '' as string | null,
    shiftException: null as ShiftExceptionInterface | null,
    drawerShiftExceptionForm: false,
    drawerShiftExceptionDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getExceptionTypes()
    await this.getShiftEmployee()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async handleDateChange(e: any) {
      this.selectedDateStart = null
      this.selectedDateEnd = null
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      try {
        const selectedDate = e
        if (selectedDate && selectedDate.length === 2) {
          const [startDate, endDate] = selectedDate
          const formattedStartDate = startDate.toISOString().split('T')[0]
          const formattedEndDate = endDate.toISOString().split('T')[0]
          this.selectedDateStart = formattedStartDate
          this.selectedDateEnd = formattedEndDate
        }
      } catch (error) {
      }
      myGeneralStore.setFullLoader(false)
      await this.getShiftEmployee()
    },
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
    async getExceptionTypes() {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.exceptionTypes.data : []
      this.exceptionTypesList = list
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
      this.shiftException = {...shiftException}
      const index = this.shiftExceptionsList.findIndex((shiftException: ShiftExceptionInterface) => shiftException.shiftExceptionId === this.shiftException?.shiftExceptionId)
      if (index !== -1) {
        this.shiftExceptionsList[index] = shiftException
        this.$forceUpdate()
      } else {
        this.shiftExceptionsList.push(shiftException)
        this.$forceUpdate()
      }
      this.drawerShiftExceptionForm = false
    },
    onEdit(shiftException: ShiftExceptionInterface) {
      this.shiftException = {...shiftException}
      this.drawerShiftExceptionForm = true
    },
    onDelete(shiftException: ShiftExceptionInterface) {
      this.shiftException = {...shiftException}
      this.selectedDateTimeDeleted = ''
      if (this.shiftException.shiftExceptionsDate) {
        this.selectedDateTimeDeleted = DateTime.fromISO(this.shiftException.shiftExceptionsDate).toHTTP()
      }
      this.drawerShiftExceptionDelete = true
    },
    
    async confirmDelete() {
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
          this.$toast.add({
            severity: 'success',
            summary: 'Delete shift exception',
            detail: shiftExceptionResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift exception',
            detail: shiftExceptionResponse._data.message,
              life: 5000,
          })
        }
      }
    }
  }
})