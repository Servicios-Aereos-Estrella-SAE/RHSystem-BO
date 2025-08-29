import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { DateTime } from 'luxon';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface';
import ShiftExceptionEvidenceService from '~/resources/scripts/services/ShiftExceptionEvidenceService';
import type { ShiftExceptionEvidenceInterface } from '~/resources/scripts/interfaces/ShiftExceptionEvidenceInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'shiftExceptionForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canManageUserResponsible: { type: Boolean, required: true },
    canManageToPreviousDays: { type: Boolean, required: true },
  },
  data: () => ({
    exceptionTypeList: [] as ExceptionTypeInterface[],
    submitted: false,
    currentShiftException: null as ShiftExceptionInterface | null,
    isNewShiftException: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
    hasCompletedYear: false,
    minDate: DateTime.fromISO('2000-10-10').toJSDate(),
    needCheckInTime: false,
    needCheckOutTime: false,
    needReason: false,
    needEnjoymentOfSalary: false,
    needPeriodDays: false,
    needPeriodHours: false,
    needTimeByTime: false,
    formattedShiftExceptionInTime: '' as string | null,
    formattedShiftExceptionOutTime: '' as string | null,
    applyToMoreThanOneDay: false,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>,
    isDisabilityLeave: false,
    options: [
      { label: 'Yes', value: 1 },
      { label: 'No', value: 0 },
    ],
    activeSwichtTimeByTime: false,
    files: [] as Array<any>,
    shiftExceptionEvidences: [] as Array<ShiftExceptionEvidenceInterface>,
    shiftExceptionEvidence: null as ShiftExceptionEvidenceInterface | null,
    drawerShiftExceptionEvidenceDelete: false,
    localeToUse: 'en',
  }),
  computed: {
    selectedExceptionDate() {
      const day = DateTime.fromJSDate(this.date).setZone('UTC-6').setLocale(this.localeToUse).toFormat('DDDD')
      return day
    },
    getOptions() {
      return [
        { label: this.$t('yes'), value: 1 },
        { label: this.$t('no'), value: 0 }
      ];
    }
  },
  watch: {
    // Convierte automáticamente el objeto Date a una cadena de hora cuando cambia
    "shiftException.shiftExceptionCheckInTime"(newValue) {
      this.formattedShiftExceptionInTime = newValue
        ? DateTime.fromJSDate(newValue).toFormat("HH:mm")
        : null
    },
    "shiftException.shiftExceptionCheckOutTime"(newValue) {
      this.formattedShiftExceptionOutTime = newValue
        ? DateTime.fromJSDate(newValue).toFormat("HH:mm")
        : null
    },
    "applyToMoreThanOneDay"() {
      this.shiftException.daysToApply = 0
    },
    /*  "activeSwichtTimeByTime"(val) {
       if (val) {
         this.shiftException.shiftExceptionEnjoymentOfSalary = 0
       } else {
         this.shiftException.shiftExceptionEnjoymentOfSalary = null
       }
 
     } */
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewShiftException = !this.shiftException.shiftExceptionId ? true : false
    if (this.shiftException.shiftExceptionId) {
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await shiftExceptionService.show(this.shiftException.shiftExceptionId)

      if (shiftExceptionResponse.status === 200) {
        this.currentShiftException = shiftExceptionResponse._data.data.shiftException
      }
      const shiftExceptionEvidenceResponse = await shiftExceptionService.getEvidences(this.shiftException.shiftExceptionId)

      if (shiftExceptionEvidenceResponse.status === 200) {
        this.shiftExceptionEvidences = shiftExceptionEvidenceResponse._data.data.data
      }
      if (this.currentShiftException && this.currentShiftException.shiftExceptionsDate) {
        this.currentDate = `${this.currentShiftException.shiftExceptionsDate}`
        const newDate = DateTime.fromISO(this.currentShiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('UTC-6').toFormat('yyyy-MM-dd HH:mm:ss')
        this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
      }
      let isActive: number = 1
      isActive = this.shiftException.shiftExceptionTimeByTime ? this.shiftException.shiftExceptionTimeByTime : 0
      this.activeSwichtTimeByTime = isActive === 1 ? true : false
    } else {
      this.shiftException.shiftExceptionsDate = this.date
      this.currentDate = DateTime.fromJSDate(this.date).setZone('UTC-6').toISO()
      this.shiftException.shiftExceptionEnjoymentOfSalary = null
    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    let systemModuleSlug = firstSegment
    if (systemModuleSlug.toString().includes('employees-attendance-monitor')) {
      systemModuleSlug = 'employees'
    }
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    const exceptionType = hasAccess || this.employee.employeeTypeOfContract === 'External' ? '' : 'rest-day'
    this.exceptionTypeList = await this.getExceptionTypes(exceptionType, true)
    const existRestDayIndex = this.exceptionTypeList.findIndex(a => a.exceptionTypeSlug === 'falta-por-incapacidad')
    if (existRestDayIndex >= 0) {
      if (this.exceptionTypeList[existRestDayIndex].exceptionTypeId !== this.shiftException.exceptionTypeId) {
        this.exceptionTypeList.splice(existRestDayIndex, 1)
      }
    }
    if (this.shiftException.shiftExceptionId) {
      let existCurrentExceptionType = this.exceptionTypeList.find(a => a.exceptionTypeId === this.shiftException.exceptionTypeId)
      if (!existCurrentExceptionType) {
        const exceptionTypeList = await this.getExceptionTypes(exceptionType, false)
        existCurrentExceptionType = exceptionTypeList.find(a => a.exceptionTypeId === this.shiftException.exceptionTypeId)
        if (existCurrentExceptionType) {
          this.exceptionTypeList.push(existCurrentExceptionType)
        }
      }
    }


    let isVacation = false
    const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.shiftException.exceptionTypeId)

    if (index >= 0) {
      if (this.exceptionTypeList[index].exceptionTypeSlug === 'vacation') {
        isVacation = true
      }
    }

    this.setMinDate(isVacation)
    myGeneralStore.setFullLoader(false)
    this.isReady = true
    if (this.shiftException.shiftExceptionId) {
      this.handleTypeChange()
    }
  },
  methods: {
    isOptionDisabled(option: any) {
      return option.exceptionTypeActive !== 1
    },
    async getExceptionTypes(search: string, onlyActive: boolean) {
      const response = await new ExceptionTypeService().getFilteredList(search, 1, 100, onlyActive)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      return list.filter(item => item.exceptionTypeSlug !== 'vacation')
    },
    async onSave() {
      this.submitted = true
      const shiftExceptionService = new ShiftExceptionService()

      if (!shiftExceptionService.validateInfo(this.shiftException)) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (this.needReason && !this.shiftException.shiftExceptionsDescription) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if ((this.needCheckInTime || this.needPeriodHours) && !this.shiftException.shiftExceptionCheckInTime) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if ((this.needCheckOutTime || this.needPeriodHours) && !this.shiftException.shiftExceptionCheckOutTime) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (this.needEnjoymentOfSalary && this.shiftException.shiftExceptionEnjoymentOfSalary === null) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }

      if (this.applyToMoreThanOneDay && !this.shiftException.daysToApply) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('missing_data'),
          life: 5000,
        })
        return
      }



      const shiftExceptionCheckInTimeTemp = this.shiftException.shiftExceptionCheckInTime
      const shiftExceptionCheckOutTimeTemp = this.shiftException.shiftExceptionCheckOutTime

      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let shiftExceptionResponse = null
      const shiftExceptionDateTemp = this.shiftException.shiftExceptionsDate

      if (!this.dateWasChange) {
        this.shiftException.shiftExceptionsDate = this.currentDate
      }
      if (this.formattedShiftExceptionInTime) {
        this.shiftException.shiftExceptionCheckInTime = this.formattedShiftExceptionInTime
      }
      if (this.formattedShiftExceptionOutTime) {
        this.shiftException.shiftExceptionCheckOutTime = this.formattedShiftExceptionOutTime
      }
      if (!this.needCheckInTime && !this.needPeriodHours) {
        this.shiftException.shiftExceptionCheckInTime = null
      }
      if (!this.needCheckOutTime && !this.needPeriodHours) {
        this.shiftException.shiftExceptionCheckOutTime = null
      }
      if (!this.needEnjoymentOfSalary) {
        this.shiftException.shiftExceptionEnjoymentOfSalary = null
      }
      if (!this.needTimeByTime) {
        this.shiftException.shiftExceptionTimeByTime = null
        this.activeSwichtTimeByTime = false
      } else {
        this.shiftException.shiftExceptionTimeByTime = this.activeSwichtTimeByTime ? 1 : 0
      }
      if (!this.needPeriodDays) {
        this.shiftException.daysToApply = 0
      }
      let isNew = false
      if (!this.shiftException.shiftExceptionId) {
        isNew = true
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }
      let wasSavedCorrectly = false
      let shiftExceptionsSaved = [] as Array<ShiftExceptionInterface>
      this.shiftExceptionsError = []
      if (isNew) {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          wasSavedCorrectly = true
          shiftExceptionsSaved = shiftExceptionResponse._data.data.shiftExceptionsSaved

          if (shiftExceptionResponse._data.data.shiftExceptionsError) {
            this.shiftExceptionsError = shiftExceptionResponse._data.data.shiftExceptionsError
          }
          this.$emit('onShiftExceptionSaveAll', shiftExceptionResponse._data.data.shiftExceptionsSaved as Array<ShiftExceptionInterface>, this.shiftExceptionsError as Array<ShiftExceptionErrorInterface>)
        } else {
          const msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
        }
      } else {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          wasSavedCorrectly = true

          shiftExceptionsSaved.push(shiftExceptionResponse._data.data.shiftException)
          shiftExceptionResponse = await shiftExceptionService.show(shiftExceptionResponse._data.data.shiftException.shiftExceptionId)

          if (shiftExceptionResponse.status === 200) {
            const shiftException = shiftExceptionResponse._data.data.shiftException
            this.$emit('onShiftExceptionSave', shiftException as ShiftExceptionInterface)
          }
        } else {
          const msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
        }
      }
      if (wasSavedCorrectly) {
        const allPromises: Promise<any>[] = []

        for (const shiftException of shiftExceptionsSaved) {
          const shiftExceptionEvidenceService = new ShiftExceptionEvidenceService()

          for (const file of this.files) {
            const shiftExceptionEvidence = {
              shiftExceptionId: shiftException.shiftExceptionId,
            } as ShiftExceptionEvidenceInterface
            const promise = shiftExceptionEvidenceService.store(shiftExceptionEvidence, file)
            allPromises.push(promise)
          }
        }

        const results = await Promise.allSettled(allPromises)

        for (const result of results) {
          if (!(result.status === 'fulfilled' && (result.value.status === 201 || result.value.status === 200))) {
            const err = result.status === 'rejected' ? result.reason : result.value;
            const msgError = err._data?.message || 'Upload failed';
            const severityType = err.status === 500 ? 'error' : 'warn';

            this.$toast.add({
              severity: severityType,
              summary: 'Some evidence files failed',
              detail: msgError,
              life: 5000,
            });
          }
        }
      }

      this.shiftException.shiftExceptionCheckInTime = shiftExceptionCheckInTimeTemp
      this.shiftException.shiftExceptionCheckOutTime = shiftExceptionCheckOutTimeTemp
      this.shiftException.shiftExceptionsDate = shiftExceptionDateTemp
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    },
    handleTypeChange() {
      if (this.isReady) {
        this.needCheckInTime = false
        this.needCheckOutTime = false
        this.needReason = false
        this.needEnjoymentOfSalary = false
        this.needPeriodDays = false
        this.needPeriodHours = false
        this.needTimeByTime = false
        this.isDisabilityLeave = false
        let isVacation = false
        const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.shiftException.exceptionTypeId)
        if (index >= 0) {
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckInTime) {
            this.needCheckInTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckOutTime) {
            this.needCheckOutTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedReason) {
            this.needReason = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedEnjoymentOfSalary) {
            this.needEnjoymentOfSalary = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedPeriodInDays) {
            this.needPeriodDays = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedPeriodInHours) {
            this.needPeriodHours = true
          }
          if (this.exceptionTypeList[index].exceptionTypeSlug === 'vacation') {
            isVacation = true
            if (this.employee.employeeHireDate && this.shiftException.shiftExceptionsDate) {
              const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
              const dateOrigin = new Date(this.shiftException.shiftExceptionsDate.toString())
              const dateNew = DateTime.fromJSDate(dateOrigin)
              const dateFormated = dateNew.toFormat('yyyy-MM-dd')
              const dateSelected = DateTime.fromISO(dateFormated)
              if (dateSelected < dateFirstYear) {
                this.shiftException.shiftExceptionsDate = null
                this.$toast.add({
                  severity: 'warn',
                  summary: 'Date invalid',
                  detail: `When on vacation, the selected date cannot be earlier than ${dateNew.toFormat('DD')}`,
                  life: 5000,
                })
              }
            }
          } else if (this.exceptionTypeList[index].exceptionTypeSlug !== 'falta-por-incapacidad' && (this.exceptionTypeList[index].exceptionTypeSlug === 'late-arrival' || this.exceptionTypeList[index].exceptionTypeSlug === 'early-departure' || this.exceptionTypeList[index].exceptionTypeSlug === 'leaving-during-work-hours')) {
            this.needTimeByTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeSlug === 'falta-por-incapacidad') {
            this.isDisabilityLeave = true
            this.activeSwichtTimeByTime = false
          }
        }
        if (this.needPeriodDays) {
          this.applyToMoreThanOneDay = false
          this.shiftException.daysToApply = 0
        }

        this.setMinDate(isVacation)
      }
    },
    setMinDate(isVacation: boolean) {
      this.minDate = DateTime.fromISO('2000-10-10').toJSDate()
      if (this.employee.employeeHireDate && isVacation) {
        const now = DateTime.now();
        this.hasCompletedYear = now.diff(DateTime.fromISO(this.employee.employeeHireDate.toString()), 'years').years >= 1
        const dateFirstYear = DateTime.fromISO(this.employee.employeeHireDate.toString()).plus({ years: 1 })
        if (dateFirstYear) {
          const dateMin = dateFirstYear.toISODate() ? dateFirstYear.toISODate() : ''
          this.minDate = DateTime.fromISO(dateMin ? dateMin : '').toJSDate()
        }
      }
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    getFileName(url: string) {
      if (!url) return 'Unknown file'
      try {
        let lastPart = url.split('/').pop() || ''
        lastPart = lastPart.split('?')[0].split('#')[0]
        const decoded = decodeURIComponent(lastPart)

        return decoded.length > 40
          ? '...' + decoded.slice(-40)
          : decoded
      } catch {
        return 'Unknown File'
      }
    },
    isImage(url?: string): boolean {
      if (!url) return false
      return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(url)
    },
    deleteEvidence(shiftExceptionEvidence: ShiftExceptionEvidenceInterface) {
      this.shiftExceptionEvidence = { ...shiftExceptionEvidence }
      this.drawerShiftExceptionEvidenceDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.shiftExceptionEvidence) {
        this.drawerShiftExceptionEvidenceDelete = false
        const shiftExceptionEvidenceService = new ShiftExceptionEvidenceService()
        const employeeShiftExceptionEvidenceResponse = await shiftExceptionEvidenceService.delete(this.shiftExceptionEvidence)
        if (employeeShiftExceptionEvidenceResponse.status === 200) {
          const index = this.shiftExceptionEvidences.findIndex((shiftExceptionEvidence: ShiftExceptionEvidenceInterface) => shiftExceptionEvidence.shiftExceptionEvidenceId === this.shiftExceptionEvidence?.shiftExceptionEvidenceId)
          if (index !== -1) {
            this.shiftExceptionEvidences.splice(index, 1)
            this.$forceUpdate()
          }
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete evidence employee',
            detail: employeeShiftExceptionEvidenceResponse._data.message,
            life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    capitalizeFirstLetter(text: string) {
      if (!text) return ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  }
})
