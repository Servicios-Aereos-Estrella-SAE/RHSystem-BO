import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'
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
    canManageWorkDisability: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false as boolean,
    workDisabilities: [] as Array<WorkDisabilityInterface>,
    workDisability: null as WorkDisabilityInterface | null,
    isDeleted: false,
    drawerWorkDisabilityForm: false,
    drawerWorkDisabilityDelete: false,
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
    await this.getWorkDisabilities()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    const myGeneralStore = useMyGeneralStore()
    if (myGeneralStore.workDisabilityId) {
     const existWorkDisability = this.workDisabilities.find(a => a.workDisabilityId === myGeneralStore.workDisabilityId)
     if (existWorkDisability) {
      this.workDisability = existWorkDisability
      this.drawerWorkDisabilityForm = true
     }
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
    addNew() {
      const newWorkDisability = {
        workDisabilityId: 0,
        workDisabilityUuid: '',
        employeeId: this.employee.employeeId,
      } as WorkDisabilityInterface
      this.workDisability = newWorkDisability
      this.drawerWorkDisabilityForm = true
    },
    onSave(workDisability: WorkDisabilityInterface, shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.workDisability = { ...workDisability }
      const index = this.workDisabilities.findIndex((workDisability: WorkDisabilityInterface) => workDisability.workDisabilityId === this.workDisability?.workDisabilityId)
      if (index !== -1) {
        this.workDisabilities[index] = workDisability
        this.$forceUpdate()
      } else {
        this.workDisabilities.push(workDisability)
        this.$forceUpdate()
      }
      this.$emit('save', shiftExceptionsError)
      this.drawerWorkDisabilityForm = true
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    onEdit(workDisability: WorkDisabilityInterface) {
      this.workDisability = { ...workDisability }
      this.drawerWorkDisabilityForm = true
    },
    onDelete(workDisability: WorkDisabilityInterface) {
      this.workDisability = { ...workDisability }

      this.drawerWorkDisabilityDelete = true
    },

    /* async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.workDisability) {
        this.drawerWorkDisabilityDelete = false
        const workDisabilityService = new WorkDisabilityService()
        const workDisabilityResponse = await workDisabilityService.delete(this.workDisability)
        if (workDisabilityResponse.status === 200) {
          const index = this.workDisabilities.findIndex((workDisability: WorkDisabilityInterface) => workDisability.workDisabilityId === this.workDisability?.workDisabilityId)
          if (index !== -1) {
            this.workDisabilities.splice(index, 1)
            this.$forceUpdate()
          }
          this.$emit('save', [])
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift exception',
            detail: workDisabilityResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    } */
  }
})