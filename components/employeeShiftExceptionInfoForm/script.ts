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

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'shiftExceptionForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    date: { type: Date, required: true },
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    clickOnSave: { type: Function, default: null },
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
    formattedShiftExceptionInTime: '' as string | null,
    formattedShiftExceptionOutTime: '' as string | null,
    applyToMoreThanOneDay: false,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>
  }),
  computed: {
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
    }
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

      if (this.currentShiftException && this.currentShiftException.shiftExceptionsDate) {
        this.currentDate = `${this.currentShiftException.shiftExceptionsDate}`
        const newDate = DateTime.fromISO(this.currentShiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('America/Mexico_City').toFormat('yyyy-MM-dd HH:mm:ss')
        this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
      }

    } else {
      this.shiftException.shiftExceptionsDate = this.date
      this.currentDate = DateTime.fromJSDate(this.date).setZone('America/Mexico_City').toISO()
    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    const exceptionType = hasAccess || this.employee.employeeTypeOfContract === 'External' ? '' : 'rest-day'
    await this.getExceptionTypes(exceptionType)

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
    async getExceptionTypes(search: string) {
      const response = await new ExceptionTypeService().getFilteredList(search, 1, 100)
      const list: ExceptionTypeInterface[] = response.status === 200 ? response._data.data.exceptionTypes.data : []
      this.exceptionTypeList = list.filter(item => item.exceptionTypeSlug !== 'vacation')
    },
    async onSave() {
      this.submitted = true
      const shiftExceptionService = new ShiftExceptionService()

      if (!shiftExceptionService.validateInfo(this.shiftException)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.needCheckInTime && !this.shiftException.shiftExceptionCheckInTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.needCheckOutTime && !this.shiftException.shiftExceptionCheckOutTime) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (this.applyToMoreThanOneDay && !this.shiftException.daysToApply) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
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
      this.shiftException.shiftExceptionCheckInTime = this.formattedShiftExceptionInTime
      this.shiftException.shiftExceptionCheckOutTime = this.formattedShiftExceptionOutTime
      if (!this.needCheckInTime) {
        this.shiftException.shiftExceptionCheckInTime = null
      }
      if (!this.needCheckOutTime) {
        this.shiftException.shiftExceptionCheckOutTime = null
      }
      let isNew = false
      if (!this.shiftException.shiftExceptionId) {
        isNew = true
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }
      this.shiftExceptionsError = []
      if (isNew) {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          if (shiftExceptionResponse._data.data.shiftExceptionsError) {
            this.shiftExceptionsError = shiftExceptionResponse._data.data.shiftExceptionsError
          }
          this.$emit('onShiftExceptionSaveAll', shiftExceptionResponse._data.data.shiftExceptionsSaved as Array<ShiftExceptionInterface>, this.shiftExceptionsError as Array<ShiftExceptionErrorInterface>)
        } else {
          const msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'update' : 'create'}`,
            detail: msgError,
            life: 5000,
          })
        }
      } else {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
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
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'update' : 'create'}`,
            detail: msgError,
            life: 5000,
          })
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
        let isVacation = false
        const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.shiftException.exceptionTypeId)
        if (index >= 0) {
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckInTime) {
            this.needCheckInTime = true
          }
          if (this.exceptionTypeList[index].exceptionTypeNeedCheckOutTime) {
            this.needCheckOutTime = true
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
          }
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
    }
  }
})