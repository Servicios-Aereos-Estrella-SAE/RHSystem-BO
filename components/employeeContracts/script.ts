import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import EmployeeContractService from '~/resources/scripts/services/EmployeeContractService';
import type { EmployeeContractInterface } from '~/resources/scripts/interfaces/EmployeeContractInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeContracts',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    employeeContractsList: [] as EmployeeContractInterface[],
    employeeContract: null as EmployeeContractInterface | null,
    drawerEmployeeContractForm: false,
    drawerEmployeeContractDelete: false,
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
    await this.getEmployeeContracts()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getEmployeeContracts() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeContractsList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeContractService = new EmployeeContractService()
      const employeeContractResponse = await employeeContractService.getByEmployee(employeeId)
      this.employeeContractsList = employeeContractResponse.data
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newEmployeeContract: EmployeeContractInterface = {
        employeeContractId: null,
        employeeContractUuid: null,
        employeeContractFolio: '',
        employeeContractStartDate: null,
        employeeContractEndDate: null,
        employeeContractStatus: '',
        employeeContractMonthlyNetSalary: 0,
        employeeContractFile: '',
        employeeContractTypeId: null,
        employeeId: this.employee.employeeId ? this.employee.employeeId : null,
        departmentId: null,
        positionId: null,
        payrollBusinessUnitId: null,
        employeeContractActive: 1,
      }
      this.employeeContract = newEmployeeContract
      this.drawerEmployeeContractForm = true
    },
    async onSave(employeeContract: EmployeeContractInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeContract = { ...employeeContract }

      const index = this.employeeContractsList.findIndex((employeeContract: EmployeeContractInterface) => employeeContract.employeeContractId === this.employeeContract?.employeeContractId)
      if (index !== -1) {
        this.employeeContractsList[index] = employeeContract
        this.$forceUpdate()
      } else {
        this.employeeContractsList.push(employeeContract)
        this.$forceUpdate()
      }
      this.$emit('onEmployeeContractSave', employeeContract as EmployeeContractInterface)
      this.drawerEmployeeContractForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeContract: EmployeeContractInterface) {
      this.employeeContract = { ...employeeContract }
      this.drawerEmployeeContractForm = true
    },
    onDelete(employeeContract: EmployeeContractInterface) {
      this.employeeContract = { ...employeeContract }
      this.drawerEmployeeContractDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeContract) {
        this.drawerEmployeeContractDelete = false
        const employeeContractService = new EmployeeContractService()
        const employeeContractResponse = await employeeContractService.delete(this.employeeContract)
        if (employeeContractResponse.status === 200) {
          const index = this.employeeContractsList.findIndex((employeeContract: EmployeeContractInterface) => employeeContract.employeeContractId === this.employeeContract?.employeeContractId)
          if (index !== -1) {
            this.employeeContractsList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee contract',
            detail: employeeContractResponse._data.message,
            life: 5000,
          })
          this.$emit('onEmployeeContractSave', this.employeeContract as EmployeeContractInterface)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete employee contract',
            detail: employeeContractResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})