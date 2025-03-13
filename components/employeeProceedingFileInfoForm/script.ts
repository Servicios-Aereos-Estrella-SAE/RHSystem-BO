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
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { ProceedingFileTypePropertyValueInterface } from '~/resources/scripts/interfaces/ProceedingFileTypePropertyValueInterface';
import type { ProceedingFileTypePropertyInterface } from '~/resources/scripts/interfaces/ProceedingFileTypePropertyInterface';
import ProceedingFileTypePropertyService from '~/resources/scripts/services/ProceedingFileTypePropertyService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    usePrimeVue,
  },
  name: 'employeeProceedingFileForm',
  props: {
    employeeProceedingFile: { type: Object as PropType<EmployeeProceedingFileInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canReadOnlyFiles: { type: Boolean, default: false, required: true },
    canManageFiles: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    proceedingFileStatusList: [] as ProceedingFileStatusInterface[],
    submitted: false,
    currentEmployeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    isNewEmployeeProceedingFile: false,
    isReady: false,
    files: [] as Array<any>,
    proceedingFile: null as ProceedingFileInterface | null,
    activeSwicht: true,
    processCompleteSwicht: false,
    expirationAt: '' as string,
    displayExpirationAtCalendar: false as boolean,
    signatureDate: '' as string,
    displaySignatureDateCalendar: false as boolean,
    effectiveStartDate: '' as string,
    displayEffectiveStartDateCalendar: false as boolean,
    effectiveEndDate: '' as string,
    displayEffectiveEndDateCalendar: false as boolean,
    inclusionInTheFilesDate: '' as string,
    displayInclusionInTheFilesDateCalendar: false as boolean,
    proceedingFileTypePropertyCategories: [] as Array<any>,
    drawerProceedingFileTypePropertyValueDelete: false,
    proceedingFileTypePropertyValue: null as ProceedingFileTypePropertyValueInterface | null,
    proceedingFileTypeProperty: null as ProceedingFileTypePropertyInterface | null,
  }),
  computed: {
  },
  watch: {
    'proceedingFile.proceedingFileExpirationAt'(val: Date) {
      this.expirationAt = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileSignatureDate'(val: Date) {
      this.signatureDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileEffectiveStartDate'(val: Date) {
      this.effectiveStartDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileEffectiveEndDate'(val: Date) {
      this.effectiveEndDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileInclusionInTheFilesDate'(val: Date) {
      this.inclusionInTheFilesDate = this.getDateFormatted(val)
    },
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
    if (this.proceedingFile.proceedingFileExpirationAt) {
      const expirationAt = DateTime.fromISO(this.proceedingFile.proceedingFileExpirationAt.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileExpirationAt = expirationAt
      this.expirationAt = this.getDateFormatted(this.proceedingFile.proceedingFileExpirationAt as Date)
    }
    if (this.proceedingFile.proceedingFileSignatureDate) {
      const signatureDate = DateTime.fromISO(this.proceedingFile.proceedingFileSignatureDate.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileSignatureDate = signatureDate
      this.signatureDate = this.getDateFormatted(this.proceedingFile.proceedingFileSignatureDate as Date)
    }
    if (this.proceedingFile.proceedingFileEffectiveStartDate) {
      const effectiveStartDate = DateTime.fromISO(this.proceedingFile.proceedingFileEffectiveStartDate.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileEffectiveStartDate = effectiveStartDate
      this.effectiveStartDate = this.getDateFormatted(this.proceedingFile.proceedingFileEffectiveStartDate as Date)
    }
    if (this.proceedingFile.proceedingFileEffectiveEndDate) {
      const effectiveEndDate = DateTime.fromISO(this.proceedingFile.proceedingFileEffectiveEndDate.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileEffectiveEndDate = effectiveEndDate
      this.effectiveEndDate = this.getDateFormatted(this.proceedingFile.proceedingFileEffectiveEndDate as Date)
    }
    if (this.proceedingFile.proceedingFileInclusionInTheFilesDate) {
      const inclusionInTheFilesDate = DateTime.fromISO(this.proceedingFile.proceedingFileInclusionInTheFilesDate.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileInclusionInTheFilesDate = inclusionInTheFilesDate
      this.inclusionInTheFilesDate = this.getDateFormatted(this.proceedingFile.proceedingFileInclusionInTheFilesDate as Date)
    }
    if (this.employeeProceedingFile.proceedingFile) {
      this.proceedingFile.proceedingFileStatusId = this.employeeProceedingFile.proceedingFile.proceedingFileStatus?.proceedingFileStatusId
    }
    let isActive: number = 1
    if (this.proceedingFile.proceedingFileId) {
      isActive = this.proceedingFile.proceedingFileActive
    }
    this.activeSwicht = isActive === 1 ? true : false
    let isProcessComplete: number = 0
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
    openFile() {
      window.open(this.proceedingFile?.proceedingFilePath)
    },
    getDate(date: string) {
      const newDate = DateTime.fromJSDate(new Date(date), { zone: 'local' }).toFormat('yyyy-MM-dd')
      return newDate;
    },
    getDateFormatted(date: Date) {
      if (!date) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerDisplayExpirationAt() {
      this.displayExpirationAtCalendar = true
    },
    handlerDisplaySignatureDate() {
      this.displaySignatureDateCalendar = true
    },
    handlerDisplayEffectiveStartDate() {
      this.displayEffectiveStartDateCalendar = true
    },
    handlerDisplayEffectiveEndDate() {
      this.displayEffectiveEndDateCalendar = true
    },
    handlerDisplayInclusionInTheFilesDate() {
      this.displayInclusionInTheFilesDateCalendar = true
    },
    validateFilesProperty(event: any, value: any) {
      let validFiles = event.files;
      value.files = validFiles;
      this.$forceUpdate()
    },
    openFileProperty(path: string) {
      window.open(path)
    },
    getObjectURLProperty(file: any) {
      return URL.createObjectURL(file);
    },
    async getCategoriesEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.proceedingFileTypePropertyCategories = []
      if (this.employee.employeeId && this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId) {
        const proceedingFileTypePropertyService = new ProceedingFileTypePropertyService()
        const employeeRecordPropertyResponse = await proceedingFileTypePropertyService.getCategories(this.employee.employeeId, this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId)
        this.proceedingFileTypePropertyCategories = employeeRecordPropertyResponse._data.data.employeeRecordCategories
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})