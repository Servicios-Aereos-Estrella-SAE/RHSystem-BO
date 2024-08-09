import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import EmployeeProceedingFileService from '~/resources/scripts/services/EmployeeProceedingFileService';
import ProceedingFileService from '~/resources/scripts/services/ProceedingFilleService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeProceedingFile',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    employeeProceedingFilesList: [] as EmployeeProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    employeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    employeeProceedingFileActiveId: 0 as number | null,
    drawerEmployeeProceedingFileForm: false,
    drawerEmployeeProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getEmployeeProceedingFiles()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getEmployeeProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeProceedingFilesList = []
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const employeeProceedingFileResponse = await employeeProceedingFileService.getByEmployee(employeeId)
      this.employeeProceedingFilesList = employeeProceedingFileResponse.proceedingFiles
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newEmployeeProceedingFile: EmployeeProceedingFileInterface = {
        employeeProceedingFileId: null,
        employeeId: this.employee.employeeId,
        proceedingFileId: null,
        employeeProceedingFileCreatedAt: null,
        employeeProceedingFileUpdatedAt: null,
        employeeProceedingFileDeletedAt: null
      }
      this.employeeProceedingFile = newEmployeeProceedingFile
      this.drawerEmployeeProceedingFileForm = true
    },
    async onSave(employeeProceedingFile: EmployeeProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeProceedingFile = {...employeeProceedingFile}
      
      const index = this.employeeProceedingFilesList.findIndex((employeeProceedingFile: EmployeeProceedingFileInterface) => employeeProceedingFile.employeeProceedingFileId === this.employeeProceedingFile?.employeeProceedingFileId)
      if (index !== -1) {
        this.employeeProceedingFilesList[index] = employeeProceedingFile
        this.$forceUpdate()
      } else {
        this.employeeProceedingFilesList.push(employeeProceedingFile)
        this.$forceUpdate()
      }
      this.drawerEmployeeProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(employeeProceedingFile: EmployeeProceedingFileInterface) {
      this.employeeProceedingFile = {...employeeProceedingFile}
      this.drawerEmployeeProceedingFileForm = true
    },
    onDelete(employeeProceedingFile: EmployeeProceedingFileInterface) {
      this.employeeProceedingFile = {...employeeProceedingFile}
      this.selectedDateTimeDeleted = ''
      this.drawerEmployeeProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.employeeProceedingFile) {
        this.drawerEmployeeProceedingFileDelete = false
        const employeeProceedingFileService = new EmployeeProceedingFileService()
        const employeeProceedingFileResponse = await employeeProceedingFileService.delete(this.employeeProceedingFile)
        if (employeeProceedingFileResponse.status === 200) {
          const index = this.employeeProceedingFilesList.findIndex((employeeProceedingFile: EmployeeProceedingFileInterface) => employeeProceedingFile.employeeProceedingFileId === this.employeeProceedingFile?.employeeProceedingFileId)
          if (index !== -1) {
            this.employeeProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete proceeding file employee',
            detail: employeeProceedingFileResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file employee',
            detail: employeeProceedingFileResponse._data.message,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})