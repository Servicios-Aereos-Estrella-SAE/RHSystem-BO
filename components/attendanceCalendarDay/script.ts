import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import Tooltip from 'primevue/tooltip';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface';
import { isValid } from 'date-fns';

export default defineComponent({
  name: 'attendanceCalendarDay',
  directives: {
    tooltip: Tooltip
  },
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true },
    discriminated: { type: Boolean, required: false }
  },
  data: () => ({
    commentsSidebar: false as boolean,
    dayExceptions: [] as ShiftExceptionInterface[]
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
  mounted() {
  },
  methods: {
    displayExceptionComments(checkAssist: AssistDayInterface) {
      if (checkAssist.assist.hasExceptions) {
        this.commentsSidebar = true
        this.dayExceptions = checkAssist.assist.exceptions.length > 0 ? checkAssist.assist.exceptions : []
      }
    }
  }
})