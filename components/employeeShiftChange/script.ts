import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import EmployeeShiftChangeService from '~/resources/scripts/services/EmployeeShiftChangeService';
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeShiftChanges',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    employeeShiftChangesList: [] as EmployeeShiftChangeInterface[],
    employeeShiftChange: null as EmployeeShiftChangeInterface | null,
    drawerEmployeeShiftChangeForm: false,
    drawerEmployeeShiftChangeDelete: false,
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
    await this.getEmployeeShiftChanges()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getEmployeeShiftChanges() {
      /*  const myGeneralStore = useMyGeneralStore()
       myGeneralStore.setFullLoader(true)
       this.employeeShiftChangesList = []
       const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
       const employeeShiftChangeService = new EmployeeShiftChangeService()
       const employeeShiftChangeResponse = await employeeShiftChangeService.getByEmployee(employeeId)
       this.employeeShiftChangesList = employeeShiftChangeResponse.data
       myGeneralStore.setFullLoader(false) */
    },
    addNew() {
      const newEmployeeShiftChange: EmployeeShiftChangeInterface = {
        employeeIdFrom: this.employee.employeeId,
        shiftIdFrom: null,
        employeeShiftChangeDateFrom: '',
        employeeShiftChangeDateFromIsRestDay: 0,
        employeeIdTo: null,
        shiftIdTo: null,
        employeeShiftChangeDateTo: '',
        employeeShiftChangeDateToIsRestDay: 0
      }
      this.employeeShiftChange = newEmployeeShiftChange
      this.drawerEmployeeShiftChangeForm = true
    },
    async onSave(employeeShiftChange: EmployeeShiftChangeInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeShiftChange = { ...employeeShiftChange }

      const index = this.employeeShiftChangesList.findIndex((employeeShiftChange: EmployeeShiftChangeInterface) => employeeShiftChange.employeeShiftChangeId === this.employeeShiftChange?.employeeShiftChangeId)
      if (index !== -1) {
        this.employeeShiftChangesList[index] = employeeShiftChange
        this.$forceUpdate()
      } else {
        this.employeeShiftChangesList.push(employeeShiftChange)
        this.$forceUpdate()
      }
      this.$emit('onEmployeeShiftChangeSave', employeeShiftChange as EmployeeShiftChangeInterface)
      this.drawerEmployeeShiftChangeForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeShiftChange: EmployeeShiftChangeInterface) {
      this.employeeShiftChange = { ...employeeShiftChange }
      this.drawerEmployeeShiftChangeForm = true
    },
    onDelete(employeeShiftChange: EmployeeShiftChangeInterface) {
      this.employeeShiftChange = { ...employeeShiftChange }
      this.drawerEmployeeShiftChangeDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeShiftChange) {
        this.drawerEmployeeShiftChangeDelete = false
        const employeeShiftChangeService = new EmployeeShiftChangeService()
        const employeeShiftChangeResponse = await employeeShiftChangeService.delete(this.employeeShiftChange)
        if (employeeShiftChangeResponse.status === 200) {
          const index = this.employeeShiftChangesList.findIndex((employeeShiftChange: EmployeeShiftChangeInterface) => employeeShiftChange.employeeShiftChangeId === this.employeeShiftChange?.employeeShiftChangeId)
          if (index !== -1) {
            this.employeeShiftChangesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee shift change',
            detail: employeeShiftChangeResponse._data.message,
            life: 5000,
          })
          this.$emit('onEmployeeShiftChangeSave', this.employeeShiftChange as EmployeeShiftChangeInterface)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete employee shift change',
            detail: employeeShiftChangeResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})