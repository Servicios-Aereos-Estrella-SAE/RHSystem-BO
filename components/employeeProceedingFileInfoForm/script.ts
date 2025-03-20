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
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { ProceedingFileTypePropertyValueInterface } from '~/resources/scripts/interfaces/ProceedingFileTypePropertyValueInterface';
import type { ProceedingFileTypePropertyInterface } from '~/resources/scripts/interfaces/ProceedingFileTypePropertyInterface';
import ProceedingFileTypePropertyService from '~/resources/scripts/services/ProceedingFileTypePropertyService';
import ProceedingFileTypePropertyValueService from '~/resources/scripts/services/ProceedingFileTypePropertyValueService';

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
    submitted: false,
    currentEmployeeProceedingFile: null as EmployeeProceedingFileInterface | null,
    isNewEmployeeProceedingFile: false,
    isReady: false,
    files: [] as Array<any>,
    proceedingFile: null as ProceedingFileInterface | null,
    expirationAt: '' as string,
    displayExpirationAtCalendar: false as boolean,
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
  },
  async mounted() {
    this.proceedingFile = {
      proceedingFileId: this.employeeProceedingFile.proceedingFileId,
      proceedingFileName: this.employeeProceedingFile.proceedingFile?.proceedingFileName,
      proceedingFilePath: this.employeeProceedingFile.proceedingFile?.proceedingFilePath,
      proceedingFileExpirationAt: this.employeeProceedingFile.proceedingFile?.proceedingFileExpirationAt,
      proceedingFileActive: this.employeeProceedingFile.proceedingFile?.proceedingFileActive,
      proceedingFileTypeId: this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId,
      proceedingFileObservations: this.employeeProceedingFile.proceedingFile?.proceedingFileObservations,
    } as ProceedingFileInterface
    if (this.proceedingFile.proceedingFileExpirationAt) {
      const expirationAt = DateTime.fromISO(this.proceedingFile.proceedingFileExpirationAt.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.proceedingFile.proceedingFileExpirationAt = expirationAt
      this.expirationAt = this.getDateFormatted(this.proceedingFile.proceedingFileExpirationAt as Date)
    }
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
    await this.getCategoriesEmployee()
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
        const proceedingFileId = employeeProceedingFileResponse._data.data.employeeProceedingFile.proceedingFileId as number
        const processCorrect = await this.onSaveProperties(proceedingFileId)
        if (processCorrect) {
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
        const employeeRecordPropertyResponse = await proceedingFileTypePropertyService.getCategories(this.employee.employeeId, this.employeeProceedingFile.proceedingFile?.proceedingFileTypeId, this.employeeProceedingFile.proceedingFile?.proceedingFileId)
        this.proceedingFileTypePropertyCategories = employeeRecordPropertyResponse._data.data.proceedingFileTypePropertiesCategories
      }
      myGeneralStore.setFullLoader(false)
    },
    async onSaveProperties(proceedingFileId: number) {
      let processCorrect = false
      if (this.employee.employeeId) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const proceedingFileTypePropertyValueService = new ProceedingFileTypePropertyValueService()
        const promises = []

        for (const [category, properties] of Object.entries(this.proceedingFileTypePropertyCategories)) {
          for (const item of properties as any[]) {
            for (const value of item.values as any[]) {
              const file = value.files.length > 0 ? value.files[0] : null
              if (value.proceedingFileTypePropertyValueId || value.proceedingFileTypePropertyValueValue || file) {
                const proceedingFileTypePropertyValue: ProceedingFileTypePropertyValueInterface = {
                  proceedingFileTypePropertyValueId: value.proceedingFileTypePropertyValueId,
                  proceedingFileTypePropertyId: item.proceedingFileTypePropertyId,
                  employeeId: this.employee.employeeId,
                  proceedingFileId: proceedingFileId,
                  proceedingFileTypePropertyValueValue: value.proceedingFileTypePropertyValueValue ? value.proceedingFileTypePropertyValueValue : null,
                  proceedingFileTypePropertyValueActive: 1
                }
                const request = !value.proceedingFileTypePropertyValueId
                  ? proceedingFileTypePropertyValueService.store(proceedingFileTypePropertyValue, file)
                  : proceedingFileTypePropertyValueService.update(proceedingFileTypePropertyValue, file)

                promises.push(
                  request
                    .then((response) => {
                      if (response.status === 201 || response.status === 200) {
                        return {
                          success: true,
                          message: `Proceeding file type property value ${proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId ? 'updated' : 'created'}`,
                        }
                      } else {
                        const msgError = response._data.error ? response._data.error : response._data.message;
                        return {
                          success: false,
                          message: `Proceeding file type property value ${proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId ? 'updated' : 'created'}`,
                          error: msgError
                        }
                      }
                    })
                    .catch((error) => {
                      return {
                        success: false,
                        message: `Proceeding file type property value ${proceedingFileTypePropertyValue.proceedingFileTypePropertyValueId ? 'updated' : 'created'}`,
                        error: error.message || 'Unknown error'
                      }
                    })
                )
              }
            }
          }
        }
        try {
          const results = await Promise.all(promises)
          const errors = results.filter((result) => !result.success);
          if (errors.length > 0) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error saving proceeding file type property value',
              detail: errors.map((e) => e.error).join(', '),
              life: 5000,
            })
          } else {
            processCorrect = true
          }
        } catch (error: any) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error saving proceeding file type property values',
            detail: error.message || 'There was a problem processing the proceeding file type property values.',
            life: 5000,
          })
        }
        myGeneralStore.setFullLoader(false)
        await this.getCategoriesEmployee()
      }
      return processCorrect
    }
  }
})