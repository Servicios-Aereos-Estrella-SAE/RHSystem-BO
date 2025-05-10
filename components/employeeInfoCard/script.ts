import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import type { UserResponsibleEmployeeInterface } from '~/resources/scripts/interfaces/UserResponsibleEmployeeInterface'
import UserResponsibleEmployeeService from '~/resources/scripts/services/UserResponsibleEmployeeService'
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
    userResponsibleEmployeesList: [] as UserResponsibleEmployeeInterface[],
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
    }
  },
  async mounted() {
    this.verifyCanManageUserResponsible()
  },
  methods: {
    async verifyCanManageUserResponsible() {
      const myGeneralStore = useMyGeneralStore()
      if (!myGeneralStore.isRoot) {
        myGeneralStore.setFullLoader(true)
        const { data } = useAuth()
        const session: unknown = data.value as unknown as UserInterface
        const authUser = session as UserInterface

        this.userResponsibleEmployeesList = []
        const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
        const userResponsibleEmployeeService = new UserResponsibleEmployeeService()
        const userResponsibleEmployeeResponse = await userResponsibleEmployeeService.getByEmployee(employeeId, authUser.userId)
        this.userResponsibleEmployeesList = userResponsibleEmployeeResponse.data.data
        if (this.userResponsibleEmployeesList.length > 0) {
          if (!this.userResponsibleEmployeesList[0].userResponsibleEmployeeReadonly) {
            this.canManageUserResponsible = true
          }
        }
        myGeneralStore.setFullLoader(false)
      } else {
        this.canManageUserResponsible = true
      }

    },
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
