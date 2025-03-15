import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import EmployeeBankService from '~/resources/scripts/services/EmployeeBankService';
import type { EmployeeBankInterface } from '~/resources/scripts/interfaces/EmployeeBankInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeBanks',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    employeeBanksList: [] as EmployeeBankInterface[],
    employeeBank: null as EmployeeBankInterface | null,
    drawerEmployeeBankForm: false,
    drawerEmployeeBankDelete: false,
    isDeleted: false
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    await this.getEmployeeBanks()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getEmployeeBanks() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeBanksList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeBankService = new EmployeeBankService()
      const employeeBankResponse = await employeeBankService.getByEmployee(employeeId)
      this.employeeBanksList = employeeBankResponse.data.data
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      if (this.employee.employeeId) {
        const newEmployeeBank: EmployeeBankInterface = {
          employeeBankId: null,
          employeeBankAccountClabe: '',
          employeeBankAccountClabeLastNumbers: '',
          employeeBankAccountNumber: '',
          employeeBankAccountNumberLastNumbers: '',
          employeeBankAccountCardNumber: '',
          employeeBankAccountCardNumberLastNumbers: '',
          employeeBankAccountCurrencyType: 'MXN',
          employeeBankAccountType: null,
          employeeId: this.employee.employeeId,
          bankId: null,
        }
        this.employeeBank = newEmployeeBank
        this.drawerEmployeeBankForm = true
      }
    },
    async onSave(employeeBank: EmployeeBankInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeBank = { ...employeeBank }

      const index = this.employeeBanksList.findIndex((employeeBank: EmployeeBankInterface) => employeeBank.employeeBankId === this.employeeBank?.employeeBankId)
      if (index !== -1) {
        this.employeeBanksList[index] = employeeBank
        this.$forceUpdate()
      } else {
        this.employeeBanksList.push(employeeBank)
        this.$forceUpdate()
      }
      this.drawerEmployeeBankForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeBank: EmployeeBankInterface) {
      this.employeeBank = { ...employeeBank }
      this.drawerEmployeeBankForm = true
    },
    onDelete(employeeBank: EmployeeBankInterface) {
      this.employeeBank = { ...employeeBank }
      this.drawerEmployeeBankDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeBank) {
        this.drawerEmployeeBankDelete = false
        const employeeBankService = new EmployeeBankService()
        const employeeBankResponse = await employeeBankService.delete(this.employeeBank)
        if (employeeBankResponse.status === 200) {
          const index = this.employeeBanksList.findIndex((employeeBank: EmployeeBankInterface) => employeeBank.employeeBankId === this.employeeBank?.employeeBankId)
          if (index !== -1) {
            this.employeeBanksList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee account bank',
            detail: employeeBankResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete employee account bank',
            detail: employeeBankResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})