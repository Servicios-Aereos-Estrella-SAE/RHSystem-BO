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
import type { ProceedingFileStatusInterface } from '~/resources/scripts/interfaces/ProceedingFileStatusInterface';
import ProceedingFileStatusService from '~/resources/scripts/services/ProceedingFileStatusService';

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
    proceedingFileStatusList: [] as ProceedingFileStatusInterface[],
    submitted: false,
    currentEmployeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    isNewEmployeeProceedingFile: false,
    currentDateExpirationAt: null as string | null,
    currentDateSignatureDate: null as string | null,
    currentDateEffectiveStartDate: null as string | null,
    currentDateEffectiveEndDate: null as string | null,
    currentDateInclusionInTheFilesDate: null as string | null,
    dateWasChangeExpirationAt: false,
    dateWasChangeSignatureDate: false,
    dateWasChangeEffectiveStartDate: false,
    dateWasChangeEffectiveEndDate: false,
    dateWasChangeInclusionInTheFilesDate: false,
    isReady: false,
    files: [] as Array<any>,
    proceedingFile: null as ProceedingFileInterface | null,
    activeSwicht: true,
    processCompleteSwicht: false,
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
      proceedingFileTypeId: this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId,
      proceedingFileObservations: this.employeeProceedingFile.proceedingFile?.proceedingFileObservations,
      proceedingFileAfacRights: this.employeeProceedingFile.proceedingFile?.proceedingFileAfacRights,
      proceedingFileSignatureDate: this.employeeProceedingFile.proceedingFile?.proceedingFileSignatureDate,
      proceedingFileEffectiveStartDate: this.employeeProceedingFile.proceedingFile?.proceedingFileEffectiveStartDate,
      proceedingFileEffectiveEndDate: this.employeeProceedingFile.proceedingFile?.proceedingFileEffectiveEndDate,
      proceedingFileInclusionInTheFilesDate: this.employeeProceedingFile.proceedingFile?.proceedingFileInclusionInTheFilesDate,
      proceedingFileOperationCost: this.employeeProceedingFile.proceedingFile?.proceedingFileOperationCost,
      proceedingFileCompleteProcess: this.employeeProceedingFile.proceedingFile?.proceedingFileCompleteProcess
    } as ProceedingFileInterface
    let isActive: number = 1
    if (this.proceedingFile.proceedingFileId) {
      isActive = this.proceedingFile.proceedingFileActive
    }
    this.activeSwicht = isActive === 1 ? true : false
    let isProcessComplete: number = 1
    if (this.proceedingFile.proceedingFileId) {
      isProcessComplete = this.proceedingFile.proceedingFileCompleteProcess
    }
    this.processCompleteSwicht = isProcessComplete === 1 ? true : false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    await this.getProceedingFileTypes()
    await this.getProceedingFileStatus()
    this.isNewEmployeeProceedingFile = !this.employeeProceedingFile.employeeProceedingFileId ? true : false
    if (this.employeeProceedingFile.employeeProceedingFileId) {
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const employeeProceedingFileResponse = await employeeProceedingFileService.show(this.employeeProceedingFile.employeeProceedingFileId)
      if (employeeProceedingFileResponse.status === 200) {
        this.currentEmployeeProceedingFile = employeeProceedingFileResponse._data.data.employeeProceedingFile
      }
    }
    this.currentDateExpirationAt = `${this.proceedingFile.proceedingFileExpirationAt}`
    this.currentDateSignatureDate = `${this.proceedingFile.proceedingFileSignatureDate}`
    this.currentDateEffectiveStartDate = `${this.proceedingFile.proceedingFileEffectiveStartDate}`
    this.currentDateEffectiveEndDate = `${this.proceedingFile.proceedingFileEffectiveEndDate}`
    this.currentDateInclusionInTheFilesDate = `${this.proceedingFile.proceedingFileInclusionInTheFilesDate}`
    await this.formatDate('proceedingFileExpirationAt')
    await this.formatDate('proceedingFileSignatureDate')
    await this.formatDate('proceedingFileEffectiveStartDate')
    await this.formatDate('proceedingFileEffectiveEndDate')
    await this.formatDate('proceedingFileInclusionInTheFilesDate')
    this.dateWasChangeExpirationAt = false
    this.dateWasChangeSignatureDate = false
    this.dateWasChangeEffectiveStartDate = false
    this.dateWasChangeEffectiveEndDate = false
    this.dateWasChangeInclusionInTheFilesDate = false
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getProceedingFileTypes() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.proceedingFileTypesList = []
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.getByArea('employee')
      this.proceedingFileTypesList = proceedingFileTypeResponse._data.data.proceedingFileTypes
      myGeneralStore.setFullLoader(false)
    },
    async getProceedingFileStatus() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.proceedingFileStatusList = []
      const proceedingFileStatusService = new ProceedingFileStatusService()
      const proceedingFileStatusResponse = await proceedingFileStatusService.getFilteredList('')
      this.proceedingFileStatusList = proceedingFileStatusResponse._data.data.proceedingFileStatus.data
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
        if (!this.dateWasChangeExpirationAt) {
          this.proceedingFile.proceedingFileExpirationAt = this.currentDateExpirationAt
        } else {
          if (this.proceedingFile.proceedingFileExpirationAt) {
            this.proceedingFile.proceedingFileExpirationAt = this.getDate(this.proceedingFile.proceedingFileExpirationAt)
          }
        }
        if (!this.dateWasChangeSignatureDate) {
          this.proceedingFile.proceedingFileSignatureDate = this.currentDateSignatureDate
        } else {
          if (this.proceedingFile.proceedingFileSignatureDate) {
            this.proceedingFile.proceedingFileSignatureDate = this.getDate(this.proceedingFile.proceedingFileSignatureDate)
          }
        }
        if (!this.dateWasChangeEffectiveStartDate) {
          this.proceedingFile.proceedingFileEffectiveStartDate = this.currentDateEffectiveStartDate
        } else {
          if (this.proceedingFile.proceedingFileEffectiveStartDate) {
            this.proceedingFile.proceedingFileEffectiveStartDate = this.getDate(this.proceedingFile.proceedingFileEffectiveStartDate)
          }
        }
        if (!this.dateWasChangeEffectiveEndDate) {
          this.proceedingFile.proceedingFileEffectiveEndDate = this.currentDateEffectiveEndDate
        } else {
          if (this.proceedingFile.proceedingFileEffectiveEndDate) {
            this.proceedingFile.proceedingFileEffectiveEndDate = this.getDate(this.proceedingFile.proceedingFileEffectiveEndDate)
          }
        }
        if (!this.dateWasChangeInclusionInTheFilesDate) {
          this.proceedingFile.proceedingFileEffectiveInclusionInTheFilesDate = this.currentDateInclusionInTheFilesDate
        } else {
          if (this.proceedingFile.proceedingFileEffectiveInclusionInTheFilesDate) {
            this.proceedingFile.proceedingFileEffectiveInclusionInTheFilesDate = this.getDate(this.proceedingFile.proceedingFileEffectiveInclusionInTheFilesDate)
          }
        }
        let proceedingFileResponse = null
        this.proceedingFile.proceedingFileActive = this.activeSwicht ? 1 : 0
        this.proceedingFile.proceedingFileCompleteProcess = this.processCompleteSwicht ? 1 : 0
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
    dateYear(date: string) {
      if (!date) {
        return 0
      }

      const year = parseInt(`${date.toString().split('-')[0]}`)
      return year
    },
    dateMonth(date: string) {
      if (!date) {
        return 0
      }

      const month = parseInt(`${date.toString().split('-')[1]}`)
      return month
    },
    dateDay(date: string) {
      if (!date) {
        return 0
      }

      const day = parseInt(`${date.toString().split('-')[2]}`)
      return day
    },
    formatDate(dateName: string) {
      if (!this.proceedingFile) return;
      const dateMapping: Record<string, string> = {
        proceedingFileExpirationAt: 'proceedingFileExpirationAt',
        proceedingFileSignatureDate: 'proceedingFileSignatureDate',
        proceedingFileEffectiveStartDate: 'proceedingFileEffectiveStartDate',
        proceedingFileEffectiveEndDate: 'proceedingFileEffectiveEndDate',
        proceedingFileInclusionInTheFilesDate: 'proceedingFileInclusionInTheFilesDate',
      };
      const dateField = dateMapping[dateName];
      let dateValue = this.proceedingFile[dateField] || '';
      if (dateValue) {
        dateValue = dateValue.toString();
        let date = DateTime.fromJSDate(new Date(dateValue));
        if (!date.isValid) {
          date = DateTime.fromHTTP(dateValue);
        }
        if (date.isValid) {
          const formattedDate = date.toFormat('yyyy-MM-dd');
          this.proceedingFile[dateField] = formattedDate;
          const flagField = `dateWasChange${dateField.charAt(0).toUpperCase() + dateField.slice(1)}`.replaceAll('ProceedingFile', '');
          (this as any)[flagField] = true
        }
      }
    },
    openFile() {
      window.open(this.proceedingFile?.proceedingFilePath)
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    }
  }
})