import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { useMyGeneralStore } from '~/store/general'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeVacationsControl',
  props: {
    vacationPeriod: { type: Object as PropType<VacationPeriodInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canManageVacation: { type: Boolean, required: true }
  },
  data: () => ({
    shiftExceptions: [] as Array<ShiftExceptionInterface>,
    isReady: false as boolean,
    date: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toJSDate(),
    dateF: DateTime.now().setLocale('en').setZone(DateTime.now().zoneName).toFormat('DDDD'),
    displayForm: false as boolean,
    shiftException: null as ShiftExceptionInterface | null,
    drawerShiftExceptionDelete: false,
    shiftExceptionsDate: '',
    currentIndex: -1,
    currentVacationPeriod: null as VacationPeriodInterface | null,
    countsNewVacation: 0,
    isDeleted: false,
    applyToMoreThanOneDay: false,
    daysToApply: 0,
  }),
  computed: {
  },
  watch: {
    "applyToMoreThanOneDay"() {
      this.daysToApply = 0
     }
  },
  async mounted() {
    this.isReady = false
    this.currentVacationPeriod = this.vacationPeriod
    await this.getVacations()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.isReady = true
  },
  methods: {
    async getVacations() {
      this.shiftExceptions = []
      if (this.employee.employeeId &&  this.currentVacationPeriod) {
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getVacationsByPeriod(this.employee.employeeId, this.currentVacationPeriod.vacationSettingId)
        if (employeeResponse.status === 200) {
          this.shiftExceptions = employeeResponse._data.data.vacations
        }
      }
     
    },
    async addNewVacation() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      if (this.currentVacationPeriod) {
        const availableDays = this.currentVacationPeriod.vacationPeriodAvailableDays - this.countsNewVacation
        if (availableDays <= 0) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'There are no more days available',
            life: 5000,
          })
          return
        }
        for await (const shiftException of this.shiftExceptions) {
          if (!shiftException.shiftExceptionId) {
            this.$toast.add({
              severity: 'warn',
              summary: 'Validation data',
              detail: 'Cannot add another. Save first.',
              life: 5000,
            })
            return
          }
        }
        const exceptionTypeService = new ExceptionTypeService()
        const exceptionTypeResponse = await exceptionTypeService.getFilteredList('vacation')
        let exceptionTypeId = null
        if (exceptionTypeResponse.status === 200) {
          const exceptionTypes = exceptionTypeResponse._data.data.exceptionTypes.data as Array<ExceptionTypeInterface>
          if (exceptionTypes.length > 0) {
            exceptionTypeId = exceptionTypes[0].exceptionTypeId
          }
        }
        if (!exceptionTypeId) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'Exception type vacation not found',
            life: 5000,
          })
          return
        }
        const newVacation = {
          shiftExceptionId: null,
          exceptionTypeId: exceptionTypeId,
          vacationSettingId: this.currentVacationPeriod.vacationSettingId,
          employeeId: this.employee.employeeId,
          shiftExceptionsDescription: 'vacation',
          shiftExceptionsDate: DateTime.fromJSDate(new Date).toFormat('yyyy-MM-dd'),
          shiftExceptionCheckInTime: null,
          shiftExceptionCheckOutTime: null,
          daysToApply: 0,
        } as ShiftExceptionInterface
        this.countsNewVacation += 1
        this.shiftExceptions.push(newVacation)
      }
    },
    onDelete(shiftException: ShiftExceptionInterface, currentIndex: number) {
      this.currentIndex = currentIndex
      this.shiftException = { ...shiftException }
      this.shiftExceptionsDate = ''
      if (this.shiftException && this.shiftException.shiftExceptionsDate) {
        this.shiftExceptionsDate = DateTime.fromJSDate(new Date(this.shiftException.shiftExceptionsDate.toString()))
          .setZone('America/Mexico_City')
          .setLocale('en')
          .toFormat('DDD')
      }
      this.drawerShiftExceptionDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let wasDeleteSuccessfully = false
      if (this.shiftException) {
        this.drawerShiftExceptionDelete = false
        if (this.shiftException.shiftExceptionId) {
          const aircraftProceedingFileService = new ShiftExceptionService()
          const aircraftProceedingFileResponse = await aircraftProceedingFileService.delete(this.shiftException)
          if (aircraftProceedingFileResponse.status === 200) {
            wasDeleteSuccessfully = true
            this.$toast.add({
              severity: 'success',
              summary: 'Delete vacation',
              detail: aircraftProceedingFileResponse._data.message,
              life: 5000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Delete vacation',
              detail: aircraftProceedingFileResponse._data.message,
              life: 5000,
            })
          }
        } else {
          wasDeleteSuccessfully = true
          this.$toast.add({
            severity: 'success',
            summary: 'Delete vacation',
            detail: 'Vacation was deleted successfully',
            life: 5000,
          })
        }
        if (wasDeleteSuccessfully) {
          if (this.currentIndex !== -1) {
            this.shiftExceptions.splice(this.currentIndex, 1)
            this.$forceUpdate()
          }
        }
        this.getCurrentInfo()
        this.currentIndex = -1
      }
      myGeneralStore.setFullLoader(false)
    },
    onSave(shiftException: ShiftExceptionInterface, index: number) {
      if (shiftException.shiftExceptionsDate) {
        const shiftExceptionsDate = DateTime.fromISO(shiftException.shiftExceptionsDate.toString(), { setZone: true })
          .setZone('America/Mexico_City')
          .setLocale('en')
          .toJSDate()
        shiftException.shiftExceptionsDate = shiftExceptionsDate
      }
      this.shiftExceptions[index] = shiftException
      this.getCurrentInfo()
      this.$forceUpdate()
    },
    async onSaveAll(shiftExceptionsError: Array<ShiftExceptionErrorInterface>) {
      await this.getVacations()
      this.getCurrentInfo()
      if (shiftExceptionsError.length > 0) {
        this.$emit('save', shiftExceptionsError)
      }
      this.$forceUpdate()
    },
    onCancel(index: number) {
      if (index !== -1) {
        this.shiftExceptions.splice(index, 1)
        this.countsNewVacation--
        this.$forceUpdate()
      }
    },
    formatDateWithYearDifference(date: string) {
      const originalDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
      const nextYearDate = originalDate.plus({ years: 1 })

      const formattedOriginalDate = originalDate.toFormat('MMMM dd, yyyy')
      const formattedNextYearDate = nextYearDate.toFormat('MMMM dd, yyyy')

      return `${formattedOriginalDate} - ${formattedNextYearDate}`
    },
    async getCurrentInfo() {
      if (this.employee.employeeId && this.employee.employeeHireDate && this.currentVacationPeriod) {
        this.countsNewVacation = 0
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getYearsWorked(this.employee.employeeId, this.currentVacationPeriod.vacationPeriodYear)
        if (employeeResponse.status === 200) {
          const years = employeeResponse._data.data.yearsWorked
          const start = DateTime.fromISO(this.employee.employeeHireDate.toString())
          const month = start.month.toString().padStart(2, '0')
          const day = start.day.toString().padStart(2, '0')
          for await (const year of years) {
            if (year.vacationSetting) {
              const correspondingDays = year.vacationSetting.vacationSettingVacationDays
              const usedDays = year.vacationsUsedList.length
              const availableDays = correspondingDays - usedDays
              const vacationPeriod = {
                vacationPeriodRange: this.formatDateWithYearDifference(`${year.year}-${month}-${day}`),
                vacationSettingId: year.vacationSetting.vacationSettingId,
                vacationPeriodYear: year.year,
                vacationPeriodActiveWorkYears: year.yearsPassed,
                vacationPeriodCorrespondingDays: correspondingDays,
                vacationPeriodUsedDays: usedDays,
                vacationPeriodAvailableDays: availableDays
              } as VacationPeriodInterface
              this.currentVacationPeriod = vacationPeriod
            }
          }
        }
      }
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
  }
})