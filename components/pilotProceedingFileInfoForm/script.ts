import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import { useMyGeneralStore } from '~/store/general'
import type { PilotProceedingFileInterface } from '~/resources/scripts/interfaces/PilotProceedingFileInterface';
import PilotProceedingFileService from '~/resources/scripts/services/PilotProceedingFileService';
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
  name: 'pilotProceedingFileForm',
  props: {
    pilotProceedingFile: { type: Object as PropType<PilotProceedingFileInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    proceedingFileTypesList: [] as ProceedingFileTypeInterface[],
    submitted: false,
    currentPilotProceedingFile: null as PilotProceedingFileInterface | null,
    isNewPilotProceedingFile: false,
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
      proceedingFileId: this.pilotProceedingFile.proceedingFileId,
      proceedingFileName: this.pilotProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.pilotProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.pilotProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.pilotProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileIdentify: this.pilotProceedingFile.proceedingFile?.proceedingFileIdentify,
      proceedingFileTypeId: this.pilotProceedingFile.proceedingFile?.proceedingFileTypeId
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
    this.isNewPilotProceedingFile = !this.pilotProceedingFile.pilotProceedingFileId ? true : false
    if (this.pilotProceedingFile.pilotProceedingFileId) {
      const pilotProceedingFileService = new PilotProceedingFileService()
      const pilotProceedingFileResponse = await pilotProceedingFileService.show(this.pilotProceedingFile.pilotProceedingFileId)
      if (pilotProceedingFileResponse.status === 200) {
        this.currentPilotProceedingFile = pilotProceedingFileResponse._data.data.pilotProceedingFile
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
          this.pilotProceedingFile.proceedingFileId = proceedingFileResponse._data.data.proceedingFile.proceedingFileId
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
      const pilotProceedingFileService = new PilotProceedingFileService()
      if (!pilotProceedingFileService.validateInfo(this.pilotProceedingFile)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        myGeneralStore.setFullLoader(false)
        return
      }
      let pilotProceedingFileResponse = null
      if (!this.pilotProceedingFile.pilotProceedingFileId) {
        pilotProceedingFileResponse = await pilotProceedingFileService.store(this.pilotProceedingFile)
      } else {
        pilotProceedingFileResponse = await pilotProceedingFileService.update(this.pilotProceedingFile)
      }
      if (pilotProceedingFileResponse.status === 201 || pilotProceedingFileResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Pilot proceeding file ${this.pilotProceedingFile.pilotProceedingFileId ? 'updated' : 'created'}`,
          detail: pilotProceedingFileResponse._data.message,
          life: 5000,
        })
        pilotProceedingFileResponse = await pilotProceedingFileService.show(pilotProceedingFileResponse._data.data.pilotProceedingFile.pilotProceedingFileId)
        if (pilotProceedingFileResponse.status === 200) {
          const pilotProceedingFile = pilotProceedingFileResponse._data.data.pilotProceedingFile.pilotProceedingFile
          this.$emit('onPilotProceedingFileSave', pilotProceedingFile as PilotProceedingFileInterface)
        }
      } else {
        let msgError = pilotProceedingFileResponse._data.message
        const severityType = pilotProceedingFileResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Pilot proceeding file ${this.pilotProceedingFile.pilotProceedingFileId ? 'updated' : 'created'}`,
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
      if (!this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const year = parseInt(`${this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const month = parseInt(`${this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt) {
        return 0
      }

      const day = parseInt(`${this.pilotProceedingFile?.proceedingFile?.proceedingFileExpirationAt.toString().split('-')[2]}`)
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