import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
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
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
  },
  data: () => ({
    isReady: false as boolean,
    workDisabilities: [] as Array<WorkDisabilityInterface>,
    workDisability: null as WorkDisabilityInterface | null,
    isDeleted: false,
    drawerWorkDisabilityForm: false,
    drawerWorkDisabilityDelete: false,
    sessionUser: null as UserInterface | null,
    startDateLimit: DateTime.local(1999, 12, 29).toJSDate(),
  }),
  watch: {
    async 'statusForm'(value) {
      this.isReady = false
      await this.getWorkDisabilities()
      this.isReady = true
    }
  },
  computed: {
    displayAddButton() {
      if (!this.sessionUser) {
        return false
      }

      if ((this.sessionUser.person?.employee?.employeeId === this.employee.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (this.canManageWorkDisabilities && !this.isDeleted && this.canManageWorkDisabilities) {
        return true
      }

      return false
    }
  },
  async mounted() {
    this.isReady = false
    await this.setSessionUser()
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
      myGeneralStore.workDisabilityId = null
    }
    this.getStartPeriodDay()
    this.isReady = true
  },
  methods: {
    getStartPeriodDay() {
      const myGeneralStore = useMyGeneralStore()
      if (myGeneralStore.isRoot) {
        this.startDateLimit = DateTime.local(1999, 12, 29).toJSDate()
      } else {
        const { data } = useAuth()

        const authUser = data.value as unknown as UserInterface
        if (authUser.role) {
          if (authUser.role.roleManagementDays) {
            this.startDateLimit = DateTime.now().minus({ days: authUser.role.roleManagementDays }).toJSDate()
          } else {
            this.startDateLimit = DateTime.local(1999, 12, 29).toJSDate()
          }
        }
      }
    },
    async setSessionUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.sessionUser = authUser
    },
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
    async confirmDelete() {
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
            summary: 'Delete work disability',
            detail: workDisabilityResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})
