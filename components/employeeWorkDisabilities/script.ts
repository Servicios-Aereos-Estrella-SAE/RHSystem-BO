import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface'
import WorkDisabilityService from '~/resources/scripts/services/WorkDisabilityService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
  },
  name: 'employeeWorkDisabilities',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    statusForm: { type: Boolean, required: false, default: false },
    canManageWorkDisability: { type: Boolean, required: true }
  },
  data: () => ({
    isReady: false as boolean,
    workDisabilities: [] as Array<WorkDisabilityInterface>,
    isDeleted: false
  }),
  watch: {
    async 'statusForm'(value) {
      this.isReady = false
      await this.getWorkDisabilities()
      this.isReady = true
    }
  },
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.getWorkDisabilities()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.isReady = true
  },
  methods: {
    async getWorkDisabilities() {
      this.workDisabilities = []
      if (this.employee.employeeId) {
        const workDisabilityService = new WorkDisabilityService()
        const workDisabilityResponse = await workDisabilityService.getByEmployee(this.employee.employeeId)
        if (workDisabilityResponse.status === 200) {
          this.workDisabilities = workDisabilityResponse._data.data.workDisabilities
        }
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setUserVacationFormStatus(false)
    },
    handlerClickManage(vacationPeriod: VacationPeriodInterface) {
      this.$emit('manageWorkDisabilities', vacationPeriod)
    }
  }
})