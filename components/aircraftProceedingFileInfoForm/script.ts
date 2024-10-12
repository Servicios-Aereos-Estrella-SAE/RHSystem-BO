import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { AircraftProceedingFileInterface } from '~/resources/scripts/interfaces/AircraftProceedingFileInterface';
import AircraftProceedingFileService from '~/resources/scripts/services/AircraftProceedingFileService';
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
  name: 'aircraftProceedingFileInfoForm',
  props: {
    aircraftProceedingFile: { type: Object as PropType<AircraftProceedingFileInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    proceedingFileStatusList: [] as ProceedingFileStatusInterface[],
    submitted: false,
    currentAircraftProceedingFile: null as AircraftProceedingFileInterface | null,
    isNewAircraftProceedingFile: false,
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
      proceedingFileId: this.aircraftProceedingFile.proceedingFileId,
      proceedingFileName: this.aircraftProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.aircraftProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.aircraftProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.aircraftProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileIdentify: this.aircraftProceedingFile.proceedingFile?.proceedingFileIdentify,
      proceedingFileTypeId: this.aircraftProceedingFile.proceedingFile?.proceedingFileTypeId,
      proceedingFileObservations: this.aircraftProceedingFile.proceedingFile?.proceedingFileObservations,
      proceedingFileAfacRights: this.aircraftProceedingFile.proceedingFile?.proceedingFileAfacRights,
      proceedingFileSignatureDate: this.aircraftProceedingFile.proceedingFile?.proceedingFileSignatureDate,
      proceedingFileEffectiveStartDate: this.aircraftProceedingFile.proceedingFile?.proceedingFileEffectiveStartDate,
      proceedingFileEffectiveEndDate: this.aircraftProceedingFile.proceedingFile?.proceedingFileEffectiveEndDate,
      proceedingFileInclusionInTheFilesDate: this.aircraftProceedingFile.proceedingFile?.proceedingFileInclusionInTheFilesDate,
      proceedingFileOperationCost: this.aircraftProceedingFile.proceedingFile?.proceedingFileOperationCost,
      proceedingFileCompleteProcess: this.aircraftProceedingFile.proceedingFile?.proceedingFileCompleteProcess
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
  if (this.aircraftProceedingFile.proceedingFile) {
    this.proceedingFile.proceedingFileStatusId = this.aircraftProceedingFile.proceedingFile.proceedingFileStatus?.proceedingFileStatusId
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
    this.isNewAircraftProceedingFile = !this.aircraftProceedingFile.aircraftProceedingFileId ? true : false

    if (this.aircraftProceedingFile.aircraftProceedingFileId) {
      const aircraftProceedingFileService = new AircraftProceedingFileService()
      const aircraftProceedingFileResponse = await aircraftProceedingFileService.show(this.aircraftProceedingFile.aircraftProceedingFileId)
      if (aircraftProceedingFileResponse.status === 200) {
        this.currentAircraftProceedingFile = aircraftProceedingFileResponse._data.data.aircraftProceedingFile
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
      const proceedingFileTypeResponse = await proceedingFileTypeService.getByArea('aircraft')
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
          this.aircraftProceedingFile.proceedingFileId = proceedingFileResponse._data.data.proceedingFile.proceedingFileId
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

      const aircraftProceedingFileService = new AircraftProceedingFileService()
      if (!aircraftProceedingFileService.validateInfo(this.aircraftProceedingFile)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
        return
      }

      let aircraftProceedingFileResponse = null
      if (!this.aircraftProceedingFile.aircraftProceedingFileId) {
        aircraftProceedingFileResponse = await aircraftProceedingFileService.store(this.aircraftProceedingFile)
      } else {
        aircraftProceedingFileResponse = await aircraftProceedingFileService.update(this.aircraftProceedingFile)
      }

      if (aircraftProceedingFileResponse.status === 201 || aircraftProceedingFileResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Aircraft proceeding file ${this.aircraftProceedingFile.aircraftProceedingFileId ? 'updated' : 'created'}`,
          detail: aircraftProceedingFileResponse._data.message,
          life: 5000,
        })
        aircraftProceedingFileResponse = await aircraftProceedingFileService.show(aircraftProceedingFileResponse._data.data.aircraftProceedingFile.aircraftProceedingFileId)
        if (aircraftProceedingFileResponse.status === 200) {
          const aircraftProceedingFile = aircraftProceedingFileResponse._data.data.aircraftProceedingFile.aircraftProceedingFile
          this.$emit('onAircraftProceedingFileSave', aircraftProceedingFile as AircraftProceedingFileInterface)
        }
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: `Aircraft proceeding file ${this.aircraftProceedingFile.aircraftProceedingFileId ? 'updated' : 'created'}`,
          detail: aircraftProceedingFileResponse._data.message,
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
    onCancel() {
      this.$emit('onCancel')
    },
    setFile(event: any) {
      const files = event.target.files
      if (files.length > 0) {
        this.files = [...files]
      }
    },
    removeFile() {
      this.files = []
    },
    dateYear() {
        if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
          return 0
        }
  
        const year = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
        return year
      },
      dateMonth() {
        if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
          return 0
        }
  
        const month = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
        return month
      },
      dateDay() {
        if (!this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
          return 0
        }
  
        const day = parseInt(`${this.aircraftProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
        return day
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
