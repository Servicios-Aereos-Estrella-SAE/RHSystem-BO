import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import PositionService from '~/resources/scripts/services/PositionService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'departmentInfoForm',
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    departments: [] as DepartmentInterface[],
    submitted: false,
    genders: [
        { label: 'Male', value: 'Hombre' },
        { label: 'Female', value: 'Mujer' },
        { label: 'Other', value: 'Otro' }
    ],
    isNewUser: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewUser = !this.department.departmentId ? true : false
    this.isReady = true
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = response._data.data.departments
    },
    getDepartmentCode() {
      // Obtener el departamento con el departmentCode más grande
      let greatestDepartmentCode = 0 as number | null;
      if (this.department.departmentId === null) {
        greatestDepartmentCode = this.departments.reduce((prev, current) =>
          ((prev.departmentId ?? 0) > (current.departmentId ?? 0)) ? prev : current
        ).departmentId;
        // Convertir greatestDepartmentCode a número y sumarle 1
        this.department.departmentCode = ((greatestDepartmentCode ?? 0) + 1).toString();
      }
    },
    async onSave() {
      this.submitted = true
      this.getDepartmentCode()
      const departmentService = new DepartmentService()
      if (!departmentService.validate(this.department)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      
      let departmentResponse = null
      if (!this.department.departmentId) {
        departmentResponse = await departmentService.store(this.department)
      } else {
        departmentResponse = await departmentService.update(this.department)
      }
      if (departmentResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: `Department ${this.department.departmentId ? 'updated' : 'created'}`,
          detail: departmentResponse._data.message,
            life: 5000,
        })
        await this.getDepartments()
        departmentResponse = await departmentService.showOnSave(departmentResponse._data.data.department.departmentId)
        if (departmentResponse?.status === 200) {
          const department = departmentResponse._data.data.department
          this.$emit('save', department as DepartmentInterface)
        }
      } else {
        const msgError = departmentResponse._data.error ? departmentResponse._data.error : departmentResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `Employee ${this.department.departmentId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
    },
    convertToDateTime(birthday: string | Date | null): Date | null {
      if (birthday === '' || birthday === null || birthday === undefined) {
        return null;
      }
      // Si el cumpleaños ya es un objeto Date, retorna directamente
      if (birthday instanceof Date) {
        return birthday;
      }
      // Si el cumpleaños es una cadena de texto, intenta convertirla a Date
      const date = new Date(birthday);
      return isNaN(date.getTime()) ? null : date;
    },

  }
})