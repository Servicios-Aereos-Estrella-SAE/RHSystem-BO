import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'employeeInfoCard',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    clickOnPhoto: { type: Function, default: null },
    canManageShifts: { type: Boolean, default: false, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
    canReadOnlyFiles: { type: Boolean, default: false, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    canManageUserResponsible: false
  }),
  computed: {
    employeeName() {
      if (!this.employee.person) {
        return '---'
      }

      const name = `${this.employee.person.personFirstname || ''} ${this.employee.person.personLastname || ''} ${this.employee.person.personSecondLastname || ''}`
      return name
    },
    employeeInitial() {
      const name = this.employeeName.trim()
      const first = name.charAt(0)
      return first.toUpperCase()
    },
    getEmployeePhoto() {
      const CONFIG = useRuntimeConfig()
      const API_PATH = CONFIG.public.BASE_API_PATH
      const photoPath = `${API_PATH}/proxy-image?url=${this.employee.employeePhoto}`
      let photoIsValid = false
      const employeeService = new EmployeeService()
      employeeService.checkImage(photoPath).then(valid => {
        photoIsValid = valid
      });
      if (photoIsValid) {
        return photoPath
      }
      return this.employee.employeePhoto
    }
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
  },
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnShifts() {
      this.$emit('clickShifts', this.employee)
    },
    onClickPhoto() {
      this.clickOnPhoto()
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    handlerOpenProceedingFiles() {
      this.$emit('clickProceedingFiles', this.employee)
    }
  }
})
