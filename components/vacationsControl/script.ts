import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
  },
  name: 'vacationsControl',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    clickOnDelete: { type: Function, default: null },
    canManageVacation: { type: Boolean, required: true },
    indexCard: { type: Number, required: true },
    isDeleted: { type: Boolean, required: true },
    vacationPeriodAvailableDays: { type: Number, required: true },
    canManageException: { type: Boolean, required: true },
  },
  data: () => ({
    shiftExceptionsDate: '',
    displayForm: false as boolean,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>,
    applyToMoreThanOneDay: false,
    submitted: false,
    canManageToPreviousDays: false,
    currentDate: null as string | null | DateTime | Date,
    sessionUser: null as UserInterface | null
  }),
  watch: {
    'shiftException.shiftExceptionsDate'(val: Date) {
      this.shiftExceptionsDate = this.getDateFormatted(val)
    },
    "applyToMoreThanOneDay"() {
      this.shiftException.daysToApply = 0
    }
  },
  computed: {
    displayEditVacationDayButton () {
      if (!this.sessionUser) {
        return false
      }

      if ((this.sessionUser.person?.employee?.employeeId === this.employee.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (!(!this.canManageVacation || this.isDeleted || (this.shiftException.shiftExceptionId && !this.canManageToPreviousDays) || !this.canManageException)) {
        return true
      }

      return false
    },
    displayDestroyVacationDayButton () {
      if (!this.sessionUser) {
        return false
      }

      if ((this.sessionUser.person?.employee?.employeeId === this.employee.employeeId) && this.sessionUser.role?.roleSlug !== 'admin' && this.sessionUser.role?.roleSlug !== 'root') {
        return false
      }

      if (!(!this.canManageVacation || this.isDeleted || (this.shiftException.shiftExceptionId && !this.canManageToPreviousDays) || !this.canManageException)) {
        return true
      }

      return false
    }
  },
  async mounted() {
    await this.setSessionUser()

    if (this.shiftException.shiftExceptionsDate) {
      const dateTemp = this.shiftException.shiftExceptionsDate.toString()
      const shiftExceptionsDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { zone: 'utc' })
      const currentDate = DateTime.fromISO(dateTemp, { zone: 'utc' })
        .setZone('America/Mexico_City', { keepLocalTime: true })
        .toJSDate()
      this.shiftException.shiftExceptionsDate = currentDate
      this.shiftExceptionsDate = shiftExceptionsDate.setLocale('en').toFormat('DDD')
    }
    if (!this.shiftException.shiftExceptionId) {
      this.displayForm = true
    }
    this.verifyPermissionManagePreviousDays()
  },
  methods: {
    async setSessionUser () {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      const authUser = session as UserInterface
      this.sessionUser = authUser
    },
    verifyPermissionManagePreviousDays() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.canManageToPreviousDays = false
      if (myGeneralStore.isRoot || myGeneralStore.isAdmin) {
        this.canManageToPreviousDays = true
      } else {
        if (myGeneralStore.isRh) {
          this.canManageToPreviousDays = true
        } else {
          if (this.shiftException.shiftExceptionsDate) {
            if (this.isDateGreaterOrEqualToToday(this.shiftException.shiftExceptionsDate.toString())) {
              this.canManageToPreviousDays = true
            }
          }
        }
        if (myGeneralStore.isRh) {
          if (this.isDateAfterOrEqualToFirstDayPeriod()) {
            this.canManageToPreviousDays = true
          } else {
            this.canManageToPreviousDays = false
          }
        }
      }
      myGeneralStore.setFullLoader(false)
    },
    getNextPayThursday() {
      const today = DateTime.now(); // Fecha actual
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      return nextPayDate.toJSDate()
    },
    isDateAfterOrEqualToFirstDayPeriod() {
      const datePay = this.getNextPayThursday()
      const monthPerdiod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))
      let start
      const date = DateTime.local(yearPeriod, monthPerdiod, dayPeriod)
      const startOfWeek = date.startOf('week')
      let thursday = startOfWeek.plus({ days: 3 })
      start = thursday.minus({ days: 24 })
      let currentDay = start
      currentDay = currentDay.minus({ days: 1 })
      if (this.shiftException.shiftExceptionsDate) {
        return this.shiftException.shiftExceptionsDate >= currentDay
      } else {
        return false
      }

    },
    isDateGreaterOrEqualToToday(dateString: string) {
      const inputDate = new Date(dateString)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return inputDate >= today
    },
    getDateFormatted(date: Date) {
      if (!date) {
        return ''
      }
      return DateTime.fromJSDate(date, { zone: 'utc' })
        //.setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerClickOnDelete() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    async handlerClickOnSave() {
      this.submitted = true
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
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
      if (this.applyToMoreThanOneDay && !this.shiftException.daysToApply) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      if (this.applyToMoreThanOneDay && this.shiftException.daysToApply) {
        if (this.applyToMoreThanOneDay && this.shiftException.daysToApply > this.vacationPeriodAvailableDays) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: `The number of days cannot be greater than the available days ${this.vacationPeriodAvailableDays}`,
            life: 5000,
          })
          return
        }
      }
      await this.verifyPermissionManagePreviousDays()
      if (!this.canManageToPreviousDays) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: `The date: ${this.shiftExceptionsDate} is in the past and you do not have permission to save it `,
          life: 5000,
        })
        return
      }
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let shiftExceptionResponse = null
      const shiftExceptionDateTemp = this.shiftException.shiftExceptionsDate

      let isNew = false
      if (!this.shiftException.shiftExceptionId) {
        isNew = true
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }
      if (isNew) {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          if (shiftExceptionResponse._data.data.shiftExceptionsError) {
            this.shiftExceptionsError = shiftExceptionResponse._data.data.shiftExceptionsError
          }
          this.$emit('onShiftExceptionSaveAll', this.shiftExceptionsError as Array<ShiftExceptionErrorInterface>, this.indexCard)
          this.displayForm = false
          //}
        } else {
          let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
        }
      } else {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          shiftExceptionResponse = await shiftExceptionService.show(shiftExceptionResponse._data.data.shiftException.shiftExceptionId)
          if (shiftExceptionResponse.status === 200) {
            const shiftException = shiftExceptionResponse._data.data.shiftException
            this.$emit('onShiftExceptionSave', shiftException as ShiftExceptionInterface, this.indexCard)
            this.displayForm = false
          }
        } else {
          let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
        }
      }


      this.shiftException.shiftExceptionsDate = shiftExceptionDateTemp

      myGeneralStore.setFullLoader(false)
    },
    onEdit() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      this.currentDate = this.shiftException.shiftExceptionsDate
      this.displayForm = true
    },
    cancelEdit() {
      if (!this.shiftException.shiftExceptionId) {
        this.$emit('onShiftExceptionCancel')
      }
      this.shiftException.shiftExceptionsDate = this.currentDate
      this.canManageToPreviousDays = true
      this.displayForm = false
    }
  }
})
