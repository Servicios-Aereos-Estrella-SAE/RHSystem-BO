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
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import VacationAuthorizationService from '~/resources/scripts/services/VacationAuthorizationService'
import type { VacationAuthorizationInterface } from '~/resources/scripts/interfaces/VacationAuthorizationInterface'

export default defineComponent({
  components: {
  },
  name: 'employeeVacationsControl',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    vacationPeriod: { type: Object as PropType<VacationPeriodInterface>, required: true },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canManageVacation: { type: Boolean, required: true },
    canManageException: { type: Boolean, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
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
    sessionUser: null as UserInterface | null,
    restrictFutureVacations: false,
    startDateLimit: DateTime.local(1999, 12, 29).toJSDate(),
    localeToUse: 'en',
    // Nuevas propiedades para el sistema de autorización
    showVacationRequestForm: false,
    showAuthorizationDialog: false,
    pendingRequests: [] as VacationAuthorizationInterface[],
    pendingRequestsCount: 0,
    vacationAuthorizationService: null as VacationAuthorizationService | null
  }),
  computed: {
    displayAddButton() {
      if (!this.sessionUser) {
        return false
      }

      if ((this.sessionUser?.person?.employee?.employeeId === this.employee.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (this.canManageVacation && !this.isDeleted && this.canManageException) {
        return true
      }

      return false
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    await this.setSessionUser()
    this.isReady = false
    this.currentVacationPeriod = this.vacationPeriod
    await this.getVacations()
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    const systemSettingService = new SystemSettingService()
    const systemSettingResponse = await systemSettingService.getActive()

    if (systemSettingResponse) {

      let isRestrictFutureVacationActive: number = 0;
      isRestrictFutureVacationActive = systemSettingResponse.systemSettingRestrictFutureVacation
        ? systemSettingResponse.systemSettingRestrictFutureVacation
        : 0;
      this.restrictFutureVacations = isRestrictFutureVacationActive === 1 ? true : false
    }
    this.getStartPeriodDay()

    // Inicializar servicio de autorización de vacaciones
    this.vacationAuthorizationService = new VacationAuthorizationService()
    await this.loadPendingRequests()

    this.isReady = true
  },
  methods: {
    getStartPeriodDay() {
      const myGeneralStore = useMyGeneralStore()
      if (myGeneralStore.isRoot) {
        this.startDateLimit = DateTime.local(1999, 12, 29).toJSDate()
      } else {
        const { data } = useAuth()

        const authUser = data.value as unknown as UserInterface
        if (authUser.role) {
          if (authUser.role.roleManagementDays) {
            this.startDateLimit = DateTime.now().minus({ days: authUser.role.roleManagementDays }).toJSDate()
          } else {
            this.startDateLimit = DateTime.local(1999, 12, 29).toJSDate()
          }
        }
      }
    },
    async setSessionUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.sessionUser = authUser
    },
    async getVacations() {
      this.shiftExceptions = []
      if (this.employee.employeeId && this.currentVacationPeriod) {
        const employeeService = new EmployeeService()
        const employeeResponse = await employeeService.getVacationsByPeriod(this.employee.employeeId, this.currentVacationPeriod.vacationSettingId)
        if (employeeResponse.status === 200) {
          this.shiftExceptions = employeeResponse._data.data.vacations
        }
      }

    },
    async addNewVacation() {
      const myGeneralStore = useMyGeneralStore()
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('validation_data'),
          detail: this.t('you_do_not_have_permission_to_manage_vacations'),
          life: 5000,
        })
        return
      }

      if (!myGeneralStore.isRoot && this.restrictFutureVacations) {
        if (this.vacationPeriod.vacationPreviousAvailableDays > 0) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('you_cannot_add_vacation_in_this_period_because_there_is_still_available_vacation_in_previous_periods'),
            life: 5000,
          })
          return
        }
      }

      if (this.currentVacationPeriod) {
        const availableDays = this.currentVacationPeriod.vacationPeriodAvailableDays - this.countsNewVacation
        if (availableDays <= 0) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('there_are_no_more_days_available'),
            life: 5000,
          })
          return
        }
        for await (const shiftException of this.shiftExceptions) {
          if (!shiftException.shiftExceptionId) {
            this.$toast.add({
              severity: 'warn',
              summary: this.t('validation_data'),
              detail: this.t('cannot_add_another_save_first'),
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
            summary: this.t('validation_data'),
            detail: this.t('exception_type_vacation_not_found'),
            life: 5000,
          })
          return
        }
        const newVacation: ShiftExceptionInterface = {
          shiftExceptionId: null,
          exceptionTypeId: exceptionTypeId,
          vacationSettingId: this.currentVacationPeriod.vacationSettingId,
          employeeId: this.employee.employeeId,
          shiftExceptionsDescription: 'vacation',
          shiftExceptionsDate: DateTime.fromJSDate(new Date).toFormat('yyyy-MM-dd'),
          shiftExceptionCheckInTime: null,
          shiftExceptionCheckOutTime: null,
          daysToApply: 0,
          shiftExceptionEnjoymentOfSalary: null,
          shiftExceptionTimeByTime: null
        }
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
          .setZone('UTC-6')
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
              summary: this.t('delete_vacation'),
              detail: aircraftProceedingFileResponse._data.message,
              life: 5000,
            })
            this.$emit('save', [])
          } else {
            this.$toast.add({
              severity: 'error',
              summary: this.t('delete_vacation'),
              detail: aircraftProceedingFileResponse._data.message,
              life: 5000,
            })
          }
        } else {
          wasDeleteSuccessfully = true
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_vacation'),
            detail: this.t('vacation_was_deleted_successfully'),
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
          .setZone('UTC-6')
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
      //if (shiftExceptionsError.length > 0) {
      this.$emit('save', shiftExceptionsError)
      //}
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
        .setZone('UTC-6')
        .setLocale('en')
        .toFormat('DDD')
    },

    // Nuevos métodos para el sistema de autorización de vacaciones
    async loadPendingRequests() {
      if (!this.vacationAuthorizationService) {
        console.log('VacationAuthorizationService not initialized')
        return
      }

      try {
        console.log('Loading pending requests for employee:', this.employee.employeeId)
        const response = await this.vacationAuthorizationService.getPendingVacationRequests(this.employee.employeeId!)
        console.log('Pending requests response:', response)

        if (response.status === 200) {
          this.pendingRequests = response.data || []
          this.pendingRequestsCount = this.pendingRequests.length
          console.log('Pending requests loaded:', this.pendingRequests.length, 'requests')
        } else {
          console.log('Response status not 200:', response.status)
        }
      } catch (error) {
        console.error('Error loading pending requests:', error)
        this.pendingRequests = []
        this.pendingRequestsCount = 0
      }
    },

    toggleVacationRequestForm() {
      this.showVacationRequestForm = !this.showVacationRequestForm
    },

    toggleAuthorizationForm() {
      this.showAuthorizationDialog = !this.showAuthorizationDialog
    },

    onVacationRequestCreated(exceptionRequest: ExceptionRequestInterface) {
      this.$toast.add({
        severity: 'success',
        summary: this.t('request_created'),
        detail: this.t('vacation_request_created_successfully'),
        life: 5000,
      })

      this.showVacationRequestForm = false
      this.loadPendingRequests() // Recargar solicitudes pendientes
    },

    onVacationRequestError(error: any) {
      this.$toast.add({
        severity: 'error',
        summary: this.t('error'),
        detail: this.t('failed_to_create_vacation_request'),
        life: 5000,
      })
    },

    onVacationAuthorized(response: any) {
      this.$toast.add({
        severity: 'success',
        summary: this.t('authorization_successful'),
        detail: this.t('vacation_requests_authorized_successfully'),
        life: 5000,
      })

      this.showAuthorizationDialog = false
      this.loadPendingRequests() // Recargar solicitudes pendientes
      this.getVacations() // Recargar vacaciones autorizadas
    },

    onVacationAuthorizationError(error: any) {
      this.$toast.add({
        severity: 'error',
        summary: this.t('authorization_failed'),
        detail: this.t('an_error_occurred_while_authorizing'),
        life: 5000,
      })
    }
  }
})
