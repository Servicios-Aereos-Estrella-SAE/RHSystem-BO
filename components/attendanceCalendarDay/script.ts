import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import Tooltip from 'primevue/tooltip';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import EmployeeShiftChangeService from '~/resources/scripts/services/EmployeeShiftChangeService';
import type { EmployeeShiftChangeInterface } from '~/resources/scripts/interfaces/EmployeeShiftChangeInterface';
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService';
import AssistService from '~/resources/scripts/services/AssistService';

export default defineComponent({
  name: 'attendanceCalendarDay',
  directives: {
    tooltip: Tooltip
  },
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true },
    discriminated: { type: Boolean, required: false },
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    onRefresh: { type: Function, default: null },
    canDeleteCheckAssist: { type: Boolean, default: false, required: true },
    startDateLimit: { type: Date, required: true }
  },
  data: () => ({
    commentsSidebar: false as boolean,
    dayExceptions: [] as ShiftExceptionInterface[],
    employeeShiftChangesList: [] as EmployeeShiftChangeInterface[],
    hasNotes: false,
    showChecksList: false,
    drawerCheckAssistDelete: false as boolean,
    assistId: null as number | null,
    canDeletePreviousAssist: false
  }),
  computed: {
    dateYear() {
      if (!this.checkAssist?.day) {
        return 0
      }

      const year = parseInt(`${this.checkAssist.day.split('-')[0]}`)
      return year
    },
    dateMonth() {
      if (!this.checkAssist?.day) {
        return 0
      }

      const month = parseInt(`${this.checkAssist.day.split('-')[1]}`)
      return month
    },
    dateDay() {
      if (!this.checkAssist?.day) {
        return 0
      }

      const day = parseInt(`${this.checkAssist.day.split('-')[2]}`)
      return day
    },
    weekDayName() {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.setLocale('en').toFormat('cccc')
      return day
    },
    calendarDay() {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.setLocale('en').toFormat('DD')
      return day
    },
    chekInTime() {
      if (!this.checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkIn.assistPunchTimeUtc.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-6')
      return timeCST.setLocale('en').toFormat('TT')
    },
    chekEatInTime() {
      if (!this.checkAssist?.assist?.checkEatIn?.assistPunchTimeUtc) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkEatIn.assistPunchTimeUtc.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-6')
      return timeCST.setLocale('en').toFormat('TT')
    },
    chekEatOutTime() {
      if (!this.checkAssist?.assist?.checkEatOut?.assistPunchTimeUtc) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkEatOut.assistPunchTimeUtc.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-6')
      return timeCST.setLocale('en').toFormat('TT')
    },
    chekOutTime() {
      const now = DateTime.now().setZone('UTC-6')
      const timeToCheckOut = DateTime.fromISO(this.checkAssist.assist.checkOutDateTime.toString(), { setZone: true }).setZone('UTC-6')

      if (timeToCheckOut > now && this.checkAssist.assist.shiftCalculateFlag !== 'doble-12x48') {
        this.checkAssist.assist.checkOutStatus = ''
        return ''
      }

      if (!this.checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkOut.assistPunchTimeUtc.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-6')
      const timeFormatted = timeCST.setLocale('en').toFormat('TT')
      return timeFormatted
    },
    headIconIsException() {
      const valid = this.checkAssist.assist.hasExceptions && !this.checkAssist.assist.isVacationDate && !this.checkAssist.assist.isRestDay
      return valid
    },
    headIconIsBirthday() {
      const valid = this.checkAssist.assist.isBirthday
      return valid
    },
    headIconShiftIsChange() {
      const valid = this.checkAssist.assist.dateShift?.shiftIsChange
      return valid
    },
    headIconIsHoliday() {
      const valid = (this.checkAssist.assist.isHoliday && this.chekInTime)
      return valid
    },
    headIconIsRestDay() {
      const valid = (this.checkAssist.assist.isRestDay && this.chekInTime) ||
        (this.checkAssist.assist.isRestDay && this.checkAssist.assist.checkInStatus === 'working') ||
        (this.checkAssist.assist.isRestDay && this.checkAssist.assist.checkInStatus === 'rest-working-out') ||
        (this.checkAssist.assist.isRestDay && this.checkAssist.assist.isHoliday)
      return valid
    },
    headIconIsVacationDay() {
      const valid = this.checkAssist.assist.isVacationDate && this.chekInTime
      return valid
    },
    calendarIsHoliday() {
      const valid = this.checkAssist.assist.isHoliday
        && this.checkAssist.assist.holiday
        && !this.checkAssist.assist.checkIn
      return valid
    },
    calendarIsVacationDay() {
      const valid = this.checkAssist.assist.isVacationDate && !this.chekInTime && !this.calendarIsHoliday
      return valid
    },
    calendarIsRestDay() {
      const valid = (this.checkAssist.assist.isRestDay && !this.chekInTime && this.checkAssist.assist.checkInStatus !== 'working' && !this.chekInTime && this.checkAssist.assist.checkInStatus !== 'rest-working-out')
        && !this.calendarIsHoliday
        && !this.calendarIsVacationDay
      return valid
    },
    calendarIsNextDay() {
      const valid = this.checkAssist.assist.isFutureDay
        && !this.calendarIsHoliday
        && !this.calendarIsVacationDay
        && !this.calendarIsRestDay
      return valid
    },
    calendarHasnotIncidences() {
      const valid = !this.calendarIsHoliday && !this.calendarIsVacationDay && !this.calendarIsRestDay && !this.calendarIsNextDay
      return valid
    },
    cardIsFuture() {
      const valid = this.calendarIsNextDay && !this.calendarIsVacationDay && !this.calendarIsHoliday && !this.calendarIsRestDay
      return valid
    },
    cardIsRest() {
      const valid = this.calendarIsRestDay && !this.chekInTime && this.checkAssist.assist.checkInStatus !== 'working' && this.checkAssist.assist.checkInStatus !== 'rest-working-out'
      return valid
    }
  },
  async mounted() {
    if (this.checkAssist.assist.dateShift?.shiftIsChange) {
      const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
      const employeeShiftChangeService = new EmployeeShiftChangeService()
      const employeeShiftChangeResponse = await employeeShiftChangeService.getByEmployee(employeeId, this.checkAssist.day)
      this.employeeShiftChangesList = employeeShiftChangeResponse.employeeShiftChanges as Array<EmployeeShiftChangeInterface>
      if (this.employeeShiftChangesList.length > 1) {
        this.employeeShiftChangesList = [this.employeeShiftChangesList[0]]
      }
      if (this.employeeShiftChangesList.length > 0) {
        this.hasNotes = this.employeeShiftChangesList[0].employeeShiftChangeNote ? true : false;
      }
    }
    const workDisabilityPeriodStartDate = DateTime
      .fromISO(this.checkAssist.day)
      .startOf('day')

    const limitDate = DateTime
      .fromJSDate(this.startDateLimit)
      .startOf('day')
    if (workDisabilityPeriodStartDate.toMillis() >= limitDate.toMillis()) {
      this.canDeletePreviousAssist = true
    } else {
      this.canDeletePreviousAssist = false
    }
  },
  methods: {
    async displayExceptionComments(checkAssist: AssistDayInterface) {
      if (checkAssist.assist.hasExceptions || this.hasNotes) {
        const shiftExceptionService = new ShiftExceptionService()
        this.commentsSidebar = true
        this.dayExceptions = checkAssist.assist.exceptions.length > 0 ? checkAssist.assist.exceptions : []
        for await (const shiftException of this.dayExceptions) {
          if (shiftException.shiftExceptionId) {
            const shiftExceptionEvidenceResponse = await shiftExceptionService.getEvidences(shiftException.shiftExceptionId)
            if (shiftExceptionEvidenceResponse.status === 200) {
              shiftException.shiftExceptionEvidences = shiftExceptionEvidenceResponse._data.data.data
            }
          }
        }
      }
    },
    async displayChecks() {
      if (this.checkAssist.assist.assitFlatList.length > 0) {
        this.showChecksList = true
      }
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
    isVideo(url: string) {
      if (!url) return false
      return /\.(mp4|webm|ogg)$/i.test(url);
    },
    formattedDate(date: string) {
      if (date) {
        const dateTime = DateTime.fromISO(date as string, { setZone: true }).setZone('UTC-6')
        return dateTime.toFormat('TT')
      }
    },
    onDeleteCheckAssist(assistId: number) {
      this.assistId = assistId
      this.drawerCheckAssistDelete = true
    },
    async confirmDeleteCheckAssist() {
      if (this.assistId) {
        this.drawerCheckAssistDelete = false
        const assistService = new AssistService()
        const assistResponse = await assistService.inactivate(this.assistId)

        if (assistResponse.status === 200) {
          const index = this.checkAssist.assist.assitFlatList.findIndex(a => a.assistId === this.assistId)
          if (index !== -1) {
            this.checkAssist.assist.assitFlatList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete assist',
            detail: assistResponse._data.message,
            life: 5000,
          })
          if (this.onRefresh) {
            this.onRefresh()
          }

        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete assist',
            detail: assistResponse._data.message,
            life: 5000,
          })
        }
      }
    },
    onCancelCheckAssistDelete() {
      this.assistId = null
      this.drawerCheckAssistDelete = false
    }
  }
})