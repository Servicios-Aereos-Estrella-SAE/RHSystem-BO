import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { DateTime } from 'luxon'
import { useMyGeneralStore } from '~/store/general'
import ShiftService from '~/resources/scripts/services/ShiftService'
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface';
import EmployeeProceedingFileService from '~/resources/scripts/services/EmployeeProceedingFileService';
import { usePrimeVue } from 'primevue/config'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    usePrimeVue,
  },
  name: 'employeeProceedingFileForm',
  props: {
    employeeProceedingFile: { type: Object as PropType<EmployeeProceedingFileInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    shiftList: [] as EmployeeProceedingFileInterface[],
    submitted: false,
    currentEmployeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    isNewEmployeeProceedingFile: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewEmployeeProceedingFile = !this.employeeProceedingFile.employeeProceedingFileId ? true : false
    if (this.employeeProceedingFile.employeeProceedingFileId) {
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const employeeProceedingFileResponse = await  employeeProceedingFileService.show(this.employeeProceedingFile.employeeProceedingFileId)
      if (employeeProceedingFileResponse.status === 200) {
        this.currentEmployeeProceedingFile = employeeProceedingFileResponse._data.data.employeeProceedingFile
      }
    }
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async onSave() {
      this.submitted = true
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      if (!employeeProceedingFileService.validateInfo(this.employeeProceedingFile)) {
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
      let employeeProceedingFileResponse = null
      if (!this.employeeProceedingFile.employeeProceedingFileId) {
        employeeProceedingFileResponse = await employeeProceedingFileService.store(this.employeeProceedingFile)
      } else {
        employeeProceedingFileResponse = await employeeProceedingFileService.update(this.employeeProceedingFile)
      }
      if (employeeProceedingFileResponse.status === 201 || employeeProceedingFileResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Employee proceeding file ${this.employeeProceedingFile.employeeProceedingFileId ? 'updated' : 'created'}`,
          detail: employeeProceedingFileResponse._data.message,
            life: 5000,
        })
        employeeProceedingFileResponse = await  employeeProceedingFileService.show(employeeProceedingFileResponse._data.data.employeeProceedingFileId)
        if (employeeProceedingFileResponse.status === 200) {
          const employeeProceedingFile = employeeProceedingFileResponse._data.data.employeeProceedingFile
          this.$emit('onEmployeeProceedingFileSave', employeeProceedingFile as EmployeeProceedingFileInterface)
        }
      } else {
        let msgError = employeeProceedingFileResponse._data.message
        const severityType = employeeProceedingFileResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Employee proceeding file ${this.employeeProceedingFile.employeeProceedingFileId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
      myGeneralStore.setFullLoader(false)
    },
    formatSize(bytes: number) {
      const $primevue = usePrimeVue()
      if ($primevue && $primevue.config.locale) {
        const k = 1024;
        const dm = 3;
        const sizes = $primevue.config.locale.fileSizeTypes;
    
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    
        return `${formattedSize} ${sizes[i]}`;
      }
      return `0`
  }
  }
})