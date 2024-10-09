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
    minDate:  DateTime.fromISO('2000-10-10').toJSDate()
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewShiftException = !this.shiftException.shiftExceptionId ? true : false

    if (this.shiftException.shiftExceptionId) {
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await  shiftExceptionService.show(this.shiftException.shiftExceptionId)

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
      this.currentDate= DateTime.fromJSDate(this.date).setZone('America/Mexico_City').toISO()
    }

    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    const exceptionType = hasAccess ? '' : 'rest-day'
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

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let shiftExceptionResponse = null
      const shiftExceptionDateTemp = this.shiftException.shiftExceptionsDate

      if (!this.dateWasChange) {
        this.shiftException.shiftExceptionsDate = this.currentDate
      }

      const dateToException = DateTime.fromJSDate(new Date(`${this.shiftException.shiftExceptionsDate}`)).setZone(
        'America/Mexico_City'
      )

      this.shiftException.shiftExceptionsDate = dateToException.toFormat('yyyy-LL-dd')

      if (!this.shiftException.shiftExceptionId) {
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }

      if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
        shiftExceptionResponse = await  shiftExceptionService.show(shiftExceptionResponse._data.data.shiftException.shiftExceptionId)
        if (shiftExceptionResponse.status === 200) {
          const shiftException = shiftExceptionResponse._data.data.shiftException
          this.$emit('onShiftExceptionSave', shiftException as ShiftExceptionInterface)
        }
      } else {
        let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
        if (msgError.length > 0) {
          let newMesageError = ''
          for await (const msg of msgError) {
            newMesageError = `${newMesageError}\n${msg.message}`
          }
          msgError = newMesageError
        }
        const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }

      this.shiftException.shiftExceptionsDate = shiftExceptionDateTemp
      myGeneralStore.setFullLoader(false)
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    },
    handleTypeChange() {
      if (this.isReady) {
        let isVacation = false
        const index = this.exceptionTypeList.findIndex(opt => opt.exceptionTypeId === this.shiftException.exceptionTypeId)
        if (index >= 0) {
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
                  detail: `When on vacation, the selected date cannot be earlier than ${dateNew.toFormat('DD')}` ,
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