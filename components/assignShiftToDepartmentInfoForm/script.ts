import { defineComponent, ref, onMounted } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { DepartmentShiftEmployeeWarningInterface } from '~/resources/scripts/interfaces/DepartmentShiftEmployeeWarningInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import ShiftService from '~/resources/scripts/services/ShiftService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'AssignShiftToDepartmentInfoForm',
  emits: ['save'],
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    drawerShiftConfirm: false,
    applySince: '' as string,
    submitted: false,
    shiftsList: [] as ShiftInterface[],
    selectedShift: null as ShiftInterface | null,
    warnings: [] as Array<DepartmentShiftEmployeeWarningInterface>
  }),
  computed: {
  },
  async mounted() {
    await this.getShifts()
  },
  methods: {
    async onSave() {
     this.submitted = true
     this.warnings = []
     if (!this.applySince || !this.selectedShift || !this.selectedShift.shiftId) {
       this.$toast.add({
         severity: 'warn',
         summary: 'Validation data',
         detail: 'Missing data',
           life: 5000,
       })
       return
     }
     this.drawerShiftConfirm = true
    },
    async confirmSave() {
      this.drawerShiftConfirm = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.selectedShift && this.selectedShift.shiftId) {
        const departmentService = new DepartmentService()
        const departmentResponse = await departmentService.assignShift(this.department.departmentId, this.selectedShift.shiftId, this.applySince)
        if (departmentResponse.status === 201) {
          this.warnings = departmentResponse._data.data.department.data.warnings
          this.$toast.add({
            severity: 'success',
            summary: 'Assign shift to department',
            detail: departmentResponse._data.message,
              life: 5000,
          })
          this.$emit('save')
        } else {
          const severityType = departmentResponse.status === 500 ? 'error' : 'warn'
          const msgError = departmentResponse._data.error ? departmentResponse._data.error : departmentResponse._data.message
          this.$toast.add({
            severity: severityType,
            summary: 'Assign shift to department',
            detail: msgError,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    async getShifts() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new ShiftService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.data : []
      this.shiftsList = list
      myGeneralStore.setFullLoader(false)
    }
  }
})
