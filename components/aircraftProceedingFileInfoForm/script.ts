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
    submitted: false,
    currentAircraftProceedingFile: null as AircraftProceedingFileInterface | null,
    isNewAircraftProceedingFile: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
    files: [] as Array<any>,
    proceedingFile: null as ProceedingFileInterface | null,
    activeSwicht: true,
  }),
  async mounted() {
    this.proceedingFile = {
      proceedingFileId: this.aircraftProceedingFile.proceedingFileId,
      proceedingFileName: this.aircraftProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.aircraftProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.aircraftProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.aircraftProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileIdentify: this.aircraftProceedingFile.proceedingFile?.proceedingFileIdentify,
      proceedingFileTypeId: this.aircraftProceedingFile.proceedingFile?.proceedingFileTypeId
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

    this.isNewAircraftProceedingFile = !this.aircraftProceedingFile.aircraftProceedingFileId ? true : false

    if (this.aircraftProceedingFile.aircraftProceedingFileId) {
      const aircraftProceedingFileService = new AircraftProceedingFileService()
      const aircraftProceedingFileResponse = await aircraftProceedingFileService.show(this.aircraftProceedingFile.aircraftProceedingFileId)
      if (aircraftProceedingFileResponse.status === 200) {
        this.currentAircraftProceedingFile = aircraftProceedingFileResponse._data.data.aircraftProceedingFile
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
          const aircraftProceedingFile = aircraftProceedingFileResponse._data.data.aircraftProceedingFile
          this.$emit('clickOnSave', aircraftProceedingFile)
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
      getDate(date: string) {
        return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
      }
  }
})
