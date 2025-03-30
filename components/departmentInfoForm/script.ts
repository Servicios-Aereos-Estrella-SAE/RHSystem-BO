import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import { useMyGeneralStore } from '~/store/general'

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
    isNewDepartment: false,
    isReady: false,
    isSubDeparment: false,
    prefix: 'G1',
    positionNumber: 1,
    departmentPrefixList: [
      { prefix: 'D1', label: 'Dirección' },
      { prefix: 'G1', label: 'Gerencia' },
      { prefix: 'J1', label: 'Jefatura' }
    ]
  }),
  computed: {
    departmentsWithNone() {
      return [
        { departmentId: null, departmentName: 'None' },
        ...this.departments
      ];
    }
  },
  async mounted() {
    this.isReady = false
    this.isNewDepartment = !this.department.departmentId ? true : false
    this.isReady = true
    this.getDepartments()

    if (!this.isNewDepartment) {
      this.setPrefix()
    }
  },
  methods: {
    setPrefix () {
      const prefix = this.department.departmentName.split(' ')[0]
      const type = prefix.slice(0, 3).replace('(', '')
      const order = parseInt(prefix.slice(3).replace(')', ''))

      this.prefix = type
      this.positionNumber = order

      this.department.departmentName = this.department.departmentName.replace(prefix, '').trim()
    },
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

      this.department.departmentName = `(${this.prefix}${`${this.positionNumber}`.padStart(2, '0')}) ${this.department.departmentName}`

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      if (!this.department.departmentId) {
        departmentResponse = await departmentService.store(this.department)
      } else {
        departmentResponse = await departmentService.update(this.department)
      }

      if (departmentResponse.status === 201 || departmentResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Department ${this.department.departmentId ? 'updated' : 'created'}`,
          detail: departmentResponse._data.message,
          life: 5000,
        })

        this.$emit('save', departmentResponse._data.data.department as DepartmentInterface)
      } else {
        myGeneralStore.setFullLoader(false)
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
