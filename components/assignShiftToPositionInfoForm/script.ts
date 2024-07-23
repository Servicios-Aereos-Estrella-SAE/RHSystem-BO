import { defineComponent, ref, onMounted } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'
import PositionService from '~/resources/scripts/services/PositionService'
import ShiftService from '~/resources/scripts/services/ShiftService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  name: 'AssignShiftToPositionInfoForm',
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    position: { type: Object as PropType<PositionInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    drawerShift: false,
    applySince: '' as string,
    submitted: false,
    shiftsList: [] as ShiftInterface[],
    selectedShift: null as ShiftInterface | null
  }),
  computed: {
  },
  async mounted() {
    await this.getShifts()
  },
  methods: {
    async onSave() {
      this.submitted = true
      if (!this.applySince || !this.selectedShift || !this.selectedShift.shiftId) {
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
      const positionService = new PositionService()
      const positionResponse = await positionService.assignShift(this.department.departmentId, this.position.positionId, this.selectedShift.shiftId, this.applySince)
      // console.log(positionResponse)
      myGeneralStore.setFullLoader(false)
      // console.log('ok')
    },
    async confirmSave() {
      
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
