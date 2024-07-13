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

export default defineComponent({
  components: {
    Toast,
    ToastService,
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
    selectedExceptionTypeId: null as number | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    await this.getExceptionTypes()
    await this.getShiftEmployee()
    this.isReady = true
   
  },
  methods: {
    async getShiftEmployee() {
      this.shiftExceptionsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await shiftExceptionService.getByEmployee(employeeId, this.selectedExceptionTypeId, null, null)
      this.shiftExceptionsList = shiftExceptionResponse
    },
    async getExceptionTypes() {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.exceptionTypes.data : []
      this.exceptionTypesList = list
    },
  }
})