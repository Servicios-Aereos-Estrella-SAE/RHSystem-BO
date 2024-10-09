import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { CustomerProceedingFileInterface } from '~/resources/scripts/interfaces/CustomerProceedingFileInterface';
import CustomerProceedingFileService from '~/resources/scripts/services/CustomerProceedingFileService';
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
  name: 'customerProceedingFileForm',
  props: {
    customerProceedingFile: { type: Object as PropType<CustomerProceedingFileInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    proceedingFileStatusList: [] as ProceedingFileStatusInterface[],
    submitted: false,
    currentCustomerProceedingFile: null as CustomerProceedingFileInterface | null,
    isNewCustomerProceedingFile: false,
    currentDate: null as string | null,
    dateWasChange: false,
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
  }),
  computed: {
  },
  watch: {
    'proceedingFile.proceedingFileExpirationAt' (val: Date) {
      this.expirationAt = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileSignatureDate' (val: Date) {
      this.signatureDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileEffectiveStartDate' (val: Date) {
      this.effectiveStartDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileEffectiveEndDate' (val: Date) {
      this.effectiveEndDate = this.getDateFormatted(val)
    },
    'proceedingFile.proceedingFileInclusionInTheFilesDate' (val: Date) {
      this.inclusionInTheFilesDate = this.getDateFormatted(val)
    },
  },
  async mounted() {
    this.proceedingFile = {
      proceedingFileId: this.customerProceedingFile.proceedingFileId,
      proceedingFileName: this.customerProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.customerProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.customerProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.customerProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileIdentify: this.customerProceedingFile.proceedingFile?.proceedingFileIdentify,
      proceedingFileTypeId: this.customerProceedingFile.proceedingFile?.proceedingFileTypeId,
      proceedingFileObservations: this.customerProceedingFile.proceedingFile?.proceedingFileObservations,
      proceedingFileAfacRights: this.customerProceedingFile.proceedingFile?.proceedingFileAfacRights,
      proceedingFileSignatureDate: this.customerProceedingFile.proceedingFile?.proceedingFileSignatureDate,
      proceedingFileEffectiveStartDate: this.customerProceedingFile.proceedingFile?.proceedingFileEffectiveStartDate,
      proceedingFileEffectiveEndDate: this.customerProceedingFile.proceedingFile?.proceedingFileEffectiveEndDate,
      proceedingFileInclusionInTheFilesDate: this.customerProceedingFile.proceedingFile?.proceedingFileInclusionInTheFilesDate,
      proceedingFileOperationCost: this.customerProceedingFile.proceedingFile?.proceedingFileOperationCost,
      proceedingFileCompleteProcess: this.customerProceedingFile.proceedingFile?.proceedingFileCompleteProcess
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
  if (this.customerProceedingFile.proceedingFile) {
    this.proceedingFile.proceedingFileStatusId = this.customerProceedingFile.proceedingFile.proceedingFileStatus?.proceedingFileStatusId
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
    this.isNewCustomerProceedingFile = !this.customerProceedingFile.customerProceedingFileId ? true : false
    if (this.customerProceedingFile.customerProceedingFileId) {
      const customerProceedingFileService = new CustomerProceedingFileService()
      const customerProceedingFileResponse = await customerProceedingFileService.show(this.customerProceedingFile.customerProceedingFileId)
      if (customerProceedingFileResponse.status === 200) {
        this.currentCustomerProceedingFile = customerProceedingFileResponse._data.data.customerProceedingFile
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
      const proceedingFileTypeResponse = await proceedingFileTypeService.getByArea('customer')
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
          this.customerProceedingFile.proceedingFileId = proceedingFileResponse._data.data.proceedingFile.proceedingFileId
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
      const customerProceedingFileService = new CustomerProceedingFileService()
      if (!customerProceedingFileService.validateInfo(this.customerProceedingFile)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
        return
      }
      let customerProceedingFileResponse = null
      if (!this.customerProceedingFile.customerProceedingFileId) {
        customerProceedingFileResponse = await customerProceedingFileService.store(this.customerProceedingFile)
      } else {
        customerProceedingFileResponse = await customerProceedingFileService.update(this.customerProceedingFile)
      }
      if (customerProceedingFileResponse.status === 201 || customerProceedingFileResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Customer proceeding file ${this.customerProceedingFile.customerProceedingFileId ? 'updated' : 'created'}`,
          detail: customerProceedingFileResponse._data.message,
          life: 5000,
        })
        customerProceedingFileResponse = await customerProceedingFileService.show(customerProceedingFileResponse._data.data.customerProceedingFile.customerProceedingFileId)
        if (customerProceedingFileResponse.status === 200) {
          const customerProceedingFile = customerProceedingFileResponse._data.data.customerProceedingFile.customerProceedingFile
          this.$emit('onCustomerProceedingFileSave', customerProceedingFile as CustomerProceedingFileInterface)
        }
      } else {
        let msgError = customerProceedingFileResponse._data.message
        const severityType = customerProceedingFileResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Customer proceeding file ${this.customerProceedingFile.customerProceedingFileId ? 'updated' : 'created'}`,
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
      if (!this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const year = parseInt(`${this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const month = parseInt(`${this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const day = parseInt(`${this.customerProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
      return day
    },
    openFile() {
      window.open(this.proceedingFile?.proceedingFilePath)
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    },
    getDateFormatted (date: Date) {
      if (!date) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerDisplayExpirationAt () {
      this.displayExpirationAtCalendar = true
    },
    handlerDisplaySignatureDate () {
      this.displaySignatureDateCalendar = true
    },
    handlerDisplayEffectiveStartDate () {
      this.displayEffectiveStartDateCalendar = true
    },
    handlerDisplayEffectiveEndDate () {
      this.displayEffectiveEndDateCalendar = true
    },
    handlerDisplayInclusionInTheFilesDate () {
      this.displayInclusionInTheFilesDateCalendar = true
    },
  }
})