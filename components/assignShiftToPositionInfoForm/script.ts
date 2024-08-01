import { defineComponent, ref, onMounted } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import type { PositionShiftEmployeeWarningInterface } from '~/resources/scripts/interfaces/PositionShiftEmployeeWarningInterface'
import PositionService from '~/resources/scripts/services/PositionService'
import ShiftService from '~/resources/scripts/services/ShiftService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'AssignShiftToPositionInfoForm',
  emits: ['save'],
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    drawerShiftConfirm: false,
    applySince: '' as string,
    submitted: false,
    shiftsList: [] as ShiftInterface[],
    selectedShift: null as ShiftInterface | null,
    warnings: [] as Array<PositionShiftEmployeeWarningInterface>
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
        const positionService = new PositionService()
        const positionResponse = await positionService.assignShift(this.department.departmentId, this.position.positionId, this.selectedShift.shiftId, this.applySince)
        if (positionResponse.status === 201) {
          this.warnings = positionResponse._data.data.position.data.warnings
          this.$toast.add({
            severity: 'success',
            summary: 'Assign shift to position',
            detail: positionResponse._data.message,
              life: 5000,
          })
          this.$emit('save')
        } else {
          const severityType = positionResponse.status === 500 ? 'error' : 'warn'
          const msgError = positionResponse._data.error ? positionResponse._data.error : positionResponse._data.message
          this.$toast.add({
            severity: severityType,
            summary: 'Assign shift to position',
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
