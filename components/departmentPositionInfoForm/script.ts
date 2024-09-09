import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import PositionService from '~/resources/scripts/services/PositionService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'departmentPositionInfoForm',
  props: {
    department: { type: Object as PropType<DepartmentInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    positions: [] as PositionInterface[],
    positionSelected: null as PositionInterface | null,
    submitted: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isReady = true
    this.getPositions()
  },
  methods: {
    async getPositions() {
      let response = null
      const positionService = new PositionService()
      response = await positionService.getPositions()
      this.positions = response
    },
    async onSave() {
      const departmentService = new DepartmentService()
      this.submitted = true
      if (!this.positionSelected) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      
      let positionResponse = null
      positionResponse = await departmentService.assignDepartment(this.positionSelected.positionId, this.department.departmentId ?? 0)
      if (positionResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: `Department ${this.department.departmentId ? 'updated' : 'created'}`,
          detail: positionResponse._data.message,
            life: 5000,
        })
        positionResponse = await new PositionService().show(this.department.departmentId ?? 0, this.positionSelected.positionId)
        if (positionResponse?.status === 200) {
          const position = positionResponse._data.data.position
          this.$emit('save', position as DepartmentInterface)
        }
      } else {
        const msgError = positionResponse.message
        this.$toast.add({
          severity: 'error',
          summary: `Department Position`,
          detail: msgError,
            life: 5000,
        })
      }
    },
  }
})