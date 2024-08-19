import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { EmployeeProceedingFileInterface } from '~/resources/scripts/interfaces/EmployeeProceedingFileInterface';
import EmployeeProceedingFileService from '~/resources/scripts/services/EmployeeProceedingFileService';
import { usePrimeVue } from 'primevue/config'
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService';
import ProceedingFileService from '~/resources/scripts/services/ProceedingFilleService';
import { DateTime } from 'luxon';

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
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    submitted: false,
    currentEmployeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    isNewEmployeeProceedingFile: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
    files: [] as Array<any>,
    proceedingFile: null as ProceedingFileInterface | null,
    activeSwicht: true,
  }),
  computed: {
  },
  async mounted() {
    this.proceedingFile = {
      proceedingFileId: this.employeeProceedingFile.proceedingFileId,
      proceedingFileName: this.employeeProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.employeeProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.employeeProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.employeeProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileIdentify: this.employeeProceedingFile.proceedingFile?.proceedingFileIdentify,
      proceedingFileTypeId: this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId
    } as ProceedingFileInterface
    let isActive: number = 1
    if (this.proceedingFile.proceedingFileId) {
      isActive = this.proceedingFile.proceedingFileActive
    }
    this.activeSwicht = isActive === 1 ? true : false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    await this.getProceedingFileTypes()
    this.isNewEmployeeProceedingFile = !this.employeeProceedingFile.employeeProceedingFileId ? true : false
    if (this.employeeProceedingFile.employeeProceedingFileId) {
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const employeeProceedingFileResponse = await employeeProceedingFileService.show(this.employeeProceedingFile.employeeProceedingFileId)
      if (employeeProceedingFileResponse.status === 200) {
        this.currentEmployeeProceedingFile = employeeProceedingFileResponse._data.data.employeeProceedingFile
      }
    }
    this.currentDate = `${this.proceedingFile.proceedingFileExpirationAt}`
    await this.formatDate()
    this.dateWasChange = false
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getProceedingFileTypes() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.proceedingFileTypesList = []
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.getFilteredList('')
      this.proceedingFileTypesList = proceedingFileTypeResponse._data.data.proceedingFileTypes.data
      myGeneralStore.setFullLoader(false)
    },
    async onSave() {
      this.submitted = true
      if (this.proceedingFile && !this.proceedingFile.proceedingFileTypeId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Wrong proceeding file type',
          detail: 'You must select a proceeding file type',
          life: 5000,
        })
        return
      }
      if (!(this.files.length > 0) && !this.proceedingFile?.proceedingFileId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'File invalid',
          detail: 'You must select a file',
          life: 5000,
        })
        return
      }
      if (this.files.length > 1) {
        this.$toast.add({
          severity: 'warn',
          summary: 'File invalid',
          detail: 'Only one file is allowed',
          life: 5000,
        })
        return
      }
      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isAudioOrVideo = mimeType.startsWith('audio/') || mimeType.startsWith('video/');
          if (isAudioOrVideo) {
            this.$toast.add({
              severity: 'warn',
              summary: 'File invalid',
              detail: 'Audio or video files are not allowed.',
              life: 5000,
            })
            return
          }
        }
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const proceedingFileService = new ProceedingFileService()
      if (this.proceedingFile) {
        const files = this.files.length > 0 ? this.files[0] : null
        const proceedingFileExpirationAtTemp = this.proceedingFile.proceedingFileExpirationAt
        if (!this.dateWasChange) {
          this.proceedingFile.proceedingFileExpirationAt = this.currentDate
        } else {
          if (this.proceedingFile.proceedingFileExpirationAt) {
            this.proceedingFile.proceedingFileExpirationAt = this.getDate(this.proceedingFile.proceedingFileExpirationAt)
          }
        }
        let proceedingFileResponse = null
        this.proceedingFile.proceedingFileActive = this.activeSwicht ? 1 : 0
        if (!this.proceedingFile.proceedingFileId) {
          proceedingFileResponse = await proceedingFileService.store(this.proceedingFile, files)
        } else {
          proceedingFileResponse = await proceedingFileService.update(this.proceedingFile, files)
        }
        this.proceedingFile.proceedingFileExpirationAt = proceedingFileExpirationAtTemp
        if (proceedingFileResponse.status === 201 || proceedingFileResponse.status === 200) {
          this.employeeProceedingFile.proceedingFileId = proceedingFileResponse._data.data.proceedingFile.proceedingFileId
        } else {
          let msgError = proceedingFileResponse._data.message
          const severityType = proceedingFileResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Proceeding file ${this.proceedingFile.proceedingFileId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
          myGeneralStore.setFullLoader(false)
          return
        }
      }
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      if (!employeeProceedingFileService.validateInfo(this.employeeProceedingFile)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
        return
      }
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
        employeeProceedingFileResponse = await employeeProceedingFileService.show(employeeProceedingFileResponse._data.data.employeeProceedingFile.employeeProceedingFileId)
        if (employeeProceedingFileResponse.status === 200) {
          const employeeProceedingFile = employeeProceedingFileResponse._data.data.employeeProceedingFile.employeeProceedingFile
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
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    dateYear() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const year = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const month = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const day = parseInt(`${this.employeeProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
      return day
    },
    formatDate() {
      if (this.proceedingFile && this.proceedingFile.proceedingFileExpirationAt) {
        const date = DateTime.local(this.dateYear(), this.dateMonth(), this.dateDay(), 0)
        const day = date.toFormat('yyyy-MM-dd')
        if (date.isValid) {
          this.proceedingFile.proceedingFileExpirationAt = day
        } else {
          const newDate = DateTime.fromHTTP(this.proceedingFile.proceedingFileExpirationAt)
          if (date.isValid) {
            const day = newDate.toFormat('yyyy-MM-dd')
            this.proceedingFile.proceedingFileExpirationAt = day
          }
        }
      }
      this.dateWasChange = true
    },
    openFile() {
      window.open(this.proceedingFile?.proceedingFilePath)
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    }
  }
})